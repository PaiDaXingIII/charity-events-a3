/**
 * Search Controller - Search and filter charity events
 * Assessment 3 - Client-side Website
 */

app.controller('SearchController', ['$scope', 'ApiService', function($scope, ApiService) {
  // Initialize scope variables
  $scope.categories = [];
  $scope.events = [];
  $scope.filters = {
    date: '',
    location: '',
    categoryId: ''
  };
  $scope.loading = false;
  $scope.error = null;
  $scope.searched = false;

  /**
   * Load all categories for the dropdown
   */
  $scope.loadCategories = function() {
    ApiService.getAllCategories()
      .then(function(response) {
        $scope.categories = response.data;
      })
      .catch(function(error) {
        $scope.error = 'Failed to load categories: ' + (error.data ? error.data.error : error.statusText);
      });
  };

  /**
   * Perform search with current filters
   */
  $scope.searchEvents = function() {
    $scope.loading = true;
    $scope.error = null;
    $scope.searched = true;

    ApiService.searchEvents($scope.filters)
      .then(function(response) {
        $scope.events = response.data;
        $scope.loading = false;

        // Add event status
        $scope.events.forEach(function(event) {
          var eventDate = new Date(event.event_date);
          var now = new Date();
          event.status = eventDate > now ? 'Upcoming' : (eventDate.toDateString() === now.toDateString() ? 'Today' : 'Past');
        });
      })
      .catch(function(error) {
        $scope.error = 'Search failed: ' + (error.data ? error.data.error : error.statusText);
        $scope.loading = false;
      });
  };

  /**
   * Clear all filters and results
   */
  $scope.clearFilters = function() {
    $scope.filters = {
      date: '',
      location: '',
      categoryId: ''
    };
    $scope.events = [];
    $scope.searched = false;
    $scope.error = null;
  };

  /**
   * Format date for display
   */
  $scope.formatDate = function(dateString) {
    return new Date(dateString).toLocaleString('en-AU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Load categories on controller initialization
  $scope.loadCategories();
}]);


