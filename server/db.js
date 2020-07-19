const _ = require('lodash')
const {promisify} = require('util')
const sqlite3 = require('sqlite3').verbose();
const Github = require('./github')

/** Represents the database, exposing methods for logical operations. */
class Database {

    /** SQLite database connection. */
    db;
    _promiseRun;

    /** Connects to and populates the database if necessary. */
    init(callback) {
        if (this.db) {
            console.log('database already connected')
            return callback()
        }
        this.db = new sqlite3.Database('./db/github.sqlite', (err) => {
            if (err) {
                return callback(err);
            }
            this._promiseRun = promisify(this.db.run).bind(this.db)

            console.log('connected to database');

            this._populateTest(callback);

            process.on('exit', () => {
                db.close((err) => {
                    if (err) {
                        return console.error(err.message);
                    }
                    console.log('closed database connection');
                });
            })
        });
    }

    /** Selects a workspace by name. */
    getWorkspace(name, callback) {
        this.db.get(selectWorkspaceSql, [name], (err, row) => {
            if (err) {
                console.log('query err', err)
                return callback(err);
            }

            if (!row) {
                return callback(null, null)
                // console.log('defaulting row')
                // row = {
                //     name,
                //     content: defaultContent
                // }
            }

            callback(null, {
                name: row.name,
                content: JSON.parse(row.content),
            })
        });
    }

    /** Creates a workspace by given a name. */
    createWorkspace(name, callback) {
        console.debug(`creating workspace ${name}`)
        this.db.run(insertWorkspaceSql, [name], (err) => {
            if (err) {
                return callback(err);
            }
        })
    }

    getRepoId(issue) {
        const repoName = new RegExp('^https://api.github.com/repos/([^/]+/[^/]+)').exec(issue.url)[1]
        console.debug('getting repo ID for', repoName)

        const _promiseGet = promisify(this.db.get).bind(this.db)
        return _promiseGet(`SELECT id FROM repositories WHERE full_name = ?`, [repoName]).then(repoId => {
            if (repoId) {
                console.debug('got repoId', repoId)
                return repoId;
            } else {
                console.debug('no repoId')
                return new Github().getRepo(repoName).then(repo => {
                    console.debug('got repo with id', repo.id)
                    this.writeRepo(repo)
                    return repo.id
                })
            }
        })
    }

    writeRepo(repo) {
        console.debug('writing repo', repo.full_name)
        const sql = `INSERT INTO repositories(id, name, full_name, description, has_issues) VALUES(?,?,?,?,?)
                ON CONFLICT DO NOTHING`
        return this._promiseRun(sql, [repo.id, repo.name, repo.full_name, repo.description, repo.has_issues])
    }

    writeIssues(issues, callback) {
        if (!issues.length) {
            return callback()
        }

        this.getRepoId(issues[0]).then(repoId => {
            const repoName = issues[0]
            const issueToRow = (i) => [
                i.id,
                i.title,
                i.url,
                i.user.login,
                (i.assignee || {login: null}).login,
                i.state,
                i.labels.map(l => l.name).join(','),
                i.comments || '',
                i.created_at,
                i.updated_at,
                repoId,
            ]
            const sql = `INSERT INTO issues(id, title, url, user, assignee, state, labels, comments, created_at, updated_at, repository_id)
                VALUES ${issues.map(i => '(?,?,?,?,?,?,?,?,?,?,?)').join(', ')}
                ON CONFLICT(id) DO NOTHING` //UPDATE SET phonenumber=excluded.phonenumber
            console.log(sql, _.flatten(issues.map(issueToRow)))
            this.db.run(sql, _.flatten(issues.map(issueToRow)), callback)
        })
    }

    _runAll(sql) {
        const sqls = sql.split(';').filter(sql => sql)

        return Promise.all(sqls.map(sql => this._promiseRun(sql)))
    }

    /** Creates tables and a test workspace if they don't exist. */
    _populateTest(callback) {
        console.debug('populating...')

        this._runAll(dropTableSql)
            .then(() => {
                return this._runAll(createTableSql)
            }).then(() => {
                this.getWorkspace('test', (err, row) => {
                    if (!row) {
                        console.debug('populated, creating test workspace')
                        return this.createWorkspace('test', callback)
                    } else {
                        console.debug('populated', row)
                        return callback();
                    }
                })
            }).catch((err) => {
                return callback(err)
            })
    }
}

const dropTableSql = `
DROP TABLE IF EXISTS workspaces;
DROP TABLE IF EXISTS repositories;
DROP TABLE IF EXISTS workspace_repositories;
DROP TABLE IF EXISTS issues;`

const createTableSql = `
CREATE TABLE IF NOT EXISTS workspaces (
    name string PRIMARY KEY,
    content string
);

CREATE TABLE IF NOT EXISTS repositories (
    id int PRIMARY KEY,
    name string NOT NULL,
    full_name string NOT NULL,
    description string NOT NULL,
    has_issues boolean NOT NULL
);

CREATE TABLE IF NOT EXISTS issues (
    id int PRIMARY KEY,
    title string NOT NULL,
    url string,
    user string,
    assignee string,
    labels string,
    state string,
    comments string,
    created_at string,
    updated_at string,
    repository_id int,
    FOREIGN KEY(repository_id) REFERENCES repositories(id)
);

CREATE TABLE IF NOT EXISTS workspace_repositories (
    workspace_name string,
    repository_id int,
    FOREIGN KEY(workspace_name) REFERENCES workspaces(name),
    FOREIGN KEY(repository_id) REFERENCES repositories(id)
);`

const selectWorkspaceSql = `
SELECT * FROM workspaces WHERE name = ?`

const insertWorkspaceSql = `
INSERT INTO workspaces(name) VALUES(?)`

const defaultContent = JSON.stringify({
    nodes: [
        {key: 0, name: 'Alpha', loc: '0 0'},
        {key: 1, name: 'Beta', loc: '150 0'},
        {key: 2, name: 'Gamma', loc: '0 150'},
        {key: 3, name: 'Delta', loc: '150 150'}
    ],
    links: [
        {key: -1, from: 0, to: 1},
        {key: -2, from: 0, to: 2},
        {key: -3, from: 1, to: 1},
        {key: -4, from: 2, to: 3},
    ],
})

module.exports = Database
