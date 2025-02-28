##  Coursework Template ##
### CM2040 Database Networks and the Web ###

#### Installation requirements ####

* NodeJS 
    - follow the install instructions at 
    - we recommend using the latest LTS version
* Sqlite3 
    - Windows users: follow instructions here https://www.sqlitetutorial.net/download-install-sqlite/
    - Mac users: it comes preinstalled
    - Linux users: use a package manager eg. apt install
* express-session
    
*passport
    
*passport-local
To install all the node packages run ```npm install``` from the project directory





##### Creating database tables #####

* All database tables should created by modifying the db_schema.sql.
* This allows us to review and recreate your database simply by running ```npm run build-db``` // npm run build-db did not work with my computer at theb eginning.
if the databases does not work, create a file called database.db and run the comments in index.js to build the database.


#### Preparing for submission ####

Make a copy of this folder
In your copy, delete the following files and folders:
    * node_modules
    * .git (the hidden folder with your git repository)
    * database.db (your database) 

Make sure that your package.json file includes all of the dependencies for your project NB. you need to use the ```--save``` tag each time you use npm to install a dependency

#### Getting started with my project ####

Edit this section to include any settings that should be adjusted in configuration files and concise instructions for how to access the reader and author pages once the app is running.

If the databases does not work, BUILD A FILE called database.db and run the functions in the comments in index.js to create the database tables.


