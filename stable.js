var bot = require("./bot"); //Don't change this
bot.hostURL = 'http://denaliai19-matthesby1.c9users.io'; //Put the server url/IP adress here!
bot.key = "6zh4j2tpogk"; //Set your bot key to this string!
/***************************************************/
//Write your code in this function!!!
bot.direction = function(game) {

    /* ~~~ Determines and Organizes Data About The Game ~~~ */
    var enemyBots = [];
    var enemyBases = [];
    var myDir = "none";
    var grabNear = false;

    var dirs = ["north", "east", "south", "west"];

    for (let i = 0; i < game.players.length; i++) { //Adds all other bots to the enemyBots array.
        if (game.players[i].id != game.myBot.id) {
            enemyBases.push(game.bases[i]); //Adds all other bases to the enemyBases array
            enemyBots.push(game.players[i]);
        }
    }

    // Find's flowre with most PPD
    var flowerMostPpd = game.flowers[0];
    for (let i = 0; i < game.flowers.length; i++) {
        if (findPpd(game.myBot, game.flowers[i]) > findPpd(game.myBot, flowerMostPpd)) {
            flowerMostPpd = game.flowers[i];
        }
    }

    // Find's flowr with most pollen
    var flowerMostPollen = game.flowers[0];
    for (let i = 0; i < game.flowers.length; i++) {
        if (game.flowers[i].pollen / bot.findDistance(game.myBot.pos, game.flowers[i].pos) > flowerMostPollen.pollen) {
            flowerMostPollen = game.flowers[i];
        }
    }
    // Find enemy with the most Pollen
    var enemyMostPollen = enemyBots[0];
    for (let i = 0; i < enemyBots.length; i++) {
        if (enemyBots[i].pollen > enemyMostPollen.pollen) {
            enemyMostPollen = enemyBots[i]
        }
    }

    // Finds closest Enemy
    var closestEnemy = enemyBots[0];
    for (let i = 0; i < enemyBots.length; i++) {
        if (bot.findDistance(game.myBot.pos, enemyBots[i].pos) < bot.findDistance(game.myBot.pos, closestEnemy.pos)) {
            closestEnemy = enemyBots[i]
        }
    }

    // Finds a nearby flower to grab
    var grabFlower = game.flowers[0];
    for (let i = 0; i < game.flowers.length; i++) {
        if (bot.findDistance(game.myBot.pos, game.flowers[i].pos) === 2 && game.flowers[i].pollen > 40) {
            grabFlower = game.flowers[i];
            grabNear = true;
        }
    }

    var grabBase = false;
    var nearBase = enemyBases[0];
    for (let i = 0; i < enemyBases.length; i++) {
        if (bot.findDistance(game.myBot.pos, enemyBases[i].pos) <= 4 && enemyBases[i].pollen > 50 && bot.findDistance(enemyBots[i].pos, enemyBases[i].pos) > 3) {
            nearBase = enemyBases[i];
            grabBase = true;
        }
    }

    var currentWinner = enemyBases[0];
    var winnerId = 0;
    for (let i = 0; i < enemyBases.length; i++) {
        if (currentWinner.pollen < enemyBases[i].pollen) {
            currentWinner = enemyBases[i];
            winnerId = i;
        }
    }

    // Determine avoid and others for enemyBots and Bases
    for (let i = 0; i < enemyBots.length; i++) {
        // avoid bots with less pollen than me
        if (enemyBots[i].pollen + 15 < game.myBot.pollen) {
            bot.avoidSpace(enemyBots[i].pos);
        }

        // avoid bases with bots near
        if (bot.findDistance(enemyBots[i].pos, enemyBases[i].pos) <= 2) {
            bot.avoidSpace(enemyBases[i].pos);
        }
    }

    //

    var stepsToBase = bot.findDistance(game.myBot.pos, game.myBase.pos);
    var turnsLeft = game.totalTurns - game.turn;

    /* ~~ This code decides what to do ~~ */
    var task = "most flower ppd";

    if (stepsToBase * game.players.length + 2 >= turnsLeft) {
        console.log("game ending, go home!");
        task = "go home";
    }
    else if (grabBase) {
        task = "steal base";
    }

    else if (grabNear) {
        task = "grab near";
    }
    else if ((currentWinner.pollen > game.myBase.pollen + 200 && bot.findDistance(currentWinner.pos, enemyBots[winnerId].pos) > 3 ) || (bot.findDistance(game.myBot.pos, currentWinner.pos) < 2) && currentWinner.pollen > 40 && bot.findDistance(currentWinner.pos, enemyBots[winnerId].pos) > 3) {
        task = "steal from winner";
    }
    else if (game.myBot.pollen > 200) {
        task = "go home";
    }
    // else if (game.myBot.pollen < enemyMostPollen.pollen) {
    //     task = "chase most";
    // }

    console.log("task is: ", task);

    /* ~~This code decides how to do it ~~ */
    if (task == "none") {
        console.log("Going random!");
        myDir = dirs[Math.floor(Math.random() * 4)];
    }
    else if (task == "most flower") {
        myDir = bot.nextStep(game.myBot.pos, flowerMostPollen.pos);
        console.log("Going For Flower with Most Pollen");
        if (myDir === undefined) {
            bot.clearAvoid();
            myDir = bot.nextStep(game.myBot.pos, flowerMostPollen.pos);
        }
    }
    else if (task == "go home") {
        myDir = bot.nextStep(game.myBot.pos, game.myBase.pos);
        console.log("Going Home!")
        if (myDir === undefined) {
            bot.clearAvoid();
            myDir = bot.nextStep(game.myBot.pos, game.myBase.pos);
        }
    }

    else if (task === "steal base") {
        myDir = bot.nextStep(game.myBot.pos, nearBase.pos);
        console.log("Stealing from Base!")
        if (myDir === undefined) {
            bot.clearAvoid();
            myDir = bot.nextStep(game.myBot.pos, nearBase.pos);
        }
    }

    else if (task == "chase most") {
        console.log("Chasing most Pollen!");
        myDir = bot.nextStep(game.myBot.pos, enemyMostPollen.pos);
        if (myDir === undefined) {
            bot.clearAvoid();
            myDir = bot.nextStep(game.myBot.pos, enemyMostPollen.pos);
        }
    }
    else if (task == "most flower ppd") {
        console.log("getting flower most PPD!");
        myDir = bot.nextStep(game.myBot.pos, flowerMostPpd.pos);
        if (myDir === undefined) {
            bot.clearAvoid();
            myDir = bot.nextStep(game.myBot.pos, flowerMostPpd.pos);
        }

    }
    else if (task == "grab near") {
        console.log("grabbing one real quick");
        myDir = bot.nextStep(game.myBot.pos, grabFlower.pos);

        if (myDir === undefined) {
            bot.clearAvoid();
            myDir = bot.nextStep(game.myBot.pos, grabFlower.pos);
        }
    }
    
    else if (task == "steal from winner") {
        console.log("stealing from winner");
        myDir = bot.nextStep(game.myBot.pos, currentWinner.pos);

        if (myDir === undefined) {
            bot.clearAvoid();
            myDir = bot.nextStep(game.myBot.pos, currentWinner.pos);
        }
    }



    function findPpd(thing1, flower) {
        return flower.pollen / bot.findDistance(thing1.pos, flower.pos);
    }


    return myDir;
} //DO NOT CHANGE ANYTHING BELOW THIS LINE
bot();
