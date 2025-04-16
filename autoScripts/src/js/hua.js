//处理弹窗

// // ================== 弹窗配置中心 ==================
// const POPUP_CONFIG = {
//     // 防诈骗弹窗
//     fraudWarning: {
//         detect: () => descMatch(/.*(诈骗|风险).*/).getOneNodeInfo(300),
//         action: (node) => node.click(),
//         retry: 2,
//         priority: 1
//     },
//
//     // 青少年模式
//     teenMode: {
//         detect: () => descMatch(/.*(青少年|未成年).*/).getOneNodeInfo(300),
//         action: (node) => {
//             const closeBtn = bounds(node.bounds.right - 80, node.bounds.top + 30,
//                 node.bounds.right - 30, node.bounds.top + 80)
//                 .getNodeInfo(500);
//             closeBtn?.click();
//         },
//         retry: 3,
//         priority: 2
//     },
//
//     // 今日推荐弹窗
//     todayRecommend: {
//         detect: () => desc("今日不再提示").getOneNodeInfo(300),
//         action: (node) => {
//             const closeNode = node.parent().children()[2];
//             if (closeNode?.clickable()) {
//                 click(closeNode.bounds.centerX(), closeNode.bounds.centerY());
//             }
//         },
//         retry: 1,
//         priority: 3
//     },
//
//     // 通用弹窗
//     commonPopup: {
//         detect: () => descMatch(/^(我知道了|我已知晓|立即关闭)$/).getNodeInfo(300),
//         action: (node) => {
//             const clickX = node.bounds.centerX() + random(-5, 5);
//             const clickY = node.bounds.centerY() + random(-5, 5);
//             clickPoint(clickX, clickY);
//         },
//         retry: 2,
//         priority: 4
//     }
// };
//弹窗  防诈骗

// 如果有弹窗处理

//弹窗 青少年模式

function  handlePopups () {
    var jinRiTuiJianNode = desc("今日不再提示").getOneNodeInfo(10)
    if (jinRiTuiJianNode) {
        var closeJinrituijianNode = jinRiTuiJianNode.previousSiblings()[2];
        logd(JSON.stringify(closeJinrituijianNode));
        closeJinrituijianNode.click();
        sleep(random(400, 800))
    }


    var youngerNode1 = desc("我知道了").getOneNodeInfo(10);
    if (youngerNode1) {
        youngerNode1.click()
    }

    var youngerNode2 = desc("我已知晓").getOneNodeInfo(20);
    if (youngerNode2) {
        youngerNode2.click()
    }

    var shipinsupeiNode = desc("视频速配").getOneNodeInfo(20)
    if (shipinsupeiNode) {
        back()
        sleep(500);
        var jixutuichuNode = desc("继续退出").getOneNodeInfo(1000)
        if(jixutuichuNode){
            jixutuichuNode.click();
            sleep(random(400, 800))
        }

    }

}



// // ================== 智能关闭系统 ==================
// let handledPopups = new Set(); // 已处理弹窗缓存
//
// function closePopups() {
//     if (!shouldHandlePopup()) return; // 界面状态验证
//
//     const popupTypes = Object.keys(POPUP_CONFIG)
//         .sort((a, b) => POPUP_CONFIG[a].priority - POPUP_CONFIG[b].priority);
//
//     for (let i = 0; i < popupTypes.length; i++) {
//         const type = popupTypes[i];
//         if (handlePopupType(type)) {
//             logd(`成功处理 ${type} 弹窗`);
//             return true;
//         }
//     }
//     return false;
// }
//
// // ================== 核心处理逻辑 ==================
// function handlePopupType(type) {
//     const config = POPUP_CONFIG[type];
//     for (let i = 0; i < config.retry; i++) {
//         try {
//             const node = config.detect();
//             if (node && !handledPopups.has(node.id)) {
//                 config.action(node);
//                 if (verifyClose(node)) {
//                     handledPopups.add(node.id);
//                     return true;
//                 }
//             }
//         } catch (e) {
//             logw(`${type} 处理失败: ${e.message}`);
//         }
//         sleep(random(300, 700));
//     }
//     return false;
// }
//
// // ================== 验证函数 ==================
// function verifyClose(originalNode) {
//     // 二次验证策略
//     return Promise.race([
//         new Promise(res => setTimeout(() => res(false), 1500)),
//         new Promise(res => {
//             const check = () => !originalNode.refresh() || originalNode.bounds.isEmpty();
//             if (check()) return res(true);
//             setInterval(() => check() && res(true), 200);
//         })
//     ]);
// }
//
//
//
// // ================== 智能弹窗处理系统 ==================
// const POPUP_HANDLER = {
//     // 防诈骗弹窗（最高优先级）
//     fraud: {
//         detect: () => matchPopup([
//             { desc: /诈骗|风险/ },
//             { text: /谨防诈骗/ },
//             { bounds: [0.3, 0.4, 0.7, 0.6] } // 屏幕中心区域
//         ]),
//         action: node => smartClick(node, 'rightTop', 30),
//         retry: 2,
//         cooldown: 5000 // 5秒内不重复处理
//     },
//
//     // 青少年模式（次优先级）
//     teenMode: {
//         detect: () => matchPopup([
//             { desc: /青少年|未成年/ },
//             { id: 'age_confirm_close' }
//         ], { minWidth: 0.6 }), // 弹窗宽度需占屏60%以上
//         action: node => {
//             const closeBtn = findCloseButton(node, 'leftBottom');
//             closeBtn?.click();
//         },
//         retry: 3,
//         dynamicWait: true // 根据弹窗尺寸计算等待时间
//     },
//
//     // 视频速配弹窗
//     videoMatch: {
//         detect: () => matchPopup([
//             { desc: '视频速配' },
//             { text: '继续退出' },
//             { depth: [12, 15] } // 控件层级范围
//         ]),
//         action: node => handleComplexPopup(node),
//         recovery: () => back(), // 备用恢复操作
//         priority: 2
//     },
//
//     // 通用弹窗（最低优先级）
//     common: {
//         detect: () => matchPopup([
//             { desc: /我知道了|我已知晓|立即关闭/ },
//             { clickable: true, depth: 8 }
//         ]),
//         action: node => simulateHumanClick(node),
//         retryStrategy: 'exponential' // 指数退避重试
//     }
// };
//
// // ================== 核心处理器 ==================
// let popupHistory = new Map(); // 弹窗处理记录
//
// function handlePopups() {
//     const detected = [];
//
//     // 并行检测所有类型弹窗
//     Object.entries(POPUP_HANDLER).forEach(([type, cfg]) => {
//         if (isInCooldown(type)) return;
//
//         const nodes = cfg.detect();
//         if (nodes.length > 0) {
//             detected.push({ type, nodes, cfg });
//         }
//     });
//
//     // 按优先级排序处理
//     detected.sort((a, b) => (b.cfg.priority || 0) - (a.cfg.priority || 0));
//
//     return detected.some(({ type, nodes, cfg }) => {
//         const success = processPopup(type, nodes[0], cfg);
//         if (success) recordHandled(type, nodes[0]);
//         return success;
//     });
// }
//
// // ================== 智能处理逻辑 ==================
// function processPopup(type, node, cfg) {
//     for (let attempt = 1; attempt <= cfg.retry; attempt++) {
//         try {
//             // 执行主处理动作
//             cfg.action(node);
//
//             // 动态等待策略
//             const waitTime = cfg.dynamicWait ?
//                 calcWaitTime(node.bounds) : 800;
//
//             if (waitForDisappear(node, waitTime)) {
//                 logd(`[${type}] 弹窗已关闭 尝试次数: ${attempt}`);
//                 return true;
//             }
//
//             // 执行恢复策略
//             cfg.recovery?.();
//         } catch (e) {
//             loge(`[${type}] 处理失败: ${e.stack}`);
//         }
//
//         // 指数退避等待
//         sleep(300 * Math.pow(2, attempt));
//     }
//     return false;
// }
//
// // ================== 高级工具函数 ==================
// function matchPopup(conditions, options = {}) {
//     const results = [];
//
//     conditions.forEach(cond => {
//         let query = selector();
//
//         // 动态构建查询条件
//         Object.entries(cond).forEach(([key, val]) => {
//             if (key === 'bounds') {
//                 const [left, top, right, bottom] = val.map(p =>
//                     typeof p === 'number' ? screenRatio(p) : p
//                 );
//                 query = query.bounds(left, top, right, bottom);
//             } else if (key === 'depth') {
//                 query = query.depth(...val);
//             } else {
//                 query = query[key](val);
//             }
//         });
//
//         // 执行复合查询
//         const nodes = query.find(options.timeout || 300);
//         results.push(...nodes.filter(n => !popupHistory.has(n.id)));
//     });
//
//     return deduplicateNodes(results);
// }
//
// function smartClick(node, hotZone, offset) {
//     const clickPoints = {
//         rightTop: [node.bounds.right - offset, node.bounds.top + offset],
//         leftBottom: [node.bounds.left + offset, node.bounds.bottom - offset],
//         center: [node.bounds.centerX(), node.bounds.centerY()]
//     };
//
//     const [x, y] = clickPoints[hotZone] || clickPoints.center;
//     clickPoint(x + random(-5,5), y + random(-5,5));
// }
//
// // ================== 验证系统 ==================
// function waitForDisappear(node, timeout = 2000) {
//     const start = Date.now();
//     while (Date.now() - start < timeout) {
//         if (!node.refresh()?.exists()) return true;
//         sleep(200);
//     }
//     return !node.exists();
// }




// ================== 全局状态记录 ==================
let processedUsers = new Set();  // 已处理用户记录
let emptyCount = 0;              // 连续空屏计数器

//const VALID_ITEM_HEIGHT = 213; // 根据日志计算：862-649=213
//const CLICK_SAFE_MARGIN = 15;   // 安全点击边距
// 核心抓取函数
function loopHomeUsers() {

    try {
        // 初始化设备参数
        initDeviceScaling();
        logd("初始化设备完成");

        // 进入目标界面
        if (!navigateToChatHome()) {
            throw new Error("导航到陪聊界面失败");
        }
        logd("进入首页");
        // 智能滑动控制
        let retryCount = 0;
        const maxRetry = 3;
        const allUsers = [];

        while (retryCount < maxRetry) {
            // 获取当前屏幕用户
            const currentBatch = processCurrentScreen();

            logd("当前处理批:"+JSON.stringify(currentBatch[0]))
            if(currentBatch){
                //swipeToPoint(adaptX(400),adaptY(2000),adaptX(400),adaptY(100),3000)
                drag(adaptX(400),adaptY(2100),adaptX(400),adaptY(50),1000)
                sleep(2000);

            }
        }

        // 最终去重处理
        return true;
    } catch (e) {
        loge(`失败: ${e.message}`);
        return [];
    }
}

//processCurrentScreen()

// 当前屏幕处理
function processCurrentScreen() {

    let currentUsersHome = [];
    logd("currentUserHome："+ currentUsersHome)
    // 带命名分组的正则表达式（推荐）
    //const reg = "/^(?<name>[^\d]+?)\s+(?<age>\d+)岁\s*\|\s*(?<height>\d+)cm\s+状态[:：]\s*(?<status>.+)/";

    //const reg =  "^([^\\d]+?)\\s*\\(d+)岁\\s*[|｜]\\s*\\(d+)cm\\s+状态[:：]\\s*(.+)"
    const reg =  "^([^\\d]+?)\\s*(\\d+)岁";


    const LIST_BOUNDS = { left: 0, top: 280, right: 1080, bottom: 2150 };
// 获取消息列表容器
    logd(LIST_BOUNDS.left)
    const listNodeContainer = bounds(
        adaptX(LIST_BOUNDS.left),
        adaptY(LIST_BOUNDS.top),
        adaptX(LIST_BOUNDS.right),
        adaptY(LIST_BOUNDS.bottom)
    ).descMatch(reg).getNodeInfo(1000);
    //logd(JSON.stringify(listNodeContainer))
    if (!listNodeContainer) {
        logd("消息列表未找到");
        return;
    }

    logd(JSON.stringify(listNodeContainer))
    // 遍历所有子节点（带进度提示）
    // 获取有效用户列表
    const validUsersHome = [];
    const rawNodes = listNodeContainer || [];


    logd(`共发现 ${rawNodes.length} 个节点`);

    rawNodes.forEach((node, index) => {
        try {
            logd(`处理节点 ${index + 1}/${rawNodes.length}`);

            // 节点基础验证
            if (!node || !node.desc) {
                logd("忽略无描述节点");
                return;
            }

            // 解析用户信息
            const userInfo =  parseNodeInfo(node, index);
            if (!userInfo.valid) {
                logd(`无效用户: ${userInfo.reason}`);
                return;
            }

            // 存储有效用户
            validUsersHome.push({
                name: userInfo.name,
                position: index + 1,
                clickPoint: calculateClickPoint(node.bounds),
                rawInfo: userInfo  // 调试用原始信息
            });


            logd(`[有效用户] ${userInfo.name} 坐标: ${JSON.stringify(node.bounds)}`);
        } catch (e) {
            loge(`节点[${index}]处理失败: ${e.message}`);
        }
    });


    // 执行打招呼或发消息程序
    executeOrderlyClickhandleGreetOrSendMsg(validUsersHome);
    return currentUsersHome.filter(u => !processedUsers.has(u.id));
}

