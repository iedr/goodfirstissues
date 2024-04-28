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
            repo_stars: 3,
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
          this.num_assignees = issue.Assignees.issue_assignees_count;
        this.num_comments = issue.Comments.issue_comment_count;
        this.created_at = issue.issue_createdAt;
        this.issue_labels_count = issue.issue_labels.label_totalcount;
        this.issue_repo_desc = issue.issue_repo.repo_desc;
        this.issue_repo_name = issue.issue_repo.repo_name;
        this.issue_repo_stars = issue.issue_repo.repo_stars;
        this.issue_repo_url = issue.issue_repo.repo_url;
        this.issue_title = issue.issue_title;
        this.issue_url = issue.issue_url;
        this.owner_login = issue.issue_repo.Owner.repo_owner;

        let issue_labels = [];
        for (let n of issue.issue_labels.Nodes) {
            issue_labels.push(n.label_name);
        }
        this.issue_labels = issue_labels;

        let repo_prog_lang = [];
        for (let n of issue.issue_repo.repo_langs.Nodes) {
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

    getRepoStars() {
        return this.issue_repo_stars;
    }

    getOwnerLogin() {
        return this.owner_login;
    }
    getIssueRepoStars() {
        return this.issue_repo_stars;
    }
}
