const Discord = require('discord.js');
const SendmailTransport = require('nodemailer/lib/sendmail-transport');
const client = new Discord.Client();
var players = [];
var playerChoices = [];
var playerCards = [];
var czarIndex = 0;
var whiteCardValues = ["Cumray", "-ussy", "YOOOOOO", "Nude stravinsky", "Hentai land","Some bitches","Deez nuts", "Free bottom surgery", "Dumpling Palace", "Ichiban", "Yume", "Vivi's", "Yo Dumpy's?", "Booling", "The Christian Science Center", "Genshin Impact", "Pico Park", "Berklee Esports", "Kamal's irresistably hot hands", "Catgirl Miles", "We wo", "Cumracist", "Elizabeth, NJ", "Ares' keyboard", "New Hampshire Curry", "Chimken", "Among Us IRL", "Depresso Espresso", "160", "Westland"]
var whiteCards = [];
var blackCardValues = ["__________ussy", "__________? That's what they called me in middle school.", "Berklee College of __________", "Getting my bottom surgery at __________", "Nothing is better than Little Bake's __________", "Izzi goes to Berklee and __________", "I'm single because __________", "I'm poor beacuse __________", "Inside of you are two wolves, one is __________", "2AM run to __________", "Nothing is more cringe than __________"];
var blackCards = [];
var currBlackCard;
const numCards = 5;


class Card {
    constructor(type, value) {
        this.type = type;
        this.value = value;
        this.used = false;
    }
}

class PlayerCards {
    constructor() {
        this.cards = [];
        this.points = 0;
    }
}

client.on('message', msg => {
    if (msg.content.includes("!cah")) {
        if (msg.content.includes("add")) {
            addPlayer(msg);
        } else if (msg.content.includes("list players")) {
            for (i in players) {
                msg.channel.send(client.users.cache.find(user => user.id === players[i]).username);
            }
        } else if (msg.content.includes("start")) {
            populateCards();
            populatePlayerCards();
            msg.channel.send("Starting, sending cards!");
            sendWhiteCards(msg);
            msg.channel.send("Let's start with " + client.users.cache.find(user => user.id === players[czarIndex]).username + " as the card czar");
            pickBlackCard(msg);
        } else if (msg.content.includes("pick")) {
            assignPicks(msg);
            full = checkFull();
            if (full) {
                msg.channel.send("All responses are in, let's pick a winner!");
                sendResults(msg);
                checkWinner(msg);
            }
        } else if (msg.content.includes("vote")) {
            message = msg.content.replace("!cah vote ", "");
            message = parseInt(message);
            checkVoteValidity(msg);
            if (msg.author.username === client.users.cache.find(user => user.id === players[czarIndex]).username) {
                revealChoice(msg);
            } else {
                msg.channel.send("You are not the card czar!");
            }
        }
    }
});

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

function addPlayer(msg) {
    const message = msg.content.split(" ");
    message[2] = message[2].replace('<','');
    message[2] = message[2].replace('>','');
    message[2] = message[2].replace('!','');
    message[2] = message[2].replace('@','');
    message[2] = message[2].replace('&','');
    players.push(message[2]);
}

function nextRound(msg) {
    msg.channel.send("Next round!");
    pickBlackCard(msg);
    sendWhiteCards(msg);
}

function pickBlackCard(msg) {
    found = false;
    while (found === false) {
        currBlackCard = blackCards[Math.floor(Math.random() * blackCards.length)]; 
        if (currBlackCard.used === false) {
            found = true;
            currBlackCard.used = true;
            break;
        }
    }
    msg.channel.send("The black card is: " + currBlackCard.value);
}

function assignPicks(msg) {
    count = 0;
    for (i in players) {
        if (msg.author.username === client.users.cache.find(user => user.id === players[i]).username) {
            message = msg.content.replace("!cah pick ", "");
            if (parseInt(message) > 5) {
                msg.channel.send("Invalid card number");
                return;
            }
            message--;
            playerChoices[count] = message;
        }
        count++;
    }
    msg.channel.send(playerChoices.length);
}

function sendWhiteCards(msg) {
    randomizeWhiteCards(msg);
    i = 0;
    while (i < playerCards.length) {
        j = 0;
        while (j < numCards) {
            client.users.cache.find(user => user.id === players[i]).send(playerCards[i].cards[j].value);
            j++;
        }
        client.users.cache.find(user => user.id === players[i]).send("-----------------------------");
        i++;
    }
}

function randomizeWhiteCards(msg) {
    for (i in players) {
        j = 0;
        while (j < numCards) {
            found = false;
            while (found === false) {
                currCard = whiteCards[Math.floor(Math.random() * whiteCards.length)]; 
                if (currCard.used === false) {
                    found = true;
                    playerCards[i].cards[j] =  currCard;
                    currCard.used = true;
                }
            }
            j++;
        }
    }
}

function checkFull() {
    full = true;
    j = 0;
    while (j < playerChoices.length) {
        if (j === null) {
            full = false;
            break;
        }
        j++;
    }
    return full;
}

function populateCards() {
    for (i in whiteCardValues) {
        whiteCards.push(new Card("white", whiteCardValues[i]));
    }
    for (i in blackCardValues) {
        blackCards.push(new Card("black", blackCardValues[i]));
    }
}

function sendResults(msg) {
    for (i in players) {
        msg.channel.send(currBlackCard.value.replace("__________", playerCards[i].cards[parseInt(playerChoices[i])].value));
    }
}

function populatePlayerCards() {
    a = 0;
    while (a < players.length) {
        playerCards[a] = new PlayerCards();
        a++;
    }
}

function checkWinner(msg) {
    for (i in playerCards) {
        msg.channel.send(playerCards[i].points);
        if (playerCards[i].points === 5) {
            msg.channel.send("found winner");
            msg.channel.send(client.users.cache.find(user => user.id === players[i]).username + " wins!");
        }
    }
}

function revealChoice(msg) {
    message--;
    msg.channel.send("Czar chose the card " + playerCards[message].cards[parseInt(playerChoices[message])].value);
    playerCards[message].points++;
    nextRound(msg);
}

function checkVoteValidity(msg) {
    if (message > players.length) {
        msg.channel.send("Invalid vote!");
    }
}

client.login('login-key');
