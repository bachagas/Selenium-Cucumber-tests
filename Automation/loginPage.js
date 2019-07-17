const {Builder, By, Key, until} = require('selenium-webdriver');
Driver = require('./driver.js');
//console.log(Driver);

username = null;
password = null;

this.goTo = async function() {
  try {
    await Driver.get('http://localhost/wordpress/wp-login.php');
    //await Driver.wait(until.elementIsSelected(By.id('user_login')));
  } catch (err) {
    //await Driver.quit();
    // console.log('oops! (loginPage.goTo)');
    throw err;
  }
  return this;
};

this.loginAs = function(user) {
  username = user;
  return this;
};

this.withPassword = function(passwd) {
  password = passwd;
  return this;
};

this.login = async function() {
  // let driver = await new Builder().forBrowser('chrome').build();
  try {
    //await Driver.get('http://localhost/wordpress/wp-login.php');
    await Driver.wait(until.urlMatches(new RegExp('localhost\/wordpress\/wp-login.php')), 10*1000);
    await Driver.wait(until.elementLocated(By.id('user_login')), 10*1000);
  //   await Driver.wait(until.elementIsVisible(By.id('user_login')), 30*1000);
  //   await Driver.findElement(By.id('user_login')).click();
  //   await Driver.wait(until.elementIsSelected(By.id('user_login')), 10*1000);
    await Driver.findElement(By.id('user_login')).sendKeys(username); //, Key.RETURN);
    await Driver.findElement(By.id('user_pass')).sendKeys(password);
    await Driver.findElement(By.id('wp-submit')).click();
  } catch (err) {
    //await Driver.quit();
    // console.log('oops! login exception:', err);
    throw err;
  }
  return this;
}

module.exports = this;
