const assert = require('assert');
const request = require('supertest')
const app = require('../app')

describe("appointments", function() {
  describe("POST /appointments", function() {
    it("creates an appointment", async () => {
      await request(app)
        .post('/appointments')
        .send({})
        .expect(200);
    });
  });
});
