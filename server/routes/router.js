const express = require("express");
const router = express.Router();

router.get("/dbs",(req,res)=>{
  res.status(200).json({message:"dbs is called"})
})

module.exports=router;