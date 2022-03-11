require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const db = require("./app/models");
const Role = db.role;
var corsOptions = {
  origin: "http://localhost:8081"
};

db.mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  })

  function initial() {
    Role.estimatedDocumentCount((err, count) => {
      if (!err && count === 0) {
        new Role({
          name: "user"
        }).save(err => {
          if (err) {
            console.log("error", err);
          }
          console.log("added 'user' to roles collection");
        });
        new Role({
            name: "admin"
          }).save(err => {
            if (err) {
              console.log("error", err);
            }
            console.log("added 'admin' to roles collection");
          });
        }
      });
    }
app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});


// set port, listen for requests
// const PORT = process.env.PORT || 8080;
app.listen(process.env.PORT || 8081, () => console.log(`Server started on port 4500 WeebStore`))

