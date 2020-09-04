package main

import (
   "context"
   "encoding/json"
   "fmt"
   "log"
   "strings"
   "time"
   "flag"

   "cloud.google.com/go/firestore"
   firebase "firebase.google.com/go"
   "github.com/shurcooL/githubv4"
   "golang.org/x/oauth2"
   "google.golang.org/api/option"
)

//type githubConfig struct {
//	GithubToken string `json:"GITHUB_TOKEN"`
//}

type fbCredentials struct {
  Type string
  ProjectId string
  PrivateKeyID string
  PrivateKey string
  ClientEmail string
  ClientID string
  AuthURI string
  TokenURI string
  AuthProviderX509CertURL string
  ClientX509CertURL string
}

type progLanguage struct {
   Nodes []struct {
      Name string `json:"repo_prog_language"`
   }
}

type repository struct {
   Name        string       `json:"repo_name"`
   Description string       `json:"repo_desc"`
   URL         string       `json:"repo_url"`
   Languages   progLanguage `graphql:"languages(first: 10)" json:"repo_langs"`
   Owner struct {
      Login   string       `json:"repo_owner"`
   }
}

type label struct {
   Nodes []struct {
      Name string `json:"label_name"`
   }
   TotalCount int `json:"label_totalcount"`
}

type issue struct {
   URL        string            `json:"issue_url"`
   CreatedAt  githubv4.DateTime `json:"issue_createdAt"`
   Repository repository        `json:"issue_repo"`
   Title      string            `json:"issue_title"`
   Labels     label             `graphql:"labels(first: 10)" json:"issue_labels"`
   Comments   struct {
      TotalCount int `json:"issue_comment_count"`
   }
   Assignees struct {
      TotalCount int `json:"issue_assignees_count"`
   }
}

type result struct {
   Issue issue `graphql:"... on Issue"`
}

func timeTrack(start time.Time, name string) {
   elapsed := time.Since(start)
   log.Printf("%s took %s\n\n", name, elapsed)
}

//func getGithubToken() string {
//	file, err := ioutil.ReadFile("conf.json")
//	if err != nil {
//		log.Println("Unable to read conf.json")
//		log.Fatalln(err)
//	}
//
//	confData := githubConfig{}
//
//	err = json.Unmarshal([]byte(file), &confData)
//	if err != nil {
//		log.Println("Unable to unmarshal conf.json")
//		log.Fatalln(err)
//	}
//	return confData.GithubToken
//}

func getGithubClient(token string) *githubv4.Client {
//	gitHubToken := getGithubToken()

   src := oauth2.StaticTokenSource(
      &oauth2.Token{AccessToken: token},
   )

   httpClient := oauth2.NewClient(context.Background(), src)
   return githubv4.NewClient(httpClient)
}

func getIssuesFromGithub(token string) []result {
   defer timeTrack(time.Now(), "Github")

   var query struct {
      SearchResultItemConnection struct {
         PageInfo struct {
            HasNextPage githubv4.Boolean
            EndCursor   string
         }
         Nodes []result
      } `graphql:"search(type: ISSUE, first: 100, query:$queryString, after: $commentsCursor)"`
   }

   var allResults []result

   currDate := time.Now().AddDate(-1, 0, 0).Format("2006-01-02")
   queryString := fmt.Sprintf("created:%v label:\"good first issue\" state:open", ">"+currDate)

   variables := map[string]interface{}{
      "queryString":    githubv4.String(queryString),
      "commentsCursor": (*githubv4.String)(nil), // Null after argument to get first page.
   }

   client := getGithubClient(token)

   for {
      err := client.Query(context.Background(), &query, variables)
      if err != nil {
         log.Fatalln("Error in querying Github: ", err)
      }

      allResults = append(allResults, query.SearchResultItemConnection.Nodes...)
      log.Printf("Number of issues at hand: %v\n", len(allResults))

      if !query.SearchResultItemConnection.PageInfo.HasNextPage {
         break
      }
      variables["commentsCursor"] = githubv4.String(query.SearchResultItemConnection.PageInfo.EndCursor)
   }
   return allResults
}

