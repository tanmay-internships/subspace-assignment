const express = require("express");
const {
    statsController,
    searchController,
    memoizedController,
} = require("../controllers/blogController");

const apiRouter = express.Router();

apiRouter
    .get("/blog-stats", statsController)
    .get("/blog-search", searchController);

module.exports = apiRouter;
