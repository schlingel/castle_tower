var caminte = require('caminte');
var Schema = caminte.Schema;
var config = {
  driver : 'sqlite3',
  database : './db/entries.db'
};
var schema = new Schema(config.driver, config);
schema.autoupdate();


var EnvironmentEntry = schema.define('EnvironmentEntry', {
  id : { type : schema.Number },
  source : { type : schema.String, limit: 255 },
  humidity_percentage : { type : schema.Float },
  timestamp : { type: schema.Date, default: Date.now },
  temp_in_celsius : { type : schema.Float },
}, {
  primaryKeys : ["id"]
});

exports.EnvironmentEntry = EnvironmentEntry;
