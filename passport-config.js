const LocalStrategy = require("passport-local").Strategy;

function initialize(passport) {
  passport.use(
    new LocalStrategy(function (username, password, done) {
      sqlquery = "SELECT * FROM authors WHERE author_username LIKE ?";
      global.db.all(sqlquery, username, (err, user) => {
        console.log(user[0]);
        if (err) {
          console.log("error1");
          return done(err);
        } else if (username !== user[0].author_username) {
          console.log("Gonez");
          return done(null, false, { message: "Incorrect username." });
        } else if (password !== user[0].author_password) {
          console.log("GG");
          return done(null, false, { message: "Incorrect Password." });
        }
        console.log("Finished");
        return done(null, user[0]);
      });
    })
  );
  passport.serializeUser(function (user, done) {
    done(null, user);
  });
  passport.deserializeUser((user, done) => {
    done(null, user);
  });
}

module.exports = initialize;
