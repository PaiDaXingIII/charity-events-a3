/**
 * Home Controller - Displays upcoming charity events
 * Assessment 3 - Client-side Website
 */

app.controller('HomeController', ['$scope', 'ApiService', function($scope, ApiService) {
  // Initialize scope variables
  $scope.events = [];
  $scope.loading = true;
  $scope.error = null;

  /**
   * Load upcoming events from the API
   */
  $scope.loadUpcomingEvents = function() {
    $scope.loading = true;
    $scope.error = null;

    ApiService.getUpcomingEvents()
      .then(function(response) {
        $scope.events = response.data;
        $scope.loading = false;

        // Determine event status (Upcoming or Current)
        $scope.events.forEach(function(event) {
          var eventDate = new Date(event.event_date);
          var now = new Date();
          event.status = eventDate > now ? 'Upcoming' : 'Current';
        });
      })
      .catch(function(error) {
        $scope.error = 'Failed to load events: ' + (error.data ? error.data.error : error.statusText);
        $scope.loading = false;
      });
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

  // Load events on controller initialization
  $scope.loadUpcomingEvents();
}]);


