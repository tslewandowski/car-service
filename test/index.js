const assert = require("assert");
const request = require("supertest");
const moment = require("moment");
const app = require("../app");
const knex = require("../database");

describe("appointments", () => {
  let id;
  describe("POST /appointments", () => {
    it("creates an appointment", async () => {
      const res = await request(app)
        .post("/appointments")
        .send({
          start: moment()
            .add(2, "days")
            .format(),
          end: moment()
            .add(2, "days")
            .add(30, "minutes")
            .format(),
          status: "tentative",
          price: 2000
        })
        .expect(200);

      ({ id } = res.body);
      assert(typeof id === "number");
    });

    it("returns 400 if it fails validation", async () => {
      await request(app)
        .post("/appointments")
        .send({})
        .expect(400);
    });

    it("returns 400 if start is after end", async () => {
      await request(app)
        .post("/appointments")
        .send({
          start: moment()
            .add(2, "days")
            .add(30, "minutes")
            .format(),
          end: moment()
            .add(2, "days")
            .format(),
          status: "tentative",
          price: 2000
        })
        .expect(400);
    });
  });

  describe("DELETE /appointments/:id", () => {
    it("returns a 204 and deletes the resource", async () => {
      await request(app)
        .del(`/appointments/${id}`)
        .send()
        .expect(204);
    });
  });

  describe("PUT /appointments/:id", () => {
    it("returns a 200 and updates the resource", async () => {
      const [createdID] = await knex("appointments")
        .returning("id")
        .insert({
          start: moment()
            .add(2, "days")
            .add(30, "minutes")
            .format(),
          end: moment()
            .add(2, "days")
            .format(),
          status: "tentative",
          price: 2000
        });

      await request(app)
        .put(`/appointments/${createdID}`)
        .send({ status: "confirmed" })
        .expect(200);
    });
  });

  describe("GET /appointments/:id", () => {
    let createdID;
    before(async () => {
      [createdID] = await knex("appointments")
        .returning("id")
        .insert({
          start: moment()
            .add(2, "days")
            .add(30, "minutes")
            .format(),
          end: moment()
            .add(2, "days")
            .format(),
          status: "tentative",
          price: 2000
        });
    });

    it("retrieves the appointment", async () => {
      const res = await request(app)
        .get(`/appointments/${createdID}`)
        .send()
        .expect(200);

      assert(typeof res.body.id === "number");
    });

    it("returns 404 if the appointment does not exist", async () => {
      await request(app)
        .get("/appointments/45678")
        .send()
        .expect(404);
    });
  });

  describe("GET /appointments", () => {
    it("returns list of appointments ordered by price", async () => {
      const ids = await knex("appointments")
        .returning("id")
        .insert([
          {
            start: moment()
              .add(5, "days")
              .subtract(30, "minutes")
              .format(),
            end: moment()
              .add(5, "days")
              .add(3, "hours")
              .format(),
            status: "tentative",
            price: 2000
          },
          {
            start: moment()
              .add(6, "days")
              .subtract(30, "minutes")
              .format(),
            end: moment()
              .add(6, "days")
              .add(3, "hours")
              .format(),
            status: "tentative",
            price: 2000
          },
          {
            start: moment()
              .add(5, "days")
              .add(30, "minutes")
              .format(),
            end: moment()
              .add(5, "days")
              .add(3, "hours")
              .format(),
            status: "tentative",
            price: 2000
          },
          {
            start: moment()
              .add(2, "days")
              .add(30, "minutes")
              .format(),
            end: moment()
              .add(2, "days")
              .format(),
            status: "tentative",
            price: 2000
          }
        ]);

      const notInID = ids.pop();

      const res = await request(app)
        .get(
          `/appointments?from=${moment()
            .add(5, "days")
            .format()}&to=${moment()
            .add(6, "days")
            .format()}`
        )
        .send()
        .expect(200);

      const retrievedIDs = res.body.map(appointments => appointments.id);

      assert(retrievedIDs.indexOf(notInID) === -1);
      ids.forEach(includedID => {
        assert(retrievedIDs.includes(includedID));
      });
    });

    it("returns 400 if no dates are provided", async () => {
      await request(app)
        .get("/appointments")
        .send()
        .expect(400);
    });
  });
});
