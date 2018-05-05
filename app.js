const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
// Connect mongoose
mongoose.connect('mongodb://localhost/getcoinfree');

let db = mongoose.connection;
db.on('error', ()=>{
    console.log('connection error');
});
db.once('open', () => {
    console.log('Connection to DB success!...');
});

// create application/json parser
var jsonParser = bodyParser.json()
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })


// Init App
const app = express();

// Bring To Models Coin
let Coin = require('./models/coin');

// Load View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


// Set Public Folder
app.use(express.static(path.join(__dirname, '/public')));

// Home Route
app.get('/', (req, res) => {
    // let date = new Date();
    // let d = date.getDay();
    // let m = date.getMonth();        
    // let t = (d + m*30)-30;

    // let date = new Date();
    // let mi = date.getMinutes();
    // let h = date.getHours();
    // let d = date.getDay();
    // let m = date.getMonth();        
    // let t = (mi + h*60 + d*1440 + m*43200)-43200;


    // Coin.find((err, coins) => {
    //     if (err) {
    //         console.log(err);
    //     } else {
    //         for(let i = 0; i < coins.length; i++)
    //         {
    //             let updatecoin = {}
    //             updatecoin.enddate = coins[i].enddate - (t - coins[i].timeadd);
    //             updatecoin.timeadd = t;
                
    //             if ((t-coins[i].timenew)>2){
    //                 updatecoin.new = '';
    //             }
                
    //             if (coins[i].enddate <= 0){
    //                 updatecoin.enddate = 0;
    //                 updatecoin.closed = '/imgicon/closed.png';
    //             }
    //             let query = {_id:coins[i]._id};
    //             Coin.update(query, updatecoin, (err)=>{
    //                 if(err){
    //                     console.log(err);
    //                     return;
    //                 }
    //             });
    //         }
            
    //         res.render('index', {
    //             title: 'Earn Coin Free!',
    //             coins: coins
    //         });
    //     }
    // });
    
    let date = new Date();
    let d = date.getDay();
    let m = date.getMonth();        
    let t = (d + m*30)-30;

    Coin.find((err, coins) => {
        if (err) {
            console.log(err);
        } else {
            let coinsPage = []
            for(let i = 0; i < coins.length; i++)
            {
                let updatecoin = {}
                updatecoin.enddate = coins[i].enddate - (t - coins[i].timeadd);
                updatecoin.timeadd = t;
                
                if ((t-coins[i].timenew)>2){
                    updatecoin.new = '';
                }
                
                if (coins[i].enddate <= 0){
                    updatecoin.enddate = 0;
                    updatecoin.closed = '/imgicon/closed.png';
                }

                if (coins[i].enddate > 0){
                    coinsPage.push(coins[i]);
                }

                let query = {_id:coins[i]._id};
                Coin.update(query, updatecoin, (err)=>{
                    if(err){
                        console.log(err);
                        return;
                    }
                });
            }
            
            let limit = 16;
            let page = 1;
            let skip = (limit*page)-limit;
            let nPages = Math.ceil(coinsPage.length/limit);
            coinsPage.reverse();
            coinsPage = coinsPage.slice(skip, limit+skip);
            //coinsPage.reverse();
            //console.log('limit = ' + limit +'--' + ' page='+page+'-- '+'skip='+skip+'-- coins: '+ coinsPage);

            res.render('page', {
                title: 'Earn Coin Free! Page ' + page,
                coins: coinsPage,
                page: page,
                nPages: nPages
            });
        }
    });
});

//Get Chellam
app.get('/chellam', (req, res)=>{
    res.redirect('/coin/add');
});

// Route Files
let coin = require('./routes/coins');
app.use('/coin',coin);


// Start  Server
const port = 2286;
app.listen(port, ()=>{
    console.log('Server starting on port 2286');
});