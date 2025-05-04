const express = require("express");
const router = express.Router();
const customerRoute = require("./customer.route");
const employeeRoute = require("./employee.route");
const activityRoute = require("./activity.route");
const productRoute = require("./product.route");
const orderRoute = require("./order.route");
const userRoute = require("./user.route");


router.get("/customer",customerRoute);
router.get("/employee",employeeRoute);
router.get("/activity",activityRoute);
router.get("/product",productRoute);
router.get("/order",orderRoute);
router.get("/user",userRoute);

module.exports=router;