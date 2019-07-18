const {Builder, By, Key, until} = require('selenium-webdriver');
Driver = require('./driver.js');

// this.isAt = async function() {
//   try {
//     await Driver.get('http://localhost/wordpress/wp-login.php');
//     await Driver.wait(until.elementIsSelected(By.id('user_login')), 1000);
//   } catch (err) {
//     //await Driver.quit();
//     throw err;
//   }
//   return false;
// };

module.exports.isAt = function() {
  var result = new Promise(function(resolve, reject) {
    Driver.wait(until.titleContains('Dashboard'), 5*1000).then(function () {
      Driver.findElements(By.css('h1')).then(function (elems) {
          elems[0].getText().then(function (text) {
            resolve(text === "Dashboard");
          }).catch(function(err) {
            //console.log(err);
            reject(err);
          });
      }).catch(function (err) {
         //console.log(err);
         //Driver.quit();
         reject(err);
      });
    }).catch(function (err) {
       // console.log(err);
       //Driver.quit();
       reject(err);
    });
  });
  return result;
};
