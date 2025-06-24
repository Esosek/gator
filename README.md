# About

A guided [Boot.dev](https://www.boot.dev) project which aims to build a CLI news feed aggregator that periodically fetches new posts via RSS. Includes simple user management.

## Built with

- [Node.js](https://nodejs.org) - JavaScript runtime environment
- [Typescript](https://www.typescriptlang.org/) - strongly typed programming language that builds on JavaScript
- [PostgreSQL](https://www.postgresql.org/) - open source object-relational database system
- [Drizzle ORM](https://orm.drizzle.team/) - headless TypeScript ORM (Object-Relational Mapping)

# Setup

## Configuration

1. Create a configuration file at home dir `~/.gatorconfig.json`
2. Put this content into the configuration file `{
  "db_url": "postgres://postgres:postgres@localhost:5432/gator?sslmode=disable",
  "current_user_name": ""
}`

## Local database

1. Install PostgreSQL
   **macOS**
   `brew install postgresql@16`
   **Linux / WSL**
   `sudo apt update`
   `sudo apt install postgresql postgresql-contrib`
2. Make sure the installation worked `psql --version`
3. (Linux only) Update postgres password `sudo passwd postgres`
4. Start the postgres server
   **macOS**
   `brew services start postgresql@16`
   **Linux / WSL**
   `sudo service postgresql start`
5. Connect to the server

- macOS: `psql postgres`
- Linux: `sudo -u postgres psql`

6. You should see `postgres=#`. Create a new gator database
   `CREATE DATABASE gator;`
7. Connect to this database `\c gator` and you should see `gator=#`
8. (Linux only) Set the user password
   `ALTER USER postgres PASSWORD 'postgres';`
9. Test that everything is working and you can query the database
   `SELECT version();`

## Usage

1.  Clone the repo
2.  Run `npm i` to install dependencies
3.  In your shell start the feed aggregation loop which will be fetching new posts periodically. `TIME_BETWEEN_REQS` examples are "30s", "1m" or "1h"
    `npm run start agg <TIME_BETWEEN_REQS>`
4.  In a second shell window you may run commands

## Commands

Each command should start with `npm run start <COMMAND>`

### List of commands

- `register <USERNAME>` – Registers new user and logs them in
- `login <USERNAME>` – Logs in an existing user
- `reset` – Deletes all database records
- `users` – Lists all existing users
- `agg <TIME_BETWEEN_REQS>` – Starts the fetching loop with provided time between each request
- `addfeed <NAME> <URL>` – Adds new feed
- `feeds` – Lists all existing feeds
- `follow <FEED_URL>` – Subscribe to a feed
- `unfollow <FEED_URL>` – Unsubscribe to a feed
- `following` – Lists all subscribed feeds
- `browse <LIMIT>` – Lists posts from subscribed feeds from latest to oldest
