const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");
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
  app.get("/api/test/all", controller.allAccess);
  app.get("/api/test/user", [authJwt.verifyToken], controller.userBoard);

  app.get(
    "/api/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );
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

