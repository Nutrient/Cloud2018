const Discord = require('discord.io');
const request = require('request-promise')
const auth = require('./auth.json');

const bot = new Discord.Client({
   token: auth.token,
   autorun: true
});

bot.on('ready', (evt) => {
    console.log('Connected');
    console.log('Logged in as: ');
    console.log(bot.username + ' - (' + bot.id + ')');
});

bot.on('message',  async (user, userID, channelID, message, evt) => {
  if(!evt.d.author.bot){
      const body = {
        'user': user,
        'userID': userID,
        'channelID': channelID,
        'message': message
      };

      let command = message.split(' ')[0];

      switch (command) {
        case '=?topfive':
          try {
            let result = await request({
              method: 'POST',
              uri: 'http://localhost:5000/topFive',
              body: {channelID: channelID, Sentiment: message},
              json: true
            });
            if (Object.keys(result).length === 0) {
              bot.sendMessage({
                     to: channelID,
                     message: 'Server Error :('
              });
            }else {
              bot.sendMessage({
                     to: channelID,
                     message: JSON.stringify(result)
              });
            }
          } catch (e) {
              bot.sendMessage({
                     to: channelID,
                     message: 'Invalid input try POSITIVE | NEGATIVE | NEUTRAL | MIXED'
              });
          }
          break;
        default:
          try {
            let result = await request({
              method: 'POST',
              uri: 'http://localhost:5000/',
              body: body,
              json: true
            });
            console.log(result);
          } catch (e) {
            //console.log(e);
          }
      }



    //  console.log(user, channelID, message, evt);
  }
});
