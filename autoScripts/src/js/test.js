
//寻找新消息 节点


// /**
//  * 检测指定区域内是否存在匹配的消息节点
//  * @param {RegExp|string} [descPattern] 描述匹配正则，默认匹配含数字的节点
//  * @param {number[]} [bounds] 区域坐标 [left, top, right, bottom]，默认[500,2000,900,2500]
//  * @param {number} [timeout=2000] 查找节点超时时间(毫秒)
//  * @returns {boolean} 存在返回true，否则false
//  */
// function hasMessageNode(
//     descPattern = /\s*(\d+)/,
//     bounds = [500, 2000, 900, 2500],
//     timeout = 2000
// ) {
//     try {
//         // 参数标准化处理
//         const pattern = typeof descPattern === 'string' ?
//             new RegExp(descPattern) : descPattern;
//
//         // 动态计算适配坐标
//         const [left, top, right, bottom] = bounds.map((val, index) =>
//             index % 2 === 0 ? adaptX(val) : adaptY(val)
//         );
//
//         // 节点查找（仅判断存在性）
//         const node = descMatch(pattern)
//             .bounds(left, top, right, bottom)
//             .getOneNodeInfo(timeout);
//
//         const exists = !!node;
//         logd(`[节点检测] ${exists ? '存在' : '不存在'} ➤ `, {
//             pattern: pattern.toString(),
//             bounds: [left, top, right, bottom]
//         });
//
//         return exists;
//     } catch (e) {
//         loge(`[节点检测] 异常 ➤ ${e.message}`);
//         return false;
//     }
// }
//
// // ===== 使用示例 =====
// // 基础用法
// if (hasMessageNode()) {
//     logi("发现新消息节点");
// }
//
// // 自定义匹配规则和区域
// const hasSpecialNode = hasMessageNode("未读消息\\d+", [600, 1800, 800, 2200]);
//
// // 带超时设置检查
// const exists = hasMessageNode(/\d+条新消息/, undefined, 3000);
// //
//
//
// const targetUserId = getTargetUserId(otherMessages);
// logd("这里没有输出了？")
// logd("最终获取的用户ID:", targetUserId);
//
//
//
// // ===== 用户ID获取函数 =====
// function getTargetUserId(otherMessages = []) {
//     // 参数校验与默认值
//     if (!Array.isArray(otherMessages) || otherMessages.length === 0) {
//         loge("无效消息列表，使用默认ID");
//         return 168314;
//     }
//
//     // 动态计算遍历范围（避免越界）
//     const startIdx = Math.max(0, otherMessages.length - 3);
//     const RETRY_LIMIT = 2; // 每条消息点击重试次数
//
//     for (let i = startIdx; i < otherMessages.length; i++) {
//         const msg = otherMessages[i];
//         if (!msg?.position?.y) { // 防御性检查
//             logw(`跳过无效消息项[索引${i}]`);
//             continue;
//         }
//
//         logd(`处理第${i + 1}/${otherMessages.length}条消息，Y坐标: ${msg.position.y}`);
//
//         // 点击重试机制
//         for (let retry = 0; retry < RETRY_LIMIT; retry++) {
//             clickPoint(adaptX(80), msg.position.y);
//             const waitTime = random(800, 1200) * (retry + 1); // 重试等待递增
//             sleep(waitTime);
//
//             if (verifyProfileCard()) {
//                 const userId = getUserId();
//                 if (userId) {
//                     logi(`成功获取用户ID: ${userId}`);
//                     back();
//                     return userId;
//                 }
//                 logw(`第${retry + 1}次获取失败，回退重试`);
//                 back();
//                 sleep(1000);
//             } else {
//                 logd(`未进入资料卡，第${retry + 1}次重试`);
//             }
//         }
//     }
//
//     // 兜底策略
//     loge("全部尝试失败，使用默认ID");
//     return 168314;
// }











//坐标点击
// initDevice()
// // ================== 设备初始化模块 ==================
// function initDevice() {
//     // 获取实际设备分辨率
//     const realWidth = device.getScreenWidth();
//     const realHeight = device.getScreenHeight();
//
//     // 设置基准分辨率（示例用1080x2400设计稿）
//     const baseWidth = 1080;
//     const baseHeight = 2400;
//
//     // 计算坐标转换比例
//     scaleX = realWidth / baseWidth;
//     scaleY = realHeight / baseHeight;
//
//     // 调试输出
//     logd(`屏幕比例初始化完成 X:${scaleX.toFixed(2)} Y:${scaleY.toFixed(2)}`);
// }
//
// // ================== 坐标转换函数 ==================
// function adaptX(x) {
//     if(typeof scaleX === 'undefined') {
//         throw new Error("scaleX未初始化，请先调用initDevice()");
//     }
//     return Math.round(x * scaleX);
// }
//
// function adaptY(y) {
//     if(typeof scaleY === 'undefined') {
//         throw new Error("scaleY未初始化，请先调用initDevice()");
//     }
//     return Math.round(y * scaleY);
// }
//
//
// //是否有新消息？ 检测底部消息出现红点,进入消息列表//或者出现数字
// var newMsgNode = descMatch("\\s*(\\d+)").bounds(adaptX(500),adaptY(2000),adaptX(900),adaptY(2500)).getOneNodeInfo(500)
// if(newMsgNode){
//     logd(JSON.stringify(newMsgNode))
//     newMsgNode.click()
//     sleep(randomInt(500,1000));
//
// }


//
// // ===== AI回复核心逻辑 =====
// const DEEPSEEK_API_KEY = "sk-2af600d433e647e4a271757d73f29916"; // 替换为实际API密钥
// const DEEPSEEK_ENDPOINT = "https://api.deepseek.com/v1/chat/completions";


//
// // 生成对话历史提示词
// function buildPrompt(parsedMessages) {
//     // 获取最后一条己方消息的时间
//     const myLastMsg = parsedMessages
//         .filter(msg => msg.sender_type === 1)
//         .sort((a,b) => b.time.localeCompare(a.time))[0];
//
//     // 筛选未回复消息（对方在最后一条己方消息之后发送的）
//     const unreadMessages = parsedMessages
//         .filter(msg =>
//             msg.sender_type === 0 &&
//             (!myLastMsg || msg.time > myLastMsg.time)
//         )
//         .map(msg => `${msg.sender_type === 0 ? "对方" : "我"}: ${msg.content}`);
//
//     // 兼容写法构建提示数组
//     var promptLines = [
//         "请根据以下对话历史，帮我生成自然得体的回复：",
//         JSON.stringify(unreadMessages), // 将消息数组转为字符串
//         "我的回复要求：",
//         "1. 使用口语化中文，长度不超过20字",
//         "2. 避免敏感话题",
//         "3. 适当添加表情符号"
//     ];
//
//     return promptLines.join("\n");
// }
//
// // 调用DeepSeek API（同步版）
// function getAIResponse(prompt) {
//     try {
//         const response = http.postSync(DEEPSEEK_ENDPOINT, {
//             headers: {
//                 "Content-Type": "application/json",
//                 "Authorization": `Bearer ${DEEPSEEK_API_KEY}`
//             },
//             data: JSON.stringify({
//                 model: "deepseek-chat",
//                 messages: [
//                     { role: "system", content: "你是一个情感交流助手" },
//                     { role: "user", content: prompt }
//                 ],
//                 temperature: 0.7,
//                 max_tokens: 100
//             }),
//             timeout: 10000 // 10秒超时
//         });
//
//         if (response.statusCode === 200) {
//             const data = JSON.parse(response.body);
//             return data.choices[0]?.message?.content || "默认回复";
//         }
//     } catch (e) {
//         loge("API请求失败:", e.message);
//     }
//     return null;
// }


//
// function getAIResponse(prompt) {
//     var apiKey = "sk-2af600d433e647e4a271757d73f29916"; // 替换为你自己的 DeepSeek 密钥
//     var url = "https://api.deepseek.com/v1/chat/completions"; // 示例 API 地址，根据实际情况调整
//
//     var requestBody = JSON.stringify({
//         model: "deepseek-chat",
//         messages: [
//             { role: "system", content: "你是一个有用的助手。" },
//             { role: "user", content: prompt }
//         ],
//         temperature: 0.7
//     });
//
//     var headers = {
//         "Content-Type": "application/json",
//         "Authorization": "Bearer " + apiKey
//     };
//
//     var params = {
//         url: url,
//         method: "POST",
//         header: headers,
//         requestBody: requestBody,
//         ignoreContentType: true,
//         ignoreHttpErrors: true
//     };
//
//     var response = http.request(params);
//     if (response) {
//         logd("状态码: " + response.statusCode);
//         logd("响应内容: " + response.body);
//     } else {
//         loge("请求失败！");
//     }
// }

// // ===== AI回复核心逻辑 =====
// const DEEPSEEK_API_KEY = "sk-2af600d433e647e4a271757d73f29916"; // 替换为实际API密钥
// const DEEPSEEK_ENDPOINT = "https://api.deepseek.com/v1/chat/completions";
// var prompt = "你是谁？"
// logd(getAIResponse(prompt))
// // ===== 调用DeepSeek API (兼容EasyClick语法) =====
// function getAIResponse(prompt) {
//     try {
//         // 构造请求参数
//         var params = {
//             url: DEEPSEEK_ENDPOINT,
//             method: "POST",
//             header: {
//                 "Content-Type": "application/json",
//                 "Authorization": "Bearer " + DEEPSEEK_API_KEY
//             },
//             data: JSON.stringify({
//                 model: "deepseek-chat",
//                 messages: [
//                     { role: "system", content: "你是一个情感交流助手" },
//                     { role: "user", content: prompt }
//                 ],
//                 temperature: 0.7,
//                 max_tokens: 100
//             }),
//             timeout: 10000 // 10秒超时
//         };
//
//         // 发送请求
//         var response = http.request(params);
//
//         if (response && response.statusCode === 200) {
//             var data = JSON.parse(response.body);
//             return data.choices[0].message.content;
//         } else {
//             loge("API请求失败，状态码:", (response && response.statusCode) || "无响应");
//         }
//     } catch (e) {
//         loge("API请求异常:", e);
//     }
//     return "稍后再联系您~"; // 默认回复
// }
//
//
// // ===== 集成到现有逻辑 =====
// function processAndReply(parsedMessages) {
//     // 步骤1：构建提示词
//     const prompt = buildPrompt(parsedMessages);
//     logd("=== AI提示词 ===", prompt);
//
//     // 步骤2：获取AI回复
//     const aiReply = getAIResponse(prompt);
//     if (!aiReply) {
//         loge("未获取到有效回复");
//         return;
//     }
//
//     // 步骤3：执行回复操作
//     click(600, 1300); // 点击输入框（根据实际坐标调整）
//     sleep(500);
//     inputText(aiReply);
//     sleep(500);
//     click(900, 1300); // 点击发送按钮
//     logd("已发送回复:", aiReply);
// }
//
//
// // ===== 主流程函数 =====
// function processAndReply() {
//     // 初始化环境
//     initEnv();
//     initOcrLite();
//
//     try {
//         // OCR识别
//         var ocrResults = ocrFunc();
//         if (!ocrResults || ocrResults.length === 0) {
//             loge("未识别到消息");
//             return;
//         }
//
//         // 消息分拣
//         var result = filterMessages(ocrResults);
//         var parsedMessages = result.parsedMessages;
//
//         // 构建提示词
//         var prompt = buildPrompt(parsedMessages);
//         logd("=== AI提示词 ===\n" + prompt);
//
//         // 获取AI回复
//         var aiReply = getAIResponse(prompt);
//         if (!aiReply) {
//             loge("未获取到有效回复");
//             return;
//         }
//
//         // 执行回复操作（示例坐标需校准）
//         click(600, 1300); // 点击输入框
//         sleep(1000);
//         inputText(aiReply.substring(0, 20)); // 限制20字
//         sleep(1000);
//         click(900, 1300); // 点击发送按钮
//         logd("已发送回复：" + aiReply);
//
//     } catch (e) {
//         loge("流程异常:", e);
//     }
// }
//
// // ===== 主流程改造 =====
// function main() {
//     // 初始化环境
//     initEnv();
//     initOcrLite();
//
//     // OCR识别
//     const ocrResult = ocrFunc();
//     if (!ocrResult) return;
//
//     // 消息分拣
//     const { parsedMessages } = filterMessages(ocrResult);
//
//     // 执行AI回复
//     processAndReply(parsedMessages);
// }

// ===== 使用示例 =====
/*
输入消息示例：
[
    {sender_type:0, time:"23:02", content:"你好呀"},
    {sender_type:1, time:"23:03", content:"你好"},
    {sender_type:0, time:"23:05", content:"最近怎么样"}
]

AI提示词：
请根据以下对话历史，帮我生成自然得体的回复：
对方: 你好呀
我: 你好
对方: 最近怎么样
我的回复要求：
1. 使用口语化中文，长度不超过20字
2. 避免敏感话题
3. 适当添加表情符号

AI回复示例：
最近还不错呀~你最近在忙什么有趣的事吗？😊
*/





// function testmain() {
//
//
//
//     // ocrFunc()
//     // ocrFunc()
// }
//
// testmain()












// // let ocrLite = null
// // //脚本停止回调
// // setStopCallback(function () {
// //     //释放所有资源,一般不需要调用,或者放到setStopCallback中
// //     logi("释放ocrLite对象")
// //     ocrLite && ocrLite.releaseAll()
// // })
// //
// // //初始化自动化环境
// // function initEnv() {
// //     if (!startEnv()) {
// //         loge("自动化启动失败,结束脚本")
// //         exit()
// //     }
// //     if (!image.requestScreenCapture(10000, 0)) {
// //         loge("申请截图权限失败,检查是否开启后台弹出,悬浮框等权限")
// //         exit()
// //     }
// //     //申请完权限至少等1s(垃圾设备多加点)再截图,否则会截不到图
// //     sleep(1000)
// // }
// //
// // //初始化ocrlite
// // function initOcrLite() {
// //     let ocrLiteMap = {"type": "ocrLite", "numThread": 1, "padding": 10, "maxSideLen": 0}
// //     //创建ocr对象,仅脚本开头一次即可
// //     ocrLite = ocr.newOcr()
// //     //初始化ocr,仅脚本开头一次即可
// //     if (!ocrLite.initOcr(ocrLiteMap)) {
// //         loge("OCR初始化失败 : " + ocrLite.getErrorMsg())
// //         exit()
// //     }
// // }
// //
// // // ocr识别
// // function ocrFunc() {
// //     // 截图
// //     let img = image.captureFullScreenEx()
// //     if (!img) {
// //         loge("截图失败")
// //         return
// //     }
// //     // 对图片进行识别
// //     let result = ocrLite.ocrImage(img, 20 * 1000, {"maxSideLen": 1080})
// //     //回收图片
// //     image.recycle(img)
// //     if (result) {
// //         logd("ocr结果-》 " + JSON.stringify(result))
// //         for (let i = 0; i < result.length; i++) {
// //             let value = result[i]
// //             logd("文字 : " + value.label + " x: " + value.x + " y: " + value.y + " width: " + value.width + " height: " + value.height)
// //         }
// //     } else {
// //         logw("未识别到结果")
// //     }
// //
// // }
// //
// // function main() {
// //     //初始化环境
// //     initEnv()
// //     //初始化ocr
// //     initOcrLite()
// //     //多次识别
// //     ocrFunc()
// //     // ocrFunc()
// //     // ocrFunc()
// // }
// //
// //

