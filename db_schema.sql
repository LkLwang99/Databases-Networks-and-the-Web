
-- This makes sure that foreign_key constraints are observed and that errors will be thrown for violations
PRAGMA foreign_keys=ON;

BEGIN TRANSACTION;

--create your tables with SQL commands here (watch out for slight syntactical differences with SQLite)

CREATE TABLE IF NOT EXISTS authors (
    author_id INTEGER PRIMARY KEY AUTOINCREMENT
    author_name TEXT NOT NULL,
    author_username TEXT NOT NULL,
    author_password TEXT NOT NULL


);

CREATE TABLE IF NOT EXISTS authorsPosts (
    author_id INTEGER,
    authorsPost_id INTEGER PRIMARY KEY AUTOINCREMENT,
    authorsPost_author_name TEXT NOT NULL,
    authorsPost_title TEXT NOT NULL,
    authorsPost_description TEXT NOT NULL,
    authorsPost_date TEXT NOT NULL,
    FOREIGN KEY (author_id) REFERENCES authors(author_id)
);


CREATE TABLE IF NOT EXISTS drafts (
    draft_id INTEGER PRIMARY KEY AUTOINCREMENT,
    draftpost_author_id INTEGER,
    draftpost_author_name TEXT NOT NULL,
    draftpost_title TEXT,
    draftpost_description TEXT,
    draftpost_date TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS comments (
    comments_id INTEGER PRIMARY KEY AUTOINCREMENT,
    authorsPost_id INTEGER,
    comments TEXT NOT NULL,
    comments_date TEXT NOT NULL
);



INSERT INTO authors (author_id,author_name, author_username, author_password) VALUES (1,"Simon Star", "Simonstar123", "Simonpassword123")
INSERT INTO drafts (draft_id, draftpost_author_id, draftpost_author_name, draftpost_title, draftpost_description,draftpost_date) VALUES (2,1,"Simon Star","","Lorep Ipsum","2023-07-10")
INSERT INTO authorsPosts (author_id, authorsPost_author_name, authorsPost_title, authorsPost_description, authorsPost_date) VALUES (1, "Simon Star", "ALorem Ipsum 123413251", "ALorem Ipsum 12304124", "2023-07-10")

--insert default data (if necessary here)



COMMIT;

