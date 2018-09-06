// Main script

const url = "http://search.roblox.com/catalog/json?SortType=3&SortType3&ResultsPerPage=5&Category=2"
const Discord = require("discord.js");
const http = require("http");
const RefreshRate = 1;
const Channel = "roblox-catalog"
var bot = new Discord.Client();
var CurrentItem = [101]
var prefix = "n!"

bot.on("ready", function(){
  console.log("Bot is ready to use!");
  bot.user.setPresence({game:{name: "Notifie "+ bot.guilds.array().length +" serveurs", url: "https://www.twitch.tv/fabuss255", type: 1}});
  
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
                bot.channels.findAll('name', Channel).map(channel => channel.send(message.content.substring(6,message.content.length)));
                message.delete(100);
            }
            break;
      case "invite":
        message.channel.send("**Invite du bot**\nhttps://discordapp.com/oauth2/authorize?client_id=473172467716849674&scope=bot&permissions=101440");
        break;
  };
});
  
function log(message){
  bot.channels.get("486939478062006272").send(message);
}

function Refresh(){
  http.get( url + "&ie="+(new Date()).getTime(), (res) => {

    res.setEncoding('utf8');
    let rawData = '';
    res.on('data', (chunk) => { rawData += chunk; });
    res.on('end', () => {
      try {
        const Data = JSON.parse(rawData);
        if (CurrentItem[0] !== 101){
          Data.forEach(function(v,i){
            if (CurrentItem[i] !== v.AssetId && (i !== 5 && CurrentItem[i+1] !== v.AssetId)){
              AddItem(v)
              CurrentItem[i] = v.AssetId;
            }
        });
        }else{
          console.log("Making current item data")
          Data.forEach(function(v,i){
            CurrentItem[i] = v.AssetId;
          });
      }
        
      } catch (e) {
        console.error(e.message);
      }
    });
  }).on('error', (e) => {
    console.error(`Got error at GET http: ${e.message}`);
  });
};

function AddItem(Table){
  log("Notified new item " + Table.AssetId)
  var NewItemEmbed
  if (Number(Table.CreatedDate.substring(6, Table.CreatedDate.length - 2)) < (new Date).getTime() + 10*60*1000){
    log("notification not send because updated item")
  }else if(Table.IsLimited){
    if ( Table.IsLimitedUnique){
      NewItemEmbed = new Discord.RichEmbed()
        .setTitle("New limited U!")
        .setDescription("AssetId: "+ Table.AssetId + "\nName: " + Table.Name + "\nDescription: " + Table.Description + "\n \nPrice: " + Table.Price + " " + bot.guilds.get("476389923574775821").emojis.find("name","Robux") + "\nRemaining: " + Table.Remaining)
        .setImage(Table.ThumbnailUrl)
        .setURL(Table.AbsoluteUrl);
    }else{
    NewItemEmbed = new Discord.RichEmbed()
        .setTitle("New limited!")
        .setDescription("AssetId: "+ Table.AssetId + "\nName: " + Table.Name + "\nDescription: " + Table.Description + "\n \nPrice: " + Table.Price + " " + bot.guilds.get("476389923574775821").emojis.find("name","Robux"))
        .setImage(Table.ThumbnailUrl)
        .setURL(Table.AbsoluteUrl);
    }
  }

  bot.channels.findAll('name', Channel).map(channel => channel.send(NewItemEmbed));
}

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
