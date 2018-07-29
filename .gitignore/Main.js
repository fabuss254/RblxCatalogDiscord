// Some settings (TODO)

const OnlyLimited = false; //Is the bot only notify when there is a new limited?
const MinimumPrice = -1; //Is the bot only notify item with x minimum of robux (-1 to disable)
const MaximumPrice = -1; //Is the bot only notify item with x maximum of robux (-1 to disable)
const ShirtAndPants = false; //Is the bot listen to pants and shirt in addition of others limiteds?
const LiveCounter = true; //Is the bot edit the message with the number of remaining item (only limitedU)
const LiveCounterTimeout = 30; //When do the bot stop editing the message after x seconds (Need LiveCounter to true)
const RefreshRate = 10; //How much time to wait before getting items

// Main script

const Discord = require("discord.js");
const http = require("http");
var bot = new Discord.Client();
var CurrentItem

bot.on("ready", function(){
  console.log("Bot is ready to use!");
  bot.user.setPresence({game:{name: "On "+ bot.guilds.array().length +" servers", url: "https://www.twitch.tv/fabuss255", type: 1}});
  
  Refresh()
  bot.setInterval(Refresh, RefreshRate*1000);
});

function Refresh(){
  http.get('http://search.roblox.com/catalog/json?SortType=3&SortType3&ResultsPerPage=1&CreatorID=1', (res) => {
    const { statusCode } = res;
    const contentType = res.headers['content-type'];

    let error;
    if (statusCode !== 200) {
      error = new Error('Request Failed.\n' +
                        `Status Code: ${statusCode}`);
    } else if (!/^application\/json/.test(contentType)) {
      error = new Error('Invalid content-type.\n' +
                        `Expected application/json but received ${contentType}`);
    }
    if (error) {
      console.error(error.message);
      res.resume();
      return;
    }

    res.setEncoding('utf8');
    let rawData = '';
    res.on('data', (chunk) => { rawData += chunk; });
    res.on('end', () => {
      try {
        const parsedData = JSON.parse(rawData);
        var NewItemEmbed = new Discord.RichEmbed()
          .setTitle("NEW ITEM!")
          .setDescription("AssetId: "+ parsedData[0].AssetId + "\nName: " + parsedData[0].Name + "\nDescription: " + parsedData[0].Description)
          .setImage(parsedData[0].ThumbnailUrl);
        bot.channels.findAll('name', 'roblox-catalog').map(channel => channel.send(NewItemEmbed));
      } catch (e) {
        console.error(e.message);
      }
    });
  }).on('error', (e) => {
    console.error(`Got error at GET http: ${e.message}`);
  });
};

bot.login(process.env.TOKEN);
console.log("Login successfully!");

bot.on("error", err => {
    console.log(err);
});
