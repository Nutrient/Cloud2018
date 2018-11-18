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

    //  console.log(user, channelID, message, evt);
  }
});
