const {Octokit} = require("@octokit/rest");

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
});

class Github {
    getIssues(repoName) {
        console.debug('getting issues for', repoName)
        const [, owner, repo] = /([^/]+)\/([^/]+)/.exec(repoName)
        return octokit.issues.listForRepo({
            owner: "orlade",
            repo: "bugly",
            state: "open",
            per_page: 100
        });
    }

    getRepo(repoName) {
        console.debug('getting repo', repoName)
        const [, owner, repo] = /([^/]+)\/([^/]+)/.exec(repoName)
        return octokit.repos.get({
            owner: "orlade",
            repo: "bugly",
        }).then(({data}) => {return data})
    }

    addComment(issueId, comment) {

    }

    setPriority(issueId, priority) {

    }
}


module.exports = Github
