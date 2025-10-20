/**
 * Event Edit Controller - Edit existing events
 * Assessment 3 - Admin-side Website
 */

adminApp.controller('EventEditController', ['$scope', '$routeParams', 'ApiService', '$window', function($scope, $routeParams, ApiService, $window) {
  // Initialize scope variables
  $scope.event = null;
  $scope.registrations = [];
  $scope.categories = [];
  $scope.loading = true;
  $scope.error = null;
  $scope.submitting = false;
  $scope.eventId = $routeParams.eventId;

  /**
   * Load event details
   */
  $scope.loadEventDetails = function() {
    $scope.loading = true;
    $scope.error = null;

    ApiService.getEventById($scope.eventId)
      .then(function(response) {
        var data = response.data;
        $scope.registrations = data.registrations || [];
        
        // Convert date to Date object for datetime-local input
        var eventDateLocal = null;
        if (data.event_date) {
          eventDateLocal = new Date(data.event_date);
        }
        
        // Create clean event object without event_date
        $scope.event = {
          event_id: data.event_id,
          event_name: data.event_name,
          event_description: data.event_description,
          event_date_local: eventDateLocal,
          event_location: data.event_location,
          ticket_price: data.ticket_price,
          fund_target: data.fund_target,
          current_fund: data.current_fund,
          category_id: parseInt(data.category_id),
          organization_id: parseInt(data.organization_id),
          category_name: data.category_name,
          organization_name: data.organization_name,
          is_active: !!data.is_active
        };
        
        $scope.loading = false;
      })
      .catch(function(error) {
        $scope.error = 'Failed to load event details: ' + (error.data ? error.data.error : error.statusText);
        $scope.loading = false;
      });
  };

  /**
   * Load all categories for the dropdown
   */
  $scope.loadCategories = function() {
    ApiService.getAllCategories()
      .then(function(response) {
        $scope.categories = response.data;
      })
      .catch(function(error) {
        console.error('Failed to load categories:', error);
      });
  };

  /**
   * Validate form data
   */
  $scope.validateForm = function() {
    if (!$scope.event.event_name || $scope.event.event_name.trim() === '') {
      alert('Event name is required');
      return false;
    }

    if (!$scope.event.event_date_local) {
      alert('Event date is required');
      return false;
    }

    if (!$scope.event.event_location || $scope.event.event_location.trim() === '') {
      alert('Event location is required');
      return false;
    }

    if (!$scope.event.fund_target || $scope.event.fund_target <= 0) {
      alert('Fund target must be greater than 0');
      return false;
    }

    return true;
  };

  /**
   * Update the event
   */
  $scope.updateEvent = function() {
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
      ticket_price: parseFloat($scope.event.ticket_price),
      fund_target: parseFloat($scope.event.fund_target),
      current_fund: parseFloat($scope.event.current_fund),
      organization_id: parseInt($scope.event.organization_id),
      category_id: parseInt($scope.event.category_id),
      is_active: $scope.event.is_active
    };

    ApiService.updateEvent($scope.eventId, eventData)
      .then(function(response) {
        alert('Event updated successfully!');
        $window.location.href = '#!/events';
      })
      .catch(function(error) {
        $scope.error = 'Failed to update event: ' + (error.data ? error.data.error : error.statusText);
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

  /**
   * Format date for display
   */
  $scope.formatDate = function(dateString) {
    return new Date(dateString).toLocaleString('en-AU', {
      year: 'numeric',
      month: 'short',
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

  // Load data on controller initialization
  $scope.loadEventDetails();
  $scope.loadCategories();
}]);