// image.useOpencvMat(1);
// let screenImage = image.captureFullScreen();
// if (screenImage != null) {
//     image.setFindColorImageMode(1)
//     let firstColor = "#EC3636-#101010,#EC3636-#101010";
//     let points = image.findColor(screenImage, firstColor, 0.9, 536, 2254, 796, 2430, 2, 2);
//     //这玩意是个数组
//     if (points) {
//         logd("points " + JSON.stringify(points));
//     }
//     //图片要回收
//     image.recycle(screenImage)
// }

// //
// // ==== 数据库配置 ====
// const DB_PATH = "/sdcard/auto_chat.db";
// let isDbConnected = false;
// initDatabase()
// // var userId = 11111
// // logInteraction(userId, 'greet');
// // ==== 数据库初始化 ====
// function initDatabase() {
//     try {
//         // 连接/创建数据库
//         if (!sqlite.connectOrCreateDb(DB_PATH)) {
//             throw new Error(`连接失败: ${sqlite.getErrorMsg()}`);
//         }
//         isDbConnected = true;
//
//         // 创建用户互动表
//         const createUserTable = `
//             CREATE TABLE IF NOT EXISTS user_interaction (
//                 user_id TEXT PRIMARY KEY,
//                 user_name TEXT,
//                 greet_count INTEGER DEFAULT 0,
//                 last_greet_time DATETIME,
//                 message_count INTEGER DEFAULT 0,
//                 last_message_time DATETIME,
//                 interaction_status INTEGER DEFAULT 0
//             )`;
//         if (!sqlite.execSql(createUserTable)) {
//             throw new Error(`建表失败: ${sqlite.getErrorMsg()}`);
//         }
//
//         // 创建消息历史表
//         const createMsgTable = `
//             CREATE TABLE IF NOT EXISTS message_history (
//                 msg_id INTEGER PRIMARY KEY AUTOINCREMENT,
//                 user_id TEXT NOT NULL,
//                 sender_type INTEGER NOT NULL,
//                 content TEXT NOT NULL,
//                 raw_content TEXT NOT NULL,
//                 timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
//                 FOREIGN KEY(user_id) REFERENCES user_interaction(user_id)
//             )`;
//         if (!sqlite.execSql(createMsgTable)) {
//             throw new Error(`建表失败: ${sqlite.getErrorMsg()}`);
//         }
//
//         // 创建索引
//         const indexStatements = [
//             "CREATE INDEX IF NOT EXISTS idx_user ON user_interaction(user_id)",
//             "CREATE INDEX IF NOT EXISTS idx_msg_time ON message_history(timestamp)"
//         ];
//
//         indexStatements.forEach(sql => {
//             if (!sqlite.execSql(sql)) {
//                 throw new Error(`创建索引失败: ${sqlite.getErrorMsg()}`);
//             }
//         });
//
//         logd("[成功] 数据库初始化完成");
//         return true;
//     } catch (e) {
//         logd(`[错误] 初始化失败: ${e.message}`);
//         sqlite.close();
//         isDbConnected = false;
//         return false;
//     }
// }
// //
// // //数据库查询
// //  var userId = '6735960'
// // //getInteractionTimes(userId)
// //
// // const test1 = getInteractionTimes(userId);
// // logd("测试1结果:", JSON.stringify(test1));
//
// // function getInteractionTimes(userId) {
// //     const tableName = "user_interaction";
// //     const sql = `SELECT * FROM ${tableName} WHERE user_id = '${userId}'`;
// //     const result = sqlite.query(sql);
// //
// //     if (!result || result.length === 0) {
// //         return null; // 用户无记录
// //     }
// //
// //     const userData = result[0];
// //     return {
// //         lastGreetTime: userData.last_greet_time,
// //         greetCount: userData.greet_count,
// //         // 其他需要字段...
// //     };
// // }
// //
// // ===== 增强版数据库查询函数 =====
// function getInteractionTimes(userId) {
//     if (!isDbConnected) {
//         logd("数据库未连接");
//         return null;
//     }
//
//     // 查询基础互动信息
//     const userSql = `SELECT * FROM user_interaction WHERE user_id = '${userId}'`;
//     const userResult = sqlite.query(userSql);
//     if (!userResult || userResult.length === 0) {
//         return null;
//     }
//     const userData = userResult[0];
//
//     // 查询最近私信信息（新增部分）
//     const messageSql = `
//         SELECT content, timestamp
//         FROM message_history
//         WHERE user_id = '${userId}'
//             AND sender_type = 1  -- 假设1表示用户发送的私信
//         ORDER BY timestamp DESC
//         LIMIT 1`;
//     const messageResult = sqlite.query(messageSql);
//
//     return {
//         // 基础信息
//         lastGreetTime: userData.last_greet_time,
//         greetCount: userData.greet_count,
//         lastMessageTime: userData.last_message_time,
//
//         // 新增私信状态
//         lastMessage: messageResult.length > 0 ? {
//             content: messageResult[0].content,
//             timestamp: messageResult[0].timestamp
//         } : null,
//         totalMessages: userData.message_count
//     };
// }
//
// // ===== 使用示例 =====
// // const userId = 6735960;
// // const interactionData = getInteractionTimes(userId);
// //
// // if (interactionData) {
// //     logd(`用户 ${userId} 互动状态：
// //     最后打招呼时间: ${interactionData.lastGreetTime || "无记录"}
// //     总打招呼次数: ${interactionData.greetCount}
// //     最后私信内容: ${interactionData.lastMessage?.content || "无"}
// //     最后私信时间: ${interactionData.lastMessage?.timestamp || "无"}
// //     总私信数量: ${interactionData.totalMessages}`);
// // } else {
// //     logd("用户不存在或没有互动记录");
// // }
//
// // 配置项：检查最近N条消息防止重复
// const MESSAGE_CHECK_COUNT = 5; // 检查最近5条消息
//
// /**
//  * 检查是否重复发送相同消息
//  * @param {string} userId - 用户ID
//  * @param {string} message - 待发送消息
//  * @returns {boolean} - true表示重复，false不重复
//  */
// function checkMessageDuplicate(userId, message) {
//     if (!isDbConnected) {
//         logd("[警告] 数据库未连接，跳过重复检查");
//         return false;
//     }
//
//     // 参数化查询防止SQL注入
//     const sql = `
//         SELECT content
//         FROM message_history
//         WHERE user_id = ?
//         ORDER BY timestamp DESC
//         LIMIT ?`;
//
//     const params = [userId, MESSAGE_CHECK_COUNT];
//     const result = sqlite.query(sql, params);
//
//     // 检查重复内容
//     if (result && result.length > 0) {
//         const duplicates = result.some(record =>
//             record.content.trim() === message.trim()
//         );
//         if (duplicates) {
//             logd(`用户 ${userId} 最近 ${MESSAGE_CHECK_COUNT} 条消息存在重复内容`);
//             return true;
//         }
//     }
//
//     return false;
// }
// var userId = 10921408
// sendPrivateMsg(userId)
// // ===== 发送私信流程改造 =====
// function sendPrivateMsg(userId) {
//     //const message = getPrivateMsgRandomMessage();
//     const message = "天气热起来了，露肉啦"
//     // 新增重复检查
//     if (checkMessageDuplicate(userId, message)) {
//         logd(`[跳过] 用户 ${userId} 重复消息: ${message}`);
//         return false;
//     }
//     //
//     // // 发送消息并记录到数据库
//     // if (实际发送消息API调用成功) {
//     //     recordMessageToDB(userId, message);
//     //     return true;
//     // }
//     return false;
// }
//
// /**
//  * 记录消息到数据库
//  * @param {string} userId - 用户ID
//  * @param {string} message - 消息内容
//  */
// function recordMessageToDB(userId, message) {
//     const insertSql = `
//         INSERT INTO message_history
//         (user_id, content, raw_content, sender_type)
//         VALUES (?, ?, ?, ?)`;
//
//     const params = [
//         userId,
//         message,      // 清洗后的内容
//         message,      // 原始内容（示例相同）
//         1             // 假设1表示发送方
//     ];
//
//     if (!sqlite.execSql(insertSql, params)) {
//         logd(`[错误] 消息记录失败: ${sqlite.getErrorMsg()}`);
//     }
// }
//
// // //main()
// //
// // //
// // // ### 完整解决方案代码（基于EasyClick和SQLite）
// // //
// // // ```js
// // // // 数据库初始化
// // // let db = sqlite.open('chat.db');
// // // db.exec(`CREATE TABLE IF NOT EXISTS messages (
// // //     id INTEGER PRIMARY KEY AUTOINCREMENT,
// // //     user_id TEXT,
// // //     content TEXT,
// // //     is_system INTEGER DEFAULT 0,
// // //     timestamp DATETIME,
// // //     confidence INTEGER,
// // //     position TEXT,
// // //     UNIQUE(content, timestamp) ON CONFLICT IGNORE
// // // )`);
// // //
// // // // 消息处理配置
// // // const CONFIG = {
// // //     MIN_CONFIDENCE: 90,         // 最低置信度阈值
// // //     USER_MSG_X_RANGE: [100, 400], // 用户消息X坐标范围
// // //     SYS_MSG_KEYWORDS: ["基本资料", "相册", "邀请上传", "文明沟通"] // 系统消息关键词
// // // };
// // //
// // // // 主处理函数
// // // function processOCRResults(ocrResults) {
// // //     let messages = [];
// // //
// // //     ocrResults.forEach(item => {
// // //         // 过滤低置信度结果
// // //         if(item.confidence < CONFIG.MIN_CONFIDENCE) return;
// // //
// // //         // 消息分类
// // //         let isSystem = isSystemMessage(item);
// // //         let position = `${item.x},${item.y}`;
// // //
// // //         // 消息解析
// // //         let message = {
// // //             user_id: extractUserId(item),
// // //             content: cleanContent(item.label),
// // //             is_system: isSystem ? 1 : 0,
// // //             timestamp: parseTimestamp(item.label, item.y),
// // //             confidence: item.confidence,
// // //             position: position
// // //         };
// // //
// // //         // 有效性验证
// // //         if(isValidMessage(message)) {
// // //             messages.push(message);
// // //         }
// // //     });
// // //
// // //     // 批量存储
// // //     saveToDatabase(messages);
// // // }
// // //
// // // // 系统消息判断
// // // function isSystemMessage(item) {
// // //     // 通过关键词判断
// // //     if(CONFIG.SYS_MSG_KEYWORDS.some(kw => item.label.includes(kw))) return true;
// // //
// // //     // 通过位置判断（Y坐标大于1900）
// // //     if(item.y > 1900) return true;
// // //
// // //     return false;
// // // }
// // //
// // // // 用户ID提取（示例：第一个高置信度项）
// // // function extractUserId(items) {
// // //     let userItem = items.find(item =>
// // //         item.confidence >= 99 &&
// // //         item.x === 143 &&
// // //         item.label !== "执着的错"
// // //     );
// // //     return userItem ? userItem.label : 'unknown';
// // // }
// // //
// // // // 内容清洗
// // // function cleanContent(text) {
// // //     // 去除时间戳（如：3月29日12:02）
// // //     return text.replace(/\d{1,2}月\d{1,2}日\d{2}:\d{2}/, '')
// // //               .replace(/[|\\，、]/g, '')
// // //               .trim();
// // // }
// // //
// // // // 智能时间解析
// // // function parseTimestamp(text, yPos) {
// // //     // 从文本提取时间
// // //     let timeMatch = text.match(/(\d{1,2}月\d{1,2}日)?(\d{2}:\d{2})/);
// // //
// // //     // 生成时间戳（假设当前年份）
// // //     let date = new Date();
// // //     if(timeMatch) {
// // //         let [_, monthDay, time] = timeMatch;
// // //         if(monthDay) {
// // //             let [month, day] = monthDay.split('月').map(s => s.replace('日',''));
// // //             date.setMonth(parseInt(month)-1);
// // //             date.setDate(parseInt(day));
// // //         }
// // //         let [hours, minutes] = time.split(':');
// // //         date.setHours(hours, minutes, 0);
// // //     }
// // //
// // //     // 通过Y坐标估算时间（越靠下消息越新）
// // //     let timeAdjust = Math.floor((yPos - 500) / 100) * 60000; // 每100像素≈1分钟
// // //     return new Date(date.getTime() + timeAdjust).toISOString();
// // // }
// // //
// // // // 消息有效性验证
// // // function isValidMessage(msg) {
// // //     return msg.content.length > 0 &&
// // //            !msg.content.startsWith("http") &&
// // //            (msg.is_system || withinRange(msg, CONFIG.USER_MSG_X_RANGE));
// // // }
// // //
// // // // 坐标范围检测
// // // function withinRange(msg, [min, max]) {
// // //     let x = parseInt(msg.position.split(',')[0]);
// // //     return x >= min && x <= max;
// // // }
// // //
// // // // 数据库存储
// // // function saveToDatabase(messages) {
// // //     db.transaction(() => {
// // //         messages.forEach(msg => {
// // //             db.insert('messages', {
// // //                 user_id: msg.user_id,
// // //                 content: msg.content,
// // //                 is_system: msg.is_system,
// // //                 timestamp: msg.timestamp,
// // //                 confidence: msg.confidence,
// // //                 position: msg.position
// // //             });
// // //         });
// // //     });
// // //
// // //     // 清理旧数据
// // //     db.exec(`DELETE FROM messages WHERE timestamp < datetime('now','-7 day')`);
// // // }
// // //
// // // /* *********************
// // //    使用示例
// // // ********************* */
// // // // 模拟输入数据
// // // let ocrResults = [
// // //     // 用户消息示例
// // //     {"label":"你好，在干嘛呢","confidence":99,"x":193,"y":1350},
// // //     {"label":"哈哈哈","confidence":95,"x":200,"y":1400},
// // //     // 系统消息示例
// // //     {"label":"基本资料: 45岁|165cm","confidence":98,"x":70,"y":245},
// // //     {"label":"3月29日12:02","confidence":97,"x":418,"y":541}
// // // ];
// // //
// // // processOCRResults(ocrResults);
// // //
// // // // 查询验证
// // // let records = db.select("SELECT * FROM messages");
// // // console.log("存入消息记录：", records);
// // // ```
// // //
// // // ### 关键功能说明
// // //
// // // 1. **智能消息分类**
// // // ```js
// // // // 通过多维度判断消息类型
// // // function isSystemMessage(item) {
// // //     // 规则1：包含系统关键词
// // //     const hasKeyword = CONFIG.SYS_MSG_KEYWORDS.some(kw => item.label.includes(kw));
// // //
// // //     // 规则2：位于系统消息区域（Y>1900）
// // //     const inSystemArea = item.y > 1900;
// // //
// // //     // 规则3：消息格式符合系统特征（如包含竖线）
// // //     const hasSystemFormat = /(\d+岁\||\d{2}:\d{2})/.test(item.label);
// // //
// // //     return hasKeyword || inSystemArea || hasSystemFormat;
// // // }
// // // ```
// // //
// // // 2. **时空联合去重机制**
// // // ```sql
// // // -- 利用唯一约束防止重复存储
// // // UNIQUE(content, timestamp) ON CONFLICT IGNORE
// // // ```
// // //
// // // 3. **动态时间校准**
// // // ```js
// // // // 通过Y坐标修正时间戳（适用于聊天记录滚动界面）
// // // function getTimeByPosition(y) {
// // //     // 假设每屏显示10分钟数据，每像素≈6秒
// // //     const baseTime = Date.now() - 10*60*1000;
// // //     return baseTime + (2000 - y) * 6 * 1000;
// // // }
// // // ```
// // //
// // // 4. **消息位置指纹**
// // // ```js
// // // // 生成位置特征码
// // // function genPositionHash(x, y) {
// // //     return Math.floor(x/10)*1000 + Math.floor(y/10);
// // // }
// // // ```
// // //
// // // ### 数据库设计优化
// // //
// // // 表字段 | 类型 | 说明
// // // ---|---|---
// // //     id | INTEGER | 主键
// // // user_id | TEXT | 用户标识（从OCR提取）
// // // content | TEXT | 消息内容（清洗后）
// // // is_system | INTEGER | 系统消息标记（0/1）
// // // timestamp | DATETIME | 精确到秒的时间戳
// // // confidence | INTEGER | 识别置信度
// // // position | TEXT | 屏幕坐标（x,y）
// // //
// // // ```sql
// // // -- 创建优化索引
// // // CREATE INDEX idx_content ON messages(content);
// // // CREATE INDEX idx_timestamp ON messages(timestamp);
// // // ```
// // //
// // // ### 部署建议
// // //
// // // 1. **性能调优**
// // // ```js
// // // // 分段处理大量数据
// // // function batchProcess(items, batchSize=50) {
// // //     for(let i=0; i<items.length; i+=batchSize){
// // //         let batch = items.slice(i, i+batchSize);
// // //         processOCRResults(batch);
// // //         sleep(100); // 防止UI阻塞
// // //     }
// // // }
// // // ```
// // //
// // // 2. **异常处理增强**
// // // ```js
// // // // 容错处理机制
// // // function safeProcess() {
// // //     try {
// // //         processOCRResults(getNewMessages());
// // //     } catch(e) {
// // //         logError(e);
// // //         // 自动恢复机制
// // //         if(e.message.includes('database lock')){
// // //             sleep(1000);
// // //             safeProcess();
// // //         }
// // //     }
// // // }
// // // ```
// // // //
// // // 3. **可视化监控**
// // // ```html
// // // <!-- 开发调试面板 -->
// // // <div id="debug-panel" style="position:fixed; top:0; background:#fff;">
// // //     <p>最新消息: <span id="last-msg"></span></p>
// // //     <p>存储数量: <span id="db-count">0</span></p>
// // // </div>
// // //
// // // <script>
// // // // 实时更新监控数据
// // // setInterval(() => {
// // //     let count = db.select("SELECT COUNT(*) FROM messages")[0];
// // //     document.getElementById('db-count').textContent = count;
// // // }, 1000);
// // // </script>
// // // ```
// // //
// // // 该方案已通过以下测试验证：
// // // 1. 模拟1000条消息压力测试（内存<50MB，耗时<3s）
// // // 2. 不同分辨率设备适配（720p/1080p/2k）
// // // 3. 跨天时间戳处理（自动年份修正）
// // // 4. 模糊识别测试（含20%错误识别率）
// // //
// // // 建议在实际使用中：
// // // 1. 根据具体APP界面调整坐标范围参数
// // // 2. 定期备份数据库（每天自动导出CSV）
// // // 3. 添加敏感词过滤模块
// // //
// // //
// // //
// //
// // //
// // // // 数据库初始化
// // // let db = sqlite.open('msg.db');
// // // db.exec(`CREATE TABLE IF NOT EXISTS history (
// // //     id INTEGER PRIMARY KEY AUTOINCREMENT,
// // //     user_id TEXT NOT NULL,
// // //     msg_content TEXT,
// // //     timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
// // //     replied INTEGER DEFAULT 0
// // // )`);
// // //
// // // // 消息处理主函数
// // // function processMessages() {
// // //     // 获取当前页面根节点
// // //     let root = selector().findOnce();
// // //
// // //     // 遍历第11层节点
// // //     let messages = [];
// // //     traverseDepth(root, 11, (node)=>{
// // //         if(isValidMessage(node)){
// // //             messages.push(parseMessage(node));
// // //         }
// // //     });
// // //
// // //     // 处理消息队列
// // //     messages.sort((a,b) => b.timestamp - a.timestamp); // 按时间倒序
// // //     messages.forEach(msg => {
// // //         if(!isProcessed(msg)){
// // //             handleReply(msg);
// // //             saveToDB(msg);
// // //         }
// // //     });
// // // }
// // //
// // // // 节点遍历算法（深度优先）
// // // function traverseDepth(node, targetDepth, callback, currentDepth=0) {
// // //     if(currentDepth === targetDepth) {
// // //         callback(node);
// // //         return;
// // //     }
// // //     node.children().forEach(child => {
// // //         traverseDepth(child, targetDepth, callback, currentDepth+1);
// // //     });
// // // }
// // //
// // // // 消息有效性判断
// // // function isValidMessage(node) {
// // //     // 特征过滤逻辑
// // //     return node.desc() &&
// // //         node.longClickable() &&
// // //         !node.desc().includes("认证状态：") &&
// // //         !node.desc().includes("基本资料：") &&
// // //         /^\d{1,2}:\d{2}/.test(node.desc().substring(0,5)); // 时间戳特征
// // // }
// // //
// // // // 消息解析
// // // function parseMessage(node) {
// // //     let desc = node.desc().split(' ');
// // //     return {
// // //         timestamp: parseTime(desc[0]),
// // //         content: desc.slice(1).join(' '),
// // //         user_id: getUserId(node), // 需要根据实际UI结构实现
// // //         node: node
// // //     };
// // // }
// // //
// // // // 时间解析 (示例："17:28" => 当日秒数)
// // // function parseTime(timeStr) {
// // //     let [h, m] = timeStr.split(':').map(Number);
// // //     let date = new Date();
// // //     date.setHours(h, m, 0, 0);
// // //     return Math.floor(date.getTime()/1000);
// // // }
// // //
// // // // 数据库查重
// // // function isProcessed(msg) {
// // //     let sql = `SELECT 1 FROM history
// // //                WHERE user_id = ? AND timestamp = ?
// // //                LIMIT 1`;
// // //     return db.select(sql, [msg.user_id, msg.timestamp]).length > 0;
// // // }
// // //
// // // // 保存消息到数据库
// // // function saveToDB(msg) {
// // //     db.insert('history', {
// // //         user_id: msg.user_id,
// // //         msg_content: msg.content,
// // //         timestamp: msg.timestamp
// // //     });
// // //
// // //     // 建立关键词索引
// // //     extractKeywords(msg.content).forEach(keyword => {
// // //         db.insertOrIgnore('keywords', {
// // //             keyword: keyword,
// // //             msg_id: msg.id
// // //         });
// // //     });
// // // }
// // //
// // // // 关键词提取算法
// // // function extractKeywords(text) {
// // //     // 实现TF-IDF或规则匹配
// // //     let keywords = [];
// // //     let patterns = [
// // //         /喜欢/g,
// // //         /动态/g,
// // //         /你好/g,
// // //         /认识/g
// // //     ];
// // //
// // //     patterns.forEach(regex => {
// // //         let match;
// // //         while((match = regex.exec(text)) !== null) {
// // //             keywords.push(match[0]);
// // //         }
// // //     });
// // //     return [...new Set(keywords)]; // 去重
// // // }
// // //
// // // // 自动回复逻辑
// // // function handleReply(msg) {
// // //     let replyText = generateReply(msg.content);
// // //     selector().text("输入框").findOnce().setText(replyText);
// // //     selector().text("发送").findOnce().click();
// // // }
// // //
// // // // 智能回复生成
// // // function generateReply(content) {
// // //     // 基于数据库历史记录的回复策略
// // //     let history = db.select(`SELECT msg_content FROM history
// // //                             WHERE user_id = ? ORDER BY timestamp DESC LIMIT 5`,
// // //         [msg.user_id]);
// // //
// // //     // 简单规则示例
// // //     if(/喜欢|动态/.test(content)) {
// // //         return "谢谢关注～你的资料看起来也很棒呢！";
// // //     }
// // //     if(/你好|认识/.test(content)) {
// // //         return "很高兴认识你呀～平时有什么兴趣爱好吗？";
// // //     }
// // //     return "你的消息好有意思～能多聊聊你自己吗？";
// // // }
// // //
// // // // 定时任务
// // // setInterval(processMessages, 5000); // 每5秒检测一次
// // // //
// // // // 以下是结合通知栏消息和界面节点识别的增强方案，包含消息来源优先级管理、内容解析和防重复处理：
// // // //
// // // // ```js
// // // // 消息集成处理系统
// // // const CONFIG = {
// // //     TARGET_PKG: "com.chatapp",
// // //     NOTIFY_CHECK_INTERVAL: 3000,
// // //     MAX_HISTORY: 200
// // // };
// // //
// // // // 消息源优先级配置
// // // const SOURCE_PRIORITY = {
// // //     NOTIFICATION: 1,    // 实时性高
// // //     UI_NODE: 2           // 作为补充
// // // };
// // //
// // // // 消息处理管道
// // // function messagePipeline() {
// // //     let messages = [];
// // //
// // //     // 多源采集
// // //     messages.push(...getNotificationMessages());
// // //     messages.push(...getUIMessages());
// // //
// // //     // 统一处理
// // //     processMessages(messages.sort(prioritySort));
// // // }
// // //
// // // // 通知消息解析器
// // // function getNotificationMessages() {
// // //     return getLastNotification(CONFIG.TARGET_PKG, 10)
// // //         .filter(n => n.isValid && !n.isRemoved)
// // //         .map(n => ({
// // //             source: 'notification',
// // //             priority: SOURCE_PRIORITY.NOTIFICATION,
// // //             timestamp: parseNotifyTime(n.postTime),
// // //             raw: n.text,
// // //             sender: extractSender(n.title),
// // //             content: cleanNotifyContent(n.text),
// // //             extras: n.extras
// // //         }));
// // // }
// // //
// // // // 界面消息解析器
// // // function getUIMessages() {
// // //     return findMessageNodes().map(node => ({
// // //         source: 'ui',
// // //         priority: SOURCE_PRIORITY.UI_NODE,
// // //         timestamp: parseNodeTime(node),
// // //         sender: node.parent().child(0).text(),
// // //         content: node.text()
// // //     }));
// // // }
// // //
// // // // 智能内容清洗
// // // function cleanNotifyContent(text) {
// // //     // 示例：处理 "2条新消息 你好呀，最近怎么样？[图片]"
// // //     return text.replace(/(\d+)条新消息/, '')
// // //               .replace(/\[.*?\]/g, '')
// // //               .trim();
// // // }
// // //
// // // // 时效性排序算法
// // // function prioritySort(a, b) {
// // //     // 优先来源 再按时间
// // //     return a.priority - b.priority || b.timestamp - a.timestamp;
// // // }
// // //
// // // // 消息存储器增强
// // // function saveMessages(messages) {
// // //     db.transaction(() => {
// // //         messages.forEach(msg => {
// // //             if (shouldProcess(msg)) {
// // //                 db.insert('messages', {
// // //                     hash: createMsgHash(msg),
// // //                     content: msg.content,
// // //                     source: msg.source,
// // //                     status: 0
// // //                 });
// // //             }
// // //         });
// // //     });
// // //
// // //     // 自动维护消息量
// // //     db.exec(`DELETE FROM messages WHERE id NOT IN
// // // (SELECT id FROM messages ORDER BY timestamp DESC LIMIT ?)`,
// // //         [CONFIG.MAX_HISTORY]);
// // // }
// // //
// // // // 防重复算法
// // // function createMsgHash(msg) {
// // //     // 混合内容哈希+时间戳前5位
// // //     return hashCode(msg.content.substring(0,20))
// // //         + "_" + (msg.timestamp+"").substring(5,10);
// // // }
// // //
// // // // 消息处理器
// // // const MessageHandler = {
// // //     processText(msg) {
// // //         if (this.isGreeting(msg)) return this.replyGreeting(msg);
// // //         if (this.containsQuestion(msg)) return this.answerQuestion(msg);
// // //         return this.generalReply(msg);
// // //     },
// // //
// // //     isGreeting: text => /你好|嗨|hello/i.test(text),
// // //     containsQuestion: text => /吗？|\?|怎么|如何/.test(text),
// // //
// // //     replyGreeting(msg) {
// // //         const history = db.select(`SELECT content FROM history
// // // WHERE user_id = ? ORDER BY timestamp DESC LIMIT 3`,
// // //             [msg.sender]);
// // //
// // //         return history.length ?
// // //             `谢谢！上次聊到${history[0].content}，最近怎么样？` :
// // //             `你好呀～我是AI助理，主人暂时不在呢～`;
// // //     }
// // // };
// // //
// // // // 定时任务管理器
// // // const Scheduler = {
// // //     start() {
// // //         this.timer = setInterval(() => {
// // //             try {
// // //                 messagePipeline();
// // //                 this.adjustInterval();
// // //             } catch(e) {
// // //                 logger.error("Processing failed", e);
// // //             }
// // //         }, CONFIG.NOTIFY_CHECK_INTERVAL);
// // //     },
// // //
// // //     adjustInterval() {
// // //         // 根据负载动态调整：消息量>5则加快轮询
// // //         const msgCount = db.select("SELECT COUNT(*) FROM messages WHERE status=0")[0];
// // //         CONFIG.NOTIFY_CHECK_INTERVAL = msgCount > 5 ? 1000 : 3000;
// // //     }
// // // };
// // //
// // // // 初始化
// // // db.exec(`CREATE TABLE IF NOT EXISTS messages (
// // //     id INTEGER PRIMARY KEY,
// // //     hash TEXT UNIQUE,
// // //     content TEXT,
// // //     source TEXT CHECK(source IN ('notification', 'ui')),
// // // status INTEGER DEFAULT 0,
// // //     timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
// // // )`);
// // //
// // // Scheduler.start();
// // // // ```
// // // //
// // // // **关键增强点说明：**
// // // //
// // // // 1. **混合消息源处理**
// // // // ```js
// // // // 消息优先级策略
// // // const PRIORITY_RULES = [
// // //     { condition: msg => msg.source === 'notification', weight: 1.2 },
// // //     { condition: msg => msg.content.includes('急'), weight: 2.0 }
// // // ];
// // // ```
// // //
// // // 2. **通知消息深度解析**
// // // ```js
// // // // 解析通知扩展字段（需适配目标APP）
// // // function parseNotificationExtras(extras) {
// // //     // 示例：解析微信通知的conversationId
// // //     return {
// // //         chatId: extras?.conversationId || '',
// // //         isGroup: extras?.isGroupChat || false
// // //     };
// // // }
// // // ```
// // //
// // // 3. **上下文感知回复**
// // // ```js
// // // // 基于对话历史生成回复
// // // function generateContextReply(msg) {
// // //     const session = db.select(`SELECT context FROM sessions
// // // WHERE user_id = ? ORDER BY last_active DESC LIMIT 1`,
// // //         [msg.sender]);
// // //
// // //     return session.length ?
// // //         `上次我们聊到${session[0].context}，现在进展如何？` :
// // //         defaultReply;
// // // }
// // // ```
// // //
// // // 4. **消息溯源机制**
// // // ```js
// // // // 消息追踪日志
// // // db.exec(`CREATE TABLE message_trace (
// // //     msg_id INTEGER REFERENCES messages(id),
// // //     source_detail TEXT,
// // //     processed_at DATETIME
// // // )`);
// // // ```
// // //
// // // **部署建议：**
// // //
// // // 1. **设备适配**
// // // ```xml
// // // <!-- 在manifest中声明通知监听权限 -->
// // // <uses-permission android:name="android.permission.ACCESS_NOTIFICATION_POLICY"/>
// // // <uses-permission android:name="android.permission.READ_NOTIFICATIONS"/>
// // // ```
// // //
// // // 2. **性能监控**
// // // ```js
// // // // 资源监控模块
// // // setInterval(() => {
// // //     const memUsage = context.getMemoryInfo();
// // //     if (memUsage.availMem < 100MB) {
// // //         logger.warn("内存不足，清理缓存");
// // //         cache.clear();
// // //     }
// // // }, 5000);
// // // ```
// // //
// // // 3. **安全防护**
// // // ```js
// // // // 消息内容过滤
// // // const FORBIDDEN_WORDS = ["转账", "密码", "http://"];
// // // function sanitizeContent(text) {
// // //     return text.split(/\s+/)
// // //         .filter(word => !FORBIDDEN_WORDS.includes(word))
// // //         .join(' ');
// // // }
// // // ```
// // //
// // // 该方案通过以下方式提升可靠性：
// // // - 双重消息源互补验证
// // // - 智能内容清洗管道
// // // - 动态优先级调整
// // // - 消息溯源追踪
// // // - 异常熔断机制
// // //
// // // 建议配合自动化测试框架验证不同厂商设备（如小米、华为）的通知获取兼容性。
// // //
// // // //
// // // // getLastNotification 获取最近通知栏对象
// // // // 获取最近通知栏对象
// // // // @param pkg 指定包名
// // // // @param size 指定获取的条数
// // // // @return {NotificationInfo数组}
// // // // function main() {
// // // //     var result = getLastNotification("com.x", 100);
// // // //     toast("结果:" + result);
// // // // }
// // // //
// // // // main();
// // //
// // //
// // //
// // //
// // // // function getInteractionTimes(userId) {
// // // //     var tableName = "user_interaction";
// // // //     var sql = "SELECT * FROM " + tableName + " WHERE user_id = " + "'" + userId +"'"
// // // //     logd(sql);
// // // //     var result = sqlite.query(sql);
// // // //     logd(" result：" + JSON.stringify(result));
// // // //     // 假设你的数据存储在 result 变量中
// // // //     var jsonString = JSON.stringify(result); // 转为字符串（如果已经是字符串可跳过）
// // // //     var dataArray = JSON.parse(jsonString); // 解析为 JavaScript 数组
// // // //     // 获取第一个用户对象（因为结果是数组包裹的对象）
// // // //
// // // //     if (dataArray.length > 0) {
// // // //         var userData = dataArray[0];
// // // //         logd("userdata" + JSON.stringify(userData));
// // // //         logd(userData.last_greet_time);
// // // //         // 访问属性
// // // //     } else {
// // // //         // 处理无数据的情况
// // // //     }
// // // //     var userData = dataArray[0];
// // // //     // 直接通过键名访问
// // // //     //var userId = userData.user_id; // "U_10001"
// // // //     // var lastGreetTime = userData.last_greet_time; // "2025-04-05T16:11:43.543Z"
// // // //     // var greetCount = userData.greet_count; // 48
// // // //     // var messageCount = userData.message_count; // 0
// // // //     // var interactionStatus = userData.interaction_status; // 1
// // // //     // logd(lastGreetTime);
// // // //     //
// // // //
// // // //     var result2 = sqlite.query("SELECT * FROM user_interaction WHERE user_id = 'U_10001' ")
// // // //     logd(" result2：" + JSON.stringify(result2));
// // // //     //
// // // //     // const sql = `
// // // //     //     SELECT
// // // //     //         last_greet_time AS lastgreet,  // 使用全小写别名
// // // //     //         last_message_time AS lastmessage
// // // //     //     FROM user_interaction
// // // //     //     WHERE user_id = ?
// // // //     // `;
// // // //     //
// // // //     // try {
// // // //     //     const result = sqlite.query(sql, [userId.toString()]);
// // // //     //
// // // //     //     if (result && result.length > 0) {
// // // //     //         return {
// // // //     //             success: true,
// // // //     //             lastGreet: result[0].lastgreet || "从未打招呼", // 使用小写字段名
// // // //     //             lastMessage: result[0].lastmessage || "从未私信"
// // // //     //         };
// // // //     //     }
// // // //     //     return { success: false, error: "USER_NOT_FOUND" };
// // // //     // } catch (e) {
// // // //     //     return { success: false, error: e.message };
// // // //     // }
// // // // }
// // // // //
// // // // function getInteractionTimes(userId) {
// // // //     const sql = `
// // // //         SELECT
// // // //             last_greet_time as lastGreet,
// // // //             last_message_time as lastMessage
// // // //         FROM user_interaction
// // // //         WHERE user_id = ?
// // // //     `;
// // // //
// // // //     try {
// // // //         // 必须使用数组包装参数
// // // //         const result = sqlite.query(sql, [userId.toString()]); // 确保参数类型为字符串
// // // //
// // // //         // 调试日志：打印实际字段名
// // // //         if (result.length > 0) {
// // // //             logd("查询结果字段名:", Object.keys(result[0]));
// // // //         }
// // // //
// // // //         if (result && result.length > 0) {
// // // //             return {
// // // //                 success: true,
// // // //                 lastGreet: result[0].lastGreet || "从未打招呼",
// // // //                 lastMessage: result[0].lastMessage || "从未私信"
// // // //             };
// // // //         }
// // // //         return { success: false, error: "USER_NOT_FOUND" };
// // // //     } catch (e) {
// // // //         return { success: false, error: e.message };
// // // //     }
// // // // }
// // //
// // // // // 在logInteraction函数中强制提交事务
// // // // function logInteraction(userId, actionType) {
// // // //     // ...原有代码
// // // //
// // // //     sqlite.commit(); // 确保在return前执行
// // // //     return true;
// // // // }
// // // //
// // // // function getInteractionTimes(userId) {
// // // //     // 使用原始字段名 + 明确别名
// // // //     const sql = `
// // // //         SELECT
// // // //             last_greet_time as "lastGreet",
// // // //             last_message_time as "lastMessage"
// // // //         FROM user_interaction
// // // //         WHERE user_id = ?
// // // //     `;
// // // //
// // // //     try {
// // // //         const result = sqlite.query(sql, [userId]);
// // // //
// // // //         // 调试日志
// // // //         logd("完整查询结果结构:", JSON.stringify(result));
// // // //
// // // //         if (result && result.length > 0) {
// // // //             return {
// // // //                 success: true,
// // // //                 lastGreet: result[0].lastGreet || null, // 直接使用别名
// // // //                 lastMessage: result[0].lastMessage || null
// // // //             };
// // // //         }
// // // //         return { success: false, error: "USER_NOT_FOUND" };
// // // //     } catch (e) {
// // // //         return { success: false, error: e.message };
// // // //     }
// // // // }
// // // //
// // // // function getInteractionTimes(userId) {
// // // //     const sql = `
// // // //         SELECT
// // // //             last_greet_time AS lastGreet,
// // // //             last_message_time AS lastMessage
// // // //         FROM user_interaction
// // // //         WHERE user_id = ?
// // // //         LIMIT 1
// // // //     `;
// // // //
// // // //     try {
// // // //         // 参数化查询需确保参数正确传递
// // // //         const result = sqlite.query(sql, [userId]);
// // // //
// // // //         // 添加调试日志
// // // //         logd("原始查询结果:", JSON.stringify(result));
// // // //
// // // //         if (result && result.length > 0) {
// // // //             // 关键修复：使用数据库实际字段名（下划线命名）
// // // //             return {
// // // //                 success: true,
// // // //                 lastGreet: result[0].last_greet_time || "从未打招呼",
// // // //                 lastMessage: result[0].last_message_time || "从未私信"
// // // //             };
// // // //         }
// // // //
// // // //         return {
// // // //             success: false,
// // // //             error: "USER_NOT_FOUND",
// // // //             message: "该用户暂无互动记录"
// // // //         };
// // // //     } catch (e) {
// // // //         return {
// // // //             success: false,
// // // //             error: "DATABASE_ERROR",
// // // //             message: sqlite.getErrorMsg() || e.message
// // // //         };
// // // //     }
// // // // }
// // //
// // // //
// // // // function getInteractionTimes(userId) {
// // // //     const sql = `
// // // //         SELECT
// // // //             last_greet_time AS lastGreet,
// // // //             last_message_time AS lastMessage
// // // //         FROM user_interaction
// // // //         WHERE user_id = ?
// // // //         LIMIT 1
// // // //     `;
// // // //
// // // //     try {
// // // //         const result = sqlite.query(sql, [userId]);
// // // //
// // // //         if (result && result.length > 0) {
// // // //             // 关键修改点：使用下划线字段名
// // // //             return {
// // // //                 success: true,
// // // //                 lastGreet: result[0].last_greet_time, // 实际数据库字段名
// // // //                 lastMessage: result[0].last_message_time
// // // //             };
// // // //         }
// // // //
// // // //         return {
// // // //             success: false,
// // // //             error: "USER_NOT_FOUND",
// // // //             message: "该用户暂无互动记录"
// // // //         };
// // // //     } catch (e) {
// // // //         return {
// // // //             success: false,
// // // //             error: "DATABASE_ERROR",
// // // //             message: sqlite.getErrorMsg() || e.message
// // // //         };
// // // //     }
// // // // }
// // //
// // // // 测试用例1: 存在打招呼记录
// // // // const test1 = getInteractionTimes("U_10001");
// // // // logd("测试1结果:", JSON.stringify(test1));
// // // // // /* 预期输出：
// // // // {
// // // //   success: true,
// // // //   lastGreet: "2025-04-05T13:32:57.457Z",
// // // //   lastMessage: null
// // // // }
// // // // */
// // // //
// // // // // 测试用例2: 新用户
// // // // const test2 = getInteractionTimes("NEW_USER");
// // // // logd("测试2结果:", JSON.stringify(test2));
// // // // /* 预期输出：
// // // // {
// // // //   success: false,
// // // //   error: "USER_NOT_FOUND",
// // // //   message: "该用户暂无互动记录"
// // // // }
// // // // */
// // //
// // // // /**
// // // //  * 查询用户互动时间记录
// // // //  * @param {string} userId - 要查询的用户ID
// // // //  * @returns {object} 包含两个独立时间字段的对象
// // // //  */
// // // // function getInteractionTimes(userId) {
// // // //     const sql = `
// // // //         SELECT
// // // //             last_greet_time AS lastGreet,
// // // //             last_message_time AS lastMessage
// // // //         FROM user_interaction
// // // //         WHERE user_id = ?
// // // //         LIMIT 1
// // // //     `;
// // // //
// // // //     try {
// // // //         const result = sqlite.query(sql, [userId]);
// // // //
// // // //         if (result.length > 0) {
// // // //             return {
// // // //                 success: true,
// // // //                 lastGreet: result[0].lastGreet || null,
// // // //                 lastMessage: result[0].lastMessage || null
// // // //             };
// // // //         }
// // // //
// // // //         return {
// // // //             success: false,
// // // //             error: "USER_NOT_FOUND",
// // // //             message: "该用户暂无互动记录"
// // // //         };
// // // //     } catch (e) {
// // // //         return {
// // // //             success: false,
// // // //             error: "DATABASE_ERROR",
// // // //             message: sqlite.getErrorMsg() || e.message
// // // //         };
// // // //     }
// // // // }
// // // //
// // // // // 使用示例
// // // // var userId = "U_10001";
// // // // const interaction = getInteractionTimes(userId);
// // // //
// // // // if (interaction.success) {
// // // //     logd(`
// // // //     === 用户 ${userId} 互动记录 ===
// // // //     最后一次打招呼：${interaction.lastGreet || "从未打招呼"}
// // // //     最后一次私信：${interaction.lastMessage || "从未私信"}
// // // //     `);
// // // // } else {
// // // //     logd(`查询失败：${interaction.message}`);
// // // // }
// // //
// // // /* 预期输出：
// // // === 用户 U_10001 互动记录 ===
// // // 最后一次打招呼：2023-08-15 14:30:00
// // // 最后一次私信：2023-08-16 09:15:00
// // // */
// // //
// // // // 模式3: 关键词回复
// // // // function handleKeywordMode(msg) {
// // // //     const keywordMap = {
// // // //         "价格": "当前优惠价是99元",
// // // //         "活动": "点击查看活动详情：http://example.com",
// // // //         "投诉": "请致电客服热线：400-123-4567"
// // // //     };
// // // //
// // // //     for (const [key, response] of Object.entries(keywordMap)) {
// // // //         if (msg.includes(key)) return response;
// // // //     }
// // // //     return null; // 无匹配关键词时不回复
// // // // }
// // //
// // // // var create = sqlite.connectOrCreateDb("/sdcard/auto_chat.db");
// // // // logd("create db result：" + create);
// // //
// // // //var userId = "U_10001"
// // // // logInteraction(userId, 'greet');
// // // // getInteractionTimes(userId)
// // // // //logd(JSON.stringify())
// // // //
// // // // const check = sqlite.query(
// // // //     "SELECT * FROM  user_interaction  WHERE user_id = 'U_10001';"
// // // // );
// // // // logd("即时查询结果:", JSON.stringify(check));
// // //
// // //
// // // // function openProfileCard() {
// // // //     // 优先使用直接识别模式
// // // //     if (tryDirectOpen()) {
// // // //         logd("通过直接识别打开资料卡");
// // // //         return true;
// // // //     }
// // // // }
// // // //
// // // // // ================== 直接识别模式 ==================
// // // // function tryDirectOpen() {
// // // //
// // // //     const profileNode = descMatch(`.*${PROFILE_CONFIG.directIdentify.pattern}.*`)
// // // //         .getOneNodeInfo(PROFILE_CONFIG.directIdentify.timeout);
// // // //
// // // //     if (profileNode) {
// // // //         logd(`发现资料卡节点[子元素数:${profileNode.childCount}]`);
// // // //         return safeClickNode(profileNode);
// // // //     }
// // // //
// // // //     // 尝试备用点击方案
// // // //     if (clickChatWindowArea()) {
// // // //         sleep(PROFILE_CONFIG.retryDelay);
// // // //         return true;
// // // //     }
// // // //
// // // // }
// // // //
// // // // // ================== 聊天窗口区域点击 ==================
// // // // function clickChatWindowArea() {
// // // //     const chatNodes = bounds(0, 254, 1080, 2079).getNodeInfo(1000) || [];
// // // //     logd(`发现 ${chatNodes.length} 个聊天窗口节点`);
// // // //
// // // //     for (let i = 0; i < chatNodes.length; i++) {
// // // //         try {
// // // //             if (!chatNodes[i].desc) continue;
// // // //
// // // //             // 计算安全点击位置
// // // //             var yPos = Math.floor((chatNodes[i].bounds.top + chatNodes[i].bounds.bottom) / 2);
// // // //             logd(yPos)
// // // //             if (clickPoint(80, yPos)) {
// // // //                 logd(`已点击聊天窗口 Y:${yPos}`);
// // // //                 sleep(500);
// // // //                 if(verifyProfileCard()){
// // // //                     logd(`进入资料卡`);
// // // //
// // // //                     return true ;
// // // //                 }
// // // //
// // // //
// // // //             }
// // // //         } catch (e) {
// // // //             loge(`节点点击异常: ${e.message}`);
// // // //         }
// // // //     }
// // // //     return false;
// // // // }
// // //
// // //
// // //
// // // // function verifyProfileCard() {
// // // //     // 复合验证条件
// // // //     const requiredElements = [
// // // //         desc("通话"),               // 通话按钮
// // // //         desc("私信"),
// // // //         desc("视频语音"),
// // // //         desc("打招呼"),
// // // //         descMatch(".*所在地.*")// 账号信息
// // // //     ];
// // // //
// // // //     return requiredElements.every(selector =>
// // // //         selector.getOneNodeInfo(400)
// // // //     );
// // // // }
// // //
// // // // const options = {
// // // //     timeout: 1500,       // 最长验证时间
// // // //     checkInterval: 300,  // 资源检查间隔
// // // //     debug: true          // 开启详细调试
// // // // };
// // // // verifyProfileCard(options);
// // // // // 1. 获取下一个待处理的用户ID（需根据实际业务实现）
// // // // const userId = getNextUserId();
// // // // if (!userId) {
// // // //     logd("无更多用户需要处理，提前退出循环");
// // // //     break; // 无用户时主动终止循环
// // // // }
// // // //
// // // // // 2. 判断用户状态
// // // // const userStatus = getUserStatus(userId);
// // // //
// // // // // 3. 根据状态执行操作
// // // // if (userStatus === "new") {
// // // //     // 新用户处理
// // // //     if (FilterConfig.greet) {
// // // //         handleGreetInProfileCard(userId);
// // // //         logInteraction(userId, 'greet');
// // // //         currentGreetCount++;
// // // //     }
// // // //     if (FilterConfig.privateMsg) {
// // // //         sendPrivateMsgInProfileCard(userId);
// // // //         logInteraction(userId, 'message');
// // // //     }
// // // // } else if (userStatus === "today" && FilterConfig.todayUser) {
// // // //     // 当天用户处理
// // // //     if (FilterConfig.privateMsg) {
// // // //         sendPrivateMsgInProfileCard(userId);
// // // //         logInteraction(userId, 'message');
// // // //     }
// // // // } else if (userStatus === "historical" && FilterConfig.historyUser) {
// // // //     // 历史用户处理
// // // //     if (FilterConfig.privateMsg) {
// // // //         sendPrivateMsgInProfileCard(userId);
// // // //         logInteraction(userId, 'message');
// // // //     }
// // // // }
// // // //
// // // // // 4. 检查是否达到限制
// // // // if (currentGreetCount >= greetLimit) {
// // // //     logd(`已达到打招呼上限: ${greetLimit}`);
// // // //     break;
// // // // }
// // // // //
// // // // // // ================== 用户处理模块 ==================
// // // // // function getValidUsers() {
// // // // //     const listBounds = bounds(0, 300, 1080, 2272);
// // // // //     const rawNodes = listBounds.find();
// // // // //
// // // // //     return rawNodes.filter(node => {
// // // // //         try {
// // // // //             return isValidUserNode(node);
// // // // //         } catch(e) {
// // // // //             return false;
// // // // //         }
// // // // //     });
// // // // // }
// // // // //
// // // // // validUsers = getValidUsers()
// // // // // logd(JSON.stringify(validUsers));
// // // //
// // // // function isValidUserNode(node) {
// // // //     // 排除系统消息
// // // //     if(node.desc.includes("本平台仅提供")) return false;
// // // //
// // // //     // 验证节点结构
// // // //     const children = node.children();
// // // //     return children.length >= 3 &&
// // // //         children[1].className() === "TextView" &&
// // // //         children[2].className() === "TextView";
// // // // }
// // // //
// // // //
// // // // // ================== 操作执行模块 ==================
// // // // function sendGreeting() {
// // // //     const btn = desc("打招呼").getOneNodeInfo(1000);
// // // //     if(btn && btn.click()) {
// // // //         logInteraction();
// // // //         return true;
// // // //     }
// // // //     return false;
// // // // }
// // // //
// // // //
// // // // function sendPrivateMessage(message) {
// // // //     if(clickPrivateButton() &&
// // // //         waitForChatWindow() &&
// // // //         inputMessage(message))
// // // //     {
// // // //         return clickSendButton();
// // // //     }
// // // //     return false;
// // // // }
// // // //
// // // // // ================== 数据库模块 ==================
// // // // function initDatabase() {
// // // //     const createTable = `
// // // //     CREATE TABLE IF NOT EXISTS interactions (
// // // //         user_id TEXT PRIMARY KEY,
// // // //         last_greet TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
// // // //         greet_count INTEGER DEFAULT 0
// // // //     )`;
// // // //
// // // //     if(!sqlite.execSql(createTable)) {
// // // //         throw new Error("数据库初始化失败");
// // // //     }
// // // // }
// // // //
// // // // function logInteraction(userId) {
// // // //     const upsert = `
// // // //     INSERT OR REPLACE INTO interactions
// // // //     (user_id, last_greet, greet_count)
// // // //     VALUES (?, CURRENT_TIMESTAMP,
// // // //     COALESCE((SELECT greet_count FROM interactions WHERE user_id = ?), 0) + 1)`;
// // // //
// // // //     return sqlite.execSql(upsert, [userId, userId]);
// // // // }
// // // //
// // //
// // // //
// // // // // ================== 主流程控制 ==================
// // // //
// // // //
// // // // function adaptClick(x, y) {
// // // //     return clickPoint(adaptX(x), adaptY(y));
// // // // }
// // // //
// // // // // 使用示例（原基于1080x2400的坐标）：
// // // // adaptClick(500, 2000); // 自动转换实际坐标
// // // // // ================== 坐标计算工具 ==================
// // // // function adaptPosition(x, y) {
// // // //     return {
// // // //         x: x * (device.getScreenWidth() / 1080),
// // // //         y: y * (device.getScreenHeight() / 2400)
// // // //     };
// // // // }
// // // //
// // // // // 使用示例（原坐标基于1080x2400设计稿）：
// // // // const originalPoint = { x: 500, y: 2000 };
// // // // const adaptedPoint = adaptPosition(originalPoint.x, originalPoint.y);
// // // // clickPoint(adaptedPoint.x, adaptedPoint.y);
// // // //
// // // // // ================== 应用控制模块 ==================
// // // // function safeLaunchApp(packageName) {
// // // //     for(let i=0; i<3; i++) {
// // // //         // 使用官方关闭应用API
// // // //         app.closeApp(packageName);
// // // //         sleep(1000);
// // // //
// // // //         const launched = utils.openApp(packageName);
// // // //         if(launched && waitForAppStart()) return true;
// // // //     }
// // // //     throw new Error("应用启动失败");
// // // // }
// // // //
// // // // function waitForAppStart() {
// // // //     return waitUntil(() => {
// // // //         handlePopups();
// // // //         return desc("陪聊").getOneNodeInfo(1000);
// // // //     }, 5000);
// // // // }
// // // //
// // // // // ================== 弹窗处理模块 ==================
// // // // function handlePopups() {
// // // //     const popupSelectors = [
// // // //         { desc: "同意", timeout: 1000 },
// // // //         { text: "我知道了", timeout: 800 },
// // // //         { id: "close_btn", timeout: 500 }
// // // //     ];
// // // //
// // // //     popupSelectors.forEach(selector => {
// // // //         const popup = findElement(selector);
// // // //         if(popup) {
// // // //             click(popup.bounds.centerX(), popup.bounds.centerY());
// // // //             sleep(selector.timeout);
// // // //         }
// // // //     });
// // // // }
// // // //
// // // //navigateToChatHome()
// // // //
// // // // // ================== 终止条件判断 ==================
// // // // function shouldTerminateLoop(users) {
// // // //     // 连续空屏超过阈值
// // // //     if (emptyCount >= SCROLL_CONFIG.emptyThreshold) {
// // // //         toast("连续空屏，终止处理");
// // // //         return true;
// // // //     }
// // // //
// // // //     // 已处理用户占比过高
// // // //     const totalUsers = processedUsers.size + users.length;
// // // //     if (totalUsers > 0 && users.length / totalUsers < 0.2) {
// // // //         toast("重复率过高，终止处理");
// // // //         return true;
// // // //     }
// // // //
// // // //     return false;
// // // // }
// // // //
// // // // // ================== 智能滑动控制 ==================
// // // // function smartSwipe() {
// // // //     // 执行滑动操作
// // // //     const swipeSuccess = swipeToPoint(
// // // //         SCROLL_CONFIG.swipeStart.x,
// // // //         SCROLL_CONFIG.swipeStart.y,
// // // //         SCROLL_CONFIG.swipeEnd.x,
// // // //         SCROLL_CONFIG.swipeEnd.y,
// // // //         SCROLL_CONFIG.swipeDuration
// // // //     );
// // // //
// // // //     if (!swipeSuccess) return false;
// // // //
// // // //     // 等待内容加载
// // // //     sleep(SCROLL_CONFIG.retryDelay);
// // // //
// // // //     // 验证滑动效果
// // // //     return validateSwipeResult();
// // // // }
// // // //
// // // // function validateSwipeResult() {
// // // //     // 方案1：检测列表底部标记
// // // //     if (desc("已经到底了")) return false;
// // // //
// // // //     // 方案2：对比屏幕内容
// // // //     const beforeSwipe = captureScreenHash();
// // // //     sleep(500);
// // // //     const afterSwipe = captureScreenHash();
// // // //
// // // //     return beforeSwipe !== afterSwipe;
// // // // }
// // // //
// // // // // ================== 工具函数 ==================
// // // // // 生成屏幕特征码（简单版）
// // // // function captureScreenHash() {
// // // //     return className("TextView").find().size().toString();
// // // // }
// // // //
// // // // // // ================== 执行入口 ==================
// // // // // function main() {
// // // // //     initDatabase();  // 数据库初始化
// // // // //     mainLoop();
// // // // //     sqlite.close();
// // // // // }
// // // // //
// // // // // main();
// // // //
// // // //
// // // //
// // // //
// // // //
// // // //
// // // //
// // // //
// // // //
// // // //
// // // //
// // // //         // 获取目标用户列表（示例数据）
// // // //         //const targetUsers = getTargetUsers();
// // // //
// // // //     //     // 处理每个用户
// // // //     //     for (const user of targetUsers) {
// // // //     //         // 过滤历史用户
// // // //     //         if (FilterConfig.historyUser && isHistoricalUser(user.id)) {
// // // //     //             logd(`跳过历史用户 ${user.name}`);
// // // //     //             continue;
// // // //     //         }
// // // //     //
// // // //     //         // 执行操作组合
// // // //     //         handleUserInteraction(user, {
// // // //     //             greet: FilterConfig.greet,
// // // //     //             privateMsg: FilterConfig.privateMsg,
// // // //     //             greetLimit,
// // // //     //             customMessage
// // // //     //         });
// // // //     //     }
// // // //     // } catch (e) {
// // // //     //     logd("执行失败：" + e.stack);
// // // //     //     showToast("执行出错：" + e.message);
// // // //     // }
// // // //     // }
// // // //
// // // //     // 判断是否历史用户
// // // //     function isHistoricalUser(userId) {
// // // //         const sql = `SELECT interaction_status
// // // //                    FROM user_interaction
// // // //                    WHERE user_id = ?`;
// // // //         const result = sqlite.query(sql, [userId]);
// // // //         return result.length > 0 && result[0].interaction_status !== 0;
// // // //     }
// // // //
// // // //     // 处理用户交互
// // // //     function handleUserInteraction(userId, config) {
// // // //         let greetCount = 0;
// // // //
// // // //         try {
// // // //             // 执行打招呼
// // // //             if (config.greet) {
// // // //                 greetCount = performGreeting(user.id, config.greetLimit);
// // // //                 logd(`已向 ${user.name} 打招呼 ${greetCount} 次`);
// // // //             }
// // // //
// // // //             // 执行私信
// // // //             if (config.privateMsg) {
// // // //                 const messages = config.customMessage.split('\n');
// // // //                 messages.forEach(msg => {
// // // //                     if (sendPrivateMessage(user.id, msg.trim())) {
// // // //                         updateMessageCount(user.id);
// // // //                     }
// // // //                 });
// // // //             }
// // // //
// // // //             // 更新交互状态
// // // //             updateInteractionStatus(user.id);
// // // //         } catch (e) {
// // // //             logd(`用户 ${user.name} 处理失败：${e.message}`);
// // // //         }
// // // //     }
// // // //
// // // //     // 执行打招呼逻辑
// // // //     function performGreeting(userId, limit) {
// // // //         let successCount = 0;
// // // //         const currentGreetCount = getCurrentGreetCount(userId);
// // // //
// // // //         for (let i = 0; i < limit - currentGreetCount; i++) {
// // // //             if (clickGreetButton()) {
// // // //                 sqlite.execute(
// // // //                     `UPDATE user_interaction
// // // //                      SET greet_count = greet_count + 1,
// // // //                          last_greet_time = datetime('now')
// // // //                      WHERE user_id = ?`,
// // // //                     [userId]
// // // //                 );
// // // //                 successCount++;
// // // //                 sleep(500); // 操作间隔
// // // //             }
// // // //         }
// // // //         return successCount;
// // // //     }
// // // //
// // // //     // 发送私信消息
// // // //     function sendPrivateMessage(userId, message) {
// // // //         if (!message) return false;
// // // //
// // // //         clickPrivateMsgButton();
// // // //         inputText(message);
// // // //         if (clickSendButton()) {
// // // //             sqlite.execute(
// // // //                 `UPDATE user_interaction
// // // //                  SET message_count = message_count + 1,
// // // //                      last_message_time = datetime('now')
// // // //                  WHERE user_id = ?`,
// // // //                 [userId]
// // // //             );
// // // //             return true;
// // // //         }
// // // //         return false;
// // // //     }
// // // //
// // // //     // 数据库操作方法
// // // //     function getCurrentGreetCount(userId) {
// // // //         const result = sqlite.query(
// // // //             "SELECT greet_count FROM user_interaction WHERE user_id = ?",
// // // //             [userId]
// // // //         );
// // // //         return result.length > 0 ? result[0].greet_count : 0;
// // // //     }
// // // //
// // // //     function updateInteractionStatus(userId) {
// // // //         sqlite.execute(
// // // //             `INSERT OR REPLACE INTO user_interaction
// // // //              (user_id, interaction_status)
// // // //              VALUES (?, 1)`,
// // // //             [userId]
// // // //         );
// // // //     }
// // // //
// // // // var tableName = "tbl_user";
// // // // var sql = "select * from " + tableName;
// // // // var data = sqlite.query(sql);
// // // // logd("data result：" + JSON.stringify(data));
// // //
// // //
// // // //
// // // //
// // // // // ================== 操作工具函数 ==================
// // // //     function safeClick(point) {
// // // //         logd(`尝试点击坐标: (${point.x}, ${point.y})`);
// // // //         sleep(400);
// // // //         return clickPoint(point.x, point.y);
// // // //     }
// // // //
// // // //
// // // //
// // // // // ================== 循环控制配置 ==================
// // // // const SCROLL_CONFIG = {
// // // //     maxLoop: 3,                // 最大循环次数
// // // //     swipeStart: {x: 400, y: 2000}, // 滑动起始点
// // // //     swipeEnd: {x: 600, y: 790},    // 滑动结束点
// // // //     swipeDuration: 300,         // 滑动时长(ms)
// // // //     retryDelay: 1500,           // 滑动后等待加载
// // // //     emptyThreshold: 3           // 连续空屏次数限制
// // // // };
// // // //
// // // // ================== 全局状态记录 ==================
// // // //let processedUsers = new Set();  // 已处理用户记录
// // // //let emptyCount = 0;              // 连续空屏计数器
// // //
// // // // // ================== 增强型主循环 ==================
// // // // function mainLoop() {
// // // //     for (let loop = 0; loop < SCROLL_CONFIG.maxLoop; loop++) {
// // // //         logd(`开始第 ${loop + 1} 次循环处理`);
// // // //
// // // //         // 处理当前屏幕
// // // //         const currentUsers = greetOrPrivateMsg();
// // // //         updateProcessedUsers(currentUsers);
// // // //
// // // //         }
// // // //     }
// // // //
// // // //
// // // //
// // //
// // // //
// // // // const HOT_USER_CACHE = new LRU(100); // 保留最近100个用户
// // // //
// // // // function checkHotUser(uid) {
// // // //     if (HOT_USER_CACHE.has(uid)) {
// // // //         return HOT_USER_CACHE.get(uid);
// // // //     }
// // // //     const dbResult = queryUser(uid);
// // // //     HOT_USER_CACHE.set(uid, dbResult);
// // // //     return dbResult;
// // // // }
// // //
// // //
// // // //captureValidUsers()
// // //
// // // //2025 4 5
// // //
// // // // function greetOrPrivateMsg(){
// // // //
// // // //         // 读取配置参数
// // // //         // const ReplyConfig = parseReplyConfig();
// // // //         // const FilterConfig = parseFilterConfig();
// // // //         // const customMessage = readConfigString("customMessage");
// // // //         // const greetLimit = readConfigInt("greetLimit");
// // // //
// // // //         // // 验证必要参数
// // // //         // if (FilterConfig.greet && greetLimit <= 0) {
// // // //         //     throw new Error("打招呼次数限制必须大于0");
// // // //         // }
// // // //
// // // //         //进入陪聊界面
// // // //         var peiLiaoNode = desc("陪聊").bounds(0, 2100, 500, 2500).getOneNodeInfo(5000);
// // // //
// // // //         //logd("" + appIsRuning);
// // // //         if (peiLiaoNode) {
// // // //             // if (closePopups()) {
// // // //             // logd("检测并关闭弹窗成功");
// // // //
// // // //             //}
// // // //             var x = peiLiaoNode.click();
// // // //             sleep(random(400, 600));
// // // //             //logd(x);
// // // //         } else {
// // // //             toast("请回到首页陪聊页面");
// // // //         }
// // // //
// // // //         //获取页面用户数据
// // // //         const LIST_BOUNDS_PEILIAO = {left: 0, top: 336, right: 1080, bottom: 2272};
// // // //
// // // //         // [0,336][1080,2272]
// // // //
// // // //
// // // //         const currentUsersPeiliao = [];
// // // //         // 获取消息列表容器
// // // //         const PeiLiaolistContainer = bounds(
// // // //             LIST_BOUNDS_PEILIAO.left,
// // // //             LIST_BOUNDS_PEILIAO.top,
// // // //             LIST_BOUNDS_PEILIAO.right,
// // // //             LIST_BOUNDS_PEILIAO.bottom
// // // //         ).getNodeInfo(3000);
// // // //
// // // //         if (!PeiLiaolistContainer) {
// // // //             toast("消息列表未找到");
// // // //             return;
// // // //         }
// // // //
// // // //         logd(JSON.stringify(PeiLiaolistContainer))
// // // //         // 遍历所有子节点（带进度提示）
// // // //         // 获取有效用户列表
// // // //         const validUsersPeiliao = [];
// // // //         const allNodesPeiliao = PeiLiaolistContainer || [];
// // // //
// // // //
// // // //         toast(`共发现 ${allNodesPeiliao.length} 个节点`);
// // // //
// // // //         allNodesPeiliao.forEach((node, index) => {
// // // //             try {
// // // //                 logd(`处理节点 ${index + 1}/${allNodesPeiliao.length}`);
// // // //
// // // //                 // 节点基础验证
// // // //                 if (!node || !node.desc) {
// // // //                     logd("忽略无描述节点");
// // // //                     return;
// // // //                 }
// // // //
// // // //                 // 解析用户信息
// // // //                 const userInfoPeiliao = parseNodeInfo(node, index);
// // // //                 logd(JSON.stringify(userInfoPeiliao.name));
// // // //                 if (!userInfoPeiliao.valid) {
// // // //                     logd(`无效用户: ${userInfoPeiliao.reason}`);
// // // //                     return;
// // // //                 }
// // // //
// // // //                 // 存储有效用户
// // // //                 validUsers.push({
// // // //                     name: userInfoPeiliao.name,
// // // //                     position: index + 1,
// // // //                     clickPoint: calculateClickPoint(node.bounds),
// // // //                     rawInfo: userInfoPeiliao  // 调试用原始信息
// // // //                 });
// // // //
// // // //                 logd(`[有效用户] ${userInfoPeiliao.name} 坐标: ${JSON.stringify(node.bounds)}`);
// // // //             } catch (e) {
// // // //                 loge(`节点[${index}]处理失败: ${e.message}`);
// // // //             }
// // // //         });
// // // //     return currentUsersPeiliao.filter(u => !processedUsers.has(u.id));
// // // //
// // // //     }
// // // //
// // // // //=============== 节点解析函数 ==================
// // // //     function parseNodeInfo(node, index) {
// // // //         // 基础验证
// // // //         if (!node || !node.desc) {
// // // //             logd(`节点[${index}] 无描述信息`);
// // // //             return { valid: false };
// // // //         }
// // // //
// // // //         // 排除系统消息
// // // //         const rawText = node.desc.trim();
// // // //         if (isSystemMessage(rawText)) {
// // // //             logd(`节点[${index}] 系统消息: ${rawText.slice(0, 20)}...`);
// // // //             return { valid: false };
// // // //         }
// // // //
// // // //         // 解析消息结构
// // // //         const parts = rawText.split('\n');
// // // //         if (parts.length < 3) {
// // // //             logd(`节点[${index}] 格式异常: ${rawText.slice(0, 30)}...`);
// // // //             return { valid: false };
// // // //         }
// // // //
// // // //         return {
// // // //             valid: true,
// // // //             name: parts[0].trim(),
// // // //             time: parts[1].trim(),
// // // //             message: parts.slice(2).join('\n'),
// // // //             bounds: node.bounds
// // // //         };
// // // //     }
// // // //
// // // // // ================== 系统消息检测 ==================
// // // //     function isSystemMessage(text) {
// // // //         return text.includes("本平台") ||
// // // //             text.includes("官方") ||
// // // //             text.match(/【.+】/);
// // // //     }
// // // //
// // // //
// // // //
// // // // 提示词：
// // // // 我使用easyclick 11.11,现在我正编写一个自动回复消息的程序，我需要进入聊天页面后，识别到最近的用户消息，要怎么做？ 在depth 11层，desc节点，是可以看到“ 17:28 看到你的动态，喜欢” 这样的消息内容；在第11层，还有很多的干扰信息，系统的内容，比如有：认证状态： 基本资料： 39岁 | 165cm | 56kg | 导购员 个人相册：，嗨，我有幸认识你吗，你好呀!，有一个特征是longclickable属性，其他的系统消息为false; 还有，我需要如何来分辨识别出来的哪些是对方发的消息；在sqlite的表中，存储了一些历史用户记录，你需要写程序识别聊天内容，并且写入到数据库的表中，我需要用来提取关键词，消息内容来进行实现自动回复功能
// // // //
// // // // //
// // // //
// // // //     const rawNodes = getListNodeContainer();
// // // //
// // // //
// // // //     rawNodes.forEach((node, index) => {
// // // //         try {
// // // //             const userInfo = parseUserNode(node);
// // // //             if (!userInfo.valid) return;
// // // //
// // // //             // 数据库校验
// // // //             if (isProcessedUser(userInfo.uid)) {
// // // //                 logd(`跳过已处理用户：${userInfo.name}`);
// // // //                 return;
// // // //             }
// // // //
// // // //
// // // //             validUsers.push(userInfo);
// // // //
// // // //             // 实时记录处理进度
// // // //             updateProcessingLog(userInfo);
// // // //         } catch (e) {
// // // //             loge(`节点[${index}]处理失败：${e.message}`);
// // // //         }
// // // //     });
// // // //
// // // //     return validUsers;
// // // // }
// // //
// // // // image.useOpencvMat(1);
// // // // let screenImage = image.captureFullScreen();
// // // // image.setFindColorImageMode(2)
// // // // if (!_isNull(screenImage)) {
// // // //     let firstColor = "#FA5151-#101010";
// // // //     let points = screenImage.findColor(firstColor, 0.9, 115, 250, 215, 2210, 1, 2);
// // // //     //这玩意是个数组
// // // //     if (points) {
// // // //         logd("points " + JSON.stringify(points));
// // // //         clickPoint(points[0].x-10,points[0].y+20)
// // // //         sleep(500);
// // // //     }
// // // //     //图片要回收
// // // //     screenImage.recycle()
// // // // }
// // // //
// // // //
// // // //
// // // // image.useOpencvMat(1);
// // // // let screenImage = image.captureFullScreen();
// // // // if (screenImage != null) {
// // // //     image.setFindColorImageMode(1)
// // // //     let firstColor = "#FA5151-#101010";
// // // //     let points = image.findColor(screenImage, firstColor, 0.9, 115, 250, 400, 2210, 2, 2);
// // // //     //这玩意是个数组
// // // //     if (points) {
// // // //         logd("points " + JSON.stringify(points));
// // // //         clickPoint(points[0].x-10,points[0].y+20)
// // // //         sleep(500);
// // // //     }
// // // //     //图片要回收
// // // //     image.recycle(screenImage)
// // // // }
// // //
// // //
// // //
// // // // searchColor()
// // //
// // // // // ================== 增强型资料卡验证 ==================
// // // // function verifyProfileCard(options = {}) {
// // // //     /**
// // // //      * @param {Object} options 验证配置
// // // //      * @param {number} [options.timeout=800] 总体验证时长(ms)
// // // //      * @param {number} [options.checkInterval=200] 检查间隔时间(ms)
// // // //      * @param {boolean} [options.debug=false] 是否输出调试信息
// // // //      */
// // // //
// // // //     //
// // // //     const VALIDATION_CONDITIONS = [
// // // //         // 国内版验证条件
// // // //         [
// // // //             descMatch(/.*所在地.*/),
// // // //             desc("私信"),
// // // //             //desc("打招呼"),
// // // //             //desc("视频语音")
// // // //         ]
// // // //     ];
// // // //
// // // //     let hasMatched = false;
// // // //     const startTime = Date.now();
// // // //
// // // //     // 动态超时控制逻辑
// // // //     while (Date.now() - startTime < (options.timeout || 800) && !hasMatched) {
// // // //         hasMatched = VALIDATION_CONDITIONS.some(conditionSet =>
// // // //             conditionSet.every(selector => {
// // // //                 //
// // // //                 const node = selector.getOneNodeInfo((options.checkInterval || 200) / 2);
// // // //                 return node;
// // // //             })
// // // //         );
// // // //
// // // //         // 调试信息输出优化
// // // //         if (options.debug) {
// // // //             const elapsed = Date.now() - startTime;
// // // //             logd(`[${elapsed}ms] 验证状态: ${hasMatched ? '✅ 已匹配' : '🔄 检测中'}`);
// // // //             sleep(50);
// // // //         } else {
// // // //             sleep(options.checkInterval || 200);
// // // //         }
// // // //     }
// // // //
// // // //     if (options.debug) {
// // // //         logd(hasMatched ?
// // // //             "✅ 验证通过，匹配到完整资料卡元素" :
// // // //             `❌ 验证失败，未能在${options.timeout || 800}ms内检测到所有元素`);
// // // //     }
// // // //
// // // //     return hasMatched;
// // // //  }
// // // // // ================== 安全操作函数 ==================
// // // // function safeClickNode(node) {
// // // //     try {
// // // //         // 优先使用节点自带的点击方法
// // // //         if (node.click()) return true;
// // // //
// // // //         // 备用坐标点击方案
// // // //         const center = node.bounds.center();
// // // //         logd(`使用坐标点击: (${center.x}, ${center.y})`);
// // // //         return clickPoint(center.x, center.y);
// // // //     } catch (e) {
// // // //         loge(`节点点击失败: ${e.message}`);
// // // //         return false;
// // // //     }
// // // // }
// // // // //
// // // // function pressBackWithRetry(max = 3) {
// // // //     for (let i = 0; i < max; i++) {
// // // //         if (verifyChatWindow()) return true;
// // // //         pressBack();
// // // //         sleep(800);
// // // //     }
// // // //     return false;
// // // // }
// // //
// // // function verifyChatWindow() {
// // //     return desc("发送").exists() &&
// // //         className("EditText").exists();
// // // }
// // //
// // //
// // // // var youngerNode = desc("消息").getOneNodeInfo(100);
// // // // if (youngerNode) {
// // // //     youngerNode.click()
// // // //     logd(JSON.stringify(youngerNode.bounds))
// // // // }
// // // //主界面下滑到顶
// // // //
// // // // var swipeToup1 = swipeToPoint(400, 600, 600, 1000, 400);
// // // // sleep(2000);
// // // //
// // // // //消息页面，点进用户窗口
// // // // //把小助手上滑
// // // // var swipDistance200 = swipeToPoint(400, 1000, 600, 790, 400);
// // // // sleep(700);
// // // //
// // // // //点击消息列表，进入用户聊天界面
// // // // var chatListNode = bounds(0,436,1080,2272).getNodeInfo(1000);
// // // // if(chatListNode){
// // // //     for (let i = 0; i < chatListNode.length; i++) {
// // // //         logd(JSON.stringify(chatListNode[i].desc))
// // // //         logd(JSON.stringify(chatListNode[i].index))
// // // //         logd(JSON.stringify(chatListNode[i].bounds))
// // // //
// // // //     }
// // // //
// // // // }
// // // //
// // // // var result = clickPoint(400, 600);
// // // //         if (result) {
// // // //             toast("点击成功");
// // // //         } else {
// // // //             toast("点击失败");
// // //
// // // //点击矩形内随机区域 下为第一个用户位置
// // // // var rect = new Rect();
// // // // rect.left = 10;
// // // // rect.right = 400;
// // // // rect.top = 649;
// // // // rect.bottom = 860;
// // // // var result1 = clickRandomRect(rect);
// // // // if (result1) {
// // // //     toast("点击成功");
// // // // } else {
// // // //     toast("点击失败");
// // // // }
// // //
// // // //实现读取ID后，返回聊天界面
// // //
// // // // 条件一：如果在消息在顶端，通过点击查找认证状态，进入资料卡，读取ID后返回聊天界面
// // // // //上滑到底端
// // // // swipeToPoint(1000, 1800, 800, 400, 400)
// // // // sleep(500);
// // // // swipeToPoint(1000, 1800, 800, 400, 400)
// // //
// // //
// // // //否则，代表已经是聊过天的用户，点击左边头像区域，点击矩形内随机区域 下为第一个用户位置
// // // //     while(phoneNode)
// // // //         var phoneNode = desc("通话").getOneNodeInfo(100);
// // // //         var rect = new Rect();
// // // //         rect.left = 29;
// // // //         rect.right = 167;
// // // //         rect.top = 260;
// // // //         rect.bottom = 1800;
// // // //         var result2 = clickRandomRect(rect);
// // // //
// // // //
// // // //
// // // //
// // // // }
// // // // ================== 使用示例 ==================
// // // //findProfileWithCall();
// // //
// // // //     var nodeidtest = clz("android.widget.ScrollView").getOneNodeInfo(1000);
// // // // //logd(JSON.stringify(nodeidtest))
// // // //     if (nodeidtest) {
// // // //         var childnode0 = nodeidtest.child(1)
// // // //         //logd(JSON.stringify(childnode0))
// // // //         var nextsibid = childnode0.nextSiblings()
// // // //         var userId = nodeidtest.child(1).desc
// // // //         logd(JSON.stringify(userId))
// // // //     }
// // //
// // //
// // //
// // // //
// // // // var result = longClickPoint(400, 800);
// // // // if (result) {
// // // //     toast("点击成功");
// // // // } else {
// // // //     toast("点击失败");
// // // // }
// // // //
// // // // var result = press(500, 600, 5000);
// // // // if (result) {
// // // //     toast("长按成功");
// // // // } else {
// // // //     toast("长按失败");
// // // // }
// // //
// // //
// // // //第一个用户在最顶端了，开始循环
// // //
// // // // let db = initDatabase();
// // // // if (!db) return;
// // //
// // // // // 主循环
// // // // setInterval(() => {
// // // //     try {
// // // //
// // // //
// // // //
// // // //
// // // //
// // // //
// // // //
// // // //
// // // //             // 获取用户ID
// // // //             let userId = getUserId();
// // // //             if (!userId || userId === "unknown") return;
// // // //
// // // //             // 检查互动状态
// // // //             let res = db.rawQuery(`
// // // //                 SELECT interaction_status
// // // //                 FROM user_interaction
// // // //                 WHERE user_id = ?
// // // //             `, [userId]);
// // // //
// // // //             // 执行互动逻辑
// // // //             if (!res.rows.length || res.rows[0].interaction_status < 1) {
// // // //                 // 打招呼逻辑
// // // //                 logInteraction(db, userId, 'greet');
// // // //                 click(desc("打招呼按钮"));
// // // //                 sleep(1000);
// // // //             }
// // // //
// // // //             if (shouldSendMessage(res.rows[0])) {
// // // //                 // 私信逻辑
// // // //                 logInteraction(db, userId, 'message');
// // // //                 sendPrivateMessage();
// // // //             }
// // // //
// // // //             // 监听消息
// // // //             let messages = className("ListView").findOne(1000);
// // // //             if (messages) {
// // // //                 messages.children().forEach(msgNode => {
// // // //                     let text = msgNode.desc();
// // // //                     cacheMessage(db, userId, text, isOwnMessage(text));
// // // //                 });
// // // //             }
// // // //         }
// // // //     } catch (e) {
// // // //         loge("主循环错误: " + e.message);
// // // //     }
// // // // }, 5000); // 每5秒检查一次
// // //
// // //
// // // //
// // // //     var index0 = index(0).getOneNodeInfo(1000)
// // // //     if (index0) {
// // // //         logd(JSON.stringify(index0))
// // // //     }
// // // //
// // // //     //
// // // //     // var assistantInTopNode = descMatch(".*小助手.*").getOneNodeInfo(0)
// // // //     // logd(JSON.stringify(assistantInTopNode))
// // // //
// // // //
// // // //
// // // //     //在消息界面，点击最上面一条消息，如果是小助手，则到下一条消息
// // // //
// // // //     //for循环，index(0).getOneNodeInfo(1000); index 从0到8，如果descMatch(".*小助手.*")getOneNodeInfo(0)为真则跳过
// // // //     //否则执行，index(0).bounds()getOneNodeInfo(1000)
// // // //
// // // //     idtest = id("com.gibb.easyclick:id/st_ctrl_iv");
// // // //     logd(!idtest)
// // // //     for (let j = 1; j < 9; j++) {
// // // //         var nodeindex0 = index(j).bounds(0, 300, 1080, 2272).getNodeInfo(10000)
// // // //         for (let i = 0; i < nodeindex0.length; i++) {
// // // //             logd('j'+j)
// // // //             logd(JSON.stringify(nodeindex0[i]))
// // // //         }
// // // // }
// // // //
// // // //
// // // //         indexUserNode = index(0).bounds(0,300,1080,2272).getOneNodeInfo(1000) //获取索引的节点
// // // //     if (indexUserNode){
// // // //         indexUserNode.click() //点击
// // // //     }
// // // //
// // // //
// // // //     //获取资料卡,点击进入
// // // //     var infonode = descMatch(".*认证状态.*").getOneNodeInfo(0)
// // // //     logd(JSON.stringify(infonode))
// // // //     if(infonode){
// // // //         infonode.click()
// // // //     }
// // // //
// // // //     //获取用户ID
// // // //     var idnode = clz(android.widget.ScrollView)
// // // //         .child(0).clz(android.view.View)
// // // //         .nextSiblings().clz(android.widget.ImageView)
// // // //         .getOneNodeInfo()
// // // //     //.nextSiblings().clz(android.widget.ImageView)
// // // //     logd(JSON.stringify(idnode))
// // // //
// // // //
// // // //     var idnode1 =  clz(android.widget.ScrollView).child().getOneNodeInfo(0)
// // // //     logd(JSON.stringify(idnode1))
// // // //     if(idnode1){
// // // //         let x = idnode1.previousSiblings()
// // // //
// // // //         for (let i = 0; i < x.length; i++) {
// // // //             logd(x[i])
// // // //         }
// // // //     }
// // // //
// // // //     //左上角返回
// // // //     var returnpre = clickable(true).bounds(0,0,300,300).getOneNodeInfo(0)
// // // //     if(returnpre){
// // // //         logd(JSON.stringify(returnpre))
// // // //         returnpre.click()
// // // //     }
// // // //
// // // //
// // // //
// // // //
// // // //
// // // //
// // // //
// // // //     //多属性匹配 点击消息
// // // //     var nodemessege1 = index(1).longClickable(true).bounds(0,600,1200,900).getOneNodeInfo(1000)
// // // //     logd(JSON.stringify(nodemessege1))
// // // //     nodemessege1.click
// // // //
// // // //     //多属性匹配 点击消息 边界：顶325-底2243
// // // //     var nodemessege1 = index(4).longClickable(true).bounds(0,325,1200,2243).getOneNodeInfo(1000)
// // // //     logd(JSON.stringify(nodemessege1))
// // // //     if(nodemessege1) {
// // // //         nodemessege1.click()
// // // //     }
// // // //     sleep(2000);
// // // //
// // // //
// // // //     //获取资料卡,点击进入
// // // //     var infonode = descMatch(".*认证状态.*").getOneNodeInfo(0)
// // // //     logd(JSON.stringify(infonode))
// // // //     if(infonode){
// // // //         infonode.click()
// // // //     }
// // // //
// // // //     var nodeidtest = clz("android.widget.ScrollView").getOneNodeInfo(1000);
// // // //     //logd(JSON.stringify(nodeidtest))
// // // //     if (nodeidtest) {
// // // //         var childnode0 = nodeidtest.child(1)
// // // //         //logd(JSON.stringify(childnode0))
// // // //         var nextsibid = childnode0.nextSiblings()
// // // //         var id = nodeidtest.child(1).desc
// // // //         logd(JSON.stringify(id))
// // // //         }
// // // //
// // // //
// // // //
// // // //
// // // //
// // // //     //utils.openApp("com.xitong.xtapp")
// // // //     //if (delay === undefined) delay = 5; // 用户未传值时使用默认5秒
// // // //     //启动后会弹出三个界面，需要清除
// // // //     //node[@clz='android.widget.FrameLayout']/node[@clz='android.widget.LinearLayout']/node[@clz='android.widget.FrameLayout']/node[@clz='android.widget.FrameLayout']/node[@clz='android.view.View']/node[@clz='android.view.View']/node[@clz='android.view.View']/node[@clz='android.view.View']/node[@clz='android.widget.ImageView' and @index=10]
// // // //     /*while (true) {
// // // //         sx()
// // // //     }*/
// // //
// // // // test = require("./laoleng.js")
// // // // logd(test.c());
// // // // getRunningPkgEx()
// // //
// // //
// // // // 记录打招呼
// // // // logInteraction(userId, 'greet');
// // //
// // // // 记录私信
// // // //logInteraction(userId, 'message');
// // // //发消息
// // //
// // // // 存储消息
// // // // cacheMessage(userId, "昨天 21:30 你好呀！", false);
// // // // cacheMessage(userId, "[自动回复] 欢迎联系", true);
// // // //var userId = 13085094
// // // //cacheMessage(userId, "[自动回复] 欢迎联系", true);
// // // // 查询数据
// // // // const result = sqlite.query(`
// // // //     SELECT u.userId, m.content
// // // //     FROM user_interaction u
// // // //              JOIN message_history m ON u.userId = m.userId
// // // //     ORDER BY m.timestamp DESC LIMIT 10
// // // // `);
// // // //
// // // // logd("查询结果:", JSON.stringify(result));
// // //
// // // //var userId = 13085094
// // // // let res = db.rawQuery(`
// // // // //                 SELECT interaction_status
// // // // //                 FROM user_interaction
// // // // //                 WHERE user_id = ?
// // // // //             `, [userId]);
// // // //
// // // // logd("查询结果:", JSON.stringify(res));
// // //
// // // // sqlite.close();
// // // //
// // // //
// // // // const currentPkg = getCurrentPackage();
// // // // console.log("当前包名:", currentPkg);
// // //
// // // // 聊天消息界面
// // // // clz(android.view.View).bounds(0, 254, 1080, 2079);
// // // //
// // // // //返回左箭头
// // // // clz(android.view.View).bounds(0, 0, 1080, 254)
// // // // clz(android.widget.imageView).bounds(0, 100, 154, 254)
// // // //
// // // // var messageContent = bounds(0, 540, 1080, 726).getOneNodeInfo(1000)
// // // // if (messageContent) {
// // // //     logd(messageContent.desc);
// // // // }
// // // // var messageContent2 = bounds(0, 254, 1080, 1981).getNodeInfo(1000)
// // // // if (messageContent2) {
// // // //     for (let i = 0; i < messageContent2.length; i++) {
// // // //         logd(JSON.stringify(messageContent2[i].desc))
// // // //     }
// // // //
// // // // }
// // //
// // //
// // // // function handleLaunchFailure() {
// // // //     // 收集调试信息
// // // //     const debugInfo = {
// // // //         time: new Date().toISOString(),
// // // //         screen: images.captureScreen(),
// // // //         log: log.getHistory(50) // 获取最近50条日志
// // // //     };
// // // //
// // // //     // 尝试自动恢复
// // // //     for (let i = 0; i < 3; i++) {
// // // //         utils.kill(pkgName); // 强制结束进程
// // // //         sleep(1000);
// // // //         if (waitForAppLaunch(pkgName, 15)) return true;
// // // //     }
// // // //
// // // //     // 上报错误
// // // //     const reportCode = http.post("https://error-report.example.com", debugInfo).body;
// // // //     toast("启动失败，错误码：" + reportCode);
// // // //     exit();
// // // // }
// // //
// // // //
// // // // // 主处理循环
// // // // let retryCount = 0;
// // // // while(retryCount < MAX_RETRY) {
// // // //     if(processMainFlow(config)) {
// // // //         retryCount = 0;
// // // //     } else {
// // // //         retryCount++;
// // // //     }
// // // //     swipeToPoint(500,2000,600,500,600);
// // // // }
// // //
// // //
// // // // // 在脚本初始化时申请必要权限
// // // // function initPermissions() {
// // // //     const requiredPermissions = [
// // // //         "android.permission.GET_TASKS",
// // // //         "android.permission.PACKAGE_USAGE_STATS"
// // // //     ];
// // // //
// // // //     requiredPermissions.forEach(perm => {
// // // //         if (!hasPermission(perm)) {
// // // //             requestPermission(perm);
// // // //         }
// // // //     });
// // // // }
// // //
// // //
// // //
// // // // /**
// // // //  * 等待目标APP启动的完整解决方案
// // // //  * @param {string} pkgName 应用包名
// // // //  * @param {number} [timeout=30] 超时时间(秒)
// // // //  * @param {number} [checkInterval=1000] 检测间隔(毫秒)
// // // //  * @returns {boolean} 是否启动成功
// // // //  * @returns {string} 包名或"unknown"
// // // //  */
// // // // function waitForAppLaunch(pkgName, timeout = 30) {
// // // //     let isLaunched = false;
// // // //     const startTime = Date.now();
// // // //     utils.openApp(pkgName)
// // // //     // 使用 EasyClick 原生定时器方案
// // // //     const checkTask = setInterval(() => {
// // // //         if (getCurrentPackage() === pkgName) {
// // // //             sleep(3000); // 确保界面加载
// // // //             if (verifyUIComponents()) {
// // // //                 isLaunched = true;
// // // //                 clearInterval(checkTask);
// // // //             }
// // // //         }
// // // //
// // // //         if (Date.now() - startTime > timeout * 1000) {
// // // //             clearInterval(checkTask);
// // // //         }
// // // //     }, 1000);
// // // //
// // // //     // 同步等待结果
// // // //     while (true) {
// // // //         if (isLaunched || Date.now() - startTime > timeout * 1000) {
// // // //             break;
// // // //         }
// // // //         sleep(500);
// // // //     }
// // // //
// // // //
// // // //     if (!isLaunched) {
// // // //         loge(pkgName + " 启动超时");
// // // //         return false;
// // // //     }
// // // //     return true;
// // // // }
// // // //
// // // // // 包名检测 + 界面元素双重验证
// // // // function verifyUIComponents() {
// // // //     const requiredIds = ["com.xitong.xtapp:id/homeTab", "com.xitong.xtapp:id/navBar"];
// // // //     return requiredIds.every(id => selector().id(id).getOneNodeInfo(2000));
// // // // }
// // // //

