// 活动列表控制器 - 显示和管理所有活动

adminApp.controller('EventListController', ['$scope', 'ApiService', '$window', function($scope, ApiService, $window) {
  // 初始化变量
  $scope.events = [];
  $scope.loading = true;
  $scope.error = null;
  $scope.filterStatus = 'all'; // Filter: all, active, past, suspended

  // 从API加载所有活动
  $scope.loadAllEvents = function() {
    $scope.loading = true;
    $scope.error = null;

    ApiService.getAllEvents()
      .then(function(response) {
        $scope.events = response.data;
        $scope.loading = false;

        // 处理每个活动，添加状态信息
        var now = new Date();
        $scope.events.forEach(function(event) {
          var eventDate = new Date(event.event_date);
          
          // 根据日期判断活动状态
          if (!event.is_active) {
            event.displayStatus = 'Suspended';
            event.statusClass = 'status-suspended';
          } else if (eventDate < now) {
            event.displayStatus = 'Past';
            event.statusClass = 'status-past';
          } else {
            event.displayStatus = 'Active';
            event.statusClass = 'status-active';
          }
        });
      })
      .catch(function(error) {
        $scope.error = 'Failed to load events: ' + (error.data ? error.data.error : error.statusText);
        $scope.loading = false;
      });
  };

  // 根据状态筛选活动
  $scope.filteredEvents = function() {
    if ($scope.filterStatus === 'all') {
      return $scope.events;
    }
    
    return $scope.events.filter(function(event) {
      return event.displayStatus.toLowerCase() === $scope.filterStatus;
    });
  };

  // 跳转到编辑页面
  $scope.editEvent = function(eventId) {
    $window.location.href = '#!/edit/' + eventId;
  };

  // 删除活动
  $scope.deleteEvent = function(event) {
    // 确认是否删除
    var confirmMsg = 'Are you sure you want to delete "' + event.event_name + '"?';
    if (!confirm(confirmMsg)) {
      return;
    }

    ApiService.deleteEvent(event.event_id)
      .then(function(response) {
        alert('Event deleted successfully!');
        $scope.loadAllEvents();
      })
      .catch(function(error) {
        if (error.status === 400 && error.data && error.data.registrations_count) {
          alert('Cannot delete this event!\n\nThis event has ' + error.data.registrations_count + 
                ' registration(s). Events with registrations cannot be deleted to maintain data integrity.');
        } else {
          alert('Failed to delete event: ' + (error.data ? error.data.error : error.statusText));
        }
      });
  };

  // 格式化日期显示
  $scope.formatDate = function(dateString) {
    return new Date(dateString).toLocaleString('en-AU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 格式化货币显示
  $scope.formatCurrency = function(amount) {
    return '$' + parseFloat(amount).toLocaleString('en-AU', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  };

  // 页面加载时获取所有活动
  $scope.loadAllEvents();
}]);


