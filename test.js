var bot = require("./bot"); //Don't change this
bot.hostURL = 'http://shastaai19-matthesby1.c9users.io'; //Put the server url/IP adress here!
bot.key = "dmdvk08x0gs"; //Set your bot key to this string!
/***************************************************/
//Write your code in this function!!!
bot.direction = function(game) {

    /* ~~~ Determines and Organizes Data About The Game ~~~ */
    var enemyBots = [];
    var enemyBases = [];
    var flowerMostPollen = game.flowers[0];
    var myDir = "none";

    var dirs = ["north", "east", "south", "west"];

    for (let i = 0; i < game.players.length; i++) { //Adds all other bots to the enemyBots array.
        if (game.players[i].id != game.myBot.id) {
            enemyBases.push(game.bases[i]); //Adds all other bases to the enemyBases array
            enemyBots.push(game.players[i]);
        }
    }
    for (let i = 0; i < game.flowers.length; i++) {
        if (game.flowers[i].pollen > flowerMostPollen.pollen) {
            flowerMostPollen = game.flowers[i];
        }
    }

    // Determine avoid and others for enemyBots and Bases
    for (let i = 0; i < enemyBots.length; i++) {
        // avoid bots with less pollen than me
        if (enemyBots[i].pollen + 15 < game.myBot.pollen) {
            bot.avoidSpace(enemyBots[i]);
        }
        
        // avoid bases with bots near
        if(bot.findDistance(enemyBots[i].pos, enemyBases[i].pos) <= 2 ){
            bot.avoidSpace(enemyBases[i].pos);
        }
    }

    var stepsToBase = bot.findDistance(game.myBot.pos, game.myBase);
    var turnsLeft = game.totalTurns - game.turn;

    /* ~~ This code decides what to do ~~ */
    var task = "most flower"
    if (game.myBot.pollen > 200) {
        task = "go home";
    }
    else if (stepsToBase * game.players.length - 5 <= turnsLeft) {
        task = "go home";
    }

    /* ~~This code decides how to do it ~~ */
    if (task == "none") {
        console.log("Going random!")
        myDir = dirs[Math.floor(Math.random() * 4)];
    }
    else if (task == "most flower") {
        myDir = bot.nextStep(game.myBot.pos, flowerMostPollen.pos);
        console.log("Going For Flower with Most Pollen");
    }
    else if (task == "go home") {
        myDir = bot.nextStep(game.myBot.pos, game.myBase);
        console.log("Going Home!")
    }


    return myDir;
} //DO NOT CHANGE ANYTHING BELOW THIS LINE
bot();
