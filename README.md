## Support system
Basic example internal support ticket system using NEXTjs, PostgreSQL with Drizzle.

You can view, add, comment & change the status of tickets.


## Setting up the database
(make sure Docker and Docker compose is installed)

npx drizzle-kit migrate
docker compose up -d db


## Installing dependencies
npm install


## Configure environment, example:
DATABASE_URL=postgresql://USERNAME:PASSWORD@localhost:5432/DATABASE_NAME


## Running with npm
npm ci
npm run build
npm run start


## Starting Docker
docker compose up --build


## Stopping Docker
docker compose down