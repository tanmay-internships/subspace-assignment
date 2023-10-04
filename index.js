const dotenv = require("dotenv");
const express = require("express");
const morgan = require("morgan");
const apiRouter = require("./routes/apiRouter");

// setting configuration file
dotenv.config({ path: "./configuration.env" });

// creating express instance
const app = express();

// using morgan for logs
app.use(morgan("dev"));

// starting server
const server = app.listen(process.env.PORT || 8080, () => {
    console.log("server has been started on port " + process.env.PORT);
});

// using apirouter middleware
app.use("/api", apiRouter);

// handling unavailable paths
app.all("*", (req, res, next) => {
    // console.log("This path is not available");
    res.status(404).json({
        status: "page not found",
    });
});

// globle error handling function ... (as only error possible is "unable to fetch data" so no need for complex error handling function)
app.use("*", (err, req, res, next) => {
    console.log(err);
    res.status(500).json({
        status: "unable to fetch blogs...please try again later !",
    });
});

// shutting down on unhandled rejections to avoid abrupt shutdown
process.on("unhandledRejection", (err) => {
    console.log(err.name, " : ", err.message);
    console.log("shutting down");
    server.close(() => {
        process.exit(1);
    });
});
