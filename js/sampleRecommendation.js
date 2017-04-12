window.onload = request_favorite_movie;
var req;
var apiKey = "2d6aea1c2b693ee6f1ad40db73f53ea1";

var array_movieID = [];
var array_movieDetail = [];

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

function request_favorite_movie(){
	req = new XMLHttpRequest();
    var requestURL = "https://api.themoviedb.org/3/account/" + getCookie("username") 
    							+ "/favorite/movies?api_key=" + apiKey
    							+ "&session_id=" + getCookie("session_id") 
    							+ "&language=en-US&sort_by=created_at.asc";
    console.log( requestURL );
    req.open("GET", requestURL);
    req.onreadystatechange = get_favorite_movie;
    req.send(null);
}

function get_favorite_movie(){
	if (req.readyState == 4) 
        { 
        var resp = this.responseText;
        var jsonResp = JSON.parse(resp);
        if(jsonResp.hasOwnProperty('page')) // successfully get valid respond
            {   
            alert("favorite movies: " + req.responseText);
            console.log(req.responseText);
            // recommendation algorithm
            // some more query
            // get the result
            // print in html

            //document.getElementById('username').innerHTML = this.responseText;
            //setCookie("username", jsonResp["username"], 1);
            var list_of_json = jsonResp["results"];
            // adult, backdrop_path, genre_ids, id, original_language, original_title, overview, release_date, poster_path, popularity, title, video, vote_average, vote_count
            // genre_ids is a list of numbers
            recommend_movie(list_of_json);
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

function request_movie_details(movieID){
    req = new XMLHttpRequest();
    var requestURL = "https://api.themoviedb.org/3/movie/"+ movieID + "?api_key=" + apiKey + "&language=en-US";

    console.log( requestURL );
    req.open("GET", requestURL);
    req.onreadystatechange = get_movie_details;
    req.send(null);
}

function get_movie_details(){
    if (req.readyState == 4){
        var resp = this.responseText;
        var jsonResp = JSON.parse(resp);

        array_movieDetail.push( jsonResp );
    } 
}

function recommend_movie(list_of_json){
	// traverse through user's favorite movies' list and gather information
	for (var i = list_of_json.length - 1; i >= 0; i--) {
		array_movieID.push(list_of_json[i]["id"]);
        request_movie_details( list_of_json[i]["id"] );
	}


	// get the information of movie using request
	// output the recommended movie information to html
}