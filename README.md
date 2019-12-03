# car-service

In order to start, create a new Postgres database with the parameters listed in `knexfile.js` under development, or change them as necessary to point to the correct database and user.
Then run
```
npm install # install packages
npx knex migrate:latest # run the migrations. well, migration
```

At this point, one should be able to `npm start` and `npm test` to start the server and run the tests respectively.

The function to create appointments at a random interval is located in `./appointmentScheduler.js`.
