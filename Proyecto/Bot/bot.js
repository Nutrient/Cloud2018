const Discord = require('discord.io');
const request = require('request-promise');
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

      let command = message.split(' ');

      switch (command[0]) {
        case '=?topfive':
          try {
            let result = await request({
              method: 'POST',
              uri: 'http://localhost:5000/topFive',
              body: {channelID: channelID, Sentiment: command[1]},
              json: true
            });
            if (result.length === 0) {
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

        case '=?userTimeline':
          try {
            let result = await request({
              method: 'POST',
              uri: 'http://localhost:5000/userTimeline',
              body: {channelID: channelID, userID: userID},
              json: true
            });
            if (result.length === 0) {
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
                     message: 'Server Error :('
              });
          }
          break;

        case '=?userStats':
          try {
            let result = await request({
              method: 'POST',
              uri: 'http://localhost:5000/userStats',
              body: {userID: userID},
              json: true
            });
            if (result.length === 0) {
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
                     message: 'Server Error :('
              });
          }
          break;

        case '=?userStatsChannel':
          try {
            let result = await request({
              method: 'POST',
              uri: 'http://localhost:5000/userStatsChannel',
              body: {channelID: channelID, userID: userID},
              json: true
            });
            if (result.length === 0) {
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
                     message: 'Server Error :('
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
