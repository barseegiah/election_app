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

// Route to dashboard
app.get('/dashboard', (req, res) => {
    res.render('dashboard.ejs');
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

// Log the path to the public directory
console.log(path.join(__dirname, 'public'));

// Start the server
app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});
