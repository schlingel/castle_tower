var mqtt = require('mqtt');
var server_cfg = require('./server_cfg');
var client = mqtt.connect(server_cfg);
var models = require('./src/models');
var EnvironmentEntry = models.EnvironmentEntry;

client.on('connect', function() {
  client.subscribe('sensorTopic');
});

client.on('message', function(topic, message) {
  var sMessage = message.toString();
  var messageObj = JSON.parse(sMessage);

  console.log('received message for topic ', topic);
  console.log(messageObj);

  var entry = new EnvironmentEntry({
    source : messageObj.source,
    temp_in_celsius : messageObj.temp,
    humidity_percentage : messageObj.hum
  });

  EnvironmentEntry.create(entry, err => { console.log('could not persist entry', err) },s => { console.log('... persisted'); } );
});
