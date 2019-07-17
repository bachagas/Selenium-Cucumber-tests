const {Builder, By, Key, until} = require('selenium-webdriver');
Driver = require('./driver.js');

module.exports = {
  getPostContent: function () {
    var result = new Promise(function(resolve, reject) {
      var title = null;
      var body = null;
      Driver.wait(until.urlMatches(new RegExp('localhost\/wordpress\/[0-9]{4}\/[0-9]{2}\/[0-9]{2}\/.+\/')), 10*1000).then(function (result) {
        Driver.findElement(By.className('entry-title')).then(function (titleElem) {
            titleElem.getText().then(function (text) {
              title = text;
              Driver.findElement(By.className('entry-content')).then(function (bodyElem) {
                  bodyElem.getText().then(function (text) {
                    body = text;
                    resolve({
                      title: title,
                      body: body,
                    });
                  }).catch(function (err) {
                    console.log('Nao conseguiu obter o texto do body', err);
                    reject(err);
                  });
              }).catch(function (err) {
                console.log('Nao conseguiu encontrar o body', err);
                reject(err);
              });
            }).catch(function (err) {
              console.log('Nao conseguiu obter o texto do title', err);
              reject(err);
            });
        }).catch(function (err) {
          console.log('Nao conseguiu encontrar o title', err);
          reject(err);
        });
      }).catch(function (err) {
        console.log('Nao chegou na pagina do Post', err);
        reject(err);
      });
    });
    return result;
  }
};
