// Some settings (TODO)

const OnlyLimited = false; //Is the bot only notify when there is a new limited?
const MinimumPrice = -1; //Is the bot only notify item with x minimum of robux (-1 to disable)
const MaximumPrice = -1; //Is the bot only notify item with x maximum of robux (-1 to disable)
const ShirtAndPants = false; //Is the bot listen to pants and shirt in addition of others limiteds?
const LiveCounter = true; //Is the bot edit the message with the number of remaining item (only limitedU)
const LiveCounterTimeout = 30; //When do the bot stop editing the message after x seconds (Need LiveCounter to true)
const RefreshRate = 5; //How much time to wait before getting items

// Main script

const Discord = require("discord.js");
const http = require("http");
var bot = new Discord.Client();
var CurrentItem

bot.on("ready", function(){
  console.log("Bot is ready to use!");
  bot.user.setPresence({game:{name: "Notifying "+ bot.guilds.array.length +" servers", url: "https://www.twitch.tv/fabuss255", type: 1}});
  
  Refresh()
  bot.setInterval(Refresh, RefreshRate*1000);
});

function Refresh(){
  
};

bot.login(process.env.TOKEN);
console.log("Login successfully!");

bot.on("error", err => {
    console.log(err);
});
