/**
 * Register Controller - Handle event registration
 * Assessment 3 - Client-side Website
 */

app.controller('RegisterController', ['$scope', '$routeParams', 'ApiService', '$window', function($scope, $routeParams, ApiService, $window) {
  // Initialize scope variables
  $scope.event = null;
  $scope.loading = true;
  $scope.error = null;
  $scope.success = false;
  $scope.submitting = false;
  $scope.eventId = $routeParams.eventId;

  // Registration form data
  $scope.registration = {
    event_id: parseInt($scope.eventId),
    user_name: '',
    user_email: '',
    user_phone: '',
    tickets_purchased: 1
  };

  /**
   * Load event details to display on registration page
   */
  $scope.loadEventDetails = function() {
    $scope.loading = true;
    $scope.error = null;

    ApiService.getEventById($scope.eventId)
      .then(function(response) {
        $scope.event = response.data;
        $scope.loading = false;

        // Calculate total cost
        $scope.calculateTotal();
      })
      .catch(function(error) {
        $scope.error = 'Failed to load event details: ' + (error.data ? error.data.error : error.statusText);
        $scope.loading = false;
      });
  };

  /**
   * Calculate total registration cost
   */
  $scope.calculateTotal = function() {
    if ($scope.event && $scope.registration.tickets_purchased) {
      $scope.totalCost = $scope.event.ticket_price * $scope.registration.tickets_purchased;
    } else {
      $scope.totalCost = 0;
    }
  };

  /**
   * Validate registration form
   */
  $scope.validateForm = function() {
    // Check if all required fields are filled
    if (!$scope.registration.user_name || $scope.registration.user_name.trim() === '') {
      alert('Please enter your name');
      return false;
    }

    if (!$scope.registration.user_email || $scope.registration.user_email.trim() === '') {
      alert('Please enter your email');
      return false;
    }

    // Email validation
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test($scope.registration.user_email)) {
      alert('Please enter a valid email address');
      return false;
    }

    if (!$scope.registration.user_phone || $scope.registration.user_phone.trim() === '') {
      alert('Please enter your phone number');
      return false;
    }

    // Phone validation (basic)
    var phonePattern = /^[\d\s\-\+\(\)]+$/;
    if (!phonePattern.test($scope.registration.user_phone)) {
      alert('Please enter a valid phone number');
      return false;
    }

    if (!$scope.registration.tickets_purchased || $scope.registration.tickets_purchased < 1) {
      alert('Please select at least 1 ticket');
      return false;
    }

    return true;
  };

  /**
   * Submit registration
   */
  $scope.submitRegistration = function() {
    // Validate form
    if (!$scope.validateForm()) {
      return;
    }

    $scope.submitting = true;
    $scope.error = null;

    ApiService.createRegistration($scope.registration)
      .then(function(response) {
        $scope.success = true;
        $scope.submitting = false;

        // Show success message
        alert('Registration successful! You have registered for ' + $scope.event.event_name);

        // Redirect to event detail page after 2 seconds
        setTimeout(function() {
          $window.location.href = '#!/event/' + $scope.eventId;
        }, 2000);
      })
      .catch(function(error) {
        $scope.error = 'Registration failed: ' + (error.data ? error.data.error : error.statusText);
        $scope.submitting = false;
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

  // Load event details on controller initialization
  $scope.loadEventDetails();

  // Watch for ticket quantity changes to update total
  $scope.$watch('registration.tickets_purchased', function() {
    $scope.calculateTotal();
  });
}]);


