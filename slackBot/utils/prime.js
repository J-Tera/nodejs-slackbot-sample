'use strict';

const myrange = (min, max, l = []) => {
    if (min > max) return l;
    l.push(min);
    return myrange((min + 1), max, l);
}

const sieve = (lx, ly = []) => {
    const head = lx.shift();
    if (lx[lx.length - 1] < head * head) return (ly.concat(head, lx));
    ly.push(head);
    return sieve(lx.filter( x => (x % head) != 0 ), ly);
}

const isPrime = (p, n, i = 0) => {
    if ( p[i] * p[i] > n ) return true;
    if ( n % p[i] === 0 ) return false;
    return isPrime( p, n, i + 1 );
}

const nextPrime = (primes, n) => {
    if ( isPrime(primes, n) ) return n;
    return nextPrime( primes, n + 2);
}

const genPrimes = function* (n) {
    let p = [];
    yield p[0] = 2;
    yield p[1] = 3;
    while( p.length < n ) {
        yield p[p.length] = nextPrime(p, p[p.length-1] + 2 );
    }
}

const genLazyPrimes = () => {
    let p = [2, 3]; 
    return (i) => {
        if (p[i]) return p[i];
        return p[i] = nextPrime(p, p[i-1] + 2 );
    }
}

const takePrimes = n =>
    require('lazy.js').generate( genLazyPrimes() ).take(n).toArray();

module.exports.prime = takePrimes;

module.exports.prime_p = (i, n) => takePrimes(i+n).splice(i, n);

const lessThan = x => y => y <= x;

const takePrimesLessThan = n =>
	require('lazy.js').generate( genLazyPrimes() )
    .takeWhile( lessThan( Math.floor( Math.sqrt(n) ) ) ).toArray();

const lazyPrimesIterator = 
	require('lazy.js').generate( genLazyPrimes() ).getIterator();

const factorization = (n, lpi, ret = []) => {
	if ( n == 1 ) return ret;
	if ( Math.sqrt(n) < lpi.current() ) return ret.concat(n);
	if ( n % lpi.current() == 0 ) 
		return factorization( Math.floor(n / lpi.current() ), 
							  lpi, 
							  ret.concat(lpi.current()) );
	return factorization(n, lpi.moveNext() && lpi, ret);
};

module.exports.factor = n => factorization(n, lazyPrimesIterator);

//console.log(factorization(10000, lazyPrimesIterator));


