const { dbPool } = require('../config/event_db');

// 日期格式转换函数，把ISO格式转成MySQL需要的格式
// 比如：2025-10-22T09:45:00.000Z -> 2025-10-22 09:45:00
function formatDateForMySQL(isoDate) {
  if (!isoDate) return null;
  const date = new Date(isoDate);
  return date.toISOString().slice(0, 19).replace('T', ' ');
}

// 获取即将举行的活动列表（用于首页显示）
exports.getUpcomingEvents = async (req, res) => {
  try {
    const currentTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const query = `
      SELECT e.*, c.category_name, o.organization_name 
      FROM charity_events e
      JOIN event_categories c ON e.category_id = c.category_id
      JOIN charity_organizations o ON e.organization_id = o.organization_id
      WHERE e.event_date >= ? AND e.is_active = TRUE
      ORDER BY e.event_date ASC
    `;
    const [events] = await dbPool.execute(query, [currentTime]);
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch upcoming events: ' + error.message });
  }
};

// 获取所有活动类别
exports.getAllCategories = async (req, res) => {
  try {
    const query = 'SELECT * FROM event_categories ORDER BY category_name';
    const [categories] = await dbPool.execute(query);
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories: ' + error.message });
  }
};

// 搜索活动，支持日期、地点、类别筛选
exports.searchEvents = async (req, res) => {
  try {
    const { date, location, categoryId } = req.query;
    let query = `
      SELECT e.*, c.category_name, o.organization_name 
      FROM charity_events e
      JOIN event_categories c ON e.category_id = c.category_id
      JOIN charity_organizations o ON e.organization_id = o.organization_id
      WHERE e.is_active = TRUE
    `;
    const params = [];

    // 根据传入的参数动态添加筛选条件
    if (date) {
      query += ' AND DATE(e.event_date) = ?';
      params.push(date);
    }
    if (location) {
      query += ' AND e.event_location LIKE ?';
      params.push(`%${location}%`);
    }
    if (categoryId) {
      query += ' AND e.category_id = ?';
      params.push(categoryId);
    }

    query += ' ORDER BY e.event_date ASC';
    const [events] = await dbPool.execute(query, params);
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Search failed: ' + error.message });
  }
};

