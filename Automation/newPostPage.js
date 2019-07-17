const {Builder, By, Key, until} = require('selenium-webdriver');
Driver = require('./driver.js');
//console.log(Driver);

title = null;
body = null;

this.goToAsync = async function() {
  try {
    await Driver.wait(until.titleContains('Dashboard'), 10*1000);
  } catch (err) {
    //await Driver.quit();
    throw err;
  }
  var thisPage = this;
  var result = new Promise(function(resolve, reject) {
    Driver.findElements(By.className('wp-menu-name')).then(function (elems) {
        //console.log('findElements', elems);
        // console.log('findElements');
        elems.forEach(async function (elem) {
          try {
            let menu = await elem.getText();
            //console.log(txt, elem.getText());
            if (menu === "Posts") {
              // console.log('found item!');
              let actions = await Driver.actions();
              await actions.move({origin: elem, x: 10, y: 0}).perform();
              await Driver.findElement(By.linkText('Add New')).click();
              resolve(thisPage);
            }
          } catch {
            reject(err);
          }
        });
      }).catch(function (err) {
         console.log('Erro ao ir para pagina de adicionar posts', err);
         //Driver.quit();
         reject(err);
      });
  });
  return result;
};

this.goTo = function() {
  var thisPage = this;
  var result = new Promise(function(resolve, reject) {
    Driver.wait(until.titleContains('Dashboard'), 10*1000).then(function (res) {
      Driver.findElements(By.className('wp-menu-name')).then(function (elems) {
          //console.log('findElements', elems);
          // console.log('findElements');
          elems.forEach(async function (elem) {
            try {
              let menu = await elem.getText();
              //console.log(txt, elem.getText());
              if (menu === "Posts") {
                // console.log('found item!');
                let actions = await Driver.actions();
                await actions.move({origin: elem, x: 10, y: 0}).perform();
                await Driver.findElement(By.linkText('Add New')).click();
                resolve(thisPage);
              }
            } catch (err) {
              reject("Erro ao clicar no menu de adicionar post: " + err.toString());
            }
          });
        }).catch(function (err) {
           // console.log('Erro ao procurar menu de posts', err);
           //Driver.quit();
           reject(err);
        });
    }).catch(function (err) {
      // console.log('Nao e possivel adicionar novo post se nao chegar na pagina Dashboard', err);
      reject(err);
    });
  });
  return result;
};

this.createPost = function(postTitle) {
  title = postTitle;
  return this;
};

this.withBody = function(postBody) {
  body = postBody;
  return this;
};

this.publishAsync = async function() {
  try {
    await Driver.wait(until.titleContains('Add New Post'), 10*1000);
    await Driver.findElement(By.id('post-title-0')).sendKeys(title, Key.RETURN);
    let actions = await Driver.actions();
    await actions.sendKeys(body).perform();

    function findButton(buttonTitle) {
      return function(driver) {
        //console.log('findPublishButton');
        var result = new Promise(function(resolve, reject) {
          driver.findElements(By.css('button')).then(async function (elems) {
            var res = null;
            for (elem of elems) {
              let text = await elem.getText();
              // console.log(buttonTitle, text, buttonTitle === text);
              if (text === buttonTitle) {
                res = elem;
                break;
              }
            }
            // elems.forEach(async function (elem) {
            //   let text = await elem.getText();
            //   console.log(buttonTitle, text, buttonTitle === text);
            //   if (text === buttonTitle) res = elem;
            // });
            // console.log('res', res);
            if (!!res) resolve(res);
            else reject("Button not found: " + buttonTitle);
          }).catch(function (err) {
            // console.log(err);
            reject(err);
          });
        });
        return result;
      };
     };

     await Driver.findElement(findButton('Publish…')).click();
     //we need to click the button twice to confirm 🙄
     await Driver.findElement(findButton('Publish')).click();
  } catch (err) {
    //await driver.quit();
    console.log('oops! async publish exception:', err)
    return err;
  }
  return this;
};

this.publish = function() {
  function findButton(buttonTitle) {
    return function(driver) {
      //console.log('findPublishButton');
      var result = new Promise(function(resolve, reject) {
        driver.findElements(By.css('button')).then(async function (elems) {
          var res = null;
          for (elem of elems) {
            try {
              let text = await elem.getText();
            } catch (err) {
              throw err;
            }
            // console.log(buttonTitle, text, buttonTitle === text);
            if (text === buttonTitle) {
              res = elem;
              break;
            }
          }
          // elems.forEach(async function (elem) {
          //   let text = await elem.getText();
          //   console.log(buttonTitle, text, buttonTitle === text);
          //   if (text === buttonTitle) res = elem;
          // });
          // console.log('res', res);
          if (!!res) resolve(res);
          else reject("Button not found: " + buttonTitle);
        }).catch(function (err) {
          // console.log(err);
          reject(err);
        });
      });
      return result;
    };
  };

  var result = new Promise(function (resolve, reject) {
    Driver.wait(until.titleContains('Add New Post'), 10*1000).then(function (res) {
      Driver.findElement(By.id('post-title-0')).then(function (titleElem) {
        titleElem.sendKeys(title, Key.RETURN).then(async function (res) {
          try {
            let actions = await Driver.actions();
            await actions.sendKeys(body).perform();
            await Driver.findElement(findButton('Publish…')).click();
            //we need to click the button twice to confirm 🙄
            await Driver.findElement(findButton('Publish')).click();
            resolve(true);
          } catch (err) {
            // console.log('Erro ao escrever body do post', err);
            reject(err);
          }
        }).catch(function (err) {
          // console.log('Erro ao escrever titulo do post', err);
          reject(err);
        });
      }).catch(function (err) {
        // console.log('Erro ao localizar titulo do post');
        reject(err);
      });
    }).catch(function (err) {
      // console.log('Nao chegou na pagina Add New Post');
      reject(err);
    });
  });
  return result;
};

this.goToNewPostAsync = async function() {
  try {
    //console.log('goToNewPost');
    await Driver.wait(until.elementLocated(By.linkText('View Post')), 10*1000);
    //console.log('Achou!');
    // await Driver.findElement(By.linkText('View Post')).click();
    // console.log('Clicou!');
    let viewLinks = await Driver.findElements(By.linkText('View Post'));
    //console.log('Achou de novo!', viewLinks[1]);
    await viewLinks[1].click(); //o primeiro link fica escondido, e por isso tem que clicar no segundo 🙄
    //console.log('Clicou!');
  } catch (err) {
    //await Driver.quit();
    // console.log('ops! (goToNewPost)')
    throw err;
  }
};

this.goToNewPost = function() {
  var result = new Promise(function(resolve, reject) {
    Driver.wait(until.elementLocated(By.linkText('View Post')), 10*1000).then(function (result) {
      Driver.findElements(By.linkText('View Post')).then(function(elems) {
        if (!!elems[1]) elems[1].click().then(function (res) {
          resolve(res);
        }).catch(function (err) {
          // console.log('Nao conseguiu clicar no link View Post', err);
          reject(err);
        }); //o primeiro link fica escondido, e por isso tem que clicar no segundo 🙄
      }).catch(function(err) {
        // console.log('Nao encontrou os elementos View Post', err);
        reject(err);
      });
    }).catch(function (err) {
      // console.log('Nao localizou nenhum link View Post', err);
      reject(err);
    });
  });
  return result;
};

module.exports = this;
