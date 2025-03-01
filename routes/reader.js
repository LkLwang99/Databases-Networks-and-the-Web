const express = require("express");
const router = express.Router();
const assert = require("assert");
const passport = require("passport");

router.get("/", (req, res) => {
  var Loggedin = false;
  if (req.user !== undefined) {
    Loggedin = true;
  }
  try {
    db.all("SELECT * FROM authorsPosts", [], (err, rows) => {
      if (err) {
        console.log("error retrieving posts", err.message);
      } else {
        res.render("index", { rows, Loggedin });
      }
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/post/:id", (req, res) => {
  var Loggedin = false;
  if (req.user !== undefined) {
    Loggedin = true;
  }
  const authorsPost_id = req.params.id;

  const sqlquery = "SELECT * FROM authorsPosts WHERE authorsPost_id LIKE ?";
  const sqlquery2 = "SELECT * FROM comments WHERE authorsPost_id LIKE?";
  global.db.all(sqlquery, [authorsPost_id], (err, rows) => {
    if (err) {
      return console.error("No Post Found");
    } else {
      global.db.all(sqlquery2, [authorsPost_id], (err, comments) => {
        if (err) {
          return console.log("No Comments Found");
        } else {
          res.render("post", { post: rows[0], comments, Loggedin });
        }
      });
    }
  });
});

router.post("/post/create_comment/:id", (req, res) => {
  const currentDate = new Date().toISOString().slice(0, 10);
  const authorsPost_id = req.params.id;
  const comments = req.body.input_comments;
  const sqlquery =
    "INSERT INTO comments (authorsPost_id,comments,comments_date) VALUES (?,?,?)";
  global.db.run(sqlquery, [authorsPost_id, comments, currentDate], (err) => {
    if (err) {
      console.log("Error commenting", err.message);
      res.status(500).send("Error updating post");
    } else {
      console.log("post commented succesfully.");
      res.redirect("/post/" + authorsPost_id);
    }
  });
});

router.get("/login", NotauthenticatedUser, (req, res) => {
  var Loggedin = false;
  if (req.user !== undefined) {
    Loggedin = true;
  }
  res.render("login", { Loggedin });
});

router.get("/register", (req, res) => {
  var Loggedin = false;
  if (req.user !== undefined) {
    Loggedin = true;
  }
  res.render("register", { Loggedin });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/user", // Redirect to the user's homepage on successful login
    failureRedirect: "/", // Redirect back to the login page on failed login
  })
);

router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", (req, res) => {
  const name = req.body.name;
  const username = req.body.username;
  const password = req.body.password;
  const sqlquery =
    "INSERT INTO authors (author_name, author_username, author_password) VALUES (?,?,?)";
  global.db.run(sqlquery, [name, username, password], (err) => {
    if (err) {
      console.log("Error registering user", err.message);
      res.status(500).send("Error registering user");
    } else {
      console.log("post commented succesfully.");
      res.redirect("/login");
    }
  });
});

function NotauthenticatedUser(req, res, next) {
  if (req.user == undefined) {
    return next();
  } else {
    res.redirect("/user");
  }
}

module.exports = router;