// 从配置读取消息并处理换行
//const customMessage = readConfigString("customMessage");

// 安全获取随机消息
function getPrivateMsgRandomMessage() {
    // 处理空配置
    if (!customMessage || customMessage.trim() === "") {
        logd("自定义消息未配置，使用默认消息");
        return "你好，交个朋友吧~";
    }

    // 统一换行符为\n，分割为数组
    const messages = customMessage
        .replace(/"/g, '')          // 移除所有双引号=
        .replace(/\r\n/g, '\n')     // 统一换行符
        .split(/\n+/)               // 分割为数组
        .map(msg => msg.trim())     // 去除首尾空格
        .filter(Boolean);           // 过滤空内容

    // 检查有效性
    if (messages.length === 0) {
        logd("自定义消息格式错误，使用默认消息");
        return "我想认识你！";
    }

    // 随机选择一条
    const randomIndex = Math.floor(Math.random() * messages.length);
    return messages[randomIndex];
}

// 使用示例
// const message = getRandomMessage();
// logd(`即将发送消息: ${message}`);
// ================== 顺序点击执行器 ==================
function executeOrderlyClickhandleGreetOrSendMsg(users) {
    users.forEach((user, index) => {
        try {
            logd(`处理用户 ${index + 1}/${users.length}: ${user.name}`);

            // 执行点击
            if (!safeClick(user.clickPoint)) {
                throw new Error("点击操作失败");
            }
            sleep(randomInt(1000,1500));
            //进入资料卡获取用户信息
            var userId = getUserId();

            if (userId) {
                logi("当前用户ID:", userId);
                processUserInteraction(userId)
            } else {
                logw("获取用户ID失败");
                // 错误处理...
                back()
                return
            }

        } catch (e) {
            logd(`用户[${user.name}]处理失败: ${e.message}`);
        }
    });
}


// 定义延迟常量便于维护
const NAVIGATION_DELAY = 600;
const OPERATION_DELAY = 600;

// // 用户状态常量
const USER_STATUS = {
    HISTORICAL: 'historical',
    TODAY: 'today',
    NEW: 'new'
};


// 用户过滤处理函数
function processUserInteraction(userId) {
    const interactionStatus = getUserInteractionStatus(userId);
    logd(`处理用户 ${userId} 状态: ${JSON.stringify(interactionStatus)}`);

    // 过滤判断
    if (shouldSkipUser(interactionStatus)){
        // 导航返回
        //performNavigationBack();
        return;
    }


    //执行交互程序
    handleNewUserInteraction(userId)

    // // 执行互动逻辑
    // handleGreetInteraction(userId, status);
    // handleMessageInteraction(userId, status);



}


function shouldSkipUser(interactionStatus) {
    // 今日用户过滤
    if (FilterConfig.todayUser && !FilterConfig.historyUser &&
        (interactionStatus.greetStatus === "today" && interactionStatus.messageStatus === "today")) {
        handleUserSkip(interactionStatus, "今日用户");
        return true;
    }

    // 历史用户过滤
    if (FilterConfig.historyUser &&
        ((interactionStatus.greetStatus === "historical" && interactionStatus.messageStatus === "historical")||(interactionStatus.greetStatus === "today" && interactionStatus.messageStatus === "today"))){
        handleUserSkip(interactionStatus, "历史用户");
        return true;
    }

    if (FilterConfig.todayUser && !FilterConfig.historyUser && (FilterConfig.privateMsg && interactionStatus.messageStatus === "today" && !FilterConfig.greet)) {
        handleUserSkip(interactionStatus, "今日私信用户");
        return true;
    }

    if (FilterConfig.todayUser && !FilterConfig.historyUser && (!FilterConfig.privateMsg && interactionStatus.greetStatus === "today" && FilterConfig.greet)) {
        handleUserSkip(interactionStatus, "今日打招呼用户");
        return true;
    }

    // 历史用户过滤
    if (FilterConfig.historyUser && (!FilterConfig.privateMsg && (interactionStatus.greetStatus === "today" || interactionStatus.greetStatus === "historical")  && FilterConfig.greet)) {
        handleUserSkip(interactionStatus, "打招呼历史用户");
        return true;
    }

    if (FilterConfig.historyUser && (FilterConfig.privateMsg && (interactionStatus.messageStatus === "today" || interactionStatus.messageStatus === "historical")  && !FilterConfig.greet)) {
        handleUserSkip(interactionStatus, "私信历史用户");
        return true;
    }

    return false;
}


// handleUserSkip(status,)
function handleUserSkip(interactionStatus, reason) {
    logd(`用户 ${JSON.stringify(interactionStatus.detail)} 因 [${reason}] 被过滤`, 'warn');
    performNavigationBack();
}

function performNavigationBack() {
    logd("返回上级页面");
    back();
    sleep(NAVIGATION_DELAY);
}

// 处理新用户交互
function handleNewUserInteraction(userId) {
    let message;
    if (FilterConfig.privateMsg && FilterConfig.greet) {
        logd("执行打招呼后私信")
        message = getPrivateMsgRandomMessage();
        handleGreetAndSendPrivateMsgInProfileCard(userId,message)


    } else if (FilterConfig.greet) {
        logd("仅执行打招呼")
        handleGreetInProfileCard()

    } else if (FilterConfig.privateMsg) {
        logd("仅执行私信")
        message = getPrivateMsgRandomMessage();
        sendPrivateMsgInProfileCard(userId,message)
        logInteraction(userId, 'message')
    }

    // 统一导航返回
    performNavigationBack();
    logd(JSON.stringify(ReplyConfig))
    if(ReplyConfig.normalReply || ReplyConfig.keywordsReply || ReplyConfig.intimacyReply || ReplyConfig.aiReply) {
        logd("执行自动回复程序，检测是否有新消息")
        if(hasMessageNode()){
            swipeToFindNewMessage()
            }





    }
}

// 增强的日志记录
function logd(message, level = 'info') {
    const logLevels = {
        warn: 'WARN',
        error: 'ERROR',
        info: 'INFO'
    };
    console.log(`[${logLevels[level]}] ${new Date().toISOString()} - ${message}`);
}


function backToChat() {
    // 多方式返回
    const backBtn = bounds(0, 100, 154, 254).getOneNodeInfo(100)
    if (backBtn) {
        backBtn.click();
    } else {
        back(); // 物理返回键
    }
    sleep(500);
}



//=============== 节点解析函数 ==================
function parseNodeInfo(node, index) {
    // 基础验证
    if (!node || !node.desc) {
        logd(`节点[${index}] 无描述信息`);
        return { valid: false };
    }

    // 排除系统消息
    const rawText = node.desc.trim();
    if (isSystemMessage2(rawText)) {
        logd(`节点[${index}] 系统消息: ${rawText.slice(0, 20)}...`);
        return { valid: false };
    }

    // 解析消息结构
    const parts = rawText.split('\n');
    if (parts.length < 3) {
        logd(`节点[${index}] 格式异常: ${rawText.slice(0, 30)}...`);
        return { valid: false };
    }

    return {
        valid: true,
        name: parts[0].trim(),
        time: parts[1].trim(),
        message: parts.slice(2).join('\n'),
        bounds: node.bounds
    };
}

// 设备适配逻辑
function initDeviceScaling() {
    const DESIGN_RESOLUTION = { width: 1080, height: 2400 };
    SCREEN_SCALE = {
        width: device.getScreenWidth() / DESIGN_RESOLUTION.width,
        height: device.getScreenHeight() / DESIGN_RESOLUTION.height
    };
    logd(`设备缩放比例：${SCREEN_SCALE.width.toFixed(2)}, ${SCREEN_SCALE.height.toFixed(2)}`);
}
// //logd(smartSwipe())
// function smartSwipe() {
//     // 根据设备高度动态计算滑动距离
//     const screenHeight = device.getScreenHeight();
//     const swipeStartY = screenHeight * 0.80;  // 从屏幕80%位置开始
//     const swipeEndY = screenHeight * 0.03;    // 滑动到20%位置
//
//     const swipeConfig = {
//         start: adaptPosition(500, swipeStartY),
//         end: adaptPosition(500, swipeEndY),
//         duration: 2000  // 延长滑动时间
//     };
//
//     logd(`滑动参数：${JSON.stringify(swipeConfig)}`);
//     //swipeToPoint(400,1800,400,100,2000)
//     const success = swipeToPoint(
//         swipeConfig.start.x,
//         swipeConfig.start.y,
//         swipeConfig.end.x,
//         swipeConfig.end.y,
//         swipeConfig.duration
//     );
//
//     // 结果验证
//     sleep(2000); // 等待2秒确保内容加载
//     return success;
// }
//
// // 坐标转换工具
// function adaptPosition(x, y) {
//     return {
//         x: Math.round(x * SCREEN_SCALE.width),
//         y: Math.round(y * SCREEN_SCALE.height)
//     };
// }


// 辅助函数
function generateUserHash(user) {
    const salt = new Date().getTime().toString(36);
    return `${md5(user.name)}_${salt.slice(-4)}`;
}





// 不同设备坐标转换示例
// const originalPoint = { x: 500, y: 2000 };
// const adapted = adaptPosition(originalPoint.x, originalPointPoint.y);
// clickPoint(adapted.x, adapted.y);
//

// 滑动效果验证逻辑
function validateSwipeEffect() {
    const before = captureScreenHash();
    sleep(1200);
    const after = captureScreenHash();
    return before !== after && !detectBottomFlag();
}



function calcInteractionLevel(message) {
    const weights = {
        keywords: 5,    // 匹配关键词
        length: 0.1,    // 每10字符加1分
        emoji: 2,       // 每个表情符号
        question: 3     // 包含问号
    };

    let score = message.length * weights.length;
    if (/\?/.test(message)) score += weights.question;
    const emojiMatches = message.match(/(\uD83D[\uDE00-\uDE4F])/g) || [];
    score += emojiMatches.length * weights.emoji;
    return Math.min(score, 100);
}


function handleCaptureError(e) {
    const errorInfo = {
        time: new Date().toISOString(),
        message: e.message,
        device: `${device.width}x${device.height}`
    }

}

// ================== 智能坐标计算 ==================
function calculateClickPoint(bounds) {
    // 在中间安全区域生成随机点
    return {
        x: randomInt(
            bounds.left + 130,
            bounds.right - 600
        ),
        y: randomInt(
            bounds.top + CLICK_SAFE_MARGIN,
            bounds.bottom - CLICK_SAFE_MARGIN
        )
    };
}

// ================== 基础工具函数 ==================
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}



function updateProcessedUsers(users) {
    if (users.length === 0) {
        emptyCount++;
    } else {
        emptyCount = 0;
        users.forEach(u => processedUsers.add(u.id));
    }
}

//
// // ================== 全局变量声明 ==================
// let scaleX = 1.0; // 默认缩放比例
// let scaleY = 1.0;
//
// ================== 设备初始化模块 ==================
function initDevice() {
    // 获取实际设备分辨率
    const realWidth = device.getScreenWidth();
    const realHeight = device.getScreenHeight();

    // 设置基准分辨率（示例用1080x2400设计稿）
    const baseWidth = 1080;
    const baseHeight = 2400;

    // 计算坐标转换比例
    scaleX = realWidth / baseWidth;
    scaleY = realHeight / baseHeight;

    // 调试输出
    logd(`屏幕比例初始化完成 X:${scaleX.toFixed(2)} Y:${scaleY.toFixed(2)}`);
}

// ================== 坐标转换函数 ==================
function adaptX(x) {
    if(typeof scaleX === 'undefined') {
        throw new Error("scaleX未初始化，请先调用initDevice()");
    }
    return Math.round(x * scaleX);
}

function adaptY(y) {
    if(typeof scaleY === 'undefined') {
        throw new Error("scaleY未初始化，请先调用initDevice()");
    }
    return Math.round(y * scaleY);
}
// ================== 导航控制模块 ==================
function navigateToChatHome() {
    logd("开始导航到陪聊首页");

    const tab = desc("陪聊").bounds(adaptX(0),adaptY(300),adaptX(2000),adaptX(2500)).getOneNodeInfo(1000);
    if (tab) {
        logd("发现陪聊标签，尝试点击");
        tab.click();
        sleep(1500); // 增加加载等待时间

    }else
    {
        const tabTop = desc("回到顶部").bounds(adaptX(0),adaptY(300),adaptX(2000),adaptX(2500)).getOneNodeInfo(1000);
        if (tabTop) {

            sleep(random(300,500))

        }}
    return validateChatHome();
}


//
//
//logd(validateChatHome())
// 修改后的导航验证函数
function validateChatHome() {
    const checkPoints = [
        desc("推荐"),
        desc("动态"),
        //desc("回到顶部"),
        //desc("陪聊"),
        //clz("android.view.View")
    ];

    return checkPoints.some(element =>
        element.getOneNodeInfo(3000) !== null
    );
}

// ================== 工具函数模块 ==================
function waitUntil(condition, timeout=5000) {
    const start = Date.now();
    while(Date.now() - start < timeout) {
        if(condition()) return true;
        sleep(500);
    }
    return false;
}

// mainLoop();




