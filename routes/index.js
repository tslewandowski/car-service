const express = require("express");
const {
  createAppointment,
  createAppointmentSchema
} = require("../controllers/appointments");
const validateBody = require("../middlewares/validation");

const router = express.Router();

router
  .route("/appointments")
  .post(validateBody(createAppointmentSchema))
  .post(createAppointment);

module.exports = router;
