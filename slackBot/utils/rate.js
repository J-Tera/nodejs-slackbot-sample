
'use strict'

const fetchCurrencyList = wikidata => {
    try {
        return {
			data: wikidata.match(/<td>[A-Z]{3}(?=<\/td>)/g)
				.sort()
				.filter( (e, i, self) => self.indexOf(e) === i )
				.map( s => s.replace(/<td>/, '') ),
			log: ''
		}
    } catch (e) {
		return {
			data: [],
			log: e.message
		}
	}
}

const genExchangePair = currencyList => 
	currencyList.map( s => 'JPY' + s );

const wiki = 'https://ja.wikipedia.org/wiki/%E7%8F%BE%E8%A1%8C%E9%80%9A%E8%B2%A8%E3%81%AE%E4%B8%80%E8%A6%A7';

const yqlApi = 'https://query.yahooapis.com/v1/public/yql';
const query = [
	'select%20*%20from%20yahoo.finance.xchange%20where%20pair%20in%20(%22#EX_CURRENCY#%22)',
	'format=json',
	'env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys'
];

const genQuery = currency => 
	query.join('&').replace(/#EX_CURRENCY#/, currency);

const genURL = query =>	yqlApi + '?q=' + query;

const genPromise = (req, url) => {
	return new Promise( (resolve, reject) => {
		req.get(url, (res, rawData = '') => {
			res.on('data', (chunk) => rawData += chunk);
			res.on('end', () => resolve(rawData) );
		});
	});
}
			   
// genPromise( require('https'), wiki )
//     .then( fetchCurrencyList )
// 	.then( currencyList => genExchangePair(currencyList.data) )
//     .then( pairList => pairList.join(',') )
//     .then( str => genQuery(str) )
//     .then( query => genURL(query) )
//     .then( url => genPromise(require('https'), url) )
// 	.then( s => console.log(s) );

module.exports.currencyList = () => 
	genPromise( require('https'), wiki )
	.then( fetchCurrencyList )
    .then( s => s.data );

//module.exports.rateList = () =>

module.exports.rate = id =>     
	genPromise( require('https'), genURL(genQuery(id)) )
    .then( s => JSON.parse(s).query.results.rate.Rate )

