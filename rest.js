var mysql   = require("mysql");

function REST_ROUTER(router,connection,md5) {
    var self = this;
    self.handleRoutes(router,connection,md5);
}

REST_ROUTER.prototype.handleRoutes = function(router,connection,md5) {
    var self = this;
    router.get("/h",function(req,res){
        res.json({"Message" : "Hello World !"});
    });

//GET Requests
    router.get("/clients",function(req,res){
        var query = "SELECT fullname, email, phone1, phone2, birth, socialID, add_street, add_number, add_district, add_zip, add_city, add_state FROM ??";
        var table = ["clients"];
        query = mysql.format(query,table);
	    connection.query(query,function(err,aaData){
			if(err) {
				res.json({"Error" : true, "Message" : "Error executing MySQL query"});
			} else {
				res.json({aaData});
			}
		});
    });

    router.get("/profiles",function(req,res){
        var query = "SELECT distinct groupname, MAX(CASE WHEN attribute='WISPr-Bandwidth-Max-Down' THEN value END) down, MAX(CASE WHEN attribute='WISPr-Bandwidth-Max-up' THEN value END) up FROM radgroupreply group by groupname";
		query = mysql.format(query);
	    connection.query(query,function(err,aaData){
			if(err) {
				res.json({"Error" : true, "Message" : "Error executing MySQL query"});
			} else {
				res.json({aaData});
			}
		});
    });

	router.get("/profiles-drop",function(req,res){
        var query = "SELECT distinct groupname FROM ??";
        var table = ["radgroupreply"];
		query = mysql.format(query,table);
	    connection.query(query,function(err,aaData){
			if(err) {
				res.json({"Error" : true, "Message" : "Error executing MySQL query"});
			} else {
				res.json(aaData);
			}
		});
    });
	
//POST Requests
    router.post("/clients",function(req,res){
        var query1 = "INSERT INTO ??(??,??,??,??,??,??,??,??,??,??,??,??,??) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)";
        var query2 = "INSERT INTO ??(??,??,??,??) VALUES (?,?,?,?)";
        var query3 = "INSERT INTO ??(??,??,??) VALUES (?,?,?)";
        var table1 = ["clients","fullname", "birth", "email", "socialID", "phone1", "phone2", "add_street", "add_number", "add_district", "add_zip", "add_city", "add_state", "username",req.body.fullname,req.body.birth,req.body.email,req.body.socialID,req.body.phone1,req.body.phone2,req.body.add_street,req.body.add_number,req.body.add_district,req.body.add_zip,req.body.add_city,req.body.add_state,req.body.login];
		var table2 = ["radcheck", "username","attribute","op","value", req.body.login,'Cleartext-Password',":=",req.body.password];
		var table3 = ["radusergroup","username","groupname","priority", req.body.login,req.body.profile,1];
		sql1 = mysql.format(query1,table1);
        sql2 = mysql.format(query2,table2);
		sql3 = mysql.format(query3,table3);
        connection.query(sql1, function(err,rows){
            if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } 
			connection.query(sql2, function(err,rows){
				if(err) {
					res.json({"Error" : true, "Message" : "Error executing MySQL query"});
				} 			
				connection.query(sql3, function(err,rows){
					if(err) {
						res.json({"Error" : true, "Message" : "Error executing MySQL query"});
					} else {
						res.json({"Error" : false, "Message" : "Client Added !"});
					}
				});
			});
		});
    });

    router.post("/profiles",function(req,res){
        var sql      = "INSERT INTO ??(??,??,??,??) VALUES (?,?,?,?)";
		var attribute  = "WISPr-Bandwidth-Max-Down";
		var attribute2 = "WISPr-Bandwidth-Max-Up";
		var groupname  = req.body.groupname
		var op         = "=";
		var table      = ["radgroupreply","groupname","attribute","op","value",groupname,attribute,op,req.body.down];
		var table2     = ["radgroupreply","groupname","attribute","op","value",groupname,attribute2,op,req.body.up];

        var sql1 = mysql.format(sql,table);
		var sql2 = mysql.format(sql,table2);
        connection.query(sql1, function(err,rows){
            if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } 
			connection.query(sql2, function(err,rows){
				if(err) {
					res.json({"Error" : true, "Message" : "Error executing MySQL query"});
				} else {
					res.json({"Error" : false, "Message" : "Profile Added !"});
				}
			});
		});
    });

//Updated Requests
    router.put("/clients",function(req,res){
        var query = "UPDATE ?? SET ?? = ? WHERE ?? = ?";
        var table = ["client_login","password",md5(req.body.password),"login",req.body.login];
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                res.json({"Error" : false, "Message" : "Updated the password for login "+req.body.login});
            }
        });
    });

    router.delete("/clients/:login",function(req,res){
        var query = "DELETE from ?? WHERE ??=?";
        var table = ["client_login","login",req.params.login];
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                res.json({"Error" : false, "Message" : "Deleted the user with login "+req.params.login});
            }
        });
    });
}

module.exports = REST_ROUTER;
