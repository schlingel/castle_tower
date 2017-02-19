var mqtt = require('mqtt');
var server_cfg = require('./server_cfg');
var client = mqtt.connect([server_cfg]);

function Receiver(cfg) {
  this.client = mqtt.connect([cfg]);
}
