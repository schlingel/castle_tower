var mqtt = require('mqtt');
var server_cfg = require('./server_cfg');
var client = mqtt.connect(server_cfg);
var moment = require('moment');
var CsvWriter = require('csv-write-stream');


client.on('connect', function() {
  client.subscribe('sensorTopic');
});

client.on('message', function(topic, message) {
  if(topic !== 'sensorTopic') {
    console.log('Received message of topic', topic, ' ignoring ...');
    return;
  }

  var writer = new CsvWriter();
  var sMessage = message.toString();
  var messageObj = JSON.parse(sMessage);
  var entry = {
    source : messageObj.source,
    temp_in_celsius : messageObj.temp,
    humidity_percentage : messageObj.hum
  };

  console.log('Received sensorTopic message', entry);

  writer.pipe(fs.createWriteStream(getCsvFileName()));
  writer.write(entry);
  writer.end();
});

function getCsvFileName() {
  return moment().format('YYYYMMDD') + '.csv';
}
