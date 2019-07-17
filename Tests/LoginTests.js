Automation = require("../Automation/sample.js");
const assert = require('assert');

(async function adminUserCanLogin() {
  LoginPage.GoTo();
  LoginPage.LoginAs("admin")
    .WithPassword("admin")
    .Login();

  assert.ok(DashboardPage.isAt(), "Failed to login");
})();
