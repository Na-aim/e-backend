const User = require("../models/user.model");

getUser = async (req, res, next) => {
  let product;
  try {
    product = await User.findById(req.params.id);
    if (product == null) {
      return res.status(404).json({ message: "cannot find product" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.user = user;
  next();
};

module.exports = getUser;