function handleGreetOrSendPrivateMsg(greetLimit) {
    // 初始化计数器
    let currentGreetCount = 0;

    // 循环直到达到限制
    while (currentGreetCount < greetLimit) {
        try {
            loopHomeUsers()

        } catch (e) {
            logd(`处理过程中发生错误: ${e.message}`);
            // 可选的错误恢复逻辑，例如重试或跳过当前用户
        }
    }
}




function openProfileCard() {
    for (let yPos = adaptY(300); yPos < adaptY(1500); yPos+=1) {
        try {

            if (clickPoint(adaptX(80),  adaptY(300))) {
                sleep(500);
                logd(`已点击聊天窗口 Y:${yPos}`);

                swipeToPoint(adaptX(100),adaptY(500),adaptX(70),adaptY(1980),600);


                sleep(500);
                if(verifyProfileCard()){
                    logd(`进入资料卡`);

                    return true ;
                }else {

                }

            }
        } catch (e) {
            loge(`资料卡获取异常: ${e.message}`);
        }
    }
    return false;
}



//logd(verifyProfileCard())
function verifyProfileCard() {
    profileNode = desc("私信").getOneNodeInfo(1500);
    // addressNode = descMatch(/.*所在地.*/).getOneNodeInfo(1000)
    if(profileNode){
        logd("找到私信")
        return true;
    }
    return false;

}

// ================== 工具函数 ==================
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//openProfileCard()


//Sqlite数据库操作

// ==== 数据库配置 ====
const DB_PATH = "/sdcard/auto_chat.db";
let isDbConnected = false;
initDatabase()
// var userId = 11111
// logInteraction(userId, 'greet');
// ==== 数据库初始化 ====
function initDatabase() {
    try {
        // 连接/创建数据库
        if (!sqlite.connectOrCreateDb(DB_PATH)) {
            throw new Error(`连接失败: ${sqlite.getErrorMsg()}`);
        }
        isDbConnected = true;

        // 创建用户互动表
        const createUserTable = `
            CREATE TABLE IF NOT EXISTS user_interaction (
                user_id TEXT PRIMARY KEY,
                user_name TEXT,
                greet_count INTEGER DEFAULT 0,
                last_greet_time DATETIME,
                message_count INTEGER DEFAULT 0,
                last_message_time DATETIME,
                interaction_status INTEGER DEFAULT 0
            )`;
        if (!sqlite.execSql(createUserTable)) {
            throw new Error(`建表失败: ${sqlite.getErrorMsg()}`);
        }

        // 创建消息历史表
        const createMsgTable = `
            CREATE TABLE IF NOT EXISTS message_history (
                msg_id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT NOT NULL,
                sender_type INTEGER NOT NULL,
                content TEXT NOT NULL,
                raw_content TEXT NOT NULL,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY(user_id) REFERENCES user_interaction(user_id)
            )`;
        if (!sqlite.execSql(createMsgTable)) {
            throw new Error(`建表失败: ${sqlite.getErrorMsg()}`);
        }

        // 创建索引
        const indexStatements = [
            "CREATE INDEX IF NOT EXISTS idx_user ON user_interaction(user_id)",
            "CREATE INDEX IF NOT EXISTS idx_msg_time ON message_history(timestamp)"
        ];

        indexStatements.forEach(sql => {
            if (!sqlite.execSql(sql)) {
                throw new Error(`创建索引失败: ${sqlite.getErrorMsg()}`);
            }
        });

        logd("[成功] 数据库初始化完成");
        return true;
    } catch (e) {
        logd(`[错误] 初始化失败: ${e.message}`);
        sqlite.close();
        isDbConnected = false;
        return false;
    }
}

//var userId = 1212
//logInteraction(userId, 'greet');
// ==== 数据操作函数 ====
function logInteraction(userId, actionType) {
    if (!isDbConnected) return false;

    const now = new Date().toISOString();
    try {
        // 插入或忽略用户
        const insertSql = `
            INSERT OR IGNORE INTO user_interaction (user_id) 
            VALUES ('${userId}')`;
        if (!sqlite.execSql(insertSql)) {
            throw new Error(`插入用户失败: ${sqlite.getErrorMsg()}`);
        }

        // 更新互动数据
        const updateMap = {
            greet: {
                set: "greet_count = greet_count + 1",
                time: "last_greet_time",
                status: 1
            },
            message: {
                set: "message_count = message_count + 1",
                time: "last_message_time",
                status: 2
            }
        };

        const { set, time, status } = updateMap[actionType];
        const updateSql = `
            UPDATE user_interaction 
            SET ${set},
                ${time} = '${now}',
                interaction_status = MAX(interaction_status, ${status})
            WHERE user_id = '${userId}'`;

        return sqlite.execSql(updateSql);
    } catch (e) {
        logd(`[错误] 记录互动失败: ${e.message}`);
        return false;
    }
}

/**
 * 将 UTC 时间字符串转换为本地时区的 Date 对象
 * @param {string} isoTime - ISO 8601 格式的 UTC 时间
 * @returns {Date} 本地时区时间
 */
function toLocalDate(isoTime) {
    const utcDate = new Date(isoTime);
    return new Date(
        utcDate.getUTCFullYear(),
        utcDate.getUTCMonth(),
        utcDate.getUTCDate(),
        utcDate.getUTCHours(),
        utcDate.getUTCMinutes(),
        utcDate.getUTCSeconds()
    );
}

/**
 * 判断是否为当天用户（基于本地时区）
 * @param {string} isoTime - 用户最后一次互动时间（UTC）
 * @returns {boolean}
 */
function isTodayUser(isoTime) {
    const lastLocal = toLocalDate(isoTime);
    const nowLocal = new Date();

    return (
        lastLocal.getFullYear() === nowLocal.getFullYear() &&
        lastLocal.getMonth() === nowLocal.getMonth() &&
        lastLocal.getDate() === nowLocal.getDate()
    );
}
/**
 * 获取用户状态分类
 * @param {string} userId
 * @returns {"new" | "today" | "historical"}
 */
function getUserStatus(userId) {
    const interaction = getInteractionTimes(userId);

    if (!interaction) {
        return "new"; // 新用户
    }

    return isTodayUser(interaction.lastGreetTime) ? "today" : "historical";
    isTodayUser(interaction.lastMessageTime) ? "today" : "historical";
}

// //const userId = "U_10001";
// switch (getUserStatus(userId)) {
//     case "new":
//         logd("新用户，需要引导");
//         break;
//     case "today":
//         logd("当天活跃用户，展示最新内容");
//         break;
//     case "historical":
//         logd("历史用户（可能包含今天之前或当天）");
//         break;
// }
//handleUserGreet(userId)
// 示例：处理用户打招呼
function handleUserGreet(userId) {
    const status = getUserStatus(userId);

    switch (status) {
        case "new":
            logInteraction(userId, "greet");
            logd("互动吧！");
            //sendWelcomeMessage(userId);
            break;

        case "today":
            logd("今日已互动，不再重复记录");
            break;

        case "historical":
            logInteraction(userId, "greet");
            //sendReturningUserMessage(userId);
            break;
    }
}

// 添加时区转换工具函数
function toLocalDate(isoTime) {
    const date = new Date(isoTime);
    return new Date(date.getTime() + date.getTimezoneOffset() * 60000);
}

/**
 * 获取用户互动状态 (增强版)
 * @param {string} userId - 用户ID
 * @returns {object} - 包含详细状态的对象
 */
function getUserInteractionStatus(userId) {
    const interaction = getInteractionTimes(userId);
    if (!interaction) return { userStatus: "new" };

    // 分别判断打招呼和私信状态
    const greetStatus = interaction.lastGreetTime ?
        (isTodayUser(interaction.lastGreetTime) ? "today" : "historical") : "none";

    const messageStatus = interaction.lastMessage?.timestamp ?
        (isTodayUser(interaction.lastMessage.timestamp) ? "today" : "historical") : "none";

    // 综合用户状态
    const userStatus = (greetStatus === "today" || messageStatus === "today") ?
        "today" :
        (greetStatus !== "none" || messageStatus !== "none") ? "historical" : "new";

    return {
        userStatus,    // 用户总状态
        greetStatus,   // 打招呼状态
        messageStatus, // 私信状态
        detail: {
            lastGreet: interaction.lastGreetTime,
            lastMessage: interaction.lastMessage
        }
    };
}

// 使用示例
// const userId = 6735960;
// const status = getUserInteractionStatus(userId);

//
// logd(JSON.stringify(status, null, 2));

/* 可能输出：
{
  "userStatus": "today",
  "greetStatus": "today",
  "messageStatus": "today",
  "detail": {
    "lastGreet": "2025-04-08T09:30:00Z",
    "lastMessage": {
      "content": "你好呀",
      "timestamp": "2025-04-08T14:30:00Z"
    }
  }
}

或

{
  "userStatus": "historical",
  "greetStatus": "historical",
  "messageStatus": "none",
  "detail": {
    "lastGreet": "2025-04-07T08:15:00Z",
    "lastMessage": null
  }
}

或

{
  "userStatus": "new",
  "greetStatus": "none",
  "messageStatus": "none",
  "detail": {
    "lastGreet": null,
    "lastMessage": null
  }
}
*/


//handleGreetInProfileCard()
function handleGreetInProfileCard(userId){
    var handleGreetNode = desc("打招呼").getOneNodeInfo(3000);
    if(handleGreetNode){
        let handeGreetStatus = handleGreetNode.click()
        if(handeGreetStatus){
            logd("打招呼成功");
            logInteraction(userId, "greet")
            sleep(random(300,500))
            return true;
        }
        return false;

    }
}

//handleGreetAndSendPrivateMsgInProfileCard()
function handleGreetAndSendPrivateMsgInProfileCard(userId,message) {
    var handleGreetNode = desc("打招呼").getOneNodeInfo(1000);
    if (handleGreetNode) {
        let handeGreetStatus = handleGreetNode.click()
        if (handeGreetStatus) {
            logd("打招呼成功");
            logInteraction(userId, "greet")
            sleep(random(1000, 1500))
        }
        sendPrivateMsgInProfileCard(userId,message)
        // var sendPrivateMsgNode = desc("私信").getOneNodeInfo(2000);
        // if (sendPrivateMsgNode) {
        //
        //     let sendPrivateMsgNodeStatus = sendPrivateMsgNode.click()
        //
        //     sleep(random(1000, 1500))
        //     if (sendPrivateMsgNodeStatus) {
        //         sendMessage(userId, message);
        //
        //         //这里接发私信的步骤
        //         sleep(random(300, 500))
        //         clickPoint(80,180)
        //         sleep(random(800,1100))
        //         back()
        //         sleep(random(800,1100))
        //         return true
        //     }
        //     return false;

        // }
    }
}

//sendPrivateMsgInProfileCard(userId,message)
function sendPrivateMsgInProfileCard(userId,message) {
    var sendPrivateMsgNode = desc("私信").getOneNodeInfo(2000);
    if (sendPrivateMsgNode) {

        let sendPrivateMsgNodeStatus = sendPrivateMsgNode.click()
        sleep(random(1000, 1500))
        if (sendPrivateMsgNodeStatus) {
            sendMessage(userId, message);
            logInteraction(userId, 'message')

            //这里接发私信的步骤
            sleep(random(300, 500))
            //clickPoint(adaptX(80),adaptY(180))
            performNavigationBack();

            return true
        }
        return false;

    }
}



//sqlite.close();
// ==== 消息处理 ====
function processMessage(raw) {
    // 使用正则表达式清洗消息
    const cleaned = raw.replace(
        /^(\d{2}-\d{2}\s+\d{2}:\d{2}|[昨今]天\s+\d{2}:\d{2}|)\s*/,
        ""
    );
    return { clean: cleaned, raw };
}

function cacheMessage(userId, rawContent, isOwn) {
    if (!isDbConnected) return false;

    const { clean, raw } = processMessage(rawContent);
    const insertMap = {
        user_id: userId,
        sender_type: isOwn ? 1 : 0,
        content: clean,
        raw_content: raw
    };

    // 使用参数化插入防止SQL注入
    return sqlite.insert("message_history", insertMap);
}

//存储对方消息

// ====== 消息存储核心逻辑 ======
// function saveOtherMessages(userId, otherMessages) {
//     if (!isDbConnected || !otherMessages?.length) return false;
//
//     let successCount = 0;
//
//     otherMessages.forEach(item => {
//         try {
//             // 解析消息时间（优先使用OCR识别时间，否则取当前时间）
//             const messageTime = parseOcrTime(item.time) || new Date().toISOString();
//
//             // 格式化消息结构
//             const formatted = formatMessage(
//                 item,
//                 messageTime,
//                 false // isOwn设为false表示对方消息
//             );
//
//             // 入库处理
//             const insertResult = cacheMessage(
//                 userId,
//                 formatted.content, // 原始内容
//                 formatted.sender_type === 1 // isOwn参数
//             );
//
//             if (insertResult) {
//                 successCount++;
//                 logd(`消息存储成功 ➤ ${formatted.content}`);
//             }
//         } catch (e) {
//             loge(`消息存储失败 ➤ ${item.label}`, e.stack);
//         }
//     });
//
//     logi(`共处理${otherMessages.length}条消息，成功${successCount}条`);
//     return successCount > 0;
// }

