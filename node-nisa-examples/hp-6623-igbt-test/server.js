var async = require('async');
var Visa = require("node-nisa").Visa;
var csv = require('to-csv');
var fs = require('fs');

var hp6623 = new Visa("GPIB0::12::INSTR");

hp6623.on('srq', function(stb) {
    if (!stb)
        return;
    console.log("SRQ:  " + stb.toString(2) + " !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"); 
});

var data = [];
var vgeRow = [];
vgeRow.push(NaN);
for (var ge = 6; ge > 0; ge = ge - 0.2) {
  console.log(ge);
  vgeRow.push(ge);
}
console.log(vgeRow);
data.push( vgeRow );

for (var ce = 7; ce > -.25; ce = ce - 0.1) {
  var dataRow = new Array(vgeRow.length);
  dataRow[0] = ce;
  data.push(dataRow);
}

async.series([
  function (callback) { hp6623.open(callback); },
  function (callback) { hp6623.deviceClear(callback); },
  function (callback) { hp6623.query("ID?", callback) },
  function (callback) { hp6623.write("SRQ 3", callback) },
  function (callback) { hp6623.write("ISET 2,0.5", callback) },
  function (callback) { hp6623.write("ISET 3,0.7", callback) },
  function (c1) {
    var queue = async.priorityQueue(function (task, callback) {
      hp6623.write(task.query, function(err, res) {
        if (err) {
          return callback(err);
        }
        setTimeout(function() {
          hp6623.query("IOUT? 3", function(err, res) {
            var response = Number(res.toString('ascii'));
            console.log(response);
            data[task.kce][task.kge] = response;
            return callback();
          });
        }, 333);         
      });
    }, 1);
    queue.pause();
    queue.drain = function() {
        console.log('all items have been processed');
        c1();
    }
              
    async.forEachOf(data, function (Vce, kce, nextVce) {
      if (kce === 0) { // skip header row
        return nextVce();
      }
      async.forEachOfSeries(data[0], function (Vge, kge, nextVge) {
          if (kge !== 0) { // skip firstColumn
            var q = "VSET 2," + Vge + "\nVSET 3," + Vce[0];
            queue.push({name: "writeQuery", query: q, kge: kge, kce: kce });  
          }
          return nextVge();
      }, nextVce);
    }, function (err, res) { console.log("queued up... resume"); queue.resume(); } );
  },
  function (callback) { console.log("shutting down 1.."); hp6623.write("VSET 2,0", callback); },
  function (callback) { hp6623.write("VSET 3,0", callback); },
  function (callback) { hp6623.close(callback); }
], function (err, res) {
  if (err) {
    console.log('ERROR');
    console.log(err);
  } else {
    console.log('DONE');
    console.log(res);
  }
  console.log(data);
  fs.writeFile('result.csv', csv(data), function (err) {
    if (err) 
      return console.log(err);
    else 
      return console.log('Done writing CSV to disk!');
  });
});