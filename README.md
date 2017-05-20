[![Stories in Ready](https://badge.waffle.io/rubyforgood/pantry_scheduler.png?label=ready&title=Ready)](https://waffle.io/rubyforgood/pantry_scheduler?utm_source=badge)
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

This command  will also create a development user for you to login as with the following credentials:

    email: admin@example.com
    password: abc123

Install node and yarn

    $ brew install node yarn

Running the front-end React application:

    $ yarn install
    $ ./bin/webpack-dev-server
    navigate to localhost:3000 in the browser