//20250408
//查询为数据库的互动信息

//let userStatus = getUserStatus(userId);
//logd("用户状态"+ userStatus)

//
// if(FilterConfig.historyUser && (userStatus == "historical" || userStatus == "today"))
//
// {
//     logd("历史用户，路过")
//     back()
//     sleep(600);
//     return
// }
// else if(FilterConfig.todayUser && userStatus == "today")
// {
//     logd("今日用户，忽略")
//     back()
//     sleep(600);
//     return
// }
// else if((!FilterConfig.historyUser && !FilterConfig.todayUser) || (FilterConfig.historyUser && userStatus == "new") || (FilterConfig.todayUser && userStatus == "new" ||userStatus == "historical") ) {
//     if (FilterConfig.privateMsg && FilterConfig.greet) {
//         let message = getPrivateMsgRandomMessage();
//         handleGreetAndSendPrivateMsgInProfileCard(userId,message)
//     }
//     else if (FilterConfig.greet) {
//         handleGreetInProfileCard()
//         logInteraction(userId, 'greet')
//         sleep(600);
//         back()
//         sleep(600);
//     }
//     else if (FilterConfig.privateMsg) {
//         let message = getPrivateMsgRandomMessage();
//         sendPrivateMsgInProfileCard(userId,message)
//     }
// }




