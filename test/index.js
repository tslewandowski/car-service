const assert = require("assert");
const request = require("supertest");
const moment = require("moment");
const app = require("../app");

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
});