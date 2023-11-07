const express = require("express");
const app = express();
const PORT = 5000;
const cors = require("cors");

//Routers
const freshkartRouter = require("./routes/freshkart");
const userRouter = require("./routes/user");

const AppError = require("./utils/appError");
const errorHandler = require("./utils/errorHandler");

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(
  cors({
    origin: "*",
  })
);

// Import and create your database connection
const createDatabaseConnection = require("./services/db");

// Connect to the database and then start the server
createDatabaseConnection()
  .then(() => {
    // Define routes and other middleware
    app.use("/freshkart", freshkartRouter);
    app.use("/users", userRouter);

    app.get("/", (req, res) => {
      res.json({ message: "ok" });
    });

    app.all("*", (req, res, next) => {
      next(new AppError(`The URL ${req.originalUrl} does not exist`, 404));
    });

    app.use(errorHandler);

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}   DataBase Connected `);
    });
  })
  .catch((err) => {
    console.error("Error connecting to the database:", err);
  });
