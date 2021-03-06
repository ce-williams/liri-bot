require('dotenv').config();

var fs = require("fs");
var keys = require('./keys.js');
var request = require('request');
var twitter = require('twitter');
var Spotify = require('node-spotify-api');

//assumoing that when you type in 0 node 1 liri 2 command 3 param for command
var liriCommand = process.argv[2];
var input = process.argv[3];

//liri commands (function that controlls the other functions)

function commands(liriCommand, input) {
    switch(liriCommand) {
        case "my-tweets":
            getTweets(input);
            break;
        case "spotify-this-song":
            getSong(input);
            break;
        case "movie-this":
            getMovie(input);
            break;
        case "do-what-it-says":
            getRandom(input);
            break;
        default:
        console.log("Please enter one of the following commands: 'my-tweets', 'spotify-this-song', 'movie-this', 'do-what-it-says' followed by parameter.");
    }
}

//Twitter "get twets"
function getTweets(input) {
    //allows functionality of keys
    var client = new twitter(keys.twitter);
    // input would be the final param of the CLI (node liri get-tweets param)
    var twitterUserName = input;

    // this simplifies the api call process taking the necessary params in the form of a single 
    // varable that can be passed into a single client API .get call
    // result 'statuses/user_timeline
    var params = { screen_name: twitterUserName, count: 20 };
    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (error) {
            console.log(error);
        }
        else {
            for (var i = 0; i < tweets.length; i++) {
                console.log("Tweet: " + tweets[i].text + "\nCreated: " + tweets[i].created_at);
                var logTweets = twitterUserName + "\nTweet: " + tweets[i].created_at + "\nTweet Text: " + tweets[i].text + "\n-------\n";
                fs.appendFile('log.txt', logTweets, function (err) {
                    if (err) throw err;
                });
            }
        }
    })
};

// Spotify
function getSong(songName) {
    var spotify = new Spotify(keys.spotify);

    if (!songName) {
        songName = "The Sign";
    };

    // console.log(songName);

    spotify.search({ type: 'track', query: songName }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        } else {

            var logSong = 
                "Artist: " + data.tracks.items[0].artists[0].name + "\r\n" +
                "Song name: " + data.tracks.items[0].name + "\r\n" +
                "Preview Link: " + data.tracks.items[0].preview_url + "\r\n" +
                "Album Name: " + data.tracks.items[0].album.name + "\r\n";

            console.log(logSong);

            fs.appendFile('log.txt', logSong, function (err) {
                if (err) throw err;
            });
        };
    });
};

// get movie function

function getMovie(movieName) {
    if (!movieName) {
        movieName = "mr nobody";
    }

    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&r=json&tomatoes=true&apikey=trilogy";

    console.log(queryUrl);

    request(queryUrl, function (error, response, body) {

        if (!error && response.statusCode === 200) {
            var movieObject = JSON.parse(body);

            var movieResults =
                "Title: " + movieObject.Title + "\r\n" +
                "Year: " + movieObject.Year + "\r\n" +
                "Imdb Rating: " + movieObject.imdbRating + "\r\n" +
                "Rotten Tomatoes Rating: " + movieObject.tomatoRating + "\r\n" +
                "Country: " + movieObject.Country + "\r\n" +
                "Language: " + movieObject.Language + "\r\n" +
                "Plot: " + movieObject.Plot + "\r\n" +
                "Actors: " + movieObject.Actors + "\r\n";

            console.log(movieResults);

            //makes it possible to log the user input into the 'log.text' file

            fs.appendFile('log.txt', movieResults, function (err) {
                if (err) throw err;
            });
            logResults(response);
        }
        else {
            console.log("Error :" + error);
            return;
        }
    });
};

//Random
function getRandom() {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error);
        }
        else {
            console.log(data);

            var randomData = data.split(",");
            //passes data into getSong function
            commands(randomData[0], randomData[1]);
        }
        console.log("test" + randomData[0] + randomData[1]);
    });
};

//Function to log results from the other functions
function logResults(data) {
    fs.appendFile("log.txt", data, function (err) {
        if (err)
            throw err;
    });
};

commands(liriCommand, input);



//  `my-tweets`

//  `spotify-this-song`

//  `movie-this`

//  `do-what-it-says`
