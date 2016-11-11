var express = require('express')
var app = express()

var neo4j = require('neo4j-driver').v1;
// Create a driver instance, for the user neo4j with password neo4j.
var driver = neo4j.driver("bolt://" + process.env.DATABASE_1_PORT_7474_TCP_ADDR, neo4j.auth.basic("neo4j", "hacktrain"));
// Create a session to run Cypher statements in.
// Note: Always make sure to close sessions when you are done using them!

// CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

var http = require('http');
app.get('/srapi', function (req, res, next) {
  console.log(req.query);

  // set default values and change if provided
  var fromParam = 'MAN';
  var toParam = 'EUS';
  var dateParam = '2016-11-05T14:38';
  
  if(req.query.from) {
    fromParam = req.query.from;
  }
  if(req.query.to) {
    toParam = req.query.to;
  }
  if(req.query.date) {
    dateParam = req.query.date 
  }

  var ApiKey = process.env.SILVERRAIL_API_KEY;
  var options = {
    host: 'journeyplanner.silverrailtech.com',
    path: '/journeyplannerservice/v2/REST/DataSets/UKNationalRT/JourneyPlan?ApiKey=' + ApiKey + '&from=' + fromParam + '&to=' + toParam + '&date=' + dateParam + '&maxWalkDistanceInMetres=100&maxJourneys=10&format=json'
  };

  callback = function(response) {
    var str = '';

    //another chunk of data has been recieved, so append it to `str`
    response.on('data', function (chunk) {
      str += chunk;
    });

    //the whole response has been recieved, so we just print it out here
    response.on('end', function () {
      console.log(str);
      jsonResult = JSON.parse(str);
      res.send(jsonResult);
    });
  }

  http.request(options, callback).end();

});

app.get('/', function (req, res, next) {
  console.log(req.query);

  var from = req.query['from'];
  var to = req.query['to'];

  
  console.log('from: ' + from);
  console.log('to: ' + to);

  if(!from) {
    from = 'London Bridge';
  }
  if(!to) {
    to = 'Liverpool Street';
  }

  console.log('from: ' + from);
  console.log('to: ' + to);
  
  var session = driver.session();
  session
  .run("MATCH (start:Station {name: {fromParam} }) MATCH (end:Station {name: {toParam} }) MATCH p=(start)-[:CONNECTS_TO*1..15]->(end) RETURN p as shortestPath, REDUCE(loadingsum=0, r in relationships(p) | loadingsum+r.loading) AS totalLoading ORDER BY totalLoading ASC LIMIT 1", {fromParam: from, toParam: to})
  .then(function(result){
    result.records.forEach(function(record) {
      console.log(record._fields);
//res.send(record);

      var totalLoadingIndex = record['_fieldLookup']['totalLoading'];
      var shortestPathIndex = record['_fieldLookup']['shortestPath'];
      var fields = record['_fields'];
      var shortestPath = fields[shortestPathIndex];
      var totalLoading = fields[totalLoadingIndex]['low'];

      var start = shortestPath['start']['properties']['name'];
      var end = shortestPath['end']['properties']['name'];
      var segments = shortestPath['segments'];
      console.log(segments);
      var stops = [];
      segments.forEach(function(element) {
        console.log(element);
        var n = element['end']['properties']['name'];
        var loading = element['relationship']['properties']['loading']['low'];
        var line = element['relationship']['properties']['line'];
        stop = {};
        stop.name = n;
        stop.line = line;
        stop.loading = loading;
        stops.push(stop);
      }, this);
      

      var result = {};
      result.from = start;
      result.to = end;
      result.stops = stops;
      result.totalLoading = totalLoading;


      res.send(result);
    });
    // Compvared!
    session.close();
  })
  .catch(function(error) {
    console.log(error);
  });

})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})