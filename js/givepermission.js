window.onload = initAll;
var req;
var apiKey = "2d6aea1c2b693ee6f1ad40db73f53ea1";
var userID = "";

function checkToken() {
    var request_token = getCookie("request_token");
    if (request_token != "") {
        alert("Already got the token " + request_token);
        // send the request for user ID
        checkUserPermission();
    } else {
        send_requestToken();
    }
}

function checkUserPermission(){
    var userID = getCookie("userID");
    if(userID != ""){
        alert("Logged in as " + userID);
    }
    else{
        //send_requestToken();
    }
}

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