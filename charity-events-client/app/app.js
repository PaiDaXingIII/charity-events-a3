/**
 * Main AngularJS Application Module
 * Assessment 3 - Client-side Website
 */

// Create the main application module with ngRoute dependency
var app = angular.module('charityEventsApp', ['ngRoute']);

// Configure routes for the application
app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider
    // Home page route
    .when('/home', {
      templateUrl: 'app/views/home.html',
      controller: 'HomeController'
    })
    // Search page route
    .when('/search', {
      templateUrl: 'app/views/search.html',
      controller: 'SearchController'
    })
    // Event detail page route (with eventId parameter)
    .when('/event/:eventId', {
      templateUrl: 'app/views/detail.html',
      controller: 'DetailController'
    })
    // Registration page route (with eventId parameter)
    .when('/register/:eventId', {
      templateUrl: 'app/views/register.html',
      controller: 'RegisterController'
    })
    // Default route - redirect to home
    .otherwise({
      redirectTo: '/home'
    });

  // Use hashbang URLs for compatibility (#!)
  $locationProvider.hashPrefix('!');
}]);

// API Base URL Configuration
// Update this for deployment to SCU cPanel
app.constant('API_BASE_URL', 'https://24516934.it.scu.edu.au/api/events');


