const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

async function userAuth(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    // return res.status(401).json({
    //   message: "Unauthorized",
    // });
    return res.redirect("/auth/login")
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findById(decoded.id);

    req.user = user;

    next();
  } catch (error) {
    // res.status(401).json({
    //   message:"invalid token"
    // })
    res.redirect("/auth/login")
  }
}


module.exports = {userAuth}