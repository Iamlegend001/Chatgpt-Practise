const express = require("express")
const authMiddlewares = require("../middlewares/auth.middleware")

const router = express.Router()

router.get("/",authMiddlewares.userAuth,(req,res)=>{

  res.render("Home")
})


module.exports = router