func insertIntoDatabase(results []result, fsClient *firestore.Client) {
   defer timeTrack(time.Now(), "Insert into DB")

   for _, r := range results {
      marshalResult, jsonErr := json.Marshal(r)
      if jsonErr != nil {
         log.Println("Error in marshalling result")
         log.Fatalln(r, jsonErr)
      }

      var mapResult map[string]interface{}
      if err := json.Unmarshal(marshalResult, &mapResult); err != nil {
         log.Println("Error in unmarshalling result")
         log.Fatalln(r, err)
      }

      // Key in the data store is the cleaned URL of the issue
      issueURL := r.Issue.URL

      // E.g. https://github.com/owner/repo/issues/3
      // --> owner:repo:issues:3
      cleanedIssueURL := strings.Replace(issueURL, "https://github.com/", "", 1)
      cleanedIssueURL = strings.Replace(cleanedIssueURL, "/", ":", -1)

      if len(cleanedIssueURL) == 0 {
         continue
      }

      // Write to collection called issues
      issueCollection := fsClient.Collection("issues")
      issueDoc := issueCollection.Doc(cleanedIssueURL)

      // If exists, will overwrite
      _, err := issueDoc.Set(context.Background(), mapResult)
      if err != nil {
         log.Println("Error in setting issue to database")
         log.Fatalln(r, err)
      }
   }
}

