'use strict';

const NEXT = require('next');

const client = NEXT({
    dev: process.env.NODE_ENV !== 'production',
    dir: './app'
});

module.exports = client;
