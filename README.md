# log-book

##### References
* https://firebase.google.com/docs/auth/web/start: Overview on how to get started with web auth.
* https://firebase.google.com/docs/auth/web/manage-users#get_the_currently_signed-in_user: How to add ACL to individual pages, or in my case svelte routes.
* https://firebase.google.com/docs/reference/js/auth: JS documentation of auth package.
* https://firebase.google.com/docs/admin/setup#python: How to setup firebase on the backend so it can extract the user id from the id token that is sent by the client.
* https://firebase.google.com/docs/auth/admin/verify-id-tokens#web: How to extract the user id from the id token. The example in this page uses the `auth` object but does not have any instructions on how to get it. The setup link above has this information in the [Intialize multiple apps](https://firebase.google.com/docs/admin/setup#initialize-multiple-apps) section.


## Deployment

### First Time Setup
Steps I need to take when setting up a VM after logging in for the first time.

#### Installation
```shell
> apt update
> apt upgrade
> apt install git
> apt install nginx
> curl -LsSf https://astral.sh/uv/install.sh | sh
> apt install sqlite3
> curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
```

Generate keys -
```shell
> ssh-keygen -t rsa
```
Add the `id_rsa.pub` file to github and then pull the project.

#### API
Create the logbook db -
```shell
> cd /path/to/log-book/api
> sqlite3 logbook-1.0.0.db
sqlite> sqlite> CREATE TABLE IF NOT EXISTS logs (
   ...>   log_id CHAR(22) PRIMARY KEY,
   ...>   user_id CHAR(28),
   ...>   created_at_utc TEXT,
   ...>   activity TEXT
   ...> );
sqlite> .tables
sqlite> .schema logs
```

Create the .env file.
```shell
> cd /path/to/log-book/api
> touch .env
```

Copy the firebase creds.

Set up the environ -
```shell
> uv sync --frozen --no-cache
```

Check if the FastAPI API server comes up -
```shell
> cd /path/to/log-book/api/log_book
> fastapi run app.py
```

Set up fastapi as a daemon -
Choose a systemctl install path by running -
```shell
> systemd-analyze --user unit-paths
```

Ensure that the `[WorkingDirectory]` setting of logbook-api.service is correct.
Copy logbook-api.service into one of these paths. Create the path if it does not exist.
Reload all deamons and start the fastapi daemon  -
```shell
> systemctl --user daemon-reload
> systemctl --user enable --now logbook-api
```

Check if the daemon is up and running correctly -
```shell
> systemctl --user status logbook-api
```

The uvicorn logs should be visible as part of the status.

Copy nginx.conf to nginx conf dir
```shell
> cd /path/to/log-book/api
> cp nginx.conf /etc/nginx/conf.d/logbook-api.conf
> nginx -t
> nginx -s reload
```

#### Web

Install node v 24/npm -
```shell
nvm install 24
```

Install all the packages - 
```shell
> cd /path/to/log-book/web
> npm install
```

Create the .env file.
```shell
> cd /path/to/log-book/web
> touch .env
```

Build the website
```shell
> npm run build
```