//
// // ====== 时间解析增强函数 ======
// function parseOcrTime(ocrTime) {
//     if (!ocrTime) return null;
//
//     // 处理多种时间格式（示例：'4月4日14:18' → ISO时间）
//     const timePatterns = [
//         /(\d{1,2})月(\d{1,2})日\s*(\d{1,2}):(\d{2})/, // 中文日期格式
//         /(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2})/         // 标准日期格式
//     ];
//
//     for (const pattern of timePatterns) {
//         const match = ocrTime.match(pattern);
//         if (match) {
//             const [_, month, day, hour, minute] = match;
//             return new Date()
//                 .setMonth(month - 1, day)
//                 .setHours(hour, minute)
//                 .toISOString();
//         }
//     }
//     return null;
// }
//
//
// // ====== 消息格式化适配器 ======
// function formatMessage(item, time, isOwn) {
//     // 防御性处理异常坐标
//     const safePosition = {
//         x: Number(item.x) || 0,
//         y: Number(item.y) || 0,
//         width: Math.max(0, Number(item.width) || 0),
//         height: Math.max(0, Number(item.height) || 0)
//     };
//
//     return {
//         sender_type: isOwn ? 1 : 0,
//         content: String(item.label).trim() || '[空内容]',
//         time: time || new Date().toISOString(),
//         position: safePosition
//     };
// }

//saveOtherMessages("user_123", otherMessages);

function getUserId() {
    const MAX_RETRY = 1;      // 最大重试次数
    const FIND_TIMEOUT = 1000; // 节点查找超时(ms)
    let retryCount = 0;

    while (retryCount < MAX_RETRY) {
        try {
            // 1. 查找ScrollView节点（使用官方clz选择器）
            let scrollNode = clz("android.widget.ScrollView").getOneNodeInfo(FIND_TIMEOUT);

            if (!scrollNode) {
                logw("未找到ScrollView节点，重试中...");
                retryCount++;
                sleep(1000);
                continue;
            }

            // 2. 验证子节点结构
            if (scrollNode.childCount < 2) {
                loge("ScrollView子节点不足");
                return null;
            }

            // 3. 获取目标子节点（索引从0开始）
            let targetChild = scrollNode.child(1);

            if (!targetChild || !targetChild.desc) {
                loge("子节点缺失desc属性");
                return null;
            }

            // 4. 数据清洗（兼容多种格式）
            let rawId = String(targetChild.desc).trim();
            logd("原始ID数据:", rawId);

            // 5. 使用安全转换
            return parseSafeUserId(rawId);

        } catch (e) {
            loge("ID获取异常:", e.stack);
            retryCount++;
        }
    }
    return null;
}

// 安全ID转换函数（带格式验证）
function parseSafeUserId(raw) {
    try {
        // 去除非数字字符（保留数字）
        const cleanId = raw.replace(/[^\d]/g, '');

        // 格式验证
        if (!cleanId) throw new Error("无有效数字");
        if (cleanId.length < 6) throw new Error("ID过短");
        if (cleanId.length > 10) throw new Error("ID过长");

        // 转换为数字
        const numId = parseInt(cleanId, 10);

        // 二次验证
        if (isNaN(numId)) throw new Error("转换失败");
        if (numId <= 0) throw new Error("无效ID值");

        logd("成功获取用户ID:", numId);
        return numId;

    } catch (e) {
        loge("ID转换失败:", e.message);
        return null;
    }
}

// ======================= 自动回复核心函数 =======================
/**
 * 执行消息发送全流程
 * @param {string} userId - 目标用户ID
 * @param {string} receivedMsg - 收到的消息内容
 * @param {object} config - 配置对象
 */
function sendAutoReply(userId, receivedMsg, config) {
    try {
        // 获取当前回复模式
        const replyMode = getCurrentReplyMode();

        // 生成回复内容
        const replyContent = generateReplyContent(replyMode, receivedMsg, userId);
        if (!replyContent) return;

        // 执行消息输入和发送
        if (inputAndSendMessage(replyContent)) {
            // 记录到数据库
            cacheMessage(userId, `[自动回复] ${replyContent}`, true);
            logs(`成功发送回复至 ${userId}: ${replyContent}`);
        }
    } catch (e) {
        loge(`自动回复失败: ${e.message}`);
    }
}

// ======================= 模式处理逻辑 =======================
/**
 * 获取当前回复模式 (从HTML配置读取)
 */
function getCurrentReplyMode() {
    const config = sqlite.query("SELECT value FROM config WHERE key='reply_mode'");
    return config.rows.length > 0 ? config.rows[0].value : 'normal';
}

/**
 * 生成回复内容
 * @param {string} mode - 当前回复模式
 * @param {string} receivedMsg - 收到的消息
 * @param {string} userId - 用户ID
 */
function generateReplyContent(mode, receivedMsg, userId) {
    switch (mode) {
        case 'private':
            return handlePrivateMode(userId);
        case 'normal':
            return handleNormalMode();
        case 'keyword':
            return handleKeywordMode(receivedMsg);
        case 'intimacy':
            return handleIntimacyMode(userId);
        case 'ai':
            return handleAIMode(receivedMsg);
        default:
            return null;
    }
}

// ======================= 各模式处理函数 =======================
// 模式1: 私信专用模板
function handlePrivateMode(userId) {
    const templates = [
        "您好，有什么可以帮您？",
        "请查看我们的最新活动！"
    ];
    return templates[Math.floor(Math.random() * templates.length)];
}

// 模式2: 常规多条回复
function handleNormalMode() {
    const history = sqlite.query(
        "SELECT content FROM message_history WHERE sender_type=1 ORDER BY timestamp DESC LIMIT 3"
    );
    return history.rows.length > 0 ? "您刚提到：" + history.rows[0].content : "收到您的消息！";
}

//
// function getInteractionTimes(userId) {
//     const tableName = "user_interaction";
//     const sql = `SELECT * FROM ${tableName} WHERE user_id = '${userId}'`;
//     const result = sqlite.query(sql);
//
//     if (!result || result.length === 0) {
//         return null; // 用户无记录
//     }
//
//     const userData = result[0];
//     return {
//         lastGreetTime: userData.last_greet_time,
//         greetCount: userData.greet_count,
//         // 其他需要字段...
//     };
// }

function getInteractionTimes(userId) {
    if (!isDbConnected) {
        logd("数据库未连接");
        return null;
    }

    // 查询基础互动信息
    const userSql = `SELECT * FROM user_interaction WHERE user_id = '${userId}'`;
    const userResult = sqlite.query(userSql);
    if (!userResult || userResult.length === 0) {
        return null;
    }
    const userData = userResult[0];

    // 查询最近私信信息（新增部分）
    const messageSql = `
        SELECT content, timestamp
        FROM message_history
        WHERE user_id = '${userId}'
            AND sender_type = 1  -- 假设1表示用户发送的私信
        ORDER BY timestamp DESC
        LIMIT 1`;
    const messageResult = sqlite.query(messageSql);

    return {
        // 基础信息
        lastGreetTime: userData.last_greet_time,
        greetCount: userData.greet_count,

        // 新增私信状态
        lastMessage: messageResult.length > 0 ? {
            content: messageResult[0].content,
            timestamp: messageResult[0].timestamp
        } : null,
        totalMessages: userData.message_count
    };
}

// 模式4: 亲密度回复
function handleIntimacyMode(userId) {
    const interaction = sqlite.query(
        `SELECT greet_count, message_count 
         FROM user_interaction 
         WHERE user_id='${userId}'`
    );

    if (interaction.rows.length === 0) return "欢迎新朋友！";
    const { greet_count, message_count } = interaction.rows[0];

    if (message_count > 10) return "感谢您的长期支持！";
    if (greet_count > 3) return "很高兴再次见到您！";
    return "期待与您更多交流！";
}

// 模式5: AI智能回复
function handleAIMode(msg) {
    try {
        const response = http.post("https://api.gpt.com/v1/chat", {
            message: msg,
            max_tokens: 50
        });
        return JSON.parse(response).choices[0].text;
    } catch (e) {
        return "AI服务暂不可用";
    }
}

// ======================= 消息输入和发送 =======================
function inputAndSendMessage(text) {
    const MAX_RETRY = 3;

    for (let i = 0; i < MAX_RETRY; i++) {
        if (tryInputText(text)) {
            if (tryClickSend()) return true;
        }
        sleep(1500);
    }
    return false;
}

function tryInputText(text) {
    const inputNode = className("EditText")
        .visible(true)
        .getOneNodeInfo(2000);

    if (inputNode) {
        inputNode.click();
        sleep(500);
        inputNode.clearText();
        return inputNode.inputText(text);
    }
    return false;
}

function tryClickSend() {
    const sendBtn = desc("发送")
        .visible(true)
        .getOneNodeInfo(1000);

    if (sendBtn) {
        sendBtn.click();
        sleep(500);
        // 验证消息是否消失
        return has(sendBtn);
    }
    return false;
}

// ======================= 数据库记录 =======================
function cacheMessage(userId, content, isAuto) {
    const table = "message_history";
    const data = {
        user_id: userId,
        content: content,
        raw_content: content,
        sender_type: isAuto ? 1 : 0,
        timestamp: new Date().toISOString()
    };

    return sqlite.insert(table, data);
}
//
// // ==== 使用示例 ====
// function main() {
//     if (!initDatabase()) return;
//
//     // 模拟用户互动
//     const testUserId = "user_123";
//
//     // 记录打招呼
//     logInteraction(testUserId, 'greet');
//
//     // 记录私信
//     logInteraction(testUserId, 'message');
//
//     // 存储消息
//     cacheMessage(testUserId, "昨天 21:30 你好呀！", false);
//     cacheMessage(testUserId, "[自动回复] 欢迎联系", true);
//
//     // 查询数据
//     const result = sqlite.query(`
//         SELECT u.user_id, m.content
//         FROM user_interaction u
//         JOIN message_history m ON u.user_id = m.user_id
//         ORDER BY m.timestamp DESC
//         LIMIT 10
//     `);
//
//     logd("查询结果:", JSON.stringify(result));
//
//     sqlite.close();
// }
//
// main()
//
// // ==== 工具函数 ====
// function log(...msg) {
//     const timestamp = new Date().toISOString();
//     console.log(`[${timestamp}]`, ...msg);
// }
//
//
// // ==== 辅助函数 ====
// function isOwnMessage(text) {
//     // 通过特定标识判断己方消息
//     return text.includes("[我]") || text.startsWith("已发送");
// }
//
// function shouldSendMessage(statusRow) {
//     // 根据互动状态决定是否发私信
//     return (!statusRow || statusRow.interaction_status < 2) &&
//         (new Date() - new Date(statusRow.last_greet_time)) > 86400000; // 24小时
// }
//
// // 每月执行一次优化
// function dbMaintenance() {
//     db.execSQL("VACUUM;");
//     db.execSQL("ANALYZE;");
// }
//
// //数据备份
// function backupDatabase() {
//     let backupPath = "/sdcard/backup/chat_" +
//         new Date().toISOString().replace(/[:.]/g, "-") +
//         ".db";
//     files.copy(DB_PATH, backupPath);
// }
//
// // 获取最近10条未回复消息
// function getUnrepliedMessages() {
//     return db.rawQuery(`
//         SELECT m.*
//         FROM message_history m
//         LEFT JOIN user_interaction u
//             ON m.user_id = u.user_id
//         WHERE m.sender_type = 0
//             AND u.interaction_status < 2
//         ORDER BY m.timestamp DESC
//         LIMIT 10
//     `);
// }

//单功能测试
// var userId = getUserId();
//
// if (userId) {
//     logi("当前用户ID:", userId);
//     // 执行后续操作...
// } else {
//     logw("获取用户ID失败");
//     // 错误处理...
// }



// ================== 界面状态检测 ==================
function shouldHandlePopup() {
    // 通过页面特征元素判断是否目标界面
    const pageMarkers = [
        desc("陪聊"),
        desc("消息"),
        desc("我的"),
        descMatch(/.*推荐.*/)
    ];
    return pageMarkers.some(m => m.getNodeInfo(500));
}

// ================== 执行日志 ==================
let performanceLog = [];

function logd(msg) {
    console.log(`[${new Date().toLocaleTimeString()}] ${msg}`);
    performanceLog.push({
        time: Date.now(),
        action: msg
    });
}

// while (true) {
//     if (closePopups()) {
//         logd("检测并关闭弹窗成功");
//         break;
//     }
//     sleep(1000);
// }

// ================== 配置参数 ==================
//聊天窗口边界
//const LIST_BOUNDS = { left: 0, top: 400, right: 1080, bottom: 2272 };
const VALID_ITEM_HEIGHT = 213; // 根据日志计算：862-649=213
const CLICK_SAFE_MARGIN = 15;   // 安全点击边距

