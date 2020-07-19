const sqlite3 = require('sqlite3').verbose();

/** Represents the database, exposing methods for logical operations. */
class Database {

    /** SQLite database connection. */
    db;

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
                console.log('defaulting row')
                row = {
                    name,
                    content: defaultContent
                }
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

    /** Creates tables and a test workspace if they don't exist. */
    _populateTest(callback) {
        this.db.run(createTableSql, (err) => {
            if (err) {
                console.error(err);
                return callback(err);
            }

            this.getWorkspace('test', (err, row) => {
                if (!row) {
                    return createWorkspace(test, callback)
                } else {
                    return callback();
                }
            })
        });
        console.log('created table')
    }
}

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
