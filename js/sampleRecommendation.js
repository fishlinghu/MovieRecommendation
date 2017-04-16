window.onload = request_favorite_movie;
var req;
var apiKey = "2d6aea1c2b693ee6f1ad40db73f53ea1";

var dict_movieDetail = {};
var output = '<tr class="headerrow"><th>Poster</th><th>Title</th><th>Genres</th><th>Rating</th><th>Language</th><th>Release Date</th><th>Overview</th></tr>';

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
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
            //alert("favorite movies: " + req.responseText);
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

/*
function get_movie_details(){
    if (req.readyState == 4){
        var resp = this.responseText;
        var jsonResp = JSON.parse(resp);

        array_movieDetail.push( jsonResp );
    } 
}
*/

function get_movie_details(){
    if (req.readyState == 4){  
        sleep(2000);  
        var resp = this.responseText;
        var jsonResp = JSON.parse(resp);
        //alert("favorite movies: " + jsonResp["original_title"]);
        console.log(req.responseText);
        
        if(!(jsonResp["id"] in window.dict_movieDetail)){
            window.dict_movieDetail[ jsonResp["id"] ] = jsonResp;
            var temp = jsonResp["genres"];
            var genreStr = "";
            var homepage = jsonResp["homepage"];
            for(var i = temp.length - 1; i >= 0; i--){
                genreStr = genreStr + temp[i]["name"] + ", ";
            }
            var makeUrl = "https://www.themoviedb.org/movie/" + jsonResp["id"] + "-" + jsonResp["title"].toLowerCase().replace(/[^a-zA-Z0-9]/g, "-");
            window.output = window.output +'<tr class = "datarowodd">'
                                          + '<td><img src="img/1.png" alt="" border=3 height=200 width=200></img></td>'
                                          + "<td><a href=" + makeUrl + ">" + jsonResp["original_title"] + "</a></td>"
                                          + "<td>"+ genreStr + "</td>"
                                          + "<td>" + jsonResp["vote_average"] + "</td>"
                                          + "<td>" + jsonResp["original_language"] + "</td>"
                                          + "<td>" + jsonResp["release_date"] + "</td>"
                                          + "<td>" + jsonResp["overview"] + "</td>"
                                          + "</tr>";
                                         
            document.getElementById("movieDetail").innerHTML = window.output;
        }
    } 
    else{
        alert("Loading movie");
        //sleep(2000);
        console.log(req.responseText); 
        // wtf no alert, no respond?????????? fuck
    }
}

function recommend_movie(list_of_json){
	// traverse through user's favorite movies' list and gather information
    var array_movieID = [];
	for (var i = list_of_json.length - 1; i >= 0; i--) {
		array_movieID.push(list_of_json[i]["id"]);
        //request_movie_details( list_of_json[i]["id"] );
	}

    var indices = [];

    d3.csv("Node_list.csv", function(error, movielist){
        if(error) throw error;

        var lmovielist  = [];
        movielist.forEach(function(d){
            lmovielist.push(+d.ID);
        });

        array_movieID.forEach(function(d){
            if(lmovielist.indexOf(d) != -1){
                indices.push(lmovielist.indexOf(d));
            }
        });

        console.log(array_movieID);
        console.log("indices:"+indices);

        d3.csv("Final_output.csv", function(error, rmatrix){
            if(error) throw error;

            //Store vectors of favorite movie
            var stored_vectors = [];
            var tempLen;
            indices.forEach(function(i){
            //foreach favorite movie, store its vector 
                var stored = [];
                rmatrix.forEach(function(d){
                    stored.push(+d[i.toString()]); //make element as a number
                });
                tempLen = stored.length;
                stored_vectors.push(stored);
            });

            console.log("stored_vectors:");
            //Calculate relevance scores
            var relevance_scores = [];
            var temp_product = 1;
            for(var i = 0; i < tempLen; i++){
                for(var j = 0; j< indices.length; j++){
                    temp_product *= (1 - stored_vectors[j][i]);
                }
                relevance_scores.push(1 - temp_product);
                temp_product = 1;
            }

            console.log("relevance_scores:");

            d3.csv("Bridge_score.csv", function(error, bridgescore){
                if(error) throw error;

                var bridge_scores = [];
                bridgescore.forEach(function(d){
                    bridge_scores.push(+d.ID);
                });

                //The final score is given by bridge_score multiply relevance score
                var final_scores = [];
                for(var i = 0; i<bridge_scores.length; i++){
                    if(indices.indexOf(i) === -1){
                        final_scores.push(bridge_scores[i]*relevance_scores[i]);
                    }
                    else {
                        final_scores.push(0);
                    }
                }

                console.log("final_scores:");


                var final_movieID = [];
                var temp_index;
                var curmax = 0;
                var prevmax = d3.max(final_scores, function(d){ return d; });
                final_movieID.push(lmovielist[final_scores.indexOf(prevmax)]);
                var nfavorive = 10;

                //Recommend top 10 ranked 
                for(var i = 1; i<nfavorive; i++){
                    var j = 0;
                    final_scores.forEach(function(d){
                        if(d>curmax && d < prevmax){
                            curmax = d;
                            temp_index = j;
                        }
                        j++;
                    });
                    final_movieID.push(lmovielist[temp_index]);
                    prevmax = curmax;
                    curmax = 0;
                    
                }
                console.log(final_movieID);
                // get the information of movie using request
                for (var i = final_movieID.length - 1; i >= 0; i--) {
                    request_movie_details( final_movieID[i] );
                }
                // output the recommended movie information to html
            });
        });
    });

	
}