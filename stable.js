var bot = require("./bot"); //Don't change this
bot.hostURL = 'http://SERVERWORKSPACE-SERVERUSERNAME.c9users.io'; //Put the server url/IP adress here!
bot.key = "BOTKEYHERE"; //Set your bot key to this string!
/***************************************************/
//Write your code in this function!!!
bot.direction = function(game) {
    
    /* ~~~ Determines and Organizes Data About The Game ~~~ */
    var enemyBots = [];
    var enemyBases = [];
    var myDir = "none";

    var dirs = ["north", "east", "south", "west"];

    for (let i = 0; i < game.players.length; i++) { //Adds all other bots to the enemyBots array.
        if (game.players[i].id != game.myBot.id) {
            enemyBases.push(game.bases[i]); //Adds all other bases to the enemyBases array
            enemyBots.push(game.players[i]);
        }
    }

    /* ~~ This code decides what to do ~~ */
    var task = "none"


    /* ~~This code decides how to do it ~~ */
    if (task == "none") {
        console.log("Going random!")
        myDir = dirs[Math.floor(Math.random() * 4)];
    }


    return myDir;
} //DO NOT CHANGE ANYTHING BELOW THIS LINE
bot();
