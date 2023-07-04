const express = require('express');
const subdirRouter = express.Router();
const path = require('path');

subdirRouter
    .get('^/$|/index(.html)?', (req, res) => {
        res.sendFile(path.join(__dirname, '..', 'views', 'subdir', 'indexs.html'));
    });

subdirRouter
    .get('/test(.html)?', (req, res) => {
        res.sendFile(path.join(__dirname, '..', 'views', 'subdir', 'test.html'));
    });

module.exports = subdirRouter;