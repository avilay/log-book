# log-book

## References
* https://firebase.google.com/docs/auth/web/start: Overview on how to get started with web auth.
* https://firebase.google.com/docs/auth/web/manage-users#get_the_currently_signed-in_user: How to add ACL to individual pages, or in my case svelte routes.
* https://firebase.google.com/docs/reference/js/auth: JS documentation of auth package.
* https://firebase.google.com/docs/admin/setup#python: How to setup firebase on the backend so it can extract the user id from the id token that is sent by the client.
* https://firebase.google.com/docs/auth/admin/verify-id-tokens#web: How to extract the user id from the id token. The example in this page uses the `auth` object but does not have any instructions on how to get it. The setup link above has this information in the [Intialize multiple apps](https://firebase.google.com/docs/admin/setup#initialize-multiple-apps) section.

## Development

### Quick Start

To start both web and API development servers:

```shell
./startup_dev.py
```

This script will:
- Automatically detect your private IP address
- Update `web/.env` to point to your local API server
- Start the web server in a new terminal tab (accessible at `http://your-ip:5173`)
- Start the API server in a new terminal tab (accessible at `http://your-ip:8000`)
- Both servers are accessible from your mobile phone using the IP address

To stop both servers:

```shell
./shutdown_dev.py
```

This will gracefully terminate both the web and API servers.

### Manual Development Setup

If the automated scripts don't work, you can start the servers manually:

#### Web Server
```shell
cd web
npm run dev -- --host 0.0.0.0
```

#### API Server
```shell
cd api/log_book
source ../../.venv/bin/activate
fastapi dev app.py --host 0.0.0.0
```

## Deployment

### First Time Setup
Steps I need to take when setting up a VM after logging in for the first time.

#### Installation
```shell
sudo apt update
sudo apt upgrade
sudo apt install git
sudo apt install nginx
curl -LsSf https://astral.sh/uv/install.sh | sh
sudo apt install sqlite3
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
sudo apt install certbot python3-certbot-nginx
```

Generate keys -
```shell
ssh-keygen -t rsa
```
Add the `id_rsa.pub` file to github and then pull the project.

#### API
Create the log dir -
```shell
sudo mkdir /var/log/logbook-api
sudo chown -R $USER:$USER /var/log/logbook-api
```

Create the logbook db -
```shell
cd /path/to/log-book/api
sqlite3 logbook-1.0.0.db
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
cd /path/to/log-book/api
touch .env
```

Copy the firebase creds.

Set up the environ -
```shell
cd /path/to/log-book
uv sync --frozen --no-cache
```

Check if the FastAPI API server comes up -
```shell
cd /path/to/log-book/api/log_book
/path/to/log-book/.venv/bin/fastapi run app.py
```

Set up fastapi as a **system level** daemon -
Choose a systemctl install path by running -
```shell
systemd-analyze --system unit-paths
```

Ensure that the `[WorkingDirectory]` setting of logbook-api.service is correct.
Copy logbook-api.service into one of these paths. Create the path if it does not exist.
Reload all deamons and start the fastapi daemon  -
```shell
sudo cp logbook-api.service /usr/lib/systemd/system
systemctl daemon-reload
systemctl enable --now logbook-api
```

Check if the daemon is up and running correctly -
```shell
systemctl status logbook-api
```

Copy nginx.conf to nginx sites-enabled dir and create a symlink from the sites-available dir.
```shell
cd /path/to/log-book/api
sudo cp nginx.conf /etc/nginx/sites-available/logbook-api.conf
sudo ln -s /etc/nginx/sites-available/logbook-api.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo nginx -s reload
```

Check if the API is available by going to `http://logbook-api.avilay.rocks/version`. 

#### Web

Install node v 24/npm -
```shell
nvm install 24
```

Install all the packages - 
```shell
cd /path/to/log-book/web
npm install
```

Create the .env file.
```shell
cd /path/to/log-book/web
touch .env
```

Build the website
```shell
npm run build
```

Create the nginx directory and Copy the build there -
```
sudo mkdir /var/www/logbook
sudo chown -R $USER:$USER /var/www/logbook
cp -r build/* /var/www/logbook
```

Copy the nginx conf -
```shell
sudo cp nginx.conf /etc/nginx/sites-available/logbook.conf
sudo ln -s /etc/nginx/sites-available/logbook.conf /etc/nginx/sites-enabled/
```

#### SSL
After both the nginx conf files have been setup and everything is working fine without SSL, do the following -
```shell
sudo certbot --nginx -d logbook.avilay.rocks -d logbook-api.avilay.rocks
```

Certbot figured out that I owned the domains so there were no steps after this. Otherwise follow the steps in [Digital Ocean doc](https://www.digitalocean.com/community/tutorials/how-to-secure-nginx-with-let-s-encrypt-on-ubuntu-20-04). This command will automatically set up a cert renewal process. Check its status -
```shell
systemctl status certbot.timer
```

### Upgrades

```shell
ssh -i .ssh/aws-us-west-2-keypair.pem ubuntu@logbook.avilay.rocks
```

```shell
cd ~/projects/log-book
git pull
```

#### API

```shell
systemctl --user restart --now logbook-api
systemctl --user status logbook-api
```

#### Web

```shell
cd ~/projects/log-book/web
rm -fr build
npm run build
rm -r /var/www/logbook/*
cp -r build/* /var/www/logbook
```