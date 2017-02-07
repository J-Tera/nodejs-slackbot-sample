var cloudant = {};

if (process.env.hasOwnProperty("VCAP_SERVICES")) {
  // Running on Bluemix. Parse  port and host
  var env = JSON.parse(process.env.VCAP_SERVICES);
  var host = process.env.VCAP_APP_HOST;
  var port = process.env.VCAP_APP_PORT;
  // console.log('VCAP_SERVICES: %s', process.env.VCAP_SERVICES);
  // Also parse Cloudant settings.
  cloudant = env['cloudantNoSQLDB'][0].credentials; 
}

cloudant = {
    url : "https://c88ff3e4-2ea3-4a48-9763-b9919539b731-bluemix:202c0e67ef024a7ca1c3912cb9b34d0c2066be3901de75f589b7850aa671761a@c88ff3e4-2ea3-4a48-9763-b9919539b731-bluemix.cloudant.com"
  };
var couchdb = require('./then-couchdb/modules/index');
var db = couchdb.createClient(cloudant.url+"/sample");

module.exports = db;
module.exports.hash = function(inWord) {
  var hash = 0, i, chr, len;
  if (inWord.length === 0) return hash;
  for (i = 0, len = inWord.length; i < len; i++) {
    chr   = inWord.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}
module.exports.createId = function() {
  return Date.now().toString();
}

/*
module.exports = {
  listAll : function() {
    return db.allDocs();
//    return new Promise(function(resolve, reject) {
//      db.list({include_docs:true}, function(err, body) {
//        var resObject = [];
//        if (!err) {
//          body.rows.forEach(function(doc) {
//            resObject.push(doc.doc);
//          });
//        } else {
//          console.log(err);
//          reject("error")
//        }
//        resolve(resObject);
//      });
//    });
  },
  getOne : function(key) {
    return new Promise(function(resolve, reject) {
      db.get(key, function(err, doc) {
        console.log("GetOne");
        console.log(doc);
        if (err) {//なければ新しい文書を作成
          var doc = {};
          doc._id = utils.createId();
        }
        resolve(doc);
      });
    });
  },
  insert : function(doc) {
    return new Promise(function(resolve, reject) {
      if(!doc._id || doc._id === null) {
        doc._id = utils.createId();
      }
      db.insert(doc, function(err) {
        if (!err) {
        } else {//DBへのInsert失敗した時だけメッセージを出す
          console.log(err);
          console.log("DB insert Fail");
          reject("DB insert Fail");
        }
        resolve();
      });
    });
  }
}
*/