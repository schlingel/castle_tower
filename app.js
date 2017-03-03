var mqtt = require('mqtt');
var server_cfg = require('./mqtt_server_cfg');
var rest_cfg = require('./rest_server_cfg');
var client = mqtt.connect(server_cfg);
var moment = require('moment');
var CsvWriter = require('csv-write-stream');
var fs = require('fs');
var csvServer = require('./csv_server');

client.on('connect', function() {
  client.subscribe('sensorTopic');
});

client.on('message', function(topic, message) {
  if(topic !== 'sensorTopic') {
    console.log('Received message of topic', topic, ' ignoring ...');
    return;
  }

  var writer = new CsvWriter({ sendHeaders : false });
  var sMessage = message.toString();
  var messageObj = JSON.parse(sMessage);
  var entry = {
    source : messageObj.source,
    timestamp : moment().format('YYYY-MM-DD HH:mm'),
    temp_in_celsius : messageObj.temp,
    humidity_percentage : messageObj.hum
  };

  console.log('Received sensorTopic message', entry);

  writer.pipe(fs.createWriteStream(getCsvFileName(), {
    'flags': 'a',
    'encoding': null,
    'mode': 0666
  }));
  writer.write(entry);
  writer.end();
});

csvServer.start();

function getCsvFileName() {
  return rest_cfg.csv_dir + '/' + moment().format('YYYYMMDD') + '.csv';
}
