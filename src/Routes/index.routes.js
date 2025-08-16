const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render("index");  // ✅ Will look for views/index.ejs
});

module.exports = router;
