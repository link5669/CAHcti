const Discord = require('discord.js');
const client = new Discord.Client();
const cactiWhiteCards = ["We wo", "Bottom", "Cumray", "-ussy", "YOOOOOO", "Nude stravinsky", "Hentai land","Some bitches","Deez nuts", "Free bottom surgery", "Dumpling Palace", "Ichiban", "Yume", "Vivi's", "Yo Dumpy's?", "Booling", "The Christian Science Center", "Genshin Impact", "Black nail polish", "Pico Park", "Berklee Esports", "Get pegged", "Kamal's irresistably hot hands", "Catgirl Miles", "We wo", "Cumracist", "Elizabeth, NJ", "Ares' keyboard", "New Hampshire Curry", "Chimken", "Among Us IRL", "Depresso Espresso", "160", "Westland", "Middlesex"];
const cactiBlackCards = ["Marc Yu is an anagram for __________", "I support men's rights, men's rights to __________", "__________ussy", "__________? That's what they called me in middle school.", "Berklee College of __________", "Getting my bottom surgery at __________", "Jacquie's high on __________ tonight", "Nothing is better than Little Bake's __________", "Introducing the newest Super Smash Bros character, __________", "Izzi goes to Berklee and __________", "I'm single because __________", "I'm poor beacuse __________", "Inside of you are two wolves, one is __________", "2AM run to __________", "Nothing is more cringe than __________"];
const defaultWhiteCards = ["Cockfights", "A Gypsy curse", "Dead parents", "Friendly fire", "A moment of silence", "Ronald Reagan", "Opposable thumbs", "A dissapointing birthday party", "An honest cop with nothing left to lose", "Famine", "A tiny horse", "Flying sex snakes", "Nicolas Cage", "Not giving a shit about the third world", "Sexting", "Mutualy-assured destruction", "Pedophiles", "Virgins", "A drive-by shooting", "My vagina", "A time travel paradox", "A murder most foul", "Giving 110 percent", "Poor people", "Crippling debt", "Trail of Tears", "Daddy issues", "The Donald Trump seal of approval", "Former president George W. Bush"];
const defaultBlackCards = ["What ended my last relationship?", "__________? There's an app for that", "In Michael Jackson's last moments, he thought about __________", "In Rome, there are whisperings that the Vatican has a secret room devoted to __________", "__________. High five bro", "In the distant future, historians will agree that __________ marked the beginning of America's decline", "__________. It's a trap!", "__________ helps Obama unwind", "__________? That's how I want to die", "__________ will always get you laid", "Life was difficult for cavemen before __________", "A girl's best friend is __________"];
const prideWhiteCards = ["30 shirtless bears emerging from the fog.", "A 6-hour conversation on gender and queer theory.", "A Subaru.", "A big black dick strapped to a frail white body.", "A genderless hole.", "A messy bitch who lives for drama.", "A twink in a bounce house.", "All the different kinds of lesbians.", "Black, white, Puerto Rican, and Chinese boys.", "Britney, bitch!", "Getting your ass ate.", "Having your titties sucked while sucking on titties.", "Licking that pussy right.", "Marsha P. Johnson, the trans woman of color who may have thrown the first brick at Stonewall", "Older fitness gays.", "Peeing in a bathroom.", "Poppers and lube.", "PrEP.", "Repeatedly coming out as bisexual.", "Talking, laughing, loving, breathing, fighting, fucking, crying, drinking, riding, winning, losing, cheating, kissing, thinking, dreaming.", "Telling Heather she can't pull off that top.", "The careless cunt who left a water ring on my credenza.", "The pan-ethnic, gender-fluid children of the future.", "Those cheekbones, honey.", "Whatever straight people do for fun."];
const prideBlackCards = ["Excuse me, straight man, but __________ isn't for you, STRAIGHT MAN.", "GOD HATES __________!", "If you can't love yourself, how the hell you gonna love __________?", "We're here! We're __________! Get used to it!", "YAAAAAAS! You are serving me __________ realness!"];
var whiteCardValues = [];
var blackCardValues = [];
var players = [];
var playerChoices = [];
var playerCards = [];
var czarIndex = 0;
var whiteCards = [];
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
            if (whiteCardValues[0] == null) {
                msg.channel.send("Please select card packs");
                return;
            }
            populateCards();
            populatePlayerCards();
            msg.channel.send("Starting, sending cards!");
            sendWhiteCards(msg);
            msg.channel.send("Let's start with " + client.users.cache.find(user => user.id === players[czarIndex]).username + " as the card czar");
            pickBlackCard(msg);
        } else if (msg.content.includes("pick")) {
            assignPicks(msg);
            if (checkFull()) {
                msg.channel.send("All responses are in, let's pick a winner!");
                sendResults(msg);
                checkWinner(msg);
            }
        } else if (msg.content.includes("vote")) {
            if (msg.author.username === client.users.cache.find(user => user.id === players[czarIndex]).username) {
                if (checkFull()) {
                    msg.channel.send("All players have picked!");
                } else {
                    msg.channel.send("Not everyone has picked!");
                    return;
                }
            }
            message = msg.content.replace("!cah vote ", "");
            message = parseInt(message);
            checkVoteValidity(msg);
            if (msg.author.username === client.users.cache.find(user => user.id === players[czarIndex]).username) {
                revealChoice(msg);
            } else {
                msg.channel.send("You are not the card czar!");
            }
        } else if (msg.content.includes("setup")) {
            if (msg.content.includes("default")) {
                for (i in defaultBlackCards) {
                    blackCardValues.push(defaultBlackCards[i])
                }
                for (i in defaultWhiteCards) {
                    whiteCardValues.push(defaultWhiteCards[i])
                }
            } 
            if (msg.content.includes("cacti")) {
                for (i in cactiBlackCards) {
                    blackCardValues.push(cactiBlackCards[i])
                }
                for (i in cactiWhiteCards) {
                    whiteCardValues.push(cactiWhiteCards[i])
                }
            }
            if (msg.content.includes("pride")) {
                for (i in prideBlackCards) {
                    blackCardValues.push(prideBlackCards[i])
                }
                for (i in prideWhiteCards) {
                    whiteCardValues.push(prideWhiteCards[i])
                }
            }
        } else if (msg.content.includes("check white values")) {
            for (i in whiteCardValues) {
                msg.channel.send(i)
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
    if (players.length > czarIndex + 1) {
        czarIndex++;
    } else {
        czarIndex = 0;
    }
    msg.channel.send("Next round, " + client.users.cache.find(user => user.id === players[czarIndex]).username + " is the card czar");
    msg.channel.send("Here's the next round!");
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
    if (playerChoices.length == 0) {
        return false;
    }
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
        if (playerCards[i].points === 5) {
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

client.login('token-here');
