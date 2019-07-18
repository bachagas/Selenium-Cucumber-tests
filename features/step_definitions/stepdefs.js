const assert = require('assert');
const { Given, When, Then } = require('cucumber');
const Sample = require("../../Automation/sample.js");
const LoginPage = require("../../Automation/loginPage.js");
const DashboardPage = require("../../Automation/dashboardPage.js");
const NewPostPage = require("../../Automation/newPostPage.js");
const PostPage = require("../../Automation/postPage.js");

//Sample scenarios from Cucumber tutorial - https://cucumber.io/docs/guides/10-minute-tutorial/
Given('today is Sunday', function () {
  this.today = 'Sunday';
});

Given('today is Friday', function () {
  this.today = 'Friday';
});

Given('today is {string}', function (givenDay) {
  this.today = givenDay;
});

When('I ask whether it\'s Friday yet', function () {
  this.actualAnswer = Sample.isItFriday(this.today);
});

Then('I should be told {string}', function (expectedAnswer) {
  assert.equal(this.actualAnswer, expectedAnswer);
});


//Actual Selenium tests

//Login tests
Given('I am at the Login Page', function () {
  LoginPage.goTo();
});

When('admin user logs in', {timeout: 10*1000}, async function () {
  try {
    await LoginPage.loginAs("admin")
      .withPassword("admin")
      .loginAsync();
  } catch (err) {
    throw err;
  }
});

Then('I should get to the Dashboard page', {timeout: 10*1000}, function () {
  return DashboardPage.isAt().then(function (val) {
    assert.ok(val, "Failed to login - Not in the Dashboard page");
  });
});

//Create post tests
Given('I am logged in', function () {
  // LoginPage.goTo();
  // LoginPage.loginAs("admin")
  //   .withPassword("admin")
  //   .login();
  return DashboardPage.isAt().then(function (val) {
    assert.ok(val, "Failed to login - Not in the Dashboard page");
  });
});

When('I create a new post', {timeout: 10*1000}, function () {
  return NewPostPage.goTo().then(async function (NewPostPage) {
    try {
      await NewPostPage.createPost("This is the test post title")
        .withBody("Hi, this is the test post body.")
        .publishAsync();
    } catch (err) {
      throw err;
    }
  });
});

Then('I can view my post', {timeout: 10*1000}, function () {
  return NewPostPage.goToNewPost().then(function (result) {
    return PostPage.getPostContent().then(function (post) {
      assert.equal(post.title, "This is the test post title", "Title did not match new post");
    });
  });
});