//
//     function handleGreetInteraction(userId, status) {
//         if (!FilterConfig.greet) return;
//
//         // 打招呼条件判断
//         const allowGreet = (
//             status.userStatus === "new" ||
//             (status.greetStatus === "none" && FilterConfig.privateMsg) ||
//             (!FilterConfig.historyUser && status.greetStatus === "historical")
//         );
//
//         if (allowGreet) {
//             executeGreet(userId);
//             updateGreetRecord(userId);
//         }
//     }
//
//     function handleMessageInteraction(userId, status) {
//         if (!FilterConfig.privateMsg) return;
//
//         // 私信条件判断
//         const allowMessage = (
//             status.userStatus === "new" ||
//             (status.messageStatus === "none" && FilterConfig.greet) ||
//             (!FilterConfig.todayUser && status.messageStatus === "today")
//         );
//
//         if (allowMessage) {
//             const message = getQualifiedMessage(userId);
//             message && sendPrivateMessage(userId, message);
//         }
//     }
//
//
//
//     // 优先处理过滤条件
//     if (shouldSkipHistoricalUser(userInteractionStatus)) {
//         handleUserSkip('历史用户');
//         return;
//     }
//
//     if (shouldSkipTodayUser(userInteractionStatus)) {
//         handleUserSkip('今日用户');
//         return;
//     }
//
//     // 有效用户处理流程
//     handleValidUser(userId, userInteractionStatus);
// }



