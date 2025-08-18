const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function getRegisterController(req, res) {
  res.render("register");
}

async function postRegisterController(req, res) {
  const { username, email, password } = req.body;

  const isUserExist = await userModel.findOne({
    $or: [{ username: username }, { email: email }],
  });
  if (isUserExist) {
    return res.status(400).json({
      message: "user already exists with this username or email",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await userModel.create({
    username,
    email,
    password: hashedPassword,
  });

  // Use user._id instead of user_id
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  res.cookie("token", token);
  return res.status(201).json({
    message: "user registered successfully",
    user,
  });
}
async function postLoginController(req, res) {
  const { email, username, password } = req.body;

  // Check by email OR username
  const user = await userModel.findOne({
    $or: [{ email: email }, { username: email }, { username: username }],
  });

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  // Compare passwords
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid password" });
  }

  // Generate JWT token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h", // optional
  });

  res.cookie("token", token, { httpOnly: true }); // secure cookie
  return res.status(200).json({
    message: "User logged in successfully",
    user,
  });
}

async function getLoginController(req,res) {
  res.render('login')

}

module.exports = {
  getRegisterController,
  postRegisterController,
  postLoginController,
  getLoginController
};
