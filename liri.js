//gets the user inputted command to determine which case to run
var action = process.argv[2];
//setting up packages
var Twitter = require("twitter");
var Spotify = require('node-spotify-api');
var fs = require("fs");
//getting other files and data from those files
var keys = require("./keys.js");
var keys2 = require("./keys2.js");

var twitterKeysList = keys.twitterKeys;
var spotifyKeysList = keys2.spotifyKeys;
// console.log(twitterKeysList);
// console.log(spotifyKeysList);

liriSwitch(process.argv[2], process.argv[3]);

function liriSwitch(action, subject) {
    console.log(action);
    console.log(subject);

    switch (action) {
        case "my-tweets":
        	twitter();
            break;

        case "spotify-this-song":
            spotify(subject);
            break;

        case "movie-this":
            movies(subject);
            break;

        case "do-what-it-says":
           
            fs.readFile("random.txt", "utf8", function(error, data) {
                if (error) {
                    return console.log(error);
                }
                var dataArr = data.split(",");
                action = dataArr[0];
                subject = dataArr[1];
                liriSwitch(action, subject);
            })

            break;
    }
}

function twitter() {
    var client = new Twitter({
        consumer_key: twitterKeysList.consumer_key,
        consumer_secret: twitterKeysList.consumer_secret,
        access_token_key: twitterKeysList.access_token_key,
        access_token_secret: twitterKeysList.access_token_secret
    });
    client.get('statuses/user_timeline', { screen_name: 'Cookieboxes2', count: 20 }, function(error, tweets, response) {
        if (error) {
            error
        } else {
            for (i = 0; i < tweets.length; i++) {
                console.log(tweets[i].text);
                fs.appendFile("log.txt", tweets[i].text +"\n",function(err){
                	if (err){
                		console.log(err);
                	}
                });

            }
        }
    });
}

function spotify(songName) {
    var spotify = new Spotify({
        id: spotifyKeysList.client_id,
        secret: spotifyKeysList.client_secret
    });

    if (!songName) {
        console.log("Artist(s): Ace of Base");
        console.log("Song Name: The Sign");
    } else {
        spotify.search({ type: 'track', query: songName }, function(err, data) {
            if (err) {
                console.log('Error occurred: ' + err);
                return;
            }
            var songInfo = data.tracks.items[0];
            // console.log(songInfo);
            console.log("Artist(s): " + songInfo.artists[0].name);
            console.log("Song Name: " + songInfo.name);
            console.log("Spotify Link Preview: " + songInfo.preview_url);
            console.log("Album: " + songInfo.album.name);
        });
    }
};

function movies(movieName) {
    var request = require('request');
    console.log(movieName);
    request('http://www.omdbapi.com/?t=' + movieName + '&apikey=40e9cece', function(error, response, body) {
        if (error) {
            console.log('Error occurred: ' + error);
        } else {
            console.log("Title: " + JSON.parse(body).Title);
            console.log("Year of Release: " + JSON.parse(body).Year);
            console.log("IMDB Rating: " + JSON.parse(body).Ratings[0].Value);
            console.log("Country of Production: " + JSON.parse(body).Country);
            console.log("Language: " + JSON.parse(body).Language);
            console.log("Plot: " + JSON.parse(body).Plot);
            console.log("Actors: " + JSON.parse(body).Actors);
            console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
        }
    });
};