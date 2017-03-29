
'use strict'

const sosooNews = 'http://news.search.yahoo.co.jp/search?ei=UTF-8&p=%E7%B4%A0%E6%95%B0&st=n';

const fetchNews = (req, url) => new Promise( (resolve, reject) => {
    req.get(url, (res, rawData = '') => {
        res.on('data', (chunk) => rawData += chunk);
        res.on('end', () => resolve( rawData ));
    });
})

const fetchNewsTitles = newshtml => {
    try {
        return newshtml.match(/<h2 class="t">.+?(?=<\/h2>)/g)
                .map( s => s.replace(/<h2 class="t">/, '') )
                .map( s => s.replace(/<em>/g, '') )
                .map( s => s.replace(/<\/em>/g, '') )
                .map( s => /href="(.+?)">(.+?)<\/a>/g.exec(s) )
                .map( l => ({ url: l[1], title: l[2] }) );
    } catch (e) {
        console.log(e);
        return [];
    }
}

module.exports.get = () => fetchNews( require('http'), sosooNews )
                            .then( html => fetchNewsTitles(html) );