// ================== 主处理函数 ==================
function processChatList() {
    let currentUsers = [];
// 获取消息列表容器
    const listContainer = bounds(
        LIST_BOUNDS.left,
        LIST_BOUNDS.top,
        LIST_BOUNDS.right,
        LIST_BOUNDS.bottom
    ).getNodeInfo(3000);

    if (!listContainer) {
        logd("消息列表未找到");
        return;
    }

    logd(JSON.stringify(listContainer))
    // 遍历所有子节点（带进度提示）
    // 获取有效用户列表
    const validUsers = [];
    const allNodes = listContainer || [];


    logd(`共发现 ${allNodes.length} 个节点`);

    allNodes.forEach((node, index) => {
        try {
            logd(`处理节点 ${index + 1}/${allNodes.length}`);

            // 节点基础验证
            if (!node || !node.desc) {
                logd("忽略无描述节点");
                return;
            }

            // 解析用户信息
            const userInfo =  parseNodeInfo(node, index);
            if (!userInfo.valid) {
                logd(`无效用户: ${userInfo.reason}`);
                return;
            }

            // 存储有效用户
            validUsers.push({
                name: userInfo.name,
                position: index + 1,
                clickPoint: calculateClickPoint(node.bounds),
                rawInfo: userInfo  // 调试用原始信息
            });

            logd(`[有效用户] ${userInfo.name} 坐标: ${JSON.stringify(node.bounds)}`);
        } catch (e) {
            loge(`节点[${index}]处理失败: ${e.message}`);
        }
    });


    // 执行顺序点击
    executeOrderlyClick(validUsers);
    return currentUsers.filter(u => !processedUsers.has(u.id));
}
//=============== 节点解析函数 ==================
function parseNodeInfo(node, index) {
    // 基础验证
    if (!node || !node.desc) {
        logd(`节点[${index}] 无描述信息`);
        return { valid: false };
    }

    // 排除系统消息
    const rawText = node.desc.trim();
    if (isSystemMessage2(rawText)) {
        logd(`节点[${index}] 系统消息: ${rawText.slice(0, 20)}...`);
        return { valid: false };
    }

    // 解析消息结构
    const parts = rawText.split('\n');
    if (parts.length < 3) {
        logd(`节点[${index}] 格式异常: ${rawText.slice(0, 30)}...`);
        return { valid: false };
    }

    return {
        valid: true,
        name: parts[0].trim(),
        time: parts[1].trim(),
        message: parts.slice(2).join('\n'),
        bounds: node.bounds
    };
}



// ================== 智能坐标计算 ==================
function calculateClickPoint(bounds) {
    // 在中间安全区域生成随机点
    return {
        x: randomInt(
            bounds.left + CLICK_SAFE_MARGIN,
            bounds.right - CLICK_SAFE_MARGIN
        ),
        y: randomInt(
            bounds.top + CLICK_SAFE_MARGIN,
            bounds.bottom - CLICK_SAFE_MARGIN
        )
    };
}

// ================== 顺序点击执行器 ==================
function executeOrderlyClick(users) {
    users.forEach((user, index) => {
        try {
            logd(`处理用户 ${index + 1}/${users.length}: ${user.name}`);

            // 执行点击
            if (!safeClick(user.clickPoint)) {
                throw new Error("点击操作失败");
            }
            sleep(randomInt(500,800));
            //进入资料卡获取用户信息

            if (openProfileCard()) {
                logd("资料卡打开成功");
                // 执行后续操作...


                // 获取用户ID
                //获取ID资料卡，查询聊天信息
                sleep(1000);
                var userId = getUserId();

                if (userId) {
                    logi("当前用户ID:", userId);
                    // 执行后续操作...
                } else {
                    logw("获取用户ID失败");
                    // 错误处理...
                }

                //获取用户名
                var userInfoNode = clz("android.widget.ScrollView").getOneNodeInfo(1000);
                //logd(JSON.stringify(userInfoNode))
                if (userInfoNode) {
                    var usernameNode = userInfoNode.child(0)
                    //logd(JSON.stringify(usernameNode))
                    //var nextsibid = childnode0.nextSiblings()
                    var userName = usernameNode.desc
                    logd(JSON.stringify(userName))
                }
                //回到聊天窗口
                back()
                sleep(1000);

            } else {
                logd("资料卡打开失败");
                back()
                sleep(randomInt(600,900));
                var userId = 13141314
            }
            // 发送消息流程
            //sendMessageToUser();
            autoReplyMain(userId);
            // 返回消息列表
            //backToMessageList();
            //sleep(1100);
            back()
            sleep(800);


            //backToChat();




            function backToChat() {
                // 多方式返回
                const backBtn = bounds(0, 100, 154, 254).getOneNodeInfo(100)
                if (backBtn) {
                    backBtn.click();
                } else {
                    back(); // 物理返回键
                }
                sleep(500);
            }




            // 发送消息流程
            //sendMessageToUser();
            autoReplyMain( userId );
            // 返回消息列表
            //backToMessageList();
            sleep(1100);
            back()
            sleep(800);

        } catch (e) {
            logd(`用户[${user.name}]处理失败: ${e.message}`);
        }
    });
}

// ================== 操作工具函数 ==================
function safeClick(point) {
    logd(`尝试点击坐标: (${point.x}, ${point.y})`);
    sleep(randomInt(600,1000));
    return clickPoint(point.x, point.y);
}

function waitForChatWindow(timeout = 5000) {
    const start = Date.now();
    while (Date.now() - start < timeout) {
        if (desc("发送").exists() && className("EditText").exists()) {
            return true;
        }
        sleep(500);
    }
    return false;
}

function sendMessageToUser() {
    const messages = [
        "您好，这是我们的最新活动！",
        "很高兴为您服务！",
        "请问有什么可以帮您？"
    ];
    const message = messages[Math.floor(Math.random() * messages.length)];

    // 带重试的输入操作
    for (let i = 0; i < 3; i++) {
        const input = className("EditText").findOne(2000);
        if (input) {
            input.setText(message);
            sleep(300);
            desc("发送").findOne(1000)?.click();
            return true;
        }
    }
    return false;
}



function backToMessageList() {
    // 多重返回保障
    for (let i = 0; i < 3; i++) {
        if (bounds(
            LIST_BOUNDS.left,
            LIST_BOUNDS.top,
            LIST_BOUNDS.right,
            LIST_BOUNDS.bottom
        ).exists()) return true;
        back();
        sleep(800);
    }
    return false;
}


// ================== 基础工具函数 ==================
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ================== 执行入口 ==================
//processChatList();

// ================== 循环控制配置 ==================
const SCROLL_CONFIG = {
    maxLoop: 10,                // 最大循环次数
    swipeStart: {x: 400, y: 2000}, // 滑动起始点
    swipeEnd: {x: 600, y: 790},    // 滑动结束点
    swipeDuration: 300,         // 滑动时长(ms)
    retryDelay: 1500,           // 滑动后等待加载
    emptyThreshold: 3           // 连续空屏次数限制
};



//群发消息功能使用
// ================== 增强型主循环 ==================
function mainLoop() {
    for (let loop = 0; loop < SCROLL_CONFIG.maxLoop; loop++) {
        logd(`开始第 ${loop + 1} 次循环处理`);

        // 处理当前屏幕
        const currentUsers = processChatList();
        updateProcessedUsers(currentUsers);

        // 终止条件判断
        if (shouldTerminateLoop(currentUsers)) {
            logd("达到终止条件，退出循环");
            break;
        }

        // 执行智能滑动
        if (!smartSwipe()) {
            loge("滑动操作失败，提前终止");
            break;
        }
    }
}



function updateProcessedUsers(users) {
    if (users.length === 0) {
        emptyCount++;
    } else {
        emptyCount = 0;
        users.forEach(u => processedUsers.add(u.id));
    }
}

// ================== 终止条件判断 ==================
function shouldTerminateLoop(users) {
    // 连续空屏超过阈值
    if (emptyCount >= SCROLL_CONFIG.emptyThreshold) {
        logd("连续空屏，终止处理");
        return true;
    }

    // 已处理用户占比过高
    const totalUsers = processedUsers.size + users.length;
    if (totalUsers > 0 && users.length / totalUsers < 0.2) {
        logd("重复率过高，终止处理");
        return true;
    }

    return false;
}



//
// // ================== 智能滑动控制 ==================
// function smartSwipe() {
//     // 执行滑动操作
//     const swipeSuccess = swipeToPoint(
//         SCROLL_CONFIG.swipeStart.x,
//         SCROLL_CONFIG.swipeStart.y,
//         SCROLL_CONFIG.swipeEnd.x,
//         SCROLL_CONFIG.swipeEnd.y,
//         SCROLL_CONFIG.swipeDuration
//     );
//
//     if (!swipeSuccess) return false;
//
//     // 等待内容加载
//     sleep(SCROLL_CONFIG.retryDelay);
//
//     // 验证滑动效果
//     return validateSwipeResult();
// }

function validateSwipeResult() {
    // 方案1：检测列表底部标记
    if (desc("已经到底了").exists()) return false;

    // 方案2：对比屏幕内容
    const beforeSwipe = captureScreenHash();
    sleep(500);
    const afterSwipe = captureScreenHash();

    return beforeSwipe !== afterSwipe;
}

// ================== 工具函数 ==================
// 生成屏幕特征码（简单版）
function captureScreenHash() {
    return className("TextView").find().size().toString();
}

// // ================== 执行入口 ==================
// function main() {
//     initDatabase();  // 数据库初始化
//     mainLoop();
//  sqlite.close();
// }
//
// main();


//
// function readSendContent(){
//     var data = file.readFile("/sdcard/通用.txt");
//     toast(data);
//     // let r = file.deleteLine("/sdcard/通用.txt", -1, "一分钟都不愿意吗，你也不是真找的吧");
//     // logd("r " + r);
//     // //删除第3行
//     // r = file.deleteLine("/sdcard/通用.txt", 3, null);
//     // logd("r " + r);
//     //写入文件
//     // var data = "想喝奶了";
//     // file.writeFile(data, "/sdcard/通用.txt");
//     //读取一行
//     // var t = file.readLine("/sdcard/通用.txt", 1);
//     // toast(t);
//     //读取所有行
//     var t = file.readAllLines("/sdcard/通用.txt");
//     toast(t);
//
//     var data = file.readAllLines("/sdcard/通用.txt");
//     for (var i = 0; i < data.length; i++) {
//         logd("话术"+ i +":" + data[i]);
//     }
//
//
//
// }
// readSendContent()
//
//     话术内容从下面文件取一条：
//     var data = file.readAllLines("/sdcard/通用.txt");
//     for (var i = 0; i < data.length; i++) {
//         logd("话术"+ i +":" + data[i]);
//     }
//     var sendMessageOfme = data[random(i,data.length)]
//     然后，在输入框输入并发送，
//
// function autoReplyMessege(sendContent) {
//     //点击文本框
//     var inputnode = editable(true)
//         //.bounds(360,2020,924,2220)
//         //.clz(android.widget.EditText)
//         .getOneNodeInfo(0)
//
//     logd(JSON.stringify(inputnode))
//     inputnode.click()
//     sleep(1000);
//
//     var selectors = clz("android.widget.EditText");
//     var isSendContent = inputText(selectors, sendContent);
//     if (isSendContent) {
//         toast("是");
//     } else {
//         toast("否");
//     }
//     var nodeinput = clz("android.widget.EditText").getOneNodeInfo(0)
//     if (nodeinput) {
//         nodeinput.clearText()
//         nodeinput.click()
//         sleep(1000);
//         nodeinput.inputText(sendMessageOfme);
//     }
//
//
//     //发送消息
//     var sendmessege = desc("发送").getOneNodeInfo(0)
//     if (sendmessege) {
//         logd(JSON.stringify(sendmessege))
//         sendmessege.click()
//     }
//
//     需要保存到数据库中，
//     用这样一个函数：cacheMessage(userId, sendMessageOfme, true);
//
// }


// ================== 消息管理模块 ==================
const NORMAL_MESSAGE_FILE = "/sdcard/通用.txt";
const KEYWORDS_MESSAGE_FILE = "/sdcard/关键词.txt";
const INTIMACY_MESSAGE_FILE = "/sdcard/亲密度.txt";

/**
 * 获取随机话术内容
 * @returns {string} 随机消息文本
 */
function getRandomMessage(MESSAGE_FILE) {
    try {
        const messages = file.readAllLines(MESSAGE_FILE);
        if (!messages || messages.length === 0) {
            throw new Error("消息文件内容为空");
        }
        return messages[Math.floor(Math.random() * messages.length)];
    } catch (e) {
        loge(`读取消息文件失败: ${e.message}`);
        return "在干嘛呀！"; // 默认消息
    }
}

/**
 * 保存消息记录
 * @param {string} userId - 用户ID
 * @param {string} content - 消息内容
 */
function saveMessageRecord(userId, content) {
    if (!userId || !content) return false;

    try {
        cacheMessage(userId, `[自动回复] ${content}`, true);
        logd(`消息已保存：用户[${userId}] 内容[${content}]`);
        return true;
    } catch (e) {
        loge(`数据库保存失败: ${e.message}`);
        return false;
    }
}

// ================== 消息发送模块 ==================
/**
 * 执行消息发送流程
 * @param {string} userId - 用户ID
 * @param {string} message - 要发送的消息内容
 */
function sendMessage(userId, message) {
    if (!message) {
        logd("消息内容为空");
        return;
    }

    try {
        // 定位输入框
        var inputNode = findInputNode(1);
        // if (!inputNode?.editable()) { // 安全访问
        //     throw new Error("INPUT_NODE_INVALID");
        // }

        // if (!inputNode.editable) {
        //     throw new Error("找不到输入框");
        // }

        // 输入内容
        inputTextWithRetry(inputNode, message);

        // 发送消息
        if (clickSendButton()) {
            logd("消息发送成功");
            saveMessageRecord(userId, message);
        }
    } catch (e) {
        logd(`消息发送失败: ${e.message}`);
    }
}

/**
 * 查找输入框节点（带重试机制）
 */
