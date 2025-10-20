/**
 * Detail Controller - Display event details and registrations
 * Assessment 3 - Client-side Website
 */

app.controller('DetailController', ['$scope', '$routeParams', 'ApiService', function($scope, $routeParams, ApiService) {
  // Initialize scope variables
  $scope.event = null;
  $scope.registrations = [];
  $scope.loading = true;
  $scope.error = null;
  $scope.eventId = $routeParams.eventId;

  /**
   * Load event details including registrations
   */
  $scope.loadEventDetails = function() {
    $scope.loading = true;
    $scope.error = null;

    ApiService.getEventById($scope.eventId)
      .then(function(response) {
        $scope.event = response.data;
        $scope.registrations = response.data.registrations || [];
        $scope.loading = false;

        // Calculate progress percentage
        if ($scope.event.fund_target > 0) {
          $scope.event.progress = Math.min(100, ($scope.event.current_fund / $scope.event.fund_target) * 100);
        } else {
          $scope.event.progress = 0;
        }

        // Determine event status
        var eventDate = new Date($scope.event.event_date);
        var now = new Date();
        $scope.event.status = eventDate > now ? 'Upcoming' : (eventDate.toDateString() === now.toDateString() ? 'Today' : 'Past');
      })
      .catch(function(error) {
        $scope.error = 'Failed to load event details: ' + (error.data ? error.data.error : error.statusText);
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

  /**
   * Format currency
   */
  $scope.formatCurrency = function(amount) {
    return '$' + parseFloat(amount).toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  /**
   * Navigate to registration page
   */
  $scope.goToRegister = function() {
    window.location.href = '#!/register/' + $scope.eventId;
  };

  // Load event details on controller initialization
  $scope.loadEventDetails();
}]);


