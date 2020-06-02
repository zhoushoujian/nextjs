'use strict';

const NEXT = require('next');
console.log("process.env.NODE_ENV", process.env.NODE_ENV)
const client = NEXT({
    dev: (!process.env.NODE_ENV || process.env.NODE_ENV === "develop"),
    dir: './app'
});

module.exports = client;