//logd(findInputNode(3).editable)
function findInputNode(retry = 3) {
    for (let i = 0; i < retry; i++) {
        const node = clz("android.widget.EditText")
            .editable(true)
            .getOneNodeInfo(1000);

        if (node) {
            node.click();
            sleep(500);
            return node;
        }
        sleep(1000);
    }
    return null;
}

/**
 * 带重试的文本输入
 */
function inputTextWithRetry(node, text, retry = 1) {
    for (let i = 0; i < retry; i++) {
        node.clearText();
        if (node.inputText(text)) {
            logd(`输入成功: ${text}`);
            return true;
        }
        sleep(500);
    }
    return false;
}

/**
 * 点击发送按钮
 */
function clickSendButton() {
    const sendBtn = desc("发送")
        .clickable(true)
        .getOneNodeInfo(1500);

    if (sendBtn) {
        sendBtn.click();
        sleep(300); // 等待发送动画
        return true;
    }
    return false;
}

// ================== 主流程函数 ==================
/**
 * 自动回复主流程
 * @param {string} userId - 用户ID
 */
function autoReplyMain(userId) {
    const message = getRandomMessage(NORMAL_MESSAGE_FILE);
    sendMessage(userId, message);
}


// 配置参数
const MAX_SWIPE_RETRY = 5;       // 最大滑动次数
const BASE_WAIT_TIME = 800;     // 基础等待时间(ms)
const SWIPE_STEP = 500;         // 滑动步长

// 主流程控制器
function messageProcessor() {
    let swipeCount = 0;
    let hasNewMessage = false;

    do {
        // 每次循环重置状态
        hasNewMessage = false;

        // 分层检测消息（当前屏→滑动检测）
        if (detectAndProcessMessages()) {
            hasNewMessage = true;
            resetToTop(); // 处理完返回顶部
            continue;
        }

        // 未找到时执行滑动检测
        if (swipeDownForMore()) {
            swipeCount++;
            hasNewMessage = detectAndProcessMessages();
        }

    } while (hasNewMessage && swipeCount < MAX_SWIPE_RETRY);

    logi("消息检测完成，无未读消息");
}
// 核心检测逻辑
function detectAndProcessMessages() {
    let processedCount = 0;

    // 分层检测提升性能
    while (searchColor('red', 0.9)) { // 颜色相似度阈值
        if (!openProfileCard()) {
            handleOpenFailure();
            continue;
        }

        const userInfo = extractUserInfo();
        if (userInfo) {
            processMessageFlow(userInfo);
            processedCount++;
        }

        if (!navigateBackToList()) {
            break; // 导航失败时终止
        }
    }

    return processedCount > 0;
}

// 增强型用户信息获取
function extractUserInfo() {
    let retry = 0;
    let userInfo = null;

    while (retry < 3) {
        try {
            const userId = secureGetUserId();
            if (!userId) throw new Error('用户ID获取失败');

            userInfo = {
                id: userId,
                name: getUsername() || '未知用户',
                timestamp: new Date().toISOString()
            };

            logd(`用户信息: ${JSON.stringify(userInfo)}`);
            return userInfo;

        } catch (e) {
            logw(`信息获取失败第${retry+1}次: ${e.message}`);
            backWithDelay(1200);
            retry++;
        }
    }

    return null;
}

// 安全获取用户ID
function secureGetUserId() {
    const userId = getUserId();
    if (!userId || userId === 'undefined') {
        logw("无效的用户ID");
        return null;
    }
    return userId;
}

// 智能滑动检测
function swipeDownForMore() {
    logi("执行下滑检测...");
    swipeScreen(300, 1500, 300, 300, SWIPE_STEP);
    sleep(BASE_WAIT_TIME + 200);
    return searchColor('red', 0.85); // 滑动后再次检测
}

// 可靠返回顶部
function resetToTop() {
    logi("重置到消息列表顶部");
    for(let i=0; i<3; i++) {
        clickPoint(50, 150);  // 点击顶部区域
        sleep(300);
    }
    refreshList(); // 自定义的列表刷新方法
    sleep(BASE_WAIT_TIME);
}

// 流程错误处理
function handleOpenFailure() {
    logw("资料卡打开异常");
    backWithDelay(800);
    clickPoint(80, 170);  // 重置点击坐标
    sleep(BASE_WAIT_TIME);
}

// 带延迟的返回
function backWithDelay(delay) {
    back();
    sleep(delay + randomInt(-200, 200));
}



function autoReplyNewMessageMainLoop(){
    //当searchColor为真，说明已经点进去消息列表
    if(searchColor()){

        if (openProfileCard()) {
            logd("资料卡打开成功");
            // 执行后续操作...


            // 获取用户ID
            //获取ID资料卡，查询聊天信息
            sleep(1000);
            var userId = getUserId();

            if (userId) {
                logi("当前用户ID:", userId);
                // 执行后续操作...
            } else {
                logw("获取用户ID失败");
                // 错误处理...
            }

            //获取用户名
            var userInfoNode = clz("android.widget.ScrollView").getOneNodeInfo(1000);
            //logd(JSON.stringify(userInfoNode))
            if (userInfoNode) {
                var usernameNode = userInfoNode.child(0)
                //logd(JSON.stringify(usernameNode))
                //var nextsibid = childnode0.nextSiblings()
                var userName = usernameNode.desc
                logd(JSON.stringify(userName))
            }
            //回到聊天窗口
            back()
            sleep(1000);

        } else {
            logd("资料卡打开失败");
            back()
            sleep(randomInt(600,900));
            var userId = test001
        }
        // 发送消息流程
        //sendMessageToUser();
        autoReplyMain(userId);
        // 返回消息列表
        //backToMessageList();
        //sleep(1100);
        clickPoint(adaptX(80),adaptY(170))
        sleep(800);
    }


}



function autoMessageReply(){
    //10秒等待软件启动，并点击消息界面
    var homeMessegeNode = descMatch(".*消息.*").bounds(adaptX(100), adaptY(2100), adaptX(1080), adaptY(2500)).getOneNodeInfo(5000);

    //logd("" + appIsRuning);
    if (homeMessegeNode) {
        // if (closePopups()) {
        // logd("检测并关闭弹窗成功");

        //}
        var x = homeMessegeNode.click();
        sleep(random(400,600));
        //logd(x);
    } else {
        logd("请回到消息列表页");
    }


    var nodeMessegeHome = descMatch(".*消息.*").bounds(adaptX(100), adaptY(2100), adaptX(1080), adaptY(2500)).getOneNodeInfo(1000);

    if (nodeMessegeHome) {
        nodeMessegeHome.click();
        sleep(600);

        autoReplyNewMessageMainLoop();
        sqlite.close();
    }

}

function init_hua() {
    //开始再这里编写代码了！！
    //toast("爱你就像爱生命");


    if (!initDatabase()) return;


//如果自动化服务正常
    if (!autoServiceStart(3)) {
        logd("自动化服务启动失败，无法执行脚本")
        exit();
        return;
    }
    logd("开始执行脚本...")
    if (!netcardProcessor()) {
        exit();
        return;
    }

}

function netcardProcessor() {
    logd("开始进行卡密验证")
    // 官方自带的卡密系统
    // appId 和 appSecret的值 请到 http://uc.ieasyclick.com/ 进行注册后提卡
    let appId = "XXXXXX";//卡密自己注册
    let appSecret = "hhdbtejo";
    let cardNo = readConfigString("cardNo")
    if (cardNo == null || cardNo == undefined || cardNo.length <= 0) {
        toast("请输入卡密")
        loge("请输入卡密")
        exit()
        return false;
    }
    let inited = ecNetCard.netCardInit(appId, appSecret)
    logd("inited card => " + JSON.stringify(inited));
    let bind = ecNetCard.netCardBind(cardNo)
    let bindResult = false;
    if (bind != null && bind != undefined && bind["code"] == 0) {
        logd("卡密绑定成功")
        let leftDays = bind['data']['leftDays'] + "天";
        logd("剩余时间：" + leftDays);
        logd("激活时间：" + bind['data']['startTime'])
        logd("过期时间：" + bind['data']['expireTime'])
        bindResult = true;
        toast("卡密剩余时间:" + leftDays)
    } else {
        if (bind == null || bind == undefined) {
            loge("卡密绑定失败,无返回值 ")
            let msg = "卡密绑定失败,无返回值"
            loge(msg)
            toast(msg)
        } else {
            let msg = "卡密绑定失败: " + bind["msg"]
            loge(msg)
            toast(msg)
        }
    }
    return bindResult;
}

function autoServiceStart(time) {
    for (var i = 0; i < time; i++) {
        if (isServiceOk()) {
            return true;
        }
        var started = startEnv();
        logd("第" + (i + 1) + "次启动服务结果: " + started);
        if (isServiceOk()) {
            return true;
        }
    }
    return isServiceOk();
}


//
// function searchColor(){
//     //
//     // startEnv()
//     // logd("isServiceOk " + isServiceOk());
//     image.releaseScreenCapture();
//
//     let req = image.requestScreenCapture(10000, 0);
//     if (!req) {
//         req = image.requestScreenCapture(10000, 0);
//     }
//     if (!req) {
//         toast("申请权限失败");
//         return;
//     }
//     //申请完权限至少等1s(垃圾设备多加点)再截图,否则会截不到图
//     sleep(2000)
//
//
//     image.useOpencvMat(1);
//     let screenImage = image.captureFullScreen();
//     if (screenImage != null) {
//         image.setFindColorImageMode(1)
//         let firstColor = "#FA5151-#101010,#FA5151-#101010,#FA5151-#101010";
//         let points = image.findColor(screenImage, firstColor, 0.85,  105, 210, 220, 2250, 1, 2);
//         //这玩意是个数组
//         if (points) {
//             logd("points_ " + JSON.stringify(points));
//             clickPoint(points[0].x,points[0].y+60)
//             logd(points[0].y+60)
//             sleep(500)
//             return true;
//         }
//         //图片要回收
//         image.recycle(screenImage)
//     }
//     return false
// }

//底部打红色，或者是 通配 消息+数字； 点击
//searchNewMsgColorOnBottom()
// function searchNewMsgColorOnBottom(){
//     //
//     // startEnv()
//     // logd("isServiceOk " + isServiceOk());
//     image.releaseScreenCapture();
//
//     let req = image.requestScreenCapture(10000, 0);
//     if (!req) {
//         req = image.requestScreenCapture(10000, 0);
//     }
//     if (!req) {
//         toast("申请权限失败");
//         return;
//     }
//     //申请完权限至少等1s(垃圾设备多加点)再截图,否则会截不到图
//     sleep(2000)
//
//
//     image.useOpencvMat(1);
//     let screenImage = image.captureFullScreen();
//     if (screenImage != null) {
//         image.setFindColorImageMode(1)
//         let firstColor = "#EC3636-#101010,#EC3636-#101010";
//         let points = image.findColor(screenImage, firstColor, 0.9, 536, 2254, 796, 2430, 2, 2);
//         //这玩意是个数组
//         if (points) {
//             logd("points_ " + JSON.stringify(points));
//             clickPoint(points[0].x-30,points[0].y+60)
//             logd(points[0].y+60)
//             sleep(500)
//             return true;
//         }
//         //图片要回收
//         image.recycle(screenImage)
//     }
//     return false
// }
//
//
//
// initDevice()
//
//
//
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
//
//
// //^([^\d]+?)\s*(\d+)岁

let ocrLite = null
//脚本停止回调
setStopCallback(function () {
    //释放所有资源,一般不需要调用,或者放到setStopCallback中
    logi("释放ocrLite对象")
    ocrLite && ocrLite.releaseAll()
})

//初始化自动化环境
function initEnv() {
    // if (!startEnv()) {
    //     loge("自动化启动失败,结束脚本")
    //     exit()
    // }
    if (!image.requestScreenCapture(10000, 0)) {
        loge("申请截图权限失败,检查是否开启后台弹出,悬浮框等权限")
        exit()
    }
    //申请完权限至少等1s(垃圾设备多加点)再截图,否则会截不到图
    sleep(1000)
}

//初始化ocrlite
function initOcrLite() {
    let ocrLiteMap = {"type": "ocrLite", "numThread": 1, "padding": 10, "maxSideLen": 0}
    //创建ocr对象,仅脚本开头一次即可
    ocrLite = ocr.newOcr()
    //初始化ocr,仅脚本开头一次即可
    if (!ocrLite.initOcr(ocrLiteMap)) {
        loge("OCR初始化失败 : " + ocrLite.getErrorMsg())
        exit()
    }
}

// ocr识别
function ocrFunc() {

    // 截图
    let img = image.captureFullScreenEx()
    if (!img) {
        loge("截图失败")
        return
    }
    // 对图片进行识别
    let result = ocrLite.ocrImage(img, 20 * 1000, {"maxSideLen": 1080})
    //回收图片
    image.recycle(img)
    if (result) {
        logd("ocr结果-》 " + JSON.stringify(result))
        //
        // for (let i = 0; i < result.length; i++) {
        //     let value = result[i]
        //     logd("文字 : " + value.label + " x: " + value.x + " y: " + value.y + " width: " + value.width + " height: " + value.height)
        return result;
    }

     else {
        logw("未识别到结果")
    }

}

