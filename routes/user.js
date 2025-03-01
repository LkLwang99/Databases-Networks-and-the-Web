/**
 * These are example routes for user management
 * This shows how to correctly structure your routes for the project
 */

const express = require("express");
const router = express.Router();
const assert = require("assert");

/* bringing the authors to their login page */

/* Upon successful login, brings the author to the author's homepage */
router.get("/", authenticatedUser, (req, res) => {
  var authorsqlquery =
    "SELECT * FROM authorsPosts WHERE author_id LIKE ? ORDER BY authorsPost_date DESC";
  var authorsqlquery2 =
    "SELECT * FROM drafts WHERE draftpost_author_id LIKE ? ORDER BY draftpost_date DESC; ?";
  var author_id = req.user.author_id;

  global.db.all(authorsqlquery, [author_id], (err, rows) => {
    if (err) {
      return console.error("No Book Found");
    } else {
      global.db.all(authorsqlquery2, [author_id], (err, draftRows) => {
        if (err) {
          res.render("authorHomepage", { rows, draftRows: {} });
          return console.error("No Book Found2");
        } else {
          res.render("authorHomepage", { rows, draftRows });
        }
      });
    }
  });
});

router.get("/create_new_post", authenticatedUser, (req, res) => {
  res.render("create_new_post");
});

router.post("/create_new_post", authenticatedUser, (req, res) => {
  const currentDate = new Date().toISOString().slice(0, 10);
  const title = req.body.draftpost_title;
  const description = req.body.draftpost_description;
  const submitAction = req.body.submitAction;
  const name = req.user.author_name;
  const id = req.user.author_id;
  console.log(req.body.draftpost_title);
  if (submitAction === "submit") {
    if (title == "") {
      return res.status(400).send("the title field can't be left empty!");
    } else if (description == "") {
      return res.status(400).send("the description field can't be left empty!");
    }
    sqlQuery =
      "INSERT INTO authorsPosts (author_id, authorsPost_author_name, authorsPost_title, authorsPost_description, authorsPost_date) VALUES (?, ?, ?, ?, ?)";
    global.db.run(
      sqlQuery,
      [id, name, title, description, currentDate],
      function (err) {
        if (err) {
          console.log("Error inserting data:", err.message);
          // Handle the error here (e.g., send an error response to the client)
          res.status(500).send("Error inserting data into authorsPosts.");
        } else {
          console.log("New post inserted successfully.");
          res.redirect("/User");
        }
      }
    );
  } else if (submitAction === "saveDraft") {
    sqlQuery =
      "INSERT INTO drafts (draftpost_author_id, draftpost_author_name, draftpost_title, draftpost_description, draftpost_date) VALUES (?, ?, ?, ?, ?)";
    global.db.run(
      sqlQuery,
      [id, name, title, description, currentDate],
      function (err) {
        if (err) {
          console.log("Error inserting data:", err.message);
          // Handle the error here (e.g., send an error response to the client)
          res.status(500).send("Error inserting data into drafts.");
        } else {
          console.log("New post saved as a draft.");
          res.redirect("/user");
        }
      }
    );
  } else {
    // Handle the case where no valid submitAction value was received
    res.status(400).send("Invalid submitAction value.");
  }
});

router.get("/deletepost/:id", authenticatedUser, (req, res) => {
  const authorsPost_id = req.params.id;
  sqlquery = "DELETE FROM authorsPosts WHERE authorsPost_id LIKE ?";
  global.db.run(sqlquery, [authorsPost_id], (err, rows) => {
    if (err) {
      return console.error("No Book Found");
    } else {
      res.redirect("/user");
    }
  });
});

router.get("/editpost/:id", authenticatedUser, (req, res) => {
  const authorsPost_id = req.params.id;
  sqlquery = "SELECT * FROM authorsPosts WHERE authorsPost_id LIKE ? ";
  global.db.all(sqlquery, [authorsPost_id], (err, rows) => {
    if (err) {
      return console.error("No Book Found");
    } else {
      if (rows.length === 0) {
        console.log("No post Found");
        res.status(404).send("POST NOT FOUND.");
      } else {
        res.render("edit_post", { post: rows[0] });
      }
    }
  });
});

router.post("/update_post/:id", authenticatedUser, (req, res) => {
  const authorsPost_id = req.params.id;
  const title = req.body.draftpost_title;
  console.log(title);
  const description = req.body.draftpost_description;
  const submitAction = req.body.submitAction;
  const currentDate = new Date().toISOString().slice(0, 10);
  const sqlquery =
    "UPDATE authorsPosts SET authorsPost_title = ?, authorsPost_description = ?,authorsPost_date = ? WHERE authorsPost_id = ?";
  global.db.run(
    sqlquery,
    [title, description, currentDate, authorsPost_id],
    (err) => {
      if (err) {
        console.log("Error updating post", err.message);
        res.status(500).send("Error updating post");
      } else {
        console.log("post updated succesfully.");
        res.redirect("/user");
      }
    }
  );
});

router.get("/viewdraftpost/:id", authenticatedUser, (req, res) => {
  const draft_id = req.params.id;
  sqlquery = "SELECT * FROM drafts WHERE draft_id LIKE ?";
  global.db.all(sqlquery, [draft_id], (err, rows) => {
    if (err) {
      return console.error("No Book Found");
    } else {
      res.render("view_draftpost", { post: rows[0] });
    }
  });
});

router.get("/deletedraft/:id", authenticatedUser, (req, res) => {
  const authorsPost_id = req.params.id;
  sqlquery = "DELETE FROM drafts WHERE draft_id LIKE ?";
  global.db.run(sqlquery, [authorsPost_id], (err, rows) => {
    if (err) {
      return console.error("No Book Found");
    } else {
      res.redirect("/user");
    }
  });
});

router.get("/editdraft/:id", authenticatedUser, (req, res) => {
  const draft_id = req.params.id;
  sqlquery = "SELECT * FROM drafts WHERE draft_id LIKE ? ";
  global.db.all(sqlquery, [draft_id], (err, rows) => {
    if (err) {
      return console.error("No Book Found");
    } else {
      if (rows.length === 0) {
        console.log("No post Found");
        res.status(404).send("POST NOT FOUND.");
      } else {
        res.render("edit_draft", { post: rows[0] });
      }
    }
  });
});

router.post("/update_draft/:id", authenticatedUser, (req, res) => {
  const draft_id = req.params.id;
  const title = req.body.draftpost_title;
  console.log(title);
  const description = req.body.draftpost_description;
  const submitAction = req.body.submitAction;
  const currentDate = new Date().toISOString().slice(0, 10);
  const sqlquery =
    "UPDATE drafts SET draftpost_title = ?, draftpost_description = ?,draftpost_date = ? WHERE draft_id = ?";
  global.db.run(
    sqlquery,
    [title, description, currentDate, draft_id],
    (err) => {
      if (err) {
        console.log("Error updating post", err.message);
        res.status(500).send("Error updating post");
      } else {
        console.log("draft updated succesfully.");
        res.redirect("/user");
      }
    }
  );
});

/* Ensuring that the user is authenticated */

function authenticatedUser(req, res, next) {
  if (req.user !== undefined) {
    return next();
  } else {
    res.redirect("/login");
  }
}

module.exports = router;