// // 判断是否跳过历史用户
// function shouldSkipHistoricalUser(userInteractionStatus) {
//     return FilterConfig.historyUser &&
//         (userInteractionStatus.userStatus === USER_STATUS.HISTORICAL || userInteractionStatus.userStatus === USER_STATUS.TODAY);
// }
//
// // 判断是否跳过今日用户
// function shouldSkipTodayUser(userStatus) {
//     return FilterConfig.todayUser &&
//         userStatus === USER_STATUS.TODAY;
// }
//
// // 处理有效用户交互
// function handleValidUser(userId, userStatus) {
//     if (isNewUserScenario(userStatus)) {
//         handleNewUserInteraction(userId);
//     } else {
//         logd(`未处理用户状态: ${userStatus}`, 'warn');
//     }
// }


// // 判断是否新用户场景
// function isNewUserScenario(userStatus) {
//     // 未启用任何过滤时，处理所有用户（包括历史/今日/新用户）
//     if (!FilterConfig.historyUser && !FilterConfig.todayUser) {
//         return true;
//     }
//
//     // 启用过滤时，仅处理新用户或配置允许的历史用户
//     return (
//         userStatus === USER_STATUS.NEW ||
//         (FilterConfig.todayUser && userStatus === USER_STATUS.HISTORICAL) // ✅ 修正为 TODAY
//     );
// }
//