// ===== 核心分拣逻辑 =====
function filterMessages(ocrResults) {
    const myMessages = [];     // 自己发送的消息
    const otherMessages = []; // 对方发送的消息
    const parsedMessages = [] //解析后的消息

    // 消息时间戳缓存（优化后的时间匹配）
    const timeRegex = /(?:\d{1,2}月\d{1,2}日)?\s*\d{1,2}:\d{2}/;
    let timeStamps = ocrResults.filter(item =>
        timeRegex.test(item.label) &&
        (item.label.includes("昨天") || item.label.includes("今天"))
    );

    // 亲密度提取（防御性处理）
    const intimacyItem = ocrResults.find(item =>
        item.label.includes("C") &&
        item.x > 800 &&
        item.y < 300
    );
    const intimacy = intimacyItem ?
        parseFloat((intimacyItem.label || '').replace(/[^0-9.]/g, '')) : 0;

    // 遍历所有OCR结果
    ocrResults.forEach(item => {
        // 增强系统消息过滤（传入y坐标）
        if (isSystemMessage3(item.label, item.y)) return;

        // 动态坐标阈值（适配不同分辨率）
        const screenWidth = device.getScreenWidth();
        const isMy = item.x > screenWidth * 0.26; // 右侧60%区域
        const isOther = item.x < screenWidth * 0.25; // 左侧40%区域

        if (isMy) {
            let timeMsg = findNearestTime(item, timeStamps);
            //let senderType = true
            myMessages.push(formatMessage(item, timeMsg));
            parsedMessages.push(formatMessage(item,timeMsg,true))
        } else if (isOther) {
            //let senderType = false
            let timeMsg = findNearestTime(item, timeStamps);
            otherMessages.push(formatMessage(item, timeMsg));
            parsedMessages.push(formatMessage(item,timeMsg,false))
        }
    });

    return { myMessages, otherMessages,intimacy,parsedMessages };
}


// 时间关联优化（垂直位置优先）
function findNearestTime(msgItem, timeStamps) {
    return timeStamps
        .filter(t => Math.abs(t.y - msgItem.y) < 50) // 垂直差值小于50像素
        .sort((a,b) => a.y - b.y)[0]?.label || '未知时间';
}
// 消息格式化
function formatMessage(item,time,isOwn) {
    return {
        sender_type:isOwn ? 1 : 0,
        content: item.label,
        time: time,
        position: {
            x: item.x,
            y: item.y,
            width: item.width,
            height: item.height
        }
    };
}

function findNewMsgInMsgList() {
    //在聊天界面找到新消息
    const msgRegex = "^\\s*(\\d+)\\s{2,}(.+?)\\s+((?:\\d{4}-\\d{2}-\\d{2}\\s+)?(?:昨天|今天|前天)?\\s*\\d{1,2}:\\d{2})\\s+(.+)";
    var listNewMsgNode = descMatch(msgRegex).getOneNodeInfo(2000);
    if(listNewMsgNode) {
        logd("识别到新消息用用户节点",JSON.stringify(listNewMsgNode));
        listNewMsgNode.click()
        sleep(random(1500, 2000));
        return true
    }
    return false

}


// ====== 配置参数 ======
const OCR_RETRY_CONFIG = {
    maxAttempts: 3,    // 最大重试次数
    retryDelay: 1500,  // 重试间隔(ms)
    useNodeFallback: false // 是否启用节点描述降级方案
};

// ====== 带重试的OCR识别流程 ======
function robustOCR() {
    let attempts = 0;
    let ocrResults = [];

    while (attempts < OCR_RETRY_CONFIG.maxAttempts) {
        ocrResults = ocrFunc();

        // 验证识别结果有效性
        if (ocrResults?.length > 0) {
            logd(`第${attempts+1}次OCR识别成功`);
            return ocrResults;
        }

        // 执行重试策略
        attempts++;
        if (attempts < OCR_RETRY_CONFIG.maxAttempts) {
            logw(`第${attempts}次识别失败，${OCR_RETRY_CONFIG.retryDelay}ms后重试...`);
            sleep(OCR_RETRY_CONFIG.retryDelay);

            // // 可选：重试前执行界面刷新
            // if (needsRefresh()) swipeUp(300);
        }
    }

    // 降级方案：使用节点描述获取信息
    if (OCR_RETRY_CONFIG.useNodeFallback) {
        logw("OCR持续失败，启用节点描述降级方案");
        return getNodeDescriptionData() ;


    }

    return null;
}

// var msgNode = clz("android.widget.EditText").getOneNodeInfo(1000)
// if(msgNode){
//     var chatMessages = msgNode.previousSiblings()[0].child(0).allChildren();
//     logd(JSON.stringify(chatMessages))
//     logd(JSON.stringify(chatMessages[chatMessages.length-1]))
//
// }


// ====== 降级方案实现 ======
function getNodeDescriptionData() {
    const messages = []
    try {
        // 获取聊天容器节点
        const msgContainer = clz("android.widget.EditText")
            .getOneNodeInfo(2000)
            ?.previousSiblings()[0]
            ?.child(0);

        if (!msgContainer) {
            logw("未找到消息容器");
            return null;
        }

        // 获取所有消息子节点
        const chatNodes = msgContainer.allChildren();
        if (chatNodes.length === 0) return null;

        // 逆向遍历消息列表（从最新消息开始）
        for (let i = chatNodes.length - 1; i >= 0; i--) {
            const node = chatNodes[i];
            if (!node?.desc) continue; // 跳过无描述节点

            const message = parseChatNode(node);
            if (!message?.content) continue; // 跳过无内容消息

            //logd(JSON.stringify(message))
            // 过滤系统消息
            //if (isSystemMessage(message.content)) continue;
            messages.push(message)


        }
        return message; // 返回最新有效消息
    } catch(e) {
        loge("节点描述解析失败:", e);
    }
    return null;
}

// ====== 高级消息解析 ======
function parseChatNode(node) {
    const descParts = node.desc?.split('\n') || [];
    return {
        time: descParts[0] || '未知时间',
        content: descParts.slice(1).join('\n') || '',
        raw: desc,
    };
}
//
// // ====== 安全系统消息过滤 ======
// const SYSTEM_KEYWORDS = ['积分', '金币', '权限', '恭喜'];
// function isSystemMessage(content) {
//     // 防御性检查
//     if (typeof content !== 'string') return false;
//     return SYSTEM_KEYWORDS.some(kw => content.includes(kw));
// }

// var message1 = getNodeDescriptionData()
// logd(JSON.stringify(message1.content))

function ocrMsg() {
    try {

        // ====== 改进后的调用方式 ======
        // 原始调用代码改造
        const ocrResults = robustOCR();  // 替换原来的 ocrFunc()
        if (!ocrResults || ocrResults.length === 0) {
            loge("所有识别方案均失败");
           var sendMessageContent = getNodeDescriptionData()


            // 构建提示词
            //var prompt = "请根据最近的对话生成回复：${JSON.stringify(sendMessage.content)},回复要求：1. 中文口语化，长度<20字;2. 避免敏感内容"
            // 使用模板字符串（反引号包裹）
            let prompt1 = `请根据最近的对话生成回复：${JSON.stringify(sendMessageContent.content)}，回复要求：
                                1. 中文口语化，长度<20字
                                2. 避免敏感内容`;

            logd("=== AI提示词 ===\n" + prompt1);

            // 获取AI回复
            var aiReply = getAIResponse(prompt1);
            if(aiReply) {
                var message = aiReply;
                sendMessage("131415",message)
                performNavigationBack()
            }else{
                message = getRandomMessage(NORMAL_MESSAGE_FILE)
                sendMessage("131415",message)
                sleep(randomInt(500,1000));
                performNavigationBack()
            }
            return

        }

        // // OCR识别
        // var ocrResults = ocrFunc();
        // if (!ocrResults || ocrResults.length === 0) {
        //     loge("未识别到消息，启用抓节点描述，获得新消息");
        //     //return;

        //}
        //B计划，根据节点描述识别新消息
        // bounds([0,254][1080,2079])
        // 在android.widget.EditText的上一个兄弟节点，的子节点的，子节点，是消息的节点；

        // 消息分拣
        var result = filterMessages(ocrResults);
        logd("OCR识别解析结果:", JSON.stringify(result))
        //const { myMessages, otherMessages, intimacy,parsedMessages } = filterMessages(result)
        var parsedMessages = result.parsedMessages;
        var intimacy = result.intimacy //亲密度
        var otherMessages = result.otherMessages;
        logd("对方消息:",JSON.stringify(otherMessages))

        // 执行用户ID获取
        const targetUserId = getTargetUserId(otherMessages);
        logd("最终获取的用户ID:", targetUserId);
        logd("\n亲密度:", intimacy);
        // 构建提示词
        var prompt = buildPrompt(parsedMessages);
        logd("=== AI提示词 ===\n" + prompt);

        // 获取AI回复
        var aiReply = getAIResponse(prompt);
        if(aiReply) {
            var message = aiReply;
            logd('AI回复内容：',aiReply)
            sendMessage(targetUserId,message)
            //toast("AI回复"+ aiReply);
            performNavigationBack()
        }else{
            message = getRandomMessage(NORMAL_MESSAGE_FILE)
            sendMessage(targetUserId,message)
            logd('随机回复内容：',message)
            sleep(randomInt(500,1000));
            performNavigationBack()
        }

    }
    catch (e) {
        loge("流程异常:", e);
    }
}

// function getAIReplyMessage(){
//
// }
// function getKeywordsReplyMessage(){
//
// }
// function getNomalReplyMessage(){
//
// }
// function getIntimacyReplyMessage(){
//
// }


// function replyOption(){
//     if(ReplyConfig.normalReply & !ReplyConfig.intimacyReply && !ReplyConfig.keywordsReply && !ReplyConfig.aiReply )
//     {
//         message = getNomalReplyMessage();
//         sendMessage(userId,message)
//     }
//     else if(ReplyConfig.normalReply & ReplyConfig.intimacyReply && !ReplyConfig.keywordsReply && !ReplyConfig.aiReply )
//     {
//         message = getNomalReplyMessage();
//         sendMessage(userId,message)
//     }
// }

// ===== 配置项 =====
const SWIPE_CONFIG = {
    maxAttempts: 10,              // 最大尝试次数
    swipeDuration: 800,          // 滑动动画时间(ms)
    loadWaitTime: 1500,          // 滑动后加载等待时间(ms)
    startPoint: [400, 2000],     // [x, y] 起始点(屏幕下方)
    endPoint: [500, 300]         // [x, y] 终止点(屏幕上方)
};

// ===== 增强版滑动检测 =====
function swipeToFindNewMessage() {
    let swipeCount = 0; // 初始化滑动计数器
    let hasReachedTop = false;

    // 主处理循环
    while (hasMessageNode() && swipeCount < SWIPE_CONFIG.maxAttempts) {
        // 处理当前页消息
        while (findNewMsgInMsgList()) {
            ocrMsg();
            if(verifyProfileCard()){
                back()
                sleep(500);
            }
            if(clz("android.widget.EditText").getOneNodeInfo(50)){
                back()
            }
        }

        // 执行下滑操作
        swipeToPoint(
            adaptX(SWIPE_CONFIG.startPoint[0]),
            adaptY(SWIPE_CONFIG.startPoint[1]),
            adaptX(SWIPE_CONFIG.endPoint[0]),
            adaptY(SWIPE_CONFIG.endPoint[1]),
            SWIPE_CONFIG.swipeDuration
        );

        // 更新计数器
        swipeCount++;
        logd(`[滑动统计] 已滑动 ${swipeCount} 次`);

        // 等待内容加载
        sleep(SWIPE_CONFIG.loadWaitTime);

        // 检测是否到达底部
        if (isPageBottom()) break;
    }

    // 返回顶部处理
    resetToTop(swipeCount);

    // 返回首页
    clickPoint(adaptX(145), adaptY(2337));
    sleep(random(500, 800));
    return swipeCount;
}

// ===== 返回顶部逻辑 =====
function resetToTop(swipeCount) {
    logd(`[返回顶部] 开始执行 ${swipeCount} 次反向滑动`);

    // 反向滑动参数
    const reverseConfig = {
        startY: SWIPE_CONFIG.endPoint[1] + 200, // 上滑终点加偏移量
        endY: SWIPE_CONFIG.startPoint[1] - 200  // 下滑起点减偏移量
    };

    for (let i = 0; i < swipeCount; i++) {
        swipeToPoint(
            adaptX(SWIPE_CONFIG.endPoint[0]),
            adaptY(reverseConfig.startY),
            adaptX(SWIPE_CONFIG.startPoint[0]),
            adaptY(reverseConfig.endY),
            SWIPE_CONFIG.swipeDuration * 1.2 // 增加滑动时间
        );
        sleep(SWIPE_CONFIG.loadWaitTime);
    }
}


// ===== 工具函数 =====
function isPageBottom() {
    // 通过检测底部特征元素判断
    return descMatch(".*已经到底部|没有更多内容|超过12小时的无效消息将自动清除.*").getOneNodeInfo(500);
}
// var testnode = descMatch(".*已经到底部|没有更多内容|超过12小时的无效消息将自动清除.*").getOneNodeInfo(500);
// if(testnode){
//     logd(JSON.stringify(testnode))
// }

// 超过12小时的无效消息将自动清除
//
// 最近常聊
// 全部消息




function autoReplyLoop(){


    swipeToFindNewMessage()


}

