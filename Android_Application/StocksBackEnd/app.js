const express = require( 'express' );
const axios = require( 'axios' );
const moment = require( 'moment' );
var cors = require( 'cors' );
var AxiosLogger = require( 'axios-logger' );

let axiosInstance = axios.create( {
    headers: {
        'X-Finnhub-Token': 'c87eusqad3i9lkntmfhg'
    }
} )

axiosInstance.interceptors.request.use( AxiosLogger.requestLogger, AxiosLogger.errorLogger );
axiosInstance.interceptors.response.use( AxiosLogger.responseLogger, AxiosLogger.errorLogger );

const app = express();


app.use( cors() )
app.use('/', express.static('ui/dist/ui'));
const router = express.Router();
app.use( '/api', router );
router.get( '/', ( req, res ) => {
    // console.log( __dirname + 'dist/ui' )
    res.status( 200 ).send( 'Hello, world!' ).end();

} );

router.get( '/profile', function ( req, res ) {
    var symbol = req.query.symbol;

    var url = "https://finnhub.io/api/v1/stock/profile2?symbol=" + symbol.toUpperCase().trim();
    axiosInstance.get( url )
        .then( response => res.status( 200 ).send( response.data ).end() )
        .catch( ( error ) => {
            if ( error.response ) {
                res.status( 200 ).send( error.response.data ).end()
            } else {
                res.status( 200 ).send( {"error": "Internal server error, please try after sometime"} ).end()
            }
        } )
} );

router.get( '/quote', function ( req, res ) {
    var symbol = req.query.symbol;
    var url = "https://finnhub.io/api/v1/quote?symbol=" + symbol.toUpperCase().trim();
    axiosInstance.get( url )
        .then( response => res.status( 200 ).send( response.data ).end() )
        .catch( ( error ) => {
            if ( error.response ) {
                res.status( 200 ).send( error.response.data ).end()
            } else {
                res.status( 200 ).send( { "error": "Internal server error, please try after sometime" } ).end()
            }
        } )
} );

router.get( '/recommendation', function ( req, res ) {
    var symbol = req.query.symbol;
    var url = "https://finnhub.io/api/v1/stock/recommendation?symbol=" + symbol.toUpperCase().trim();
    axiosInstance.get( url )
        .then( response => res.status( 200 ).send( response.data ).end() )
        .catch( ( error ) => {
            if ( error.response ) {
                res.status( 200 ).send( error.response.data ).end()
            } else {
                res.status( 200 ).send( {"error": "Internal server error, please try after sometime"} ).end()
            }
        } )
} );

//TODO 
router.get( '/candle', function ( req, res ) {
    var symbol = req.query.symbol;
    var fromDate = moment().subtract( 6, 'month' ).subtract( 1, 'day' ).unix();
    var toDate = moment().unix();
    console.log( fromDate )
    console.log( toDate )
    var url = "https://finnhub.io/api/v1/stock/candle?" + "symbol=" + symbol.toUpperCase().trim() + "&resolution=D" + "&from=" + fromDate + "&to=" + toDate;
    axiosInstance.get( url )
        .then( response => res.status( 200 ).send( response.data ).end() )
        .catch( ( error ) => {
            if ( error.response ) {
                res.status( 200 ).send( error.response.data ).end()
            } else {
                res.status( 200 ).send( {"error": "Internal server error, please try after sometime"} ).end()
            }
        } )
} );

router.get( '/candle2', function ( req, res ) {
    var symbol = req.query.symbol;
    var from = req.query.from;
    var to = req.query.to;
    var resol = req.query.resol;
    var url = "https://finnhub.io/api/v1/stock/candle?" + "symbol=" + symbol.toUpperCase().trim() + "&resolution=" + resol + "&from=" + from + "&to=" + to;
    axiosInstance.get( url )
        .then( response => res.status( 200 ).send( response.data ).end() )
        .catch( ( error ) => {
            if ( error.response ) {
                res.status( 200 ).send( error.response.data ).end()
            } else {
                res.status( 200 ).send( {"error": "Internal server error, please try after sometime"} ).end()
            }
        } )
} );


//TODO
router.get( '/news', function ( req, res ) {
    var symbol = req.query.symbol;
    var fromDate = moment().subtract( 7, 'day' ).format( 'YYYY-MM-DD' );
    var toDate = moment().format( 'YYYY-MM-DD' )
    var url = "https://finnhub.io/api/v1/company-news?" + "symbol=" + symbol.toUpperCase().trim() + "&from=" + fromDate + "&to=" + toDate;
    axiosInstance.get( url )
        .then( response => res.status( 200 ).send( response.data ).end() )
        .catch( ( error ) => {

            if ( error.response ) {
                res.status( 200 ).send( error.response.data ).end()
            } else {
                res.status( 200 ).send( {"error": "Internal server error, please try after sometime"} ).end()
            }
        } )
} );

router.get( '/suggest', function ( req, res ) {
    var symbol = req.query.symbol;
    var url = "https://finnhub.io/api/v1/search?q=" + symbol.toUpperCase().trim();
    axiosInstance.get( url )
        .then( response => res.status( 200 ).send( response.data ).end() )
        .catch( ( error ) => {
            if ( error.response ) {
                res.status( 200 ).send( error.response.data ).end()
            } else {
                res.status( 200 ).send( {"error": "Internal server error, please try after sometime"} ).end()
            }
        } )
} );

router.get( '/sentiment', function ( req, res ) {
    var symbol = req.query.symbol;
    var url = "https://finnhub.io/api/v1/stock/social-sentiment?symbol=" + symbol.toUpperCase().trim() + "&from=2022-01-01";
    axiosInstance.get( url )
        .then( response => res.status( 200 ).send( response.data ).end() )
        .catch( ( error ) => {
            if ( error.response ) {
                res.status( 200 ).send( error.response.data ).end()
            } else {
                res.status( 200 ).send( {"error": "Internal server error, please try after sometime"} ).end()
            }
        } )
} );

router.get( '/peers', function ( req, res ) {
    var symbol = req.query.symbol;
    var url = "https://finnhub.io/api/v1/stock/peers?symbol=" + symbol.toUpperCase().trim();
    axiosInstance.get( url )
        .then( response => res.status( 200 ).send( response.data ).end() )
        .catch( ( error ) => {
            if ( error.response ) {
                res.status( 200 ).send( error.response.data ).end()
            } else {
                res.status( 200 ).send( {"error": "Internal server error, please try after sometime"} ).end()
            }
        } )
} );

router.get( '/earnings', function ( req, res ) {
    var symbol = req.query.symbol;
    var url = "https://finnhub.io/api/v1/stock/earnings?symbol=" + symbol.toUpperCase().trim();
    axiosInstance.get( url )
        .then( response => res.status( 200 ).send( response.data ).end() )
        .catch( ( error ) => {
            if ( error.response ) {
                res.status( 200 ).send( error.response.data ).end()
            } else {
                res.status( 200 ).send( {"error": "Internal server error, please try after sometime"} ).end()
            }
        } )
} );


// Start the server
const PORT = parseInt( process.env.PORT ) || 8081;
app.listen( PORT, () => {
    console.log( `App listening on port ${ PORT }` );
    console.log( 'Press Ctrl+C to quit.' );
} );
// [END gae_node_request_example]

module.exports = app;
