var express = require('express');
var app = express();
var phantom = require('phantom');	

app.use(express.static(__dirname + '/app'));


//serves up main index file when localhose (or website.com) 
//is run
app.get('/', function(req, resp) {
    resp.sendfile(__dirname + '/app/index.html');
});

//core request handling logic 
//set up headless browser logic

app.get('/check_for_jquery', function(req, resp) {

    var websiteUrl = req.query.website_url;
    phantom.create(function(ph) {
        ph.createPage(function(page) {
            page.open(websiteUrl, function(status) {
                if (status === "success") {
	                page.evaluate(function() {
	                    return jQuery.fn.jquery;
	                }, function(result) {
	                    ph.exit();
	                    resp.send({
	                    	version: result
	                    });
	                });
            	}
            	else {
            		ph.exit();
            		resp.send({
            			error:"Invalid Website"
            		});
            		
            	}
            });
        });
    });
});




app.listen(80);
console.log("Listening on port 80");