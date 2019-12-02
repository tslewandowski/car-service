const assert = require("assert");
const request = require("supertest");
const moment = require("moment");
const app = require("../app");

describe("appointments", () => {
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

      assert(typeof res.body.id === "number");
    });

    it("returns 400 if it fails validation", async () => {
      await request(app)
        .post("/appointments")
        .send({})
        .expect(400);
    });

    it("returns 400 if start is after end", async () => {
      await await request(app)
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
});
