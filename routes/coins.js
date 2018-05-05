const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');


// Set storage engine
const storage = multer.diskStorage({
    destination: 'public/imgcoin/',
    filename: (req, file, cb) => {
        let nfile = file.originalname.split('.')[0];
        cb(null, nfile + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Init Upload
const uploadCoin = multer({
    storage: storage
}).single('imgcoin');

// Bring in Models
let Coin = require('../models/coin');


// create application/json parser
var jsonParser = bodyParser.json();
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });

// Route get simple coin
router.get('/:idTitle/:id', urlencodedParser, (req, res)=>{
    let query = {_id:req.params.id};
    Coin.findById(query, (err, coin)=>{
        if(err){
            console.log(err);
        } else {
            let updatecoin = {};
            updatecoin.views = coin.views + 1;
            let query = {_id:req.params.id};
            Coin.update(query, updatecoin, (err)=>{
                if(err) {
                    console.log(err);
                    return;
                } else {
                    res.render('detail-coin', {
                        title: 'Get ' + coin.title,
                        coin: coin
                    });
                }
            });          
        }
    });
    
});

// Add route add coin
router.get('/add', (req, res) => {
    res.render('add-coin', {
        title: 'Add New Coin'
    });
});

// POST upload
router.post('/addlogo', (req, res)=>{


    uploadCoin(req, res, (err) => {
        if(err) {
            res.render('add-coin', {
                msg: 'upload error!'
            });
        } else {
            let namelogo = req.file.filename
            res.render('add-coin', {
                msgupload: 'Add Logo Success!',
                namelogo: namelogo
            });

        }
    });
});

// POST Add route addcoin
router.post('/add', urlencodedParser, (req, res) => {
    passcheck = req.body.password;
    if (passcheck != 'password2286') {
        console.log('Wrong password, node: "This Session for Admin Only!"');
        res.render('add-coin', {
           msg: 'Wrong password, node: "This session is for Admin only!"'
        });
    } else {

        let new_coin = new Coin();
        new_coin.title = req.body.title;
        new_coin.code = req.body.code;
        new_coin.tokens = req.body.tokens;
        new_coin.moneys = req.body.moneys;
        new_coin.rate = req.body.rate;
        new_coin.enddate = req.body.enddate;
        new_coin.tools = req.body.tools;
        new_coin.info = req.body.info;
        new_coin.tuts = req.body.tuts;
        new_coin.imgcoin = '/' + req.body.namelogo;
        new_coin.views = 0;
        new_coin.status = 'active';
        new_coin.linkbuttonfirt = req.body.linkbuttonfirt;
        new_coin.new = '/imgicon/new.png';
        new_coin.closed = '/imgicon/closed.png';

        let date = new Date();
        let d = date.getDay();
        let m = date.getMonth();        
        let t = (d + m*30)-30;

        // let date = new Date();
        // let mi = date.getMinutes();
        // let h = date.getHours();
        // let d = date.getDay();
        // let m = date.getMonth();        
        // let t = (mi + h*60 + d*1440 + m*43200)-43200;
    
            
        new_coin.timeadd = t;
        new_coin.timenew = t;

        new_coin.save((err, coin) => {
            if (err) {
                console.log(err);
                return;
            } else {
                Coin.find((err, coins) => {
                    if (err) {
                        console.log(err);
                    } else {
                        res.render('index', {
                            title: 'Earn Coin Free!',
                            coins: coins,
                            msg: 'Add new coin success!'
                        });
                    }
                });    
            }
        });        
    }
});

// Get coin closed
router.get('/closed', (req, res)=>{
    Coin.find((err, coins)=>{
        if(err) {
            console.log(err);
        } else {
            res.render('coin-closed', {
                title: 'Coin Closed List',
                coins: coins
            });
        }
    });

});

// Search
router.get('/', (req, res)=>{
    let searchQuery = req.query.search.toLowerCase();
    let coinsPage = [];
    Coin.find((err, coins)=>{
        
        if(err){
            console.log(err);
        } else {
            for(let i = 0; i < coins.length; i++){
                if((coins[i].title.toLowerCase().includes(searchQuery)) || (coins[i].code.toLowerCase().includes(searchQuery))){
                    coinsPage.push(coins[i]);
                    //console.log(coinsPage);
                }
            }
        }
        let limit = 16;
        let page = 1;
        let skip = (limit*page)-limit;
        let nPages = Math.ceil(coinsPage.length/limit);
        coinsPage.reverse();
        
        coinsPage = coinsPage.slice(skip, limit+skip);
        let msgerr = ''
    
        if(coinsPage.length < 1){
            msgerr = 'Don\'t find any coin!';
        }

        res.render('page', {
            title: 'Earn Coin Free! Page ' + page,
            coins: coinsPage,
            page: page,
            msgerr: msgerr,
            nPages: nPages
        });
    });
});


// Pagition
router.get('/pages/page/:page',urlencodedParser , (req, res) => {
    // let date = new Date();
    // let mi = date.getMinutes();
    // let h = date.getHours();
    // let d = date.getDay();
    // let m = date.getMonth();        
    // let t = (mi + h*60 + d*1440 + m*43200)-43200;

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
            let page = req.params.page || 1;
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


// Get FAQ
router.get('/faq', (req, res)=>{
    res.render('faq', {
        title: 'Frequently Asked Questions - EarnCoinFree.com'
    });
});

// Exchange Coin
router.get('/exchanges', (req, res)=>{
    res.render('exchanges', {
        title: 'Exchanges Coin - EarnCoinFree.com'
    });
});


// Get Disclaimer
router.get('/disclaimer', (req, res)=>{
    res.render('disclaimer', {
        title: 'Disclaimer - EarnCoinFree.com'
    });
});


// Get terms-and-conditions
router.get('/terms-and-conditions', (req, res)=>{
    res.render('terms-and-conditions', {
        title: 'Terms & Conditions - EarnCoinFree.com'
    });
});


// exports module
module.exports = router;

