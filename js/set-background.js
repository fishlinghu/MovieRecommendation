var idx = Math.floor((new Date().getHours()));
var body = document.getElementsByTagName("body")[0];
body.className = "heaven-" + idx;

var data = "{}";

var xhr = new XMLHttpRequest();
//xhr.withCredentials = true;

xhr.addEventListener("readystatechange", function () {
  if (this.readyState === this.DONE) {
    console.log(this.responseText);
    //var resp = this.responseText;
    //var jsonResp = JSON.parse(resp);
    document.getElementById('request_token').innerHTML = this.responseText;
  	// window.location.href = "https://www.themoviedb.org/authenticate/"+ jsonResp["request_token"] +"?redirect_to=http://aws-website-discovermovie-csf77.s3-website-us-east-1.amazonaws.com/";
  	// then you can create new session id
  }

});

xhr.open("GET", "https://api.themoviedb.org/3/authentication/token/new?api_key=2d6aea1c2b693ee6f1ad40db73f53ea1");

xhr.send(data);

