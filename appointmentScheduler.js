// create new appointments at a random interval
const moment = require("moment");
const knex = require("./database");

const START_INTERVAL = 5 * 60 * 1000; // 5 minutes in ms
const END_INTERVAL = 10 * 60 * 1000; // 10 minutes in ms

const appointmentScheduler = () => {
  knex("appointments")
    .insert({
      start: moment()
        .add(1, "day")
        .format(),
      end: moment()
        .add(1, "day")
        .add(30, "minutes")
        .format(),
      status: "tentative",
      price: 2000
    })
    .catch(error => {
      // eslint-disable-next-line no-console
      console.error(
        "error in appointmentScheduler",
        error.message,
        error.stack
      );
    });

  const timeForNextOne =
    Math.random() * (END_INTERVAL - START_INTERVAL) + START_INTERVAL;
  setTimeout(appointmentScheduler, timeForNextOne);
};

module.exports = appointmentScheduler;
