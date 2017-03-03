var restify = require('restify');
var fs = require('fs');
var path = require('path');
var rest_cfg = require('./rest_server_cfg');
var restify = require('restify');
var parse = require('csv-parse');

exports.start = start;

function start() {
  var server = restify.createServer();

  server.get('/index', onCsvIndex);
  server.get('/data/:date', onCsvData);

  server.listen(rest_cfg.port, function() {
    console.log('Started server - ', server.name,  server.url, ' listening on ', rest_cfg.port);
  });
}

function onCsvIndex(req, res, next) {
  res.send({
    success : true,
    csv_files : getCsvFiles(rest_cfg.csv_dir)
  });

  return next();
}

function getCsvFiles(dir) {
  return fs.readdirSync(dir)
    .filter(file => !fs.statSync(path.join(dir, file)).isDirectory() && file.indexOf('.csv') !== -1);
}

function getCsvContent(date_pattern) {
  var input = fs.createReadStream(rest_cfg.csv_dir + '/' + date_pattern + '.csv')
  var parser = parse({ delimiter : ',' });
  var ready = false;
  var result = {
    pipe : function(cb) {
      result.cb = cb;

      if(ready && result.cb) {
        result.cb(result);
      }
    },
    errors : [],
    data : []
  };

  parser.on('readable', function() {
    while(record = parser.read()) {
      result.data.push(record);
    }
  });

  parser.on('error', function(err) {
    result.errors.push(err);
  });

  parser.on('finish', function() {
    ready = true;
    if(!!result.cb) {
      result.cb(result);
    }
  });

  input.pipe(parser);

  return result;
}

function onCsvData(req, res, next) {
  getCsvContent(req.params.date).pipe(function(result) {
      res.send({
        success: result.errors.length === 0,
        result : result.data,
        errors : result.errors
      });
    });

  return next();
}
