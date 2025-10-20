/**
 * API Service - Handles all HTTP requests to the backend API
 * Assessment 3 - Admin-side Website
 */

adminApp.factory('ApiService', ['$http', 'API_BASE_URL', function($http, API_BASE_URL) {
  return {
    /**
     * Get all events (including all statuses)
     */
    getAllEvents: function() {
      return $http.get(API_BASE_URL);
    },

    /**
     * Get all event categories
     */
    getAllCategories: function() {
      return $http.get(API_BASE_URL + '/categories');
    },

    /**
     * Get event details by ID (includes registrations)
     * @param {Number} eventId
     */
    getEventById: function(eventId) {
      return $http.get(API_BASE_URL + '/' + eventId);
    },

    /**
     * Create a new event
     * @param {Object} eventData
     */
    createEvent: function(eventData) {
      return $http.post(API_BASE_URL, eventData);
    },

    /**
     * Update an existing event
     * @param {Number} eventId
     * @param {Object} eventData
     */
    updateEvent: function(eventId, eventData) {
      return $http.put(API_BASE_URL + '/' + eventId, eventData);
    },

    /**
     * Delete an event by ID
     * @param {Number} eventId
     */
    deleteEvent: function(eventId) {
      return $http.delete(API_BASE_URL + '/' + eventId);
    }
  };
}]);


