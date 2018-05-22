exports.parameterMissingResponse = function (res, err, data) {
    var response = {
        "message": err,
        "status":201,
        "data" : data || {}
    };
    res.send(JSON.stringify(response));
};

exports.sendCustomResponse = function(res,data) {
    var response = {
        "message":  data || {},
    };
  
    res.send(JSON.stringify(response));
    //res.send(response)
};