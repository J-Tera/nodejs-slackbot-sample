var utils = require('./utils');
var Botkit = require('botkit');
var controller = Botkit.slackbot();
var bot = controller.spawn({
  token: process.env.slack_token || "xoxb-93771157380-QISXBuTapafKyzo57rRsiUUH"
});

var db = require('./dbutils');

var watson = require('watson-developer-cloud');
var language_translator;
if (process.env.VCAP_SERVICES) {
  var vcapServices = JSON.parse(process.env.VCAP_SERVICES);
  if (vcapServices.language_translator && vcapServices.language_translator[0].credentials) {
    language_translator = watson.language_translator({
      username: vcapServices.language_translator[0].credentials.username,
      password: vcapServices.language_translator[0].credentials.password,
      url: vcapServices.language_translator[0].credentials.url,
      version : 'v2'
    });

  }
}
bot.startRTM(function(err,bot,payload) {
  if (err) {
    throw new Error('Could not connect to Slack');
  }
});


controller.hears(["^Hello","^hi$"],["direct_message","direct_mention","mention","ambient"],function(bot,message) {
  bot.reply(message,'Hello!');
});

//controller.hears(["^[sS]ave*"],["direct_message","direct_mention","mention","ambient"],function(bot,message) {
//  var matches  = message.text.match(/^[sS]ave (.*)/i);
//  var sentence = matches[1];
//  var doc = {"text":sentence};
//  doc._id = db.createId();
//  db.save(doc)
//  .then(bot.reply(message, "done"));
//});
controller.hears(["^[dD]elete*"],["direct_message","direct_mention","mention","ambient"],function(bot,message) {
  var matches  = message.text.match(/^[dD]elete (.*)/i);
  if(matches !== null && matches.length >= 2) {
	  var id = matches[1];
	  db.get(id)
	  .then(function(doc){
	    doc._deleted = true;
	    db.save(doc);
	  })
	  .then(bot.reply(message, "done"));
  }
});
controller.hears(["^[lL]ist all","^[lL]istall"],["direct_message","direct_mention","mention","ambient"],function(bot,message) {
  db.allDocs()
  .then(function(docs) {
    var res = {
        attachments:[]
    };
    docs.forEach(function(doc){
//      console.log(doc);
//      res += "ID["+doc._id+"]:Title["+doc.title+"]"+"\r\n";
      var ret = {};
      ret.text = utils.prettyjson(doc);
      ret.color ="good"
      res.attachments.push(ret);
//      console.log(ret);
//      res += utils.PrettyPrintJsonConsole(doc);
    });
    bot.reply(message, res);
  });
});

controller.hears(["^[sS]how"],["direct_message","direct_mention","mention","ambient"],function(bot,message) {
  var matches  = message.text.match(/^[sS]how (.*)/i);
  if(matches !== null && matches.length >= 2) {
    var id = matches[1];
    db.get(id)
    .then(function(doc) {
      if(doc === null) {
        bot.reply(message, "Not found");
      } else {
        var res = {
            attachments:[]
        };
        var ret = {};
        ret.text = utils.prettyjson(doc);
        ret.color ="good"
        res.attachments.push(ret);
        bot.reply(message, res);
      }
    });
} else {
  bot.reply(message, "Please use like 'show $key'");
}
});


controller.hears(["^素数"],["direct_message","direct_mention","mention","ambient"],function(bot,message) {
	console.log("Entered to 素数");
	  var matches  = message.text.match(/^素数(.*)個/i);
	  if(matches !== null && matches.length >= 2) {
	    var n = matches[1];
	    var res = require('./utils/prime.js').prime(n);
	    console.log("N=",n);
	    console.log("Res=",res)
	    bot.reply(message, res.toString());
	  } else {
		  bot.reply(message, "「素数xx個」のように入力してください。");
	  }
});




controller.hears(["^translate*","^Translate*"],["direct_message","direct_mention","mention","ambient"],function(bot,message) {
  var matches  = message.text.match(/^[tT]ranslate (.*)/i);
  var sentence = matches[1];

  language_translator.translate({
    text: sentence,
    source: 'en',
    target: 'ja'
  }, function(err, translation) {
    if (err) {
      console.log(err);
    } else {
      console.log(translation);
      console.log(translation.translations[0].translation);
    }
    var translated = "In Japanese "+translation.translations[0].translation;
    bot.reply(message, translated);
  });
});