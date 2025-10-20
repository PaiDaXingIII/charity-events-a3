-- ========================================
-- 慈善活动数据库 - 仅表结构和数据（无需CREATE DATABASE权限）
-- ========================================

-- 1. 慈善组织表
CREATE TABLE IF NOT EXISTS charity_organizations (
    organization_id INT AUTO_INCREMENT PRIMARY KEY,
    organization_name VARCHAR(100) NOT NULL, 
    mission_statement TEXT, 
    contact_email VARCHAR(100) NOT NULL, 
    contact_phone VARCHAR(20), 
    address TEXT, -- 组织地址
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    UNIQUE KEY uk_org_email (contact_email) 
);

-- 2. 活动类别表
CREATE TABLE IF NOT EXISTS event_categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(50) NOT NULL, 
    category_description TEXT, 
    UNIQUE KEY uk_category_name (category_name) 
);

-- 3. 慈善活动表
CREATE TABLE IF NOT EXISTS charity_events (
    event_id INT AUTO_INCREMENT PRIMARY KEY,
    event_name VARCHAR(100) NOT NULL, 
    event_description TEXT, 
    event_date DATETIME NOT NULL, 
    event_location TEXT NOT NULL, 
    ticket_price DECIMAL(10, 2) NOT NULL DEFAULT 0.00, 
    fund_target DECIMAL(15, 2) NOT NULL, 
    current_fund DECIMAL(15, 2) DEFAULT 0.00, 
    is_active BOOLEAN DEFAULT TRUE, 
    organization_id INT NOT NULL, 
    category_id INT NOT NULL, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, 
    
    FOREIGN KEY fk_event_organization (organization_id) 
        REFERENCES charity_organizations (organization_id)
        ON DELETE CASCADE,
    FOREIGN KEY fk_event_category (category_id) 
        REFERENCES event_categories (category_id)
        ON DELETE RESTRICT,
    
    INDEX idx_event_date (event_date),
    INDEX idx_event_category (category_id)
);

-- 4. 活动注册表（新增 - Assessment 3）
CREATE TABLE IF NOT EXISTS event_registrations (
    registration_id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    user_name VARCHAR(100) NOT NULL,
    user_email VARCHAR(100) NOT NULL,
    user_phone VARCHAR(20) NOT NULL,
    tickets_purchased INT NOT NULL DEFAULT 1,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY fk_registration_event (event_id) 
        REFERENCES charity_events (event_id)
        ON DELETE CASCADE,
    
    INDEX idx_event_registrations (event_id),
    INDEX idx_registration_date (registration_date)
);

-- 插入3个慈善组织数据
INSERT INTO charity_organizations (organization_name, mission_statement, contact_email, contact_phone, address)
VALUES 
(
    "Community Food Bank",
    "To fight hunger and improve food security for low-income families in the city.",
    "contact@communityfoodbank.org",
    "+61-2-1234-5678",
    "123 Harvest Street, Sydney NSW 2000"
),
(
    "Children's Health Foundation",
    "To support medical research and provide financial aid for children with rare diseases.",
    "info@childhealthfoundation.org",
    "+61-2-8765-4321",
    "45 Hope Avenue, Melbourne VIC 3000"
),
(
    "Environmental Protection Alliance",
    "To promote environmental conservation and reduce carbon footprint in urban areas.",
    "admin@epa.org.au",
    "+61-2-5555-9999",
    "78 Green Road, Brisbane QLD 4000"
);

-- 插入4个示例活动类别数据
INSERT INTO event_categories (category_name, category_description)
VALUES 
(
    "Fun Run",
    "Outdoor running events for all ages, with entry fees donated to charity."
),
(
    "Gala Dinner",
    "Formal dinner events with auctions, performances, and fundraising activities."
),
(
    "Silent Auction",
    "Auction events where bids are written down, and the highest bid wins the item."
),
(
    "Charity Concert",
    "Music performances by local or professional artists, with ticket proceeds donated."
);

