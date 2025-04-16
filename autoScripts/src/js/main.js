// ================== 配置变量 ==================

var FilterConfig;
var ReplyConfig;
var customMessage;
// ================== 配置常量 ==================
const APP_PACKAGE = "com.xitong.xtapp";
const MAX_RETRY = 3;
const OPERATION_INTERVAL = 1500;

//设备适配模块
let SCREEN_SCALE = {
    width: device.getScreenWidth() / 1080,
    height: device.getScreenHeight() / 2400
};
logd(SCREEN_SCALE.width,SCREEN_SCALE.height)
logd(device.getScreenHeight(),device.getScreenWidth());

const LIST_BOUNDS = {
    left: 0,
    top: device.getScreenHeight() * 0.125, // 原300/2400
    right: device.getScreenWidth(),
    bottom: device.getScreenHeight() * 0.947 // 原2272/2400
};



function main() {

    // 必须首先初始化设备
    initDevice();
    init_hua();
    //初始化环境
    initEnv()
    //初始化ocr
    initOcrLite()
    // ================== 执行器 ==================
// 每30秒巡检弹窗
//     setInterval(() => {
//         handlePopups();
//     }, 30_000);
//

    // 后续操作示例
    const targetX = adaptX(500);
    const targetY = adaptY(2000);
    logd(`转换后坐标: (${targetX},${targetY})`);

    const intimacyThreshold = readConfigInt("intimacyThreshold")
    const greetLimit = readConfigInt("greetLimit")
    customMessage = readConfigString("customMessage")

    FilterConfig = parseFilterConfig();
    ReplyConfig = parseReplyConfig();
    logd(JSON.stringify(ReplyConfig));
    logd(JSON.stringify(FilterConfig));
    logd(JSON.stringify(intimacyThreshold));
    logd(JSON.stringify(greetLimit));
    logd(JSON.stringify(customMessage));


    //clickPoint(targetX, targetY);

    logd(`当前分辨率：${device.getScreenWidth()}x${device.getScreenHeight()}`);


    try {

        // appIsRuning = laoleng.app.isRunningPkg(APP_PACKAGE)
        // logd("app1" + appIsRuning);

        // 启动应用（使用官方推荐方式）
        const launchSuccess = utils.openApp(APP_PACKAGE);
        //const launchSuccessLeng = laoleng.app.isRunningPkg(APP_PACKAGE)
        if (!launchSuccess) {
            throw new Error("应用启动失败");
        }


        // 定义策略枚举
        const OperationMode = {
            GREET_ONLY: 1,
            REPLY_ONLY: 2,
            COMBINED: 3
        };

// 状态检测函数
        const checkConditions = () => {
            const hasGreet = FilterConfig.greet || FilterConfig.privateMsg;
            const hasReply = ReplyConfig.normalReply || ReplyConfig.keywordsReply
                || ReplyConfig.intimacyReply || ReplyConfig.aiReply;

            if (hasGreet && hasReply) return OperationMode.COMBINED;
            if (hasGreet) return OperationMode.GREET_ONLY;
            if (hasReply) return OperationMode.REPLY_ONLY;
            return null;
        };

// 策略执行器
        const executeStrategy = (mode) => {
            const strategyMap = {
                [OperationMode.GREET_ONLY]: () => {
                    logd("[策略] 单独执行打招呼流程");
                    handleGreetOrSendPrivateMsg(greetLimit);
                },
                [OperationMode.REPLY_ONLY]: () => {
                    logd("[策略] 单独执行自动回复流程");
                    //onlyAutoReplyLoop();
                    aiReplyLoop();
                },
                [OperationMode.COMBINED]: () => {
                    logd("[策略] 复合模式：打招呼→等待→自动回复");
                    handleGreetOrSendPrivateMsg(greetLimit);
                    //waitForResponse();      // 新增等待响应逻辑
                    //autoMessageReply();
                }
            };

            strategyMap[mode]?.();
        };

// 主执行逻辑
        const currentMode = checkConditions();
        if (currentMode) {
            executeStrategy(currentMode);
        } else {
            logd("无有效操作模式被激活");
        }



    } catch (e) {
        logd(e);
    }

}
// 使用示例
    // 自动回复配置解析器
    function parseReplyConfig() {
        const config = getConfigJSON();
        return {
            normalReply: config.normalReply === "true",
            keywordsReply: config.keywordsReply === "true",
            intimacyReply: config.intimacyReply === "true",
            aiReply: config.aiReply === "true"
        };
    }

// 过滤配置解析器
    function parseFilterConfig() {
        const config = getConfigJSON();
        return {
            privateMsg: config.privateMsg === "true",
            greet: config.greet === "true",
            historyUser: config.historyUser === "true",
            todayUser: config.todayUser === "true"
        };
    }





// ================== 工具函数 ==================
        function random(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        function pressBack() {
            back() // Android返回键
        }

        //logd("用户名:" + userName, "用户ID:" + userId)

    /**
     * 安全获取当前前台应用包名 (兼容EasyClick 11.x)
     * @returns {string} 当前前台应用包名或"unknown"
     */
    function getCurrentPackage() {
        // 方案1：使用设备信息模块
        if (typeof device.getForegroundPackage === "function") {
            return device.getForegroundPackage() || "unknown";
        }
    }


// 缓存检测结果（有效期内直接返回）
    let packageCache = {
        value: "",
        expire: 0
    };

    function getCachedPackage() {
        if (Date.now() < packageCache.expire) {
            return packageCache.value;
        }

        const current = getCurrentPackage();
        packageCache.value = current;
        packageCache.expire = Date.now() + 1500; // 1.5秒缓存
        return current;
    }


    /**
     * 界面核心组件验证
     */

    const performance = {
        coldStart: 0,
        componentInit: 0
    };

    const startTimestamp = Date.now();
// ...启动成功后记录
    performance.coldStart = Date.now() - startTimestamp;

// 根据设备性能动态调整超时
    const DEVICE_LEVEL = device.brand === "xiaomi" ? 1 : 2;
    const TIMEOUT = DEVICE_LEVEL === 1 ? 35 : 25;

// 开启调试模式
// 替代方案：自定义日志系统
    const LOG_LEVEL = {
        NONE: 0,
        BASIC: 1,
        DEBUG: 2
    };

    let currentLogLevel = LOG_LEVEL.BASIC;

    function log(msg, level = LOG_LEVEL.BASIC) {
        if (level <= currentLogLevel) {
            console.log(`[${new Date().toISOString()}] ${msg}`);
        }
    }

// 示例使用
    log("基础日志"); // 默认显示
    log("调试信息", LOG_LEVEL.DEBUG); // 需要设置 currentLogLevel = DEBUG 才会输出


    function ck_dk() {
        clearLog(-1)
        setFloatDisplayLineNumber(false)
        showLogWindow();
        requestFloatViewPermission(1000);
        var m = {
            "x": 10,
            "y": device.getScreenHeight() - 510,
            "w": device.getScreenWidth() - 20,
            "h": 500, //自定义位置 xy 为起点坐标 w h 宽 高
            "textSize": 15,  // 日志打印字体大小
            "backgroundColor": "0x00404040", //自定义颜色值
            "title": "",
            "showTitle": false
        }
        setLogViewSizeEx(m);
    }
// 在自动化脚本中
const config = {
    filters: JSON.parse(readConfigString("filters") || "[]")
};


//启动主程序
main();



//待实现功能：
// 1、过滤历史私信用户