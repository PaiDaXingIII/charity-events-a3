const mysql = require('mysql2/promise');
require('dotenv').config();

// 数据库配置，使用环境变量方便部署
const dbConfig = {
    host: process.env.DB_HOST || 'localhost', 
    user: process.env.DB_USER || 'root', 
    password: process.env.DB_PASSWORD || '123456', 
    database: process.env.DB_NAME || 'charityevents_db', 
    waitForConnections: true, 
    connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT) || 10, 
    queueLimit: 0 
};

// 创建连接池
const dbPool = mysql.createPool(dbConfig);

// 测试连接函数
async function testDbConnection() {
    try {
        const connection = await dbPool.getConnection();
        console.log('Successfully connected to the charityevents_db database!');
        connection.release(); 
    } catch (error) {
        console.error('Database connection failed:', error.message);
        process.exit(1); 
    }
}

module.exports = {
    dbPool,
    testDbConnection
};

// 如果直接运行这个文件，执行连接测试
if (require.main === module) {
    testDbConnection();
}