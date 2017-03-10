window.onload = ;
var req;
var apiKey = "2d6aea1c2b693ee6f1ad40db73f53ea1";

function clearCookie(){
    setCookie("request_token", "", 1);
    setCookie("session_id", "", 1);
    setCookie("username", "", 1);
}

function request_favorite_movie(){
	req = new XMLHttpRequest();
    var requestURL = "https://api.themoviedb.org/3/account/" + getCookie("username") 
    							+ "/favorite/movies?api_key=" + apiKey
    							+ "&language=en-US&sort_by=created_at.asc";
    req.open("GET", requestURL);
    req.onreadystatechange = get_favorite_movie;
    req.send(null);
}

function get_favorite_movie(){
	if (req.readyState == 4) 
        { 
        var resp = this.responseText;
        var jsonResp = JSON.parse(resp);
        if(jsonResp.hasOwnProperty('')) // successfully get valid respond
            {   
            alert("favorite movies: " + req.responseText);
            console.log(req.responseText);
            //document.getElementById('username').innerHTML = this.responseText;
            //setCookie("username", jsonResp["username"], 1);
            }
        else // we do not have a valid session ID, let's request it
            {
            alert("cannot get favorite movies: " + req.responseText);
            console.log(req.responseText); 
            // important step
            // when we fail to retrieve information because of session_id
            // clear all information in cookie
            // get a new token
            // request user authorization again  
            // get a new session_id
            clearCookie();
            window.location.href = "http://aws-website-discovermovie-csf77.s3-website-us-east-1.amazonaws.com/";
            }
        }
}