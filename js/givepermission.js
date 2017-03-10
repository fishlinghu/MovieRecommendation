window.onload = checkToken;
var req;
var apiKey = "2d6aea1c2b693ee6f1ad40db73f53ea1";

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

function clearCookie(){
    setCookie("request_token", "", 1);
    setCookie("session_id", "", 1);
    setCookie("username", "", 1);
}

function checkToken() {
    //request_requestToken();
    
    var request_token = getCookie("request_token");
    var session_id = getCookie("session_id");
    if (request_token != "" && session_id == "") {
        alert("Already got the token " + request_token);
        request_sessionID();
    }
    else if(request_token != "" && session_id != ""){
        alert("Already got the token " + request_token + " and session_id " + session_id);
    } 
    else {
        request_requestToken();
    }
    
}

function checkUserPermission(){
    var username = getCookie("username");
    if(username != ""){
        alert("Logged in as " + username);
    }
    else{
        request_username();
    }
}

/*
function initAll()
	{
    document.getElementById("getInfoButton").onclick = checkToken;
	}
*/

function request_requestToken()
	{
    req = new XMLHttpRequest();
    var requestTokenURL = "https://api.themoviedb.org/3/authentication/token/new?api_key=" + apiKey;
    req.open("GET", requestTokenURL);
    req.onreadystatechange = get_requestToken;
    req.send(null);
	}

function get_requestToken()
	{
    if (req.readyState == 4) 
        { 
        alert("get request token: " + req.responseText);
        console.log(req.responseText);
        document.getElementById('request_token').innerHTML = this.responseText;
        var resp = this.responseText;
        var jsonResp = JSON.parse(resp);
        setCookie("request_token", jsonResp["request_token"], 1);
        window.location.href = "https://www.themoviedb.org/authenticate/"+ getCookie("request_token");
        //window.location.href = "https://www.themoviedb.org/authenticate/"+ jsonResp["request_token"] +"?redirect_to=http://aws-website-discovermovie-csf77.s3-website-us-east-1.amazonaws.com/";
        }
	}

/******** get sessionID *********/

function request_sessionID(){
    req = new XMLHttpRequest();
    var requestURL = "https://api.themoviedb.org/3/authentication/session/new?api_key=" + apiKey + "&request_token=" + getCookie("request_token"); // finish the url
    req.open("GET", requestURL);
    req.onreadystatechange = get_sessionID;
    req.send(null);
}

function get_sessionID()
    {
    if (req.readyState == 4) 
        { 
        console.log(req.responseText);
        var resp = this.responseText;
        var jsonResp = JSON.parse(resp);
        if(jsonResp.hasOwnProperty('session_id')) // successfully get session ID
            {   
            alert("get session ID: " + req.responseText);
            //document.getElementById('session_id').innerHTML = this.responseText;
            setCookie("session_id", jsonResp["session_id"], 1);
            // get user name
            // store it in the cookie
            // so later operations could use the username directly with session ID
            // if any request fail due to session ID
            // it should fall into the else part
            // and we go back to the initial state
            request_username();
            // basically, all request function that used session ID should follow the structure of request_username() exactly
            }
        else // fail to get session ID
            {   
            alert("Need user authorization");
            request_requestToken();
            }
        }
    }

/******** get user name *********/

function request_username(){
    req = new XMLHttpRequest();
    var requestusernameURL = "https://api.themoviedb.org/3/account?session_id=" + getCookie("session_id") + "&api_key=" + apiKey;
    req.open("GET", requestusernameURL);
    req.onreadystatechange = get_username;
    req.send(null);
}

function get_username()
    {
    if (req.readyState == 4) 
        { 
        var resp = this.responseText;
        var jsonResp = JSON.parse(resp);
        if(jsonResp.hasOwnProperty('username')) // we have a valid session ID and get the username
            {   
            alert("get username: " + req.responseText);
            console.log(req.responseText);
            //document.getElementById('username').innerHTML = this.responseText;
            setCookie("username", jsonResp["username"], 1);
            }
        else // we do not have a valid session ID, let's request it
            {
            alert("cannot get username: " + req.responseText);
            console.log(req.responseText); 
            // important step
            // when we fail to retrieve information because of session_id
            // clear all information in cookie
            // get a new token
            // request user authorization again  
            // get a new session_id
            clearCookie();
            checkToken();
            }
        }
    }