// 获取活动详情，包括注册列表
exports.getEventById = async (req, res) => {
  try {
    const { eventId } = req.params;
    
    // 先查询活动基本信息
    const eventQuery = `
      SELECT e.*, c.category_name, c.category_description,
             o.organization_name, o.mission_statement, o.contact_email
      FROM charity_events e
      JOIN event_categories c ON e.category_id = c.category_id
      JOIN charity_organizations o ON e.organization_id = o.organization_id
      WHERE e.event_id = ? AND e.is_active = TRUE
    `;
    const [events] = await dbPool.execute(eventQuery, [eventId]);

    if (events.length === 0) {
      return res.status(404).json({ error: 'Event not found or inactive' });
    }

    // 再查询这个活动的所有注册记录
    const registrationsQuery = `
      SELECT registration_id, user_name, user_email, user_phone, 
             tickets_purchased, registration_date
      FROM event_registrations
      WHERE event_id = ?
      ORDER BY registration_date DESC
    `;
    const [registrations] = await dbPool.execute(registrationsQuery, [eventId]);

    // 把活动信息和注册列表组合起来
    const event = events[0];
    const eventWithRegistrations = {
      ...event,
      ticket_price: Number(event.ticket_price),
      fund_target: Number(event.fund_target),
      current_fund: Number(event.current_fund),
      registrations: registrations
    };

    res.json(eventWithRegistrations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch event details: ' + error.message });
  }
};

// 获取所有活动（管理端用，包括所有状态的活动）
exports.getAllEvents = async (req, res) => {
  try {
    const query = `
      SELECT e.*, c.category_name, o.organization_name 
      FROM charity_events e
      JOIN event_categories c ON e.category_id = c.category_id
      JOIN charity_organizations o ON e.organization_id = o.organization_id
      ORDER BY e.event_date DESC
    `;
    const [events] = await dbPool.execute(query);
    
    // 确保数字字段是数字类型
    const formattedEvents = events.map(event => ({
      ...event,
      ticket_price: Number(event.ticket_price),
      fund_target: Number(event.fund_target),
      current_fund: Number(event.current_fund)
    }));
    
    res.json(formattedEvents);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch all events: ' + error.message });
  }
};

// 创建新活动
exports.createEvent = async (req, res) => {
  try {
    const {
      event_name, event_description, event_date, event_location,
      ticket_price, fund_target, organization_id, category_id, is_active
    } = req.body;

    // 验证必填字段
    if (!event_name || !event_date || !event_location || !fund_target || !organization_id || !category_id) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const query = `
      INSERT INTO charity_events 
      (organization_id, category_id, event_name, event_description, event_location, event_date, 
       ticket_price, fund_target, current_fund, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, ?)
    `;
    
    const activeStatus = (is_active === false || is_active === 'false') ? false : true;
    const formattedDate = formatDateForMySQL(event_date);
    
    const [result] = await dbPool.execute(query, [
      organization_id, category_id, event_name, event_description || '', 
      event_location, formattedDate, ticket_price || 0, fund_target, activeStatus
    ]);

    res.status(201).json({
      message: 'Event created successfully',
      event_id: result.insertId
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create event: ' + error.message });
  }
};

// 更新活动信息
exports.updateEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const {
      event_name, event_description, event_date, event_location,
      ticket_price, fund_target, current_fund, organization_id, category_id, is_active
    } = req.body;

    // 验证活动是否存在
    const [existing] = await dbPool.execute('SELECT event_id FROM charity_events WHERE event_id = ?', [eventId]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const activeStatus = (is_active === false || is_active === 'false') ? false : true;
    const formattedDate = formatDateForMySQL(event_date);

    const query = `
      UPDATE charity_events 
      SET organization_id = ?, category_id = ?, event_name = ?, event_description = ?, 
          event_location = ?, event_date = ?, ticket_price = ?, fund_target = ?, 
          current_fund = ?, is_active = ?
      WHERE event_id = ?
    `;
    
    await dbPool.execute(query, [
      organization_id, category_id, event_name, event_description,
      event_location, formattedDate, ticket_price, fund_target, 
      current_fund || 0, activeStatus, eventId
    ]);

    res.json({ message: 'Event updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update event: ' + error.message });
  }
};

// 删除活动，但要先检查有没有注册记录
exports.deleteEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    // 先确认活动存在
    const [events] = await dbPool.execute('SELECT event_id FROM charity_events WHERE event_id = ?', [eventId]);
    if (events.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // 查询这个活动有没有人注册
    const [registrations] = await dbPool.execute(
      'SELECT COUNT(*) as count FROM event_registrations WHERE event_id = ?',
      [eventId]
    );

    if (registrations[0].count > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete event with existing registrations',
        registrations_count: registrations[0].count
      });
    }

    // 没有注册的话可以删除
    await dbPool.execute('DELETE FROM charity_events WHERE event_id = ?', [eventId]);
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete event: ' + error.message });
  }
};

// 创建活动注册
exports.createRegistration = async (req, res) => {
  try {
    const { event_id, user_name, user_email, user_phone, tickets_purchased } = req.body;

    // 验证必填字段
    if (!event_id || !user_name || !user_email || !user_phone || !tickets_purchased) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // 检查活动是否存在并且是活跃状态
    const [events] = await dbPool.execute(
      'SELECT event_id, ticket_price FROM charity_events WHERE event_id = ? AND is_active = TRUE',
      [event_id]
    );

    if (events.length === 0) {
      return res.status(404).json({ error: 'Event not found or inactive' });
    }

    const query = `
      INSERT INTO event_registrations 
      (event_id, user_name, user_email, user_phone, tickets_purchased)
      VALUES (?, ?, ?, ?, ?)
    `;
    
    const [result] = await dbPool.execute(query, [
      event_id, user_name, user_email, user_phone, tickets_purchased
    ]);

    res.status(201).json({
      message: 'Registration created successfully',
      registration_id: result.insertId
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create registration: ' + error.message });
  }
};