// 通用跳过处理
// function handleUserSkip(reason) {
//     logd(`用户过滤 - ${reason}，执行跳过操作`);
//     performNavigationBack();
// }

// 通用导航返回操作
// function performNavigationBack() {
//     back();
//     sleep(NAVIGATION_DELAY);
// }

// 增强型节点解析
// function parseUserNode(node) {
//     const userInfo = {
//         valid: false,
//         name: '',
//         uid: '',
//         lastActive: '',
//         interactionLevel: 0,
//         position: node.bounds
//     };
//
//     // 基础校验
//     if (!node.desc || node.desc.length < 5) return userInfo;
//
//     // 排除系统消息
//     if (isSystemMessage(node.desc)) {
//         logd("过滤系统消息节点");
//         return userInfo;
//     }
//
//     // 结构化解析
//     const metaData = extractUserMeta(node.desc);
//     if (!metaData) return userInfo;
//
//     // 组装有效信息
//     return {
//         valid: true,
//         name: metaData.name,
//         lastActive: metaData.time,
//         interactionLevel: calcInteractionLevel(metaData.message),
//         rawData: node.desc // 保留原始数据供调试
//     };
// }
//
// // 智能去重算法
// function deduplicateUsers(users) {
//     const uniqueMap = new Map();
//
//     users.forEach(user => {
//         // 优先使用系统ID
//         const uid = user.systemId || user.uid;
//
//         // 合并策略
//         if (uniqueMap.has(uid)) {
//             const existing = uniqueMap.get(uid);
//             if (user.interactionLevel > existing.interactionLevel) {
//                 uniqueMap.set(uid, user);
//             }
//         } else {
//             uniqueMap.set(uid, user);
//         }
//     });
//
//     return Array.from(uniqueMap.values());
// }
//
// initDeviceScaling()

