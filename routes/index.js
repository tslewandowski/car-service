const express = require("express");
const {
  createAppointment,
  createAppointmentSchema,
  deleteAppointment
} = require("../controllers/appointments");
const validateBody = require("../middlewares/validation");

const router = express.Router();

router
  .route("/appointments")
  .post(validateBody(createAppointmentSchema))
  .post(createAppointment);

router.route("/appointments/:id").delete(deleteAppointment);

module.exports = router;
