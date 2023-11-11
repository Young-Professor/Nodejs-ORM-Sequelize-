const express = require("express");
const router = express.Router();
const { addStaff, addClass, updateDepartmentalHead, createDepartment, addStream } = require("../controllers/postcontrollers");
const {getAllStaff, getClasses, getDepartment}=require('../controllers/getcontrollers')

//post routes
router.post("/create-staff", addStaff);
router.post("/create-class", addClass);
router.post("/update-hod", updateDepartmentalHead);
router.post("/create-department", createDepartment);
router.post("/create-stream", addStream);

//get routes
router.get("/get-",getAllStaff)
router.get("/get-classes",getClasses)
router.get("/get-department",getDepartment)
module.exports = router; 