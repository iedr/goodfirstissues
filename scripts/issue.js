/*
    Issue: {
        issue_title: "Catapult Mechanism needs full rework",
        issue_url: "https://github.com/08jne01/community-a4e-c/issues/5",
        Assignees: {
            issue_assignees_count: 0
        },
        Comments: {
            issue_comment_count: 1
        },
        issue_createdAt: "2020-06-30T16:59:08Z",
        issue_labels: {
            Nodes: [
                {label_name: "Defect"},
                {label_name: "Good first issue"}
            ],
            label_totalcount: 3
        },
        issue_repo: {
            repo_desc: "The Community Repo for A-4E-C and its Official Submods",
            repo_name: "community-a4e-c",
            repo_url: "https://github.com/08jne01/community-a4e-c",
            repo_langs: {
                Nodes: [
                    {repo_prog_language: "Lua"},
                    {repo_prog_language: "C++"}
                ]
            },
            Owner: {
                repo_owner: "berstend"
            }
        }
    }
*/
class Issue {
    constructor(issue) {
        this.num_assignees = issue.Issue.Assignees.issue_assignees_count;
        this.num_comments = issue.Issue.Comments.issue_comment_count;
        this.created_at = issue.Issue.issue_createdAt;
        this.issue_labels_count = issue.Issue.issue_labels.label_totalcount;
        this.issue_repo_desc = issue.Issue.issue_repo.repo_desc;
        this.issue_repo_name = issue.Issue.issue_repo.repo_name;
        this.issue_repo_url = issue.Issue.issue_repo.repo_url;
        this.issue_repo_stars = issue.Issue.issue_repo.repo_stars;
        this.issue_title = issue.Issue.issue_title;
        this.issue_url = issue.Issue.issue_url;
        this.owner_login = issue.Issue.issue_repo.Owner.repo_owner;

        let issue_labels = [];
        for (let n of issue.Issue.issue_labels.Nodes) {
            issue_labels.push(n.label_name);
        }
        this.issue_labels = issue_labels;

        let repo_prog_lang = [];
        for (let n of issue.Issue.issue_repo.repo_langs.Nodes) {
            repo_prog_lang.push(n.repo_prog_language);
        }
        this.issue_repo_langs = repo_prog_lang;
    }

    getNumAssignees() {
        return this.num_assignees;
    }

    getNumComments() {
        return this.num_comments;
    }

    getCreatedAt() {
        return this.created_at;
    }

    getIssueLabelsCount() {
        return this.issue_labels_count;
    }

    getIssueRepoDesc() {
        return this.issue_repo_desc;
    }

    getIssueRepoName() {
        return this.issue_repo_name;
    }

    getIssueRepoUrl() {
        return this.issue_repo_url;
    }

    getIssueTitle() {
        return this.issue_title;
    }

    getIssueUrl() {
        return this.issue_url;
    }

    getIssueLabels() {
        return this.issue_labels;
    }

    getRepoProgLangs() {
        return this.issue_repo_langs;
    }

    getOwnerLogin() {
        return this.owner_login;
    }

    getIssueRepoStars(){
        console.log(this.stars)
        return this.issue_repo_stars;
    }
}
