// 导入依赖和控制器
const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

// ============ Assessment 2 原有接口 ============

// 1. 首页数据接口：获取所有当前/即将举行的活动及类别
router.get('/upcoming', eventController.getUpcomingEvents);

// 2. 活动类别接口：获取所有可用活动类别
router.get('/categories', eventController.getAllCategories);

// 3. 搜索接口：按日期、地点、类别筛选活动
router.get('/search', eventController.searchEvents);

// ============ Assessment 3 新增接口 ============

// 5. 获取所有活动（包括Active/Past/Suspended，用于管理端）
router.get('/', eventController.getAllEvents);

// 6. 创建新活动（管理端）
router.post('/', eventController.createEvent);

// 7. 更新活动（管理端）
router.put('/:eventId', eventController.updateEvent);

// 8. 删除活动（管理端）
router.delete('/:eventId', eventController.deleteEvent);

// 9. 创建活动注册（客户端）
router.post('/registrations', eventController.createRegistration);

// 4. 活动详情接口：根据ID获取单个活动完整信息（更新为包含注册列表）
// 注意：这个路由必须放在最后，因为/:eventId会匹配任何路径
router.get('/:eventId', eventController.getEventById);

module.exports = router;