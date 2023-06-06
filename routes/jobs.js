const express = require("express");
const {
  getJobs,
  createJob,
  getSingleJob,
  updateJob,
  deleteJob,
} = require("../controllers/jobs");
const router = express.Router();

router.route("/").get(getJobs);
router.route("/:id").get(getSingleJob).patch(updateJob).delete(deleteJob);
router.route("/create").post(createJob);

module.exports = router;
