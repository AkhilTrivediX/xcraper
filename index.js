import express from 'express'
const app = express();
import path from 'path'
import bodyParser from 'body-parser';
import olostep from './olostep.js';
import puppetterHandler from './puppetterHandler.js';

app.use(express.static('public'));

const urlencodedParser = bodyParser.urlencoded({extended: false})

app.get('/', function(req, res){
    res.sendFile(path.join(__dirname, "check.html"));
})

app.get('/process_get', function(req,res){
    const scrapingUrl = req.query.scraping_url
    
    console.log('Scraping')
    puppetterHandler(scrapingUrl).then(scrapedData => {

        console.log(scrapedData);

        res.end(scrapedData)
    });
})

app.post('/process_post', urlencodedParser, function(req, res){
    response = {
        first_name: req.body.first_name,
        last_name: req.body.last_name
    }

    console.log(response);
    res.end(JSON.stringify(response))
})

const server = app.listen(5000, function(){
    console.log('Successfully started server at http://localhost:5000');
})