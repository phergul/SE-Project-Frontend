const signupForm = document.querySelector('');
signupForm.addEventListener('submit', (e) => {
    //prevent refresh on submit
    e.preventDefault();

    //get the users info


    //signup with firebase
    auth.createUserWithEmailAndPassword(email, password)
})