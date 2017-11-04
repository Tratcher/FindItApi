module.exports = {
    /** How to query:
     * 
     * e.g. 
     * https://findithack.azurewebsites.net/api/GetLocations?q=[123,23]&xObj={wdwe:dw}
     * 
     * Params syntax:
     *    p1=value1&pN=valueN...
     *    data=[value1,...,valueN]
     *    data={p1:value1,...,pN:valueN}
     * 
     */
    "get": function (req, res, next) {
        /** function getLocations(
         *     double latitude,   // current location of the user
         *     double longitude,  // current location of the user
         *     double radius      // find items within this range in meters
         * )
         * Returns: Dictionary<string, List<Location>>
         */
        var lat = req.query.latitude;
        var lon = req.query.longitude;
        var radius = req.query.radius;
        var user = req.azureMobile.user.id;
        console.log("GetLocations Invoked; Latitude: " + lat + "; Longitude: " + lon + "; Radius: " + radius + "; Auth User: " + user);
        
        var sqlQuery = {
            sql: 'SELECT * FROM item WHERE found = 1 AND latitude IS NOT NULL'
        };
        var sqlQuery2 = {
            sql: 'SELECT text FROM item WHERE userId = "' + user + '" AND found = 0'
        }
        // Execute the query.  The context for Azure Mobile Apps is available through
        // request.azureMobile - the data object contains the configured data provider.
        req.azureMobile.data.execute(sqlQuery).then(function (dbResult1) {
            // console.log("History: " + dbResult1);
            var dbHashSet = dbToHashSet(dbResult1);
            // console.log("History hash: " + dbHashSet);
            req.azureMobile.data.execute(sqlQuery2).then(function (dbResult2) {
                // console.log("Searching: " + dbResult2);
                var result = {};
                var items = dbToTextList(dbResult2);
                // console.log("Items: " + items);
                items.forEach((item) => {
                    if (dbHashSet[item] !== undefined) {
                        dbHashSet[item].forEach((location) => {
                            if (getDistanceBetween(lat, lon, location.latitude, location.longitude) <= radius) {
                                if (result[item] === undefined) {
                                    result[item] = [];
                                }
                                result[item].push({
                                    latitude: location.latitude,
                                    longitude: location.longitude
                                });
                            }
                        });
                    }
                });
                res.json(result);
            });
        });
    }
};

// Given: [{"text":"toaster strudel"},{"text":"yams"},{"text":"Russian tea cakes"},{"text":"meat pies"}]
// Returns: ["toaster strudel","yams","Russian tea cakes","meat pies"}] 
function dbToTextList(db) {
    var result = [];
    db.forEach((row) => {
        result.push(row.text.toLowerCase().trim());
    });
    return result;
}

// returns Dictionary<string, Location[]>, where Location is { double latitude, double logitude }
function dbToHashSet(db) {
    var result = {};
    db.forEach((row) => {
        var value = row.text;
        if (value === null)
        {
            value = "(empty)";
        }
       var rowLower = value.toLowerCase().trim();
       if (result[rowLower] === undefined) {
           result[rowLower] = []; 
       }
       result[rowLower].push({
           latitude: row.latitude,
           longitude: row.longitude
       });
    });
    return result;
}

//This function takes in latitude and longitude of two location 
// and returns the distance between them in m
function getDistanceBetween(lat1, lon1, lat2, lon2) 
{
  var R = 6371; // km
  var dLat = toRad(lat2-lat1);
  var dLon = toRad(lon2-lon1);
  var lat1 = toRad(lat1);
  var lat2 = toRad(lat2);

  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c;
  return 1000 * d;
}

// Converts numeric degrees to radians
function toRad(Value) 
{
    return Value * Math.PI / 180;
}
