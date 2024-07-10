const express = require('express');
const app = express();
const path = require('path');


// This line of code rerun the server
app.use(express.static(path.join(__dirname, 'public')))

// This line of code tell express that this we are using the ejs template 
app.set('view engine', 'ejs')



// Route to login.ejs
app.get('/login', (req, res) => {
    res.render('login.ejs');
});

// Redirect to dashboard.ejs
app.post('/login', (req, res) => {
    res.redirect('/dashboard');
});

// Route to dashboard.ejs
app.get('/dashboard', (req, res) => {
    res.render('dashboard.ejs');
});


// Home link (if you want to serve some other content for the home route)
// app.get('/', (req, res) => {
//     res.send("<a href='/home'>Home</a>");
// });


// Log the path to the public directory
console.log(path.join(__dirname, 'public'));





// Start the server
app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});
