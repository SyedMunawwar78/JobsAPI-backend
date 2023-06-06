require("dotenv").config();
require("express-async-errors");
// Security packages
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");

const express = require("express");
const app = express();

// Connect DB
const connectDB = require("./db/connect");
//Routers
const authRouter = require("./routes/auth");
const jobsRouter = require("./routes/jobs");

// Error Handlers
const errorHandler = require("./middlewares/errorHandler");
const notFound = require("./middlewares/notFound");

//Auth
const AuthMiddleware = require("./middlewares/auth");

app.set("trust proxy", 1);
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());

//Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", AuthMiddleware, jobsRouter);

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, console.log(`Listening on port ${port}`));
  } catch (error) {
    console.log(error);
  }
};

start();
