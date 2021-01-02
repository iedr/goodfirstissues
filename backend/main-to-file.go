package main

import (
   "context"
   "encoding/json"
   "fmt"
   "log"
   "time"
   "flag"
   "io/ioutil"

   "github.com/shurcooL/githubv4"
   "golang.org/x/oauth2"
)

type progLanguage struct {
   Nodes []struct {
      Name string `json:"repo_prog_language"`
   }
}

type repository struct {
   Name        string       `json:"repo_name"`
   Description string       `json:"repo_desc"`
   URL         string       `json:"repo_url"`
   StargazerCount int       `json:"repo_stars"`
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

func getGithubClient(token string) *githubv4.Client {
   src := oauth2.StaticTokenSource(
      &oauth2.Token{AccessToken: token},
   )

   httpClient := oauth2.NewClient(context.Background(), src)
   return githubv4.NewClient(httpClient)
}

func getIssuesFromGithub(token string) []result {
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

func writeResultsToFile(results []result) {
    file, err := json.MarshalIndent(results, "", " ")
    if err != nil {
        log.Println("Error in Marshal Indenting issue")
        log.Fatalln(results, err)
    }

    _ = ioutil.WriteFile("data.json", file, 0644)
}

func main() {
   gh_token := flag.String("gh_token", "", "GitHub token")
   flag.Parse()

   issuesFromGithub := getIssuesFromGithub(*gh_token)
   writeResultsToFile(issuesFromGithub)
}
