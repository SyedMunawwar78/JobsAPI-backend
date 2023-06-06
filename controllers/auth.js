const User = require("../models/user");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const CustomErrorAPI = require("../errors/custom-error");

const register = async (req, res) => {
  const user = await User.create({ ...req.body });
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new CustomErrorAPI(
      "Please Provide Email and Password",
      StatusCodes.BAD_REQUEST
    );
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new CustomErrorAPI("Invalid Creds", StatusCodes.UNAUTHORIZED);
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new CustomErrorAPI("Invalid Password", StatusCodes.UNAUTHORIZED);
  }
  const token = user.createJWT();
  console.log(req.body);
  res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
};

module.exports = {
  login,
  register,
};
