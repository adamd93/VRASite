console.log('Client-side code running');

//const button = document.getElementById('register');
/*document.getElementById('register').addEventListener('click', function(e) {
  fetch('/register', {method: 'GET'})
    .then(function(response) {
      if(response.ok) {
        return;
      }
    })
    .catch(function(error) {
      console.log(error);
    });
});*/

//const login = document.getElementById('login');
document.getElementById('login').addEventListener('click', function(e) {
  fetch('/', {method: 'POST'})
    .then(function(response) {
      if(response.ok) {
        return;
      }
      throw new Error('Request failed.');
    })
    .catch(function(error) {
      console.log(error);
    });
});

