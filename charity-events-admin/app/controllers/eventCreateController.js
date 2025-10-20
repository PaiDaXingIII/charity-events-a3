/**
 * Event Create Controller - Create new events
 * Assessment 3 - Admin-side Website
 */

adminApp.controller('EventCreateController', ['$scope', 'ApiService', '$window', function($scope, ApiService, $window) {
  // Initialize scope variables
  $scope.categories = [];
  $scope.loading = false;
  $scope.error = null;
  $scope.submitting = false;

  // Event form data with default values
  $scope.event = {
    event_name: '',
    event_description: '',
    event_date_local: null, // Date object for datetime-local input
    event_location: '',
    ticket_price: 0,
    fund_target: 0,
    organization_id: 1, // Default to first organization
    category_id: '',
    is_active: true
  };

  /**
   * Load all categories for the dropdown
   */
  $scope.loadCategories = function() {
    ApiService.getAllCategories()
      .then(function(response) {
        $scope.categories = response.data;
        // Set default category if available
        if ($scope.categories.length > 0) {
          $scope.event.category_id = $scope.categories[0].category_id;
        }
      })
      .catch(function(error) {
        $scope.error = 'Failed to load categories: ' + (error.data ? error.data.error : error.statusText);
      });
  };

  /**
   * Validate form data
   */
  $scope.validateForm = function() {
    // Check required fields
    if (!$scope.event.event_name || $scope.event.event_name.trim() === '') {
      alert('Event name is required');
      return false;
    }

    if (!$scope.event.event_date_local) {
      alert('Event date is required');
      return false;
    }

    // Validate date is in the future
    if ($scope.event.event_date_local) {
      var selectedDate = $scope.event.event_date_local;
      var now = new Date();
      if (selectedDate < now) {
        alert('Event date must be in the future');
        return false;
      }
    }

    if (!$scope.event.event_location || $scope.event.event_location.trim() === '') {
      alert('Event location is required');
      return false;
    }

    if (!$scope.event.fund_target || $scope.event.fund_target <= 0) {
      alert('Fund target must be greater than 0');
      return false;
    }

    if (!$scope.event.category_id) {
      alert('Please select a category');
      return false;
    }

    return true;
  };

  /**
   * Submit the form to create a new event
   */
  $scope.createEvent = function() {
    // Validate form
    if (!$scope.validateForm()) {
      return;
    }

    $scope.submitting = true;
    $scope.error = null;

    // Prepare data for API
    var eventData = {
      event_name: $scope.event.event_name,
      event_description: $scope.event.event_description,
      event_date: $scope.event.event_date_local ? $scope.event.event_date_local.toISOString() : null,
      event_location: $scope.event.event_location,
      ticket_price: parseFloat($scope.event.ticket_price) || 0,
      fund_target: parseFloat($scope.event.fund_target),
      organization_id: parseInt($scope.event.organization_id),
      category_id: parseInt($scope.event.category_id),
      is_active: $scope.event.is_active
    };

    ApiService.createEvent(eventData)
      .then(function(response) {
        alert('Event created successfully!');
        $window.location.href = '#!/events';
      })
      .catch(function(error) {
        $scope.error = 'Failed to create event: ' + (error.data ? error.data.error : error.statusText);
        $scope.submitting = false;
      });
  };

  /**
   * Cancel and go back to events list
   */
  $scope.cancel = function() {
    if (confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
      $window.location.href = '#!/events';
    }
  };

  // Load categories on controller initialization
  $scope.loadCategories();
}]);


