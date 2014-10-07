var express = require('express');
var app = express();
var phantom = require('phantom');



//static file server, will serve up all files located 
// in the app directory 
app.use(express.static(__dirname + '/app'));


//serves up main index file when localhose (or website.com) 
//is run (so that localhost/app/index.html doesnt 
//need to be accessed 
app.get('/', function(req, resp) {
    resp.sendfile(__dirname + '/app/index.html');
});

//core request handling logic 
//set up headless browser logic

app.get('/check_for_jquery', function(req, resp) {
    var websiteUrl = req.query.website_url;
    if (websiteUrl === undefined) {
        resp.send({
            error: "No website URL was provided in request.",
            status: 'fail'
        });
        resp.status(400);
        return;
    } else if (!((websiteUrl.indexOf('http://') === 0) || (websiteUrl.indexOf('https://') === 0))) {
        resp.send({
            error: "URL must use http or https protocol",
            status: 'fail'
        });
        resp.status(400);
        return;
    }
    phantom.create(function(ph) {
        ph.createPage(function(page) {
            page.open(websiteUrl, function(status) {
                if (status === "success") {
                    //once the website is loaded successfully
                    //execute the code within the context of
                    //the website's javascript we've visted
                    page.evaluate(function() {
                        if (typeof jQuery !== undefined) {
                            //will return jQuery version number	
                            return jQuery.fn.jquery;
                        } else {
                            return undefined;
                        }

                    }, function(result) {
                        resp.send({
                            'version': result,
                            'status': status
                        });
                        ph.exit();
                    });
                } else {
                    resp.send({
                        'error': 'Error Accessing Site',
                        'status': status
                    });
                    ph.exit();
                }
            });
        });
    });
});




app.listen(81);
console.log("Listening on port 80");