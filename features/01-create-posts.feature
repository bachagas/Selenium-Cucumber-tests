Feature: Create posts
  Create new posts feature

  Scenario: Can create a basic post?
    Given I am logged in
    When I create a new post
    Then I can view my post