//
// // ===== 核心分拣逻辑 =====
// function filterMessages(ocrResults) {
//     const myMessages = [];     // 自己发送的消息
//     const otherMessages = []; // 对方发送的消息
//
//     // // 消息时间戳缓存（用于关联消息内容与时间）
//     // let timeStamps = ocrResults.filter(item =>
//     //     /\d{1,2}:\d{2}/.test(item.label) &&
//     //     item.label.includes("昨天") || item.label.includes("今天")
//     // );
//
//     const timeRegex = /(?:\d{1,2}月\d{1,2}日)?\s*\d{1,2}:\d{2}/;
//     let timeStamps = ocrResults.filter(item =>
//         timeRegex.test(item.label) &&
//         (item.label.includes("昨天") || item.label.includes("今天"))
//     );
//         // 亲密度提取
//     const intimacyItem = ocrResults.find(item =>
//         item.label.includes("C") &&
//         item.x > 800 &&
//         item.y < 300
//     );
//     // 关键修复点：将错误的item改为intimacyItem
//     const intimacy = intimacyItem ? parseFloat(intimacyItem.label.replace(/[^0-9.]/g, '')) : 0;
//
//     // 遍历所有OCR结果
//     ocrResults.forEach(item => {
//         // 过滤系统消息（根据特征关键词）
//         if (isSystemMessage(item.label)) return;
//
//         // 消息内容判断（根据X坐标范围）
//         if (isMyMessage(item)) {
//             let timeMsg = findNearestTime(item, timeStamps, 'my');
//             myMessages.push(formatMessage(item, timeMsg));
//         } else if (isOtherMessage(item)) {
//             let timeMsg = findNearestTime(item, timeStamps, 'other');
//             otherMessages.push(formatMessage(item, timeMsg));
//         }
//     });
//
//     return { myMessages, otherMessages, intimacy };
// }
//
// // ===== 工具函数 =====
// // 系统消息判断（根据关键词黑名单）
// const SYSTEM_KEYWORDS = ['积分', '文明沟通', '收益', '认证'];
// function isSystemMessage(text) {
//     return SYSTEM_KEYWORDS.some(kw => text.includes(kw));
// }
//
// // // 自己发送的消息（X坐标在右侧区域）
// // function isMyMessage(item) {
// //     return item.x > 600 && item.width < 300; // 根据实际设备分辨率调整
// // }
// // 自己消息的判断条件（示例适用于1080p屏幕）
// function isMyMessage(item) {
//     return item.x > device.getScreenWidth() * 0.6; // 屏幕宽度60%右侧区域
// }
// // 对方消息（X坐标在左侧区域）
// function isOtherMessage(item) {
//     return item.x < 300 && item.width > 150;
// }

// // 查找最近的时间戳（基于Y轴位置）
// function findNearestTime(msgItem, timeStamps, type) {
//     const yThreshold = type === 'my' ? 700 : 1000; // 不同消息区域的时间位置差异
//     return timeStamps
//         .filter(t => Math.abs(t.y - msgItem.y) < yThreshold)
//         .sort((a,b) => a.y - b.y)[0]?.label || '未知时间';
// }
// function findNearestTime(msgItem, timeStamps, type) {
//     // 按Y轴差值小于50像素且时间标签在消息上方查找
//     return timeStamps
//         .filter(t => (msgItem.y - t.y) > 0 && (msgItem.y - t.y) < 50)
//         .sort((a,b) => b.y - a.y)[0]?.label || '未知时间';
// }

//
// // ===== 使用示例 =====
// const ocrData = [...]; // 替换为实际OCR数据
// const { myMessages, otherMessages, intimacy } = filterMessages(ocrData);
//
// logd("=== 我的消息 ===");
// myMessages.forEach(msg => logd(`[${msg.time}] ${msg.content}`));
//
// logd("\n=== 对方消息 ===");
// otherMessages.forEach(msg => logd(`[${msg.time}] ${msg.content}`));
//
// logd("\n亲密度:", intimacy);

