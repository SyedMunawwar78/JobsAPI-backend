const CustomErrorAPI = require("../errors/custom-error");
const Job = require("../models/job");
const { StatusCodes } = require("http-status-codes");

const getJobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user.userID }).sort("createdAt");
  res.status(StatusCodes.OK).json({ count: jobs.length, jobs });
};

const getSingleJob = async (req, res) => {
  const { id: jobID } = req.params;
  const { userID } = req.user;

  const job = await Job.findOne({ _id: jobID, createdBy: userID });
  if (!job) {
    throw new CustomErrorAPI("No Job with this ID", StatusCodes.NOT_FOUND);
  }
  res.status(StatusCodes.OK).json({ job });
};

const updateJob = async (req, res) => {
  const { id: jobID } = req.params;
  const { userID } = req.user;

  const job = await Job.findByIdAndUpdate(
    { _id: jobID, createdBy: userID },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!job) {
    throw new CustomErrorAPI("No Job with this ID", StatusCodes.NOT_FOUND);
  }
  res.status(StatusCodes.OK).json({ job });
};

const createJob = async (req, res) => {
  req.body.createdBy = req.user.userID;
  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json({ job });
};

const deleteJob = async (req, res) => {
  const { id: jobID } = req.params;
  const { userID } = req.user;

  const job = await Job.findByIdAndRemove({ _id: jobID, createdBy: userID });
  if (!job) {
    throw new CustomErrorAPI("No Job with this ID", StatusCodes.NOT_FOUND);
  }
  res.status(StatusCodes.OK).json({ job });
};

module.exports = {
  getJobs,
  createJob,
  getSingleJob,
  updateJob,
  deleteJob,
};