// ===== 用户ID获取函数 =====
function getTargetUserId(otherMessages = []) {
    // 参数校验与默认值
    if (!Array.isArray(otherMessages) || otherMessages.length === 0) {
        loge("无效消息列表，使用默认ID");
        return 168314;
    }

    // 动态计算遍历范围（避免越界）
    const startIdx = 1;
    const RETRY_LIMIT = 2; // 每条消息点击重试次数

    for (let i = startIdx; i < otherMessages.length; i++) {
        const msg = otherMessages[i];
        if (!msg?.position?.y) { // 防御性检查
            logw(`跳过无效消息项[索引${i}]`);
            continue;
        }

        logd(`处理第${i + 1}/${otherMessages.length}条消息，Y坐标: ${msg.position.y}`);


        // 点击重试机制
        for (let retry = 0; retry < RETRY_LIMIT; retry++) {
            clickPoint(adaptX(80), msg.position.y);
            const waitTime = random(800, 1200) * (retry + 1); // 重试等待递增
            sleep(waitTime);

            if (verifyProfileCard()) {
                const userId = getUserId();
                if (userId) {
                    logi(`成功获取用户ID: ${userId}`);
                    back();
                    return userId;
                }
                logw(`第${retry + 1}次获取失败，重试`);

                sleep(1000);
            } else {
                logd(`未进入资料卡，第${retry + 1}次重试`);
            }
        }
    }

    // 兜底策略
    loge("全部尝试失败，使用默认ID");
    return 168314;
}

//
// // ===== 用户ID获取函数 =====
// function getTargetUserId(otherMessages) {
//     var userId = null; // 结果存储在外部可访问的变量
//
//     // 遍历对方消息列表
//     for (var i = otherMessages.length-3; i < otherMessages.length; i++) { // 修正循环语法
//         var msg = otherMessages[i];
//         logd("正在处理第", i+1, "条消息，Y坐标:", msg.position.y);
//         clickPoint(adaptX(80), msg.position.y);
//         sleep(random(800, 1200)); // 增加等待时间
//
//         // 验证是否进入资料卡
//         if (verifyProfileCard()) {
//             // 获取用户ID
//             userId = getUserId();
//             logi("成功获取用户ID:", userId);
//             back(); // 返回消息列表
//             sleep(1000);
//             return userId; // 直接返回结束函数
//             }
//
//         }
//     // 兜底策略
//     loge("未能获取有效用户ID，使用默认值");
//     return 168314;
// }


// ===== 精准消息筛选逻辑 =====
function buildPrompt(parsedMessages) {
    // 仅保留对方最后3条未回复消息
    const otherMsgs = parsedMessages.filter(function(msg) {
        return msg.sender_type === 0;
    }).slice(-3); // 取最后3条

    // 构建有效提示词
    const dialogHistory = otherMsgs.map(function(msg) {
        return "对方：" + msg.content;
    }).join("\n");

    return [
        "请根据最近的对话生成回复：",
        JSON.stringify(dialogHistory),
        "回复要求：",
        "1. 中文口语化，长度<20字",
        "2. 避免敏感内容",
        "3. 添加表情"
    ].join("\n");
}

//
// logd("=== 解析后的消息 ===");
// parsedMessages.forEach(msg => logd(`发送者${msg.sender_type} [${msg.time}] ${msg.content}`));
// logd(JSON.stringify(parsedMessages))
//
// logd("=== 我的消息 ===");
// myMessages.forEach(msg => logd(`[${msg.time}] ${msg.content}`));
//
// logd("\n=== 对方消息 ===");
// otherMessages.forEach(msg => logd(`[${msg.time}] ${msg.content}`));






// var prompt = "我好困呀，你在想谁？"
// var ai = getAIResponse(prompt)
// logd(ai)
//
// // ===== 兼容EasyClick的API调用方案 =====
// function getAIResponse(prompt) {
//     const DEEPSEEK_API_KEY = "s"; // 请替换有效API密钥
//     const API_ENDPOINT = "https://api.deepseek.com/v1/chat/completions";
//
//     try {
//         // 构建请求参数
//         const params = {
//             url: API_ENDPOINT,
//             method: "POST",
//             header: {
//                 "Content-Type": "application/json",
//                 "Authorization": "Bearer " + DEEPSEEK_API_KEY
//             },
//             requestBody: JSON.stringify({
//                 model: "deepseek-chat",
//                 messages: [
//                     {
//                         role: "system",
//                         content: "你是一个情感交流助手，用简体中文回复，20字以内，带表情"
//                     },
//                     { role: "user", content: prompt }
//                 ],
//                 temperature: 0.7,
//                 max_tokens: 50
//             }),
//             ignoreContentType: true,
//             ignoreHttpErrors: true,
//             timeout: 10000
//         };
//
//         // 发送请求
//         const response = http.request(params);
//
//         if (response) {
//             logd("API状态码:", response.statusCode);
//
//             if (response.statusCode === 200) {
//                 const data = JSON.parse(response.body);
//                 return data.choices[0]?.message?.content || "默认回复";
//             } else {
//                 loge("API错误响应:", response.body);
//             }
//         }
//     } catch (e) {
//         loge("请求异常:", e.message);
//     }
//     return null;
// }

// ===== 兼容EasyClick的API调用方案 =====
// function getAIResponse(prompt) {
//     const DEEPSEEK_API_KEY = "sk-2af600d433e673f29916";
//     const API_ENDPOINT = "https://api.deepseek.com/v1/chat/completions";
//     const MAX_RETRY = 3; // 最大重试次数
//     let retryCount = 0;
//
//
//     while (retryCount <= MAX_RETRY) {
//         try {
//             const params = {
//                 url: API_ENDPOINT,
//                 method: "POST",
//                 header: {
//                     "Content-Type": "application/json",
//                     "Authorization": "Bearer " + DEEPSEEK_API_KEY
//                 },
//                 requestBody: JSON.stringify({
//                     model: "deepseek-chat",
//                     messages: [{
//                         role: "system",
//                         content: "你是一个情感交流助手，用简体中文回复，20字以内，带表情"
//                     }, { role: "user", content: prompt }],
//                     temperature: 0.7,
//                     max_tokens: 50
//                 }),
//                 ignoreContentType: true,
//                 ignoreHttpErrors: true,
//                 timeout: 15000 // 适当延长超时时间
//             };
//
//             const response = http.request(params);
//             logd("API状态码:", response?.statusCode);
//
//             // 处理无响应体情况
//             if (!response || !response.body) {
//                 throw new Error("Empty response body");
//             }
//
//             // 防御性JSON解析
//             try {
//                 const data = JSON.parse(response.body);
//                 if (response.statusCode === 200) {
//                     return data.choices[0]?.message?.content || "默认回复";
//                 } else {
//                     loge("API错误:", data?.error?.message || "未知错误");
//                 }
//             } catch (parseError) {
//                 throw new Error(`JSON解析失败: ${parseError.message}`);
//             }
//
//         } catch (e) {
//             loge(`请求异常[重试${retryCount}]:`, e.message);
//             if (retryCount === MAX_RETRY) break;
//
//             // 指数退避重试
//             sleep(2000 * Math.pow(2, retryCount));
//             retryCount++;
//         } finally {
//             // 确保关闭连接
//             try { http.close(); } catch (e) {}
//         }
//     }
//     return null;
// }

// ===== 增强版API调用 =====
function getAIResponse(prompt) {
    const CONFIG = {
        apiKey: "sk-2af600d439916",
        endpoint: "https://api.deepseek.com/v1/chat/completions",
        maxRetry: 5,                // 最大重试次数
        baseTimeout: 15000,          // 基础超时时间
        retryDelay: [2000, 4000, 8000], // 渐进式重试延迟
        safeResponse: "有点想~了 " // 安全默认回复
    };

    let attempt = 0;
    let lastError = null;

    while (attempt <= CONFIG.maxRetry) {
        let response = null;
        try {
            // 动态超时机制
            const dynamicTimeout = CONFIG.baseTimeout * (attempt + 1);

            // 请求参数强化
            const params = {
                url: CONFIG.endpoint,
                method: "POST",
                header: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${CONFIG.apiKey}`,
                    "X-Request-ID": generateUUID() // 唯一请求标识
                },
                requestBody: JSON.stringify({
                    model: "deepseek-chat",
                    messages: [{
                        role: "system",
                        content: "你是一个情感交流助手，用简体中文回复，20字以内，带表情"
                    }, {
                        role: "user",
                        content: `${prompt} [${attempt+1}/${CONFIG.maxRetry+1}]` // 添加重试标记
                    }],
                    temperature: 0.7,
                    stream: false,
                    max_tokens: 50
                }),
                timeout: dynamicTimeout,
                ignoreContentType: true,
                enableHTTP2: true,    // 启用HTTP/2
                keepAlive: false      // 禁用长连接
            };

            logd(`[请求] 第${attempt+1}次尝试 超时:${dynamicTimeout}ms`);
            //response = http.request(params);
            response = http.request(params);
            lastResponse = response; // 保存响应对象
            logd(`[响应] 状态码: ${response.statusCode}`);
            // 正确释放资源的方式 ↓↓↓
            if (response?.close) {
                response.close(); // 关闭具体响应而非全局http
            }
            // // 强制释放连接
            // http.close();

            // 空响应体处理
            if (!response?.body?.trim()) {
                throw new Error(`空响应体 (长度:${response.body?.length || 0})`);
            }

            // 安全解析JSON
            const data = safeParseJson(response.body) || {};
            if (response.statusCode === 200) {
                return formatResponse(data.choices[0]?.message?.content);
            }

            // 处理4xx/5xx错误
            handleHttpError(response.statusCode, data.error);

        } catch (e) {
            // 错误处理中关闭响应 ↓↓↓
            if (lastResponse?.close) {
                lastResponse.close();
            }
            lastError = e;
            logw(`[异常] 尝试${attempt+1}: ${e.message}`);

            // 非重试性错误立即终止
            if (isFatalError(e)) break;

            // 执行延迟重试
            if (attempt < CONFIG.maxRetry) {
                const delay = CONFIG.retryDelay[attempt] || 10000;
                logd(`等待 ${delay}ms 后重试...`);
                sleep(delay);
            }
        } finally {
            // 确保释放资源
            //try { http.close(); } catch (e) {}
            attempt++;
        }
    }

    // 失败兜底处理
    logw(`[失败] 最终错误: ${lastError?.message || '未知错误'}`);
    return CONFIG.safeResponse;
}

// ===== 工具函数 =====
// 安全JSON解析
function safeParseJson(str) {
    try {
        return JSON.parse(str);
    } catch (e) {
        logw(`JSON解析失败: ${e.message} | 内容: ${str?.slice(0, 100)}...`);
        return null;
    }
}

// 生成UUID
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// 格式化响应内容
function formatResponse(text) {
    return (text || "")
        .replace(/[^\u4e00-\u9fa5a-zA-Z0-9\s，。！？]/g, "") // 过滤特殊字符
        .slice(0, 20) + " 😊"; // 长度控制+表情兜底
}

// 错误类型判断
function isFatalError(e) {
    return e.message.includes("certificate") || // SSL证书错误
        e.message.includes("ENOTFOUND") ||   // DNS解析失败
        e.message.includes("ECONNREFUSED");  // 连接拒绝
}

// HTTP错误处理
function handleHttpError(code, error) {
    const retryCodes = [429, 502, 503, 504];
    if (retryCodes.includes(code)) {
        throw new Error(`[${code}] ${error?.message || '可重试错误'}`);
    }
    throw new Error(`[${code}] ${error?.message || '不可恢复错误'}`);
}

function isSystemMessage1(text) {
    return /官方提示|系统消息|本平台/i.test(text);
}

// ================== 系统消息检测 ==================
function isSystemMessage2(text) {
    return text.includes("小助手") ||
        text.includes("官方") ||
        text.match(/【.+】/);
}

// ===== 增强版工具函数 =====
// 系统消息判断（新增y坐标和亲密度条件）
const SYSTEM_KEYWORDS = ['积分', '个人相册','妥善保护个人信息','文明沟通', '收益', '认证状态', '欢迎','平台倡导', '引导加QQ','请立即举报', '诈骗', '客服', '官方','以线下约会为由'];
function isSystemMessage3(text, y) {
    const isKeywordMatch = SYSTEM_KEYWORDS.some(kw => text.includes(kw));
    const isIntimacy = /^\d+\.\d+C$/.test(text);
    const isBottomArea = y >= device.getScreenHeight() * 0.8;
    return isKeywordMatch || isIntimacy || isBottomArea;
}



function hasMessageNode() {
    var newMsgNode = descMatch("\\s*(\\d+)").bounds(adaptX(500), adaptY(2000), adaptX(900), adaptY(2500)).getOneNodeInfo(1500)
    if (newMsgNode) {
        logd("识别到有新消息",JSON.stringify(newMsgNode))
        newMsgNode.click()
        sleep(randomInt(500, 1000));
        return true
    }
    return false
}

// function onlyAutoReplyLoop(){
//     //是否有新消息？ 检测底部消息出现红点,进入消息列表//或者出现数字
//
//     if(hasMessageNode()){
//         swipeToFindNewMessage()
//     }
//
//    }

   function aiReplyLoop(){

       if(hasMessageNode()){
         swipeToFindNewMessage()
    }
//
   }

