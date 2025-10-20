/**
 * API Service - Handles all HTTP requests to the backend API
 * Assessment 3 - Client-side Website
 */

app.factory('ApiService', ['$http', 'API_BASE_URL', function($http, API_BASE_URL) {
  return {
    /**
     * Get upcoming events for the home page
     */
    getUpcomingEvents: function() {
      return $http.get(API_BASE_URL + '/upcoming');
    },

    /**
     * Get all event categories
     */
    getAllCategories: function() {
      return $http.get(API_BASE_URL + '/categories');
    },

    /**
     * Search events with filters
     * @param {Object} filters - { date, location, categoryId }
     */
    searchEvents: function(filters) {
      var params = [];
      if (filters.date) params.push('date=' + filters.date);
      if (filters.location) params.push('location=' + encodeURIComponent(filters.location));
      if (filters.categoryId) params.push('categoryId=' + filters.categoryId);
      
      var queryString = params.length > 0 ? '?' + params.join('&') : '';
      return $http.get(API_BASE_URL + '/search' + queryString);
    },

    /**
     * Get event details by ID (includes registrations list)
     * @param {Number} eventId
     */
    getEventById: function(eventId) {
      return $http.get(API_BASE_URL + '/' + eventId);
    },

    /**
     * Create a new registration for an event
     * @param {Object} registration - { event_id, user_name, user_email, user_phone, tickets_purchased }
     */
    createRegistration: function(registration) {
      return $http.post(API_BASE_URL + '/registrations', registration);
    }
  };
}]);


