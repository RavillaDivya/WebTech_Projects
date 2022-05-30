'use strict';

const express = require( 'express' );
const axios = require( 'axios' );
const moment = require( 'moment' );
var cors = require( 'cors' );
var AxiosLogger = require( 'axios-logger' );
const api_key = 'c87eusqad3i9lkntmfhg';

let axiosInstance = axios.create( {
    headers: {
        'X-Finnhub-Token': api_key
    }
} )

const app = express();

app.use( cors() )
app.use('/', express.static('ui/dist/ui'));

const router = express.Router();
app.use( '/api', router );
router.get( '/', ( req, res ) => {
    res.status( 200 ).send( 'Hey, there!' ).end(); 
} );

router.get( '/profile', function ( req, res ) {
    var ticker = req.query.symbol;
    var url = "https://finnhub.io/api/v1/stock/profile2?symbol=" + ticker.toUpperCase().trim();
    axiosInstance.get(url)
        .then( response => res.status( 200 ).send( response.data ).end() )
} );

router.get( '/quote', function ( req, res ) {
    var ticker = req.query.symbol;
    var url = "https://finnhub.io/api/v1/quote?symbol=" + ticker.toUpperCase().trim();
    axiosInstance.get(url)
        .then( response => res.status( 200 ).send( response.data ).end() )
} );

router.get( '/recommendation', function ( req, res ) {
    var ticker = req.query.symbol;
    var url = "https://finnhub.io/api/v1/stock/recommendation?symbol=" + ticker.toUpperCase().trim();
    axiosInstance.get(url)
        .then( response => res.status( 200 ).send( response.data ).end() )
} );


router.get( '/candle', function ( req, res ) {
    var ticker = req.query.ticker;
    var date1 = moment().unix();
    var date2 = moment().subtract(6,'month').subtract(1,'day').unix();
    var url = "https://finnhub.io/api/v1/stock/candle?" + "symbol=" + ticker.toUpperCase().trim() + "&resolution=D" + "&from=" + date2 + "&to=" + date1;
    axiosInstance.get(url)
        .then( response => res.status( 200 ).send( response.data ).end() )
} );

router.get( '/candle2', function ( req, res ) {
    var ticker = req.query.symbol;
    var from_t = req.query.from;
    var to_t = req.query.to;
    var resolu = req.query.resol;
    var url = "https://finnhub.io/api/v1/stock/candle?" + "symbol=" + ticker.toUpperCase().trim() + "&resolution=" + resolu + "&from=" + from_t + "&to=" + to_t;
    axiosInstance.get(url)
        .then( response => res.status( 200 ).send( response.data ).end() )
} );

router.get( '/news', function ( req, res ) {
    var ticker = req.query.symbol;
    var date1 = moment();
    date1 = date1;
    date1 = date1.format('YYYY-MM-DD');
    var date2 = moment().subtract( 7, 'day' );
    date2 = date2.format('YYYY-MM-DD');
    var url = "https://finnhub.io/api/v1/company-news?" + "symbol=" + ticker.toUpperCase().trim() + "&from=" + date2 + "&to=" + date1;
    axiosInstance.get(url)
        .then( response => res.status( 200 ).send(response.data ).end() )
} );

router.get( '/suggest', function ( req, res ) {
    var ticker = req.query.symbol;
    var url = "https://finnhub.io/api/v1/search?q=" + ticker.toUpperCase().trim();
    axiosInstance.get(url)
        .then( response => res.status( 200 ).send( response.data ).end() )
} );

router.get( '/earnings', function ( req, res ) {
    var ticker = req.query.symbol;
    var url = "https://finnhub.io/api/v1/stock/earnings?symbol=" + ticker.toUpperCase().trim();
    axiosInstance.get(url)
        .then( response => res.status( 200 ).send( response.data ).end() )
} );

router.get( '/sentiment', function ( req, res ) {
    var ticker = req.query.symbol;
    var url = "https://finnhub.io/api/v1/stock/social-sentiment?symbol=" + ticker.toUpperCase().trim() + "&from=2022-01-01";
    axiosInstance.get(url)
        .then( response => res.status( 200 ).send( response.data ).end() )
} );

router.get( '/peers', function ( req, res ) {
    var ticker = req.query.symbol;
    var url = "https://finnhub.io/api/v1/stock/peers?symbol=" + ticker.toUpperCase().trim();
    axiosInstance.get(url)
        .then( response => res.status( 200 ).send( response.data ).end() )
} );

const PORT = parseInt( process.env.PORT ) || 8081;
app.listen( PORT, () => {
    console.log( `App listening on port ${ PORT }` );
    console.log( 'Press Ctrl+C to quit.' );
} );

module.exports = app;
