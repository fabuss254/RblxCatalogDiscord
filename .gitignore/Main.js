// Main script

const Discord = require("discord.js");
const request = require('request').defaults({ encoding: null });
const http = require("http");
const RefreshRate = 3;
var bot = new Discord.Client();
var CurrentItem
var PlrStatue
var prefix = "n!"

bot.on("ready", function(){
  console.log("Bot is ready to use!");
  bot.user.setPresence({game:{name: "On "+ bot.guilds.array().length +" servers", url: "https://www.twitch.tv/fabuss255", type: 1}});
  
  log("Bot just restarted!");
  Refresh()
  bot.setInterval(Refresh, RefreshRate*1000);
});

bot.on("message", function(message){
  if (message.author.equals(bot.user)) return;
  var args = message.content.substring(prefix.length).split (" ");
  if (!message.content.startsWith(prefix)) return;
  switch (args[0].toLowerCase()) {
        
      case "say":
            if (message.author.id === "178131193768706048"){
                message.channel.send();
                bot.channels.findAll('name', 'roblox-catalog').map(channel => channel.send(message.content.substring(6,message.content.length)));
                message.delete(100);
            }
            break;
  };
});
  
function log(message){
  bot.channels.get("486939478062006272").send(message);
}

function Refresh(){
  http.get("http://search.roblox.com/catalog/json?SortType=3&SortType3&ResultsPerPage=1&Category=2&ie="+(new Date()).getTime(), (res) => {
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
        if (CurrentItem && CurrentItem !== parsedData[0].AssetId){
          var NewItemEmbed
          if (parsedData[0].Remaining && parsedData[0].Remaining !== 0){
            NewItemEmbed = new Discord.RichEmbed()
            .setTitle("Updated item!")
            .setDescription("AssetId: "+ parsedData[0].AssetId + "\nName: " + parsedData[0].Name + "\nDescription: " + parsedData[0].Description + "\n \nPrice: " + parsedData[0].Price + " " + bot.guilds.get("452811080465383434").emojis.find("name","Robux") + "\nRemaining: " + parsedData[0].Remaining)
            .setImage(parsedData[0].ThumbnailUrl)
            .setURL(parsedData[0].AbsoluteUrl);
          }else{
            NewItemEmbed = new Discord.RichEmbed()
            .setTitle("Updated item!")
            .setDescription("AssetId: "+ parsedData[0].AssetId + "\nName: " + parsedData[0].Name + "\nDescription: " + parsedData[0].Description + "\n \nPrice: " + parsedData[0].Price + " " + bot.guilds.get("452811080465383434").emojis.find("name","Robux"))
            .setImage(parsedData[0].ThumbnailUrl)
            .setURL(parsedData[0].AbsoluteUrl);
          }

          bot.channels.findAll('name', 'roblox-catalog').map(channel => channel.send(NewItemEmbed));
          CurrentItem = parsedData[0].AssetId;
        }else if(!CurrentItem){
          CurrentItem = parsedData[0].AssetId;
        }
      } catch (e) {
        console.error(e.message);
      }
    });
  }).on('error', (e) => {
    console.error(`Got error at GET http: ${e.message}`);
  });
};

bot.on("channelCreate", function(channel){
  if (channel.name == "roblox-catalog"){
    channel.send("This channel will be use by this bot to notify users!");
  };
});

bot.login(process.env.TOKEN);
console.log("Login successfully!");

bot.on("error", err => {
    console.log(err);
});
