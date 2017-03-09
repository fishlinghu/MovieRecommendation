window.onload = initAll;
var req;
var apiKey = "2d6aea1c2b693ee6f1ad40db73f53ea1";

function initAll()
	{
    document.getElementById("getInfoButton").onclick = getInfo;
	}

function getInfo()
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
        console.log(req.responseText);
        document.getElementById('request_token').innerHTML = this.responseText;
        var resp = this.responseText;
        var jsonResp = JSON.parse(resp);
        window.location.href = "https://www.themoviedb.org/authenticate/"+ jsonResp["request_token"];
        //window.location.href = "https://www.themoviedb.org/authenticate/"+ jsonResp["request_token"] +"?redirect_to=http://aws-website-discovermovie-csf77.s3-website-us-east-1.amazonaws.com/";
        //then you can create new session id
        }
	}