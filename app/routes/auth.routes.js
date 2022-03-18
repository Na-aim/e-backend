const {verifySignUp}  = require("../middleware");
const controller = require("../controllers/auth.controller");
const authJwt = require("../middleware/authJwt")
const getUser = require("../middleware/aquireUser")
const db = require("../models");
const User = db.user;
module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  app.post(
    "/api/auth/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted
    ],
    controller.signup
  );
  app.post("/api/auth/signin", controller.signin);
  app.get("/auth/users", async (req, res) => {
    try {
      const users = await User.find();
      res.json(users);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  app.delete(
    "/auth/users/:id",
    [getUser, authJwt.verifyToken],
    async (req, res) => {
      try {
        await res.user.remove();
        res.json({ message: "Deleted user" });
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
    }
  );
};