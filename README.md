# Bugly

Bugly is a diagram-based tool for managing projects via GitHub issues.

## Components

Bugly consists of a SPA client served by an Express.js server, and a WebSocket connection through which they communicate live updates.

The user accesses a "workspace" that contains a configuration of repositories and views to model.

## Development

- In `server/` run `npm install` and `npm start`.
- In `client/` run `npm install` and `npm start`.

The server runs on `localhost:3001`, and the client's `create-react-app` server runs on `localhost:3000`, and connects to the server via WebSocket.

## Deployment

TODO

## Dependencies

- GoJS: Requires a license for commercial use. Bugly is using an evaluation version while prototyping.
