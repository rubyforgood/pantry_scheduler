# pantry_scheduler

Scheduling system for Elizabeth House Food Pantry.  This app will allow volunteers to log in and create appointments for clients.  Other volunteers will log in and check clients in.  Reports will be generated and mailed monthly, quarterly and yearly.

## Development

Install Postgres using [Postgres.app](https://github.com/PostgresApp/PostgresApp/releases/download/v2.0.3/Postgres-2.0.3.dmg) and run it to get your database up and running.

Clone the repo:

    $ git clone https://github.com/rubyforgood/pantry_scheduler.git

Install the gems:

    $ bundle install

Create and migrate your development database:

    $ bundle exec rake db:create db:migrate

