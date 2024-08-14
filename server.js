const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');

// Serve static files from /public directory
app.use("/public", express.static(path.join(__dirname, 'public')));

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(bodyParser.urlencoded({ extended: true }));

// Object to store user data
const users = {};



// This is the SQL Database
const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('./election.db')

db.serialize(() => {
db.run(
    `CREATE TABLE IF NOT EXISTS "roles" (
	"id"	INTEGER,
	"role"	TEXT,
	PRIMARY KEY("id" AUTOINCREMENT)
)`);

db.run(
    `CREATE TABLE IF NOT EXISTS "users" (
	"id"	INTEGER,
	"firstname"	TEXT,
	"middlename"	TEXT,
	"lastname"	TEXT,
	"dob"	DATE,
	"photo"	BLOB,
	PRIMARY KEY("id" AUTOINCREMENT)
)`);

db.run(
    `CREATE TABLE IF NOT EXISTS "auth" (
	"id"	INTEGER,
	username TEXT, 
    user_id INT,
    password TEXT,
	PRIMARY KEY("id" AUTOINCREMENT)
)`);

db.run(
    `CREATE TABLE IF NOT EXISTS parties ( 
    "id" INTEGER, 
    party TEXT, 
    logo BLOB,
    PRIMARY KEY("id" AUTOINCREMENT)
)`);
    

db.run(
    `CREATE TABLE IF NOT EXISTS positions ( 
    "id" INTEGER, 
    position TEXT, 
    PRIMARY KEY("id" AUTOINCREMENT)
)`);


db.run(
    `CREATE TABLE IF NOT EXISTS candidates ( 
    "id" INTEGER, 
    firstname TEXT, 
    middlename TEXT, 
    lastname TEXT, 
    position TEXT, 
    party_id INT,
    photo BLOB,
    PRIMARY KEY("id" AUTOINCREMENT)
)`);

db.run(
    `CREATE TABLE IF NOT EXISTS votes ( 
    "id" INTEGER, 
    votes TEXT,
    PRIMARY KEY("id" AUTOINCREMENT)
)`);

})

// Route to login form
app.get('/login', (req, res) => {
    res.render('login.ejs');
});


// Handle login form submission
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    if (users[email] && users[email].password === password) {
        res.redirect('/dashboard');
    } else {
        res.send('Invalid email or password');
    }
});


// Route to signup form
app.get('/singup', (req, res) => {
    res.render('singup.ejs');
});

// Handle signup form submission
app.post('/singup', (req, res) => {
    const { fullname, email, password } = req.body;

    // Validate inputs
    if (!fullname || !email || !password) {
        return res.send('Please fill out all fields');
    }

    // Example: Basic password length validation
    if (password.length < 6) {
        return res.send('Password must be at least 6 characters');
    }

    // Check if user already exists
    if (users[email]) {
        return res.send('User already exists');
    }

    // Store user data (ideally, hash the password in real-world scenarios)
    users[email] = { fullname, password };

   // Log the user information to the console
   console.log(`New user signed up:\nFull Name: ${fullname}\nEmail: ${email}\npassword: ${password}`);

    // Redirect to login page after successful signup
    res.redirect('/login');
});

// This code block is fetching the roles from the role table
app.get('/voterregi', (req, res) => {
    const db = new sqlite3.Database('./election.db'); // Open the database
    db.all('SELECT * FROM roles', function(error, roles) {
        if (error) {
            return res.send('Error occurred while fetching roles');
        }
        console.log(roles);
        res.render('voter_regi.ejs', { roles: roles }); // Pass roles to the template
    });
    db.close(); // Close the database connection
});

// Fetching numbers of users from the user table
app.get('/dashboard', (req, res) => {
    const db = new sqlite3.Database('./election.db'); // Open the database

    // Query to count the number of users
    db.get('SELECT COUNT(*) AS userCount FROM users', function(error, result) {
        if (error) {
            return res.send('Error occurred while fetching the number of users');
        }
        const userCount = result.userCount; // Extract userCount from the result

        console.log(result);
       // Pass the userCount to the EJS template
       res.render('dashboard.ejs', { userCount: userCount });
        
    });

    db.close(); // Close the database connection
});




// Handle voter registration form submission
app.post('/voterregi', (req, res) => {
    const { firstname, middlename, lastname, dob, username, password, photo } = req.body;

    // Validate inputs
    if (!firstname || !middlename || !lastname || !dob || !username || !password || !photo) {
        return res.send('Please fill out all fields');
    }

    // Example: Basic password length validation
    if (password.length < 6) {
        return res.send('Password must be at least 6 characters');
    }

    // Check if user already exists
    if (users[username]) {
        return res.send('User already exists');
    }

    // Store user data (ideally, hash the password in real-world scenarios)
    users[username] = { firstname, middlename, lastname, dob, password, photo };


    // Insert user first_name, middle_name, last_name, dob, photo into the users table
    const userQuery = `
    INSERT INTO users (firstname, middlename, lastname, dob, photo)
    VALUES (?, ?, ?, ?, ?)
  `;

  const db = new sqlite3.Database('./election.db'); // Open the database again for inserting data
//   This blog is insecting data to the user table
  db.run(userQuery, [firstname, middlename, lastname, dob, photo], function(err) {
      if (err) {
          return res.send('Error occurred during registration');
      }

      // Get the last inserted user ID
      const user_id = this.lastID;


    // Insert username and password data into the auth table
    const authQuery = `
      INSERT INTO auth (username, user_id, password)
      VALUES (?, ?, ?)
    `;

    // Checking if user already exit
    db.run(authQuery, [username, user_id, password], function(err) {
        if (err) {
            if (err.code === 'SQLITE_CONSTRAINT') {
                // Username already exists
                return res.send('User already exists');
            }
            // // Some other error
            return res.send('Error occurred during registration');
        }

//    Log the user information to the console
   console.log(`New user signed up:
    \nFull Name: ${firstname}
    \nMiddle Name: ${middlename} 
    \nLast Name: ${lastname}
    \nDate Of Birth: ${dob}
    \npassword: ${password}
    \nPhoto: ${photo}`);

    // Redirect to login page after successful signup
    res.redirect('/login');
});
});
 db.close(); // Close the database connection
});


// Voter Registration form route
app.get('/partyregi', (req, res) => {
    res.render('party_regi.ejs');
});



// Log the path to the public directory
console.log(path.join(__dirname, 'public'));

// Start the server
app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});