func main() {
   gh_token := flag.String("gh_token", "", "GitHub token")
        
   fb_type := flag.String("fb_type", "service_account", "fb_type")
   fb_auth_uri := flag.String("fb_auth_uri", "https://accounts.google.com/o/oauth2/auth", "fb_auth_uri")
   fb_token_uri := flag.String("fb_token_uri", "https://oauth2.googleapis.com/token", "fb_token_uri")
   fb_auth_provider_x509_cert_url := flag.String("fb_auth_provider_x509_cert_url", "https://www.googleapis.com/oauth2/v1/certs", "fb_auth_provider_x509_cert_url")
   
   fb_project_id := flag.String("fb_project_id", "", "fb_project_id")
   fb_private_key_id := flag.String("fb_private_key_id", "", "fb_private_key_id")
   fb_private_key := flag.String("fb_private_key", "", "fb_private_key")
   fb_client_email := flag.String("fb_client_email", "", "fb_client_email")
   fb_client_id := flag.String("fb_client_id", "", "fb_client_id")
   fb_client_x509_cert_url := flag.String("fb_client_x509_cert_url", "", "fb_client_x509_cert_url")

   flag.Parse()
   
     "type": "service_account",
  "project_id": "goodfirstissues-fd86e",
  "private_key_id": "589c405c46371537e3cb70dd4067965c86966d46",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCaSC0/rCisgeNG\n75TQx9AIMRQbXsYt+nhSz/BwCJMaHpkvJRCmxWXRAEPP+ESkEyqzg0Ix4Hqs4K3u\n6jFXIWW6CcbBEkKI+Ta5ckSI6sh2UNDDSJ0zlCsQ68MgCgGyPXzM9pIZoKvnQx1f\nxF5jjIFNnTXivYL39/Fo2xs5cZ9ZYwCLc2DHDYwJ3SAMUQoStByrQrSE2joQw/KY\nT4RyEzoQbDPNqwDWkJJxlDHemC3SFOin7cdX/UyL9LJTMJnPxROSTj87i+LfPcQe\n7k3c6p1v/MK+JYx8S3dbCfbkufDLGVKbr2xE/geDFaZrR4o0raYfnolNhWYtRqae\npoyN5jX/AgMBAAECggEADZ1z/Mv9FOgrfe2TpO8VMTvfieDNvW3+o1Q9ZC2liacM\nnqf3Nbhy2URcN6SxrgcQ/CGHvG4SdWIoh058hzNnzkihlRU+8OaJSUlHugt6IFLW\ncX1dfhlDyaz8nb20U53wfwf9cayHrxNxqqtiJwfVu1s1z6oovihP0hCP8PxRcypR\n3LZtU0fIpJLX0DmgRwmR0NCQYUl9nscuLC/gVLy33iFX0HWNnB2D0ECrLc+HwKT4\nIgtzwx4nMEK6MXxNOIDUJg0xHRYaPa/ITv+yNWYz3NjNEAL7IvcYm2ec8/MJezLE\nYCouXtw+tq0pzwAcf4eHEyaby8XTNnv8DorYubc3iQKBgQDPYmWNyufPzvhkTunu\nf+Q/gyawfNLhILZeM4haDwdsmqns1ZXoD0JO7z7Q0ES+6JxGSmdni3okcJuh6NHZ\ncsub7LcJH6ErdQBc0760I/pA8jM0a7TPFFBVL0YEaVF0VwyJadveD7f0h9sFMR3U\nUdGFgdArEsLBPP5f4HmP8X2I5wKBgQC+cvvlR2Qg6hzSFw/XZmC5Tt4l/QNB0fC4\nyM/oKcQ5KSD7cQoMxow20NBp3YmyrBbuf6Bdms7KP8fhdtpOCczuY9JXLxh+MPBz\ndCyPKUjVSQR/TYDHaYUZyG12QLb4EmSUern4LIbI3XHk1T6xDiBsAxLeZpkrcVjU\nRn2UUpRPKQKBgEqPK8fArXsPBEq7/Grc3CjhdCV7my2JX0ea62jFgnvPV0xotc6K\nveI3LbRRTIX+h0DWOzsE8FLtkWayl8+/7+gNQPksv/spw4mcLzIAxVZYPYSZPJY+\nzWry5g9r9fcH3OACiSPbLt3hgiLpt7m/+L4xH7B8vDxRO3so70uLHQD9AoGAEHfa\n5kmVE++KjHQoD4UvyfZS6VAGjxN7UE81AytRZ2vyCSwOJWqpxzepPe5FMOkGlpr8\nn/t59C0tuIZRfDwGt3p0Psu4v3i14hXioIJ+ZMsKk4N9JkEunDsjk/0mlS7p+Zjf\nKeGXyhiz94ilAiRpk010vTx79DC58KkjxMabQnkCgYB5ZqYUgkYt5ui5dTTHAfi3\nC+roR8WvJ1MCyTj2dkR4DaVeL/DpXsSwLeA4piYg2hFiP2WsvuX35sMZ0j9tSOjx\n6dYxRBJPpNZmHD6upGfYJiyRFUnwcawHhyyvU7qDwbBY+MhLDyBdxFh4TugvKDDJ\nxtgFifKmpdL8klTmNlw9EQ==\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-v49b8@goodfirstissues-fd86e.iam.gserviceaccount.com",
  "client_id": "106003356462866205849",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url"

   credentials_json := fbCredentials {
     Type: *fb_type `json:"type"`,
     ProjectId: *fb_project_id `json:"project_id"`,
     PrivateKeyID: *fb_private_key_id `json:"private_key_id"`,
     PrivateKey: *fb_private_key `json:"private_key"`,
     ClientEmail: *fb_client_email `json:"client_email"`,
     ClientID: *fb_client_id `json:"client_id"`,
     AuthURI: *fb_auth_uri `json:"auth_uri"`,
     TokenURI: *fb_token_uri `json:"token_uri"`,
     AuthProviderX509CertURL: *fb_auth_provider_x509_cert_url `json:"auth_provider_x509_cert_url"`,
     ClientX509CertURL: *fb_client_x509_cert_url `json:"client_x509_cert_url"`,
   }
   
	b, err := json.Marshal(credentials_json)
	if err != nil {
	    log.Fatalln("Error parsing FireBase credentials: ", err)
	}

   issuesFromGithub := getIssuesFromGithub(*gh_token)

   // https://www.youtube.com/watch?v=9rN29jENirI
   // sa := option.WithCredentialsFile("./firebase-config.json")
   sa := option.WithCredentialsJSON(b)
   app, err := firebase.NewApp(context.Background(), nil, sa)
   if err != nil {
      log.Fatalln("Error in getting FS app: ", err)
   }

   fsClient, err := app.Firestore(context.Background())
   if err != nil {
      log.Fatalln("Error in getting FS client: ", err)
   }

   defer fsClient.Close()
   insertIntoDatabase(issuesFromGithub, fsClient)
}
