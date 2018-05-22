var commonFunc        =require('./commonFunction.js')
var responses         = require('./responces.js');
var async = require('async');

exports.registerSlot =  function(req, res) {

        let reg_no     = req.body.registration;
        let colour     = req.body.colour;
        let slot       = req.body.slot;
        let level      =req.body.level;

        let manData             = [reg_no,colour,slot,level];

        if(commonFunc.checkBlank(manData)) {
            return responses.sendCustomResponse(res, "some parameter missing ,try again",
                100, {});
        }
        if(level>3 || slot >10)
        {
            return responses.sendCustomResponse(res, "try again with valid data",
                100, {});
        }

        async.waterfall([
            function(cb){
                var sql  = "SELECT id FROM parking_slot WHERE slot_id = ? and level=?";
                connection.query(sql, [slot, level], function (error, result) {
                    console.log("SELECT Slot ID",result[0].id);
                    if (error) {
                        return cb(error);
                    }
                    if (result.length) {
                        return cb(null,result[0].id);
                    }
                    return cb(null);
                });
            },function(parking_id,cb)
            {
                var sql  = "SELECT id FROM slot_detail WHERE book_id=?";
                connection.query(sql, [parking_id], function (error, result) {
                    console.log("CHECK PRE BOOKED OR NOT, SELECT ID",result[0]);
                    if (error) {
                        return cb(error);
                    }
                    if (result.length) {
                        return cb("This Slot is Already Booked");
                    }
                    return cb(null,parking_id);
                });
            },function(book_id,cb)
            {
                var sql  = "INSERT INTO  slot_detail (book_id, registration_no, color)" +
                " VALUES (?, ?, ?)";
                connection.query(sql, [book_id, reg_no,colour], function (error, result) {
                    if (error) {
                        return cb(error);
                    }
                    return cb(null);
                });
            }

            
        ],function (error, result) {
            if (error) {
                res.send(JSON.stringify({"status":false}))
            }
            else{
                res.send(JSON.stringify({
                    "status": true
                }));
            }
        })
   
};

exports.deRegisterSlot =  function(req, res) {

    let reg_no     = req.body.registration;

    var manData=[reg_no];
    if(commonFunc.checkBlank(manData)) {
        return responses.sendCustomResponse(res, "some parameter missing ,try again",
            100, {});
    }

    async.waterfall([
        function(cb)
        {
            var sql="SELECT id FROM  slot_detail WHERE registration_no=?"
            var param=[reg_no];
            connection.query(sql, param, function (error, result) {
                console.log("CHECK SLOT WITH REGISTRATION NUM");
                if (error) {
                    return cb(error);
                }
                if (result.length) {
                    return cb(null);
                }
                return cb("THIS REGISTRATION NOT EXIST");
            });
        },
        function(cb)
        {
            var sql="DELETE FROM slot_detail WHERE registration_no=?";
            var param=[reg_no];
            connection.query(sql, param, function (error, result) {
                console.log(" DO FREE SLOT WITH REGISTRATION NUM");
                if (error) {
                    return cb(error);
                }
                if (result.length) {
                    return cb(null);
                }
                return cb(null);
            });
        
        }
    ],function (error, result) {
        if (error) {
            res.send(JSON.stringify({"status":false}))
        }
        else{
            res.send(JSON.stringify({
                "status": true
            }));
        }
    })
}


exports.getFreeSlot=function(req,res)
{
    async.waterfall([
        function(cb){
            var sql ="SELECT * FROM parking_slot WHERE id NOT IN (SELECT book_id  FROM slot_detail)";
            connection.query(sql, function (error, result) {
                console.log("GET BOOKED SLOT",result);
                if (error) {
                    return cb(error);
                }
                if (result.length) {
                   var freeSlot= result.map((key,index)=>{
                       delete key["id"]
                        key["available"]=true;
                        return key
                   })
                    
                    return cb(null,freeSlot);
                }
                return cb(null);
            });

        }  
    ],function (error, result) {
        if (error) {
            res.send(JSON.stringify({"status":false}))
        }
        else{
            res.send(JSON.stringify(result));
        }
    })
}

exports.getDetail=function(req,res){
    var color=req.body.colour||"";
    var reg_no =req.body.registration||"";
    async.waterfall([
       function(cb)
       {
           //var sql1='SELECT sd.book_id,sd.registration_no ,ps.slot_id as slot ,ps.level  FROM slot_detail sd LEFT JOIN parking_slot ps ON ps.id=sd.book_id '
  
           var param=[]
           var sql1;
           if(color && !reg_no)
           {
           sql1="SELECT sd.book_id,sd.registration_no ,ps.slot_id as slot ,"+
                    "ps.level  FROM slot_detail sd LEFT JOIN parking_slot ps ON ps.id=sd.book_id  WHERE  sd.color=?";
                param.push(color)
                console.log("FIRST IF")
           }
           else if(!color && reg_no)
           {
           sql1="SELECT sd.book_id,sd.registration_no ,ps.slot_id as slot ,"+
            "ps.level  FROM slot_detail sd LEFT JOIN parking_slot ps ON ps.id=sd.book_id WHERE  sd.registration_no=?";
            param.push(reg_no);
            console.log("SECOND IF")
           }
           else{
           sql1="SELECT sd.book_id,sd.registration_no ,ps.slot_id as slot, ps.level  "+
           "FROM slot_detail sd LEFT JOIN parking_slot ps ON ps.id=sd.book_id WHERE  sd.registration_no=? AND sd.color=?";
            param.push(reg_no,color);
            console.log("THIRD IF",param)
           }

           console.log("SQL RUN",param)
           connection.query(sql1,param, function (error, result) {
               
               console.log(this.sql1)
            if (error) {
                console.log(error)
                return cb(error);
            }
            if (result.length) {
               return cb(null,result)
           }
         return cb("No data found");
     });

 }  
],function (error, result) {
 if (error) {
    
         res.send(JSON.stringify({"status":error}))
     
 }
 else{
    res.send(JSON.stringify(result));
 }
})
}
