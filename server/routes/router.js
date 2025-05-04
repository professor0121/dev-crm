const express = require("express");
const router = express.Router();

const customerRoute = require("./customer.route");
const employeeRoute = require("./employee.route");
const activityRoute = require("./activity.route");
const productRoute = require("./product.route");
const orderRoute = require("./order.route");
const userRoute = require("./user.route");

// Mount the routers
router.use("/customer", customerRoute);
router.use("/employee", employeeRoute);
router.use("/activity", activityRoute);
router.use("/product", productRoute);
router.use("/order", orderRoute);
router.use("/user", userRoute);

module.exports = router;
