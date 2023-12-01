console.log("I work");
// access token = 3c174ae84960a3091b2facf671fb569b 
// for account jeff777AtUCB using jdnelson@berkeley.edu
let requestUrl = 'https://';
fetch(requestUrl)
.then(function (response) {
  return response.json();
})
.then(function (data) {
  console.log(data);
});