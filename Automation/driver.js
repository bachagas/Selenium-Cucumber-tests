//Browser driver singleton module
const {Builder, By, Key, until} = require('selenium-webdriver');

let driver = new Builder().forBrowser('chrome').build();

module.exports = driver;