-- 插入8个示例慈善活动数据
INSERT INTO charity_events (event_name, event_description, event_date, event_location, ticket_price, fund_target, current_fund, is_active, organization_id, category_id)
VALUES 
-- 活动1：社区食品银行的趣味跑
(
    "City Fun Run 2025",
    "A 5km fun run open to all ages. All entry fees will be used to purchase food for low-income families.",
    "2025-10-15 08:00:00",
    "Sydney Olympic Park, Sydney NSW 2127",
    30.00,
    50000.00,
    28500.00,
    TRUE,
    1,
    1
),
-- 活动2：儿童健康基金会的晚宴
(
    "Hope for Kids Gala",
    "A formal dinner with a live band, silent auction, and guest speakers from the medical field. Proceeds support pediatric rare disease research.",
    "2025-11-22 18:30:00",
    "Melbourne Convention and Exhibition Centre, Melbourne VIC 3000",
    150.00,
    120000.00,
    85000.00,
    TRUE,
    2,
    2
),
-- 活动3：环境保护联盟的无声拍卖会
(
    "Eco-Friendly Silent Auction",
    "Auction of eco-friendly products (e.g., solar panels, organic home goods). All proceeds fund urban tree-planting projects.",
    "2025-09-30 10:00:00",
    "Brisbane City Hall, Brisbane QLD 4000",
    0.00, 
    30000.00,
    12000.00,
    TRUE,
    3,
    3
),
-- 活动4：社区食品银行的慈善音乐会
(
    "Melody for Meals Concert",
    "Live music by local artists. Ticket sales and on-site donations will provide 10,000 meals for the hungry.",
    "2025-12-05 19:00:00",
    "Sydney Opera House, Sydney NSW 2000",
    80.00,
    45000.00,
    32000.00,
    TRUE,
    1,
    4
),
-- 活动5：环境保护联盟的趣味跑
(
    "Eco Run 2025",
    "A 10km run through city parks. Entry fees support plastic waste reduction programs.",
    "2025-10-29 07:30:00",
    "Brisbane Botanic Gardens, Brisbane QLD 4066",
    45.00,
    60000.00,
    18000.00,
    TRUE,
    3,
    1
),
-- 活动6：社区食品银行的晚宴
(
    "Harvest Gala 2025",
    "A dinner celebrating local farmers and food donors. Proceeds expand the food bank's distribution network.",
    "2025-11-08 18:00:00",
    "Sydney Harbour Marriott Hotel, Sydney NSW 2000",
    120.00,
    75000.00,
    42000.00,
    TRUE,
    1,
    2
),
-- 活动7：儿童健康基金会的无声拍卖会
(
    "Healing Hearts Auction",
    "Auction of luxury items (e.g., hotel stays, concert tickets) to fund medical equipment for children's hospitals.",
    "2025-10-07 14:00:00",
    "Melbourne Crown Casino, Melbourne VIC 3006",
    0.00, 
    50000.00,
    22000.00,
    TRUE,
    2,
    3
),
-- 活动8：儿童健康基金会的慈善音乐会
(
    "Songs for Smiles Concert",
    "Family-friendly concert with children's performers. All proceeds go to child life support programs in hospitals.",
    "2025-12-12 14:00:00",
    "Melbourne Recital Centre, Melbourne VIC 3000",
    50.00,
    35000.00,
    19000.00,
    TRUE,
    2,
    4
);

-- 插入12条示例注册数据（满足至少10条要求）
INSERT INTO event_registrations (event_id, user_name, user_email, user_phone, tickets_purchased, registration_date)
VALUES 
-- 活动1的注册
(1, "John Smith", "john.smith@email.com", "+61-412-345-678", 2, "2025-09-15 10:30:00"),
(1, "Emma Wilson", "emma.w@email.com", "+61-423-456-789", 1, "2025-09-18 14:20:00"),
(1, "Michael Brown", "m.brown@email.com", "+61-434-567-890", 3, "2025-09-22 09:45:00"),
-- 活动2的注册
(2, "Sarah Johnson", "sarah.j@email.com", "+61-445-678-901", 2, "2025-10-01 16:30:00"),
(2, "David Lee", "david.lee@email.com", "+61-456-789-012", 4, "2025-10-05 11:15:00"),
-- 活动4的注册
(4, "Lisa Chen", "lisa.chen@email.com", "+61-467-890-123", 2, "2025-10-10 13:45:00"),
(4, "James Taylor", "j.taylor@email.com", "+61-478-901-234", 1, "2025-10-12 10:00:00"),
-- 活动5的注册
(5, "Olivia Martin", "olivia.m@email.com", "+61-489-012-345", 1, "2025-09-25 08:30:00"),
(5, "William Davis", "w.davis@email.com", "+61-490-123-456", 2, "2025-09-28 15:00:00"),
-- 活动6的注册
(6, "Sophia Anderson", "sophia.a@email.com", "+61-401-234-567", 2, "2025-10-02 12:00:00"),
-- 活动7的注册
(7, "Daniel White", "daniel.w@email.com", "+61-412-345-000", 1, "2025-09-20 14:30:00"),
-- 活动8的注册
(8, "Emily Harris", "emily.h@email.com", "+61-423-456-111", 3, "2025-10-08 16:45:00");

