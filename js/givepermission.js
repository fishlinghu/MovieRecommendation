window.onload = initAll;
var req;
var apiKey = "2d6aea1c2b693ee6f1ad40db73f53ea1";
var session_id = "";
var username = "";

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function checkToken() {
    var request_token = getCookie("request_token");
    if (request_token != "") {
        alert("Already got the token " + request_token);
        // no need the request session ID here, if we already got the session ID, dont request it again
        checkUserPermission();
    } else {
        send_requestToken();
    }
}

function checkUserPermission(){
    var username = getCookie("username");
    if(username != ""){
        alert("Logged in as " + username);
    }
    else{
        // check if we got the session ID
        send_request_username();
    }
}

function initAll()
	{
    document.getElementById("getInfoButton").onclick = checkToken;
	}

function send_requestToken()
	{
    req = new XMLHttpRequest();
    var requestTokenURL = "https://api.themoviedb.org/3/authentication/token/new?api_key=" + apiKey;
    //console.log("HI");
    //req.open("GET", "https://api.themoviedb.org/3/authentication/token/new?api_key=2d6aea1c2b693ee6f1ad40db73f53ea1");
    req.open("GET", requestTokenURL);
    req.onreadystatechange = get_requestToken;
    req.send(null);
	}

function get_requestToken()
	{
    if (req.readyState == 4) 
        { 
        alert(req.responseText);
        console.log(req.responseText);
        document.getElementById('request_token').innerHTML = this.responseText;
        var resp = this.responseText;
        var jsonResp = JSON.parse(resp);
        setCookie("request_token", jsonResp["request_token"], 1);
        //window.location.href = "https://www.themoviedb.org/authenticate/"+ jsonResp["request_token"];
        //window.location.href = "https://www.themoviedb.org/authenticate/"+ jsonResp["request_token"] +"?redirect_to=http://aws-website-discovermovie-csf77.s3-website-us-east-1.amazonaws.com/";
        //then you can create new session id
        }
	}

/******** get sessionID *********/

function send_request_sessionID(){
    req = new XMLHttpRequest();
    var requestURL = "&api_key=" + apiKey; // finish the url
    req.open("GET", requestURL);
    req.onreadystatechange = get_request_sessionID;
    req.send(null);
}

function get_request_sessionID()
    {
    if (req.readyState == 4) 
        { 
        alert(req.responseText);
        console.log(req.responseText);
        document.getElementById('session_id').innerHTML = this.responseText;
        var resp = this.responseText;
        var jsonResp = JSON.parse(resp);
        setCookie("session_id", jsonResp["session_id"], 1);
        }
    }

/******** get user name *********/

function send_request_username(){
    req = new XMLHttpRequest();
    var requestusernameURL = "https://api.themoviedb.org/3/account?session_id=" + session_id + "&api_key=" + apiKey;
    //console.log("HI");
    //req.open("GET", "https://api.themoviedb.org/3/authentication/token/new?api_key=2d6aea1c2b693ee6f1ad40db73f53ea1");
    req.open("GET", requestusernameURL);
    req.onreadystatechange = get_request_username;
    req.send(null);
}

function get_request_username()
    {
    if (req.readyState == 4) 
        { 
        alert(req.responseText);
        console.log(req.responseText);
        document.getElementById('username').innerHTML = this.responseText;
        var resp = this.responseText;
        var jsonResp = JSON.parse(resp);
        setCookie("username", jsonResp["username"], 1);
        }
    }