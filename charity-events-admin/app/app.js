/**
 * Main AngularJS Application Module - Admin Portal
 * Assessment 3 - Admin-side Website
 */

// Create the main admin application module with ngRoute dependency
var adminApp = angular.module('adminApp', ['ngRoute']);

// Configure routes for the admin application
adminApp.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider
    // Event list page route
    .when('/events', {
      templateUrl: 'app/views/event-list.html',
      controller: 'EventListController'
    })
    // Create event page route
    .when('/create', {
      templateUrl: 'app/views/event-create.html',
      controller: 'EventCreateController'
    })
    // Edit event page route (with eventId parameter)
    .when('/edit/:eventId', {
      templateUrl: 'app/views/event-edit.html',
      controller: 'EventEditController'
    })
    // Default route - redirect to events list
    .otherwise({
      redirectTo: '/events'
    });

  // Use hashbang URLs for compatibility (#!)
  $locationProvider.hashPrefix('!');
}]);

// API Base URL Configuration
// Update this for deployment to SCU cPanel
adminApp.constant('API_BASE_URL', 'https://24516934.it.scu.edu.au/api/events');


