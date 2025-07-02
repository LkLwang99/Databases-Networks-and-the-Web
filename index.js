const express = require("express");
const app = express();
const port = 3000;
const sqlite3 = require("sqlite3").verbose();
const passport = require("passport");
const session = require("express-session");
const LocalStrategy = require("passport-local").Strategy;
const userRoutes = require("./routes/user");
const readerRoutes = require("./routes/reader");
const initializePassport = require("./passport-config");

//items in the global namespace are accessible throught out the node application
global.db = new sqlite3.Database("./database.db", function (err) {
  if (err) {
    console.error(err);
    process.exit(1); //Bail out we can't connect to the DB
  } else {
    console.log("Database connected");
    global.db.run("PRAGMA foreign_keys=ON"); //This tells SQLite to pay attention to foreign key constraints
  }
});

app.use(express.urlencoded({ extended: true }));


global.db.run(`CREATE TABLE IF NOT EXISTS authors (
    author_id INTEGER PRIMARY KEY AUTOINCREMENT,
    author_name TEXT NOT NULL,
    author_username TEXT NOT NULL,
    author_password TEXT NOT NULL
)`);

global.db.run(`CREATE TABLE IF NOT EXISTS authorsPosts(
    author_id INTEGER,
    authorsPost_id INTEGER PRIMARY KEY AUTOINCREMENT,
    authorsPost_author_name TEXT NOT NULL,
    authorsPost_title TEXT NOT NULL,
    authorsPost_description TEXT NOT NULL,
    authorsPost_date TEXT NOT NULL,
    FOREIGN KEY (author_id) REFERENCES authors(author_id)
)`);

global.db.run(`CREATE TABLE IF NOT EXISTS drafts (
    draft_id INTEGER PRIMARY KEY AUTOINCREMENT,
    draftpost_author_id INTEGER,
    draftpost_author_name TEXT NOT NULL,
    draftpost_title TEXT,
    draftpost_description TEXT,
    draftpost_date TEXT NOT NULL
)`);

/* Run 2 */
global.db.run(
  `INSERT OR IGNORE INTO authors (author_id,author_name, author_username, author_password) VALUES (2,"Timon Star", "Timonstar123", "Timonpassword123")`
);

global.db.run(
  `INSERT OR IGNORE INTO authors (author_id,author_name, author_username, author_password) VALUES (1,"Simon Star", "Simonstar123", "Simonpassword123")`
);

global.db.run(
  `INSERT OR IGNORE INTO authorsPosts (author_id, authorsPost_author_name, authorsPost_title, authorsPost_description, authorsPost_date) VALUES (1, "Simon Star", "ALorem Ipsum 123413251", "ALorem Ipsum 12304124", "2023-07-10")`
);

global.db.run(
  `INSERT OR IGNORE INTO drafts (draft_id, draftpost_author_id, draftpost_author_name, draftpost_title, draftpost_description,draftpost_date) VALUES (2,1,"Simon Star","","Lorep Ipsum","2023-07-10")`
);

global.db.run(`CREATE TABLE IF NOT EXISTS comments (
    comments_id INTEGER PRIMARY KEY AUTOINCREMENT,
    authorsPost_id INTEGER,
    comments TEXT NOT NULL,
    comments_date TEXT NOT NULL
)
`);

//set the app to use ejs for rendering
app.set("view engine", "ejs");
initializePassport(passport);
app.use(express.static("public"));
app.use(express.json()); // Parse JSON bodies
app.use(
  require("express-session")({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

//this adds all the userRoutes to the app under the path /user
app.use("/user", userRoutes);

app.use("/", readerRoutes);
app.get("/test", function (req, res) {});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
