Feature: Login
  Login into the system

  Scenario: Admin user can login?
    Given I am at the Login Page
    When admin user logs in
    Then I should get to the Dashboard page
