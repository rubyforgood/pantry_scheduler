[![Build Status](https://travis-ci.org/rubyforgood/pantry_scheduler.svg?branch=master)](https://travis-ci.org/rubyforgood/pantry_scheduler) [![Stories in Ready](https://img.shields.io/waffle/label/rubyforgood/pantry_scheduler/ready.svg?label=Ready)](https://waffle.io/rubyforgood/pantry_scheduler?utm_source=badge)
# pantry_scheduler

Tracking issues in priority can be found here https://waffle.io/rubyforgood/pantry_scheduler.

Scheduling system for Elizabeth House Food Pantry.  This app will allow volunteers to log in and create appointments for clients.  Other volunteers will log in and check clients in.  Reports will be generated and mailed monthly, quarterly and yearly.

## Development

Install Postgres using [Postgres.app](https://github.com/PostgresApp/PostgresApp/releases/download/v2.0.3/Postgres-2.0.3.dmg) and run it to get your database up and running.

We're using Ruby 2.4.1. If you don't yet have a method for installing/managing Ruby versions [jgaskins](https://github.com/jgaskins) recommends [RVM](https://rvm.io).

With RVM installed, type

    $ rvm use 2.4.1

If you don't have Ruby 2.4.1 installed, RVM will give you instructions for installing it (after which you should retry the above command).

Clone the repo:

    $ git clone https://github.com/rubyforgood/pantry_scheduler.git && cd pantry_scheduler

Install the gems:

    $ bundle install

Create and migrate your development database:

    $ bundle exec rake db:setup

_NOTE_: If you are using Cloud9 for development, it's possible that that command will fail. If it does, you'll need to do some special setup:

- In `config/database.yml`, under the `development` entry, add the following property: `template: template0`
  - I don't know if it's okay to commit this. I haven't tested it outside of C9.
- Execute the following commands in this order:
  - `sudo service start postgresql`
  - `sudo -u postgres psql`
  - `CREATE USER <your_c9_username> SUPERUSER;` (where `<your_c9_username>` is your username on Cloud9)
  - `\q`
  - `bundle exec rake db:setup`

This command  will also create a development user for you to login as with the following credentials:

    email: admin@example.com
    password: abc123

Install node and yarn

    $ brew install node yarn

On Cloud9, `node` will be there, but you'll have to install `yarn` with `npm install -g yarn`.

Then, install all of the JavaScript dependencies with `yarn`:

    $ yarn install

Run the Rails Server

    $ rails s


*** Webpack error ****

Resolving webpack error after running rails s and navigating to localhost:3000:

    $ Run ./bin/rails webpacker:install and ./bin/yarn install
    $ Run bin/webpack-dev-server

    Close your terminal

    $ Run rails s again
