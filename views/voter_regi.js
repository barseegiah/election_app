document.getElementById('reg_form').addEventListener('submit', e => {
    e.preventDefault();


let firstname1 = document.getElementById('firstname').value;
let middlename1 = document.getElementById('middlename').value;
let lastname1 = document.getElementById('lastname').value;
let dateofbirth1 = document.getElementById('dob').value;
let username1 = document.getElementById('username').value;
let file1 = document.getElementById('photo').value;
let password1 = document.getElementById('password').value;

let user_data = {
    firstname: firstname1,
    middlename: middlename1,
    lastname: lastname1,
    dateofbirth: dateofbirth1,
    username: username1,
    photo: file1,
    password: password1
}

let user_pass = {
    username: username1,
    password: password1
}

console.log(user_data)
// localStorage.setItem('user_data', JSON.stringify(user_data));

auth.setItem('user_pass', JSON.stringify(user_pass));

window.location.href='Login.html';

})