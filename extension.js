const vscode = require('vscode');
const fs = require("fs");
const path = require("path");

const tplType = {
    COMPONENT: 'COMPONENT',
    ROUTE: 'ROUTE'
}
const tplFileMap = {
    [tplType.COMPONENT]: 'component.js',
    [tplType.ROUTE]: 'route.js'
}


// 主入口
exports.activate = function activate(context) {

    // 注册两个命令

    // 1. routeGenerator
    let routeDisposable = vscode.commands.registerCommand('extension.ngRouteGenerator', function (uri) {

        genCommand(uri, tplType.ROUTE);
    });

    let compoDisposable = vscode.commands.registerCommand('extension.ngCompoGenerator', function(uri) {
        genCommand(uri, tplType.COMPONENT);
    });

    context.subscriptions.push(routeDisposable);
    context.subscriptions.push(compoDisposable);
}

// this method is called when your extension is deactivated
exports.deactivate = function deactivate() {
}


function genCommand(uri, type) {
        // 生成模板的步骤如下
        // 0. 获取当前需要建立目录的位置， 如果是在文件上执行则用文件的父目录，如果是在目录上执行则在该目录下建立
        const currentPath = uri.fsPath;
        const stats = fs.statSync(currentPath);
        let parentPath = null;
        if (stats.isDirectory()) parentPath = currentPath;
        if (stats.isFile()) parentPath = path.dirname(currentPath);

        // 1. 询问当前目录的名称, 生成目录
        vscode.window.showInputBox({
            placeHolder: '输入模块名称，请勿使用驼峰命名的形式'
        }).then(moduleName => {
            const folderPath = path.join(parentPath, moduleName);
            fs.mkdirSync(folderPath);

            // 2. 根据模块名称生成各个模板文件名称
            const jsFile = path.join(folderPath, 'index.js');
            const htmlFile = path.join(folderPath, 'index.tpl.html');
            const lessFile = path.join(folderPath, 'style.less');
            const fileList = [htmlFile, lessFile, jsFile];

            // 3. 根据模块名称和模板类型，获取文件模板内容， 生成目录和文件
            const tplFile = path.resolve(__dirname, './tpl/' + tplFileMap[type]);
            fileList.forEach(file => {
                copyFile(tplFile, file, moduleName);
            });
        })
}

function copyFile(source, target, moduleName) {
    const ext = path.extname(target);
    // 生成非js文件
    if (ext !=='.js') {
        
        const contentMap = {
            '.html': `<div class="${moduleName}-container">${getRandomStr()}</div>`,
            '.less': `.${moduleName}-container {}`
        }
        fs.writeFile(target, contentMap[ext], err => {
            if(!err) return;
            vscode.window.showErrorMessage(err.message);
        })
        return;
    }

    // 生成js文件
    fs.readFile(source, (err, data) => {
        if (err) {
            vscode.window.showErrorMessage(err.message);
            return;
        }

        // 如果是js文件，则替换Controller名称和component名称
        const revisedData = reviseFile(data, moduleName);

        fs.writeFile(target, revisedData, err => {
            if (err) {
                vscode.window.showErrorMessage(err.message);
                return;
            }
            console.log('文件复制完成😁');
        });
    })
}

function reviseFile(data, moduleName) {
    // 转为驼峰形式
    const name = moduleName.replace(/\-(\w)/g, (a, b) => b.toUpperCase());
    const controllerName = name[0].toUpperCase() + name.substr(1);
    return data.toString().replace(/#{controllerName}/, controllerName).replace(/#{componentName}/, name);
}

// 命令
// - explorer.newFile
// - explorer.newFolder
// "extension.ngRouteGenerator"
// "extension.ngCompoGenerator"

const randomStr = [
   ' 一、“救命！”墙壁里传来惨叫——《呼救》',
   '二、“猫呢？”“喵”他打了个嗝——《失踪的猫咪》',
   '三、“你开心吗？” “不开，怕疼”——《手术》',
   '四、电梯里只有我，但超重了——《电梯》',
   '五、“弹眼珠好玩！”外星小孩道——《外星人的童年》',
   '六、天亮，我躺回了自己坟里——《僵尸》',
   '七、北极熊终于吃到企鹅——《地球漏洞》',
   '八、“这里有鬼” “在哪？” “我就是”——《鬼屋》',
   '九、六个人进去，七个人出来——《凶宅》',
   '十、“你和你老婆穿情侣内裤？”——《出轨》',
   '十一、春天过去，冬天降临——《混乱季节》',
   '十二、他晃了晃脑袋，听见大海——《脑袋进水》',
   '十三、“这菜开胃”他递上匕首——《佳肴》',
   '十四、身首分离，爬出藤蔓——《寄生》',
   '十五、他苦笑：这路，我走了一生——《套路》',
   '十六、被超车时，白发飘了进来——《老司机》',
   '十七、看完不赞，就没我帅——《诅咒》',
   '十八、未完待续——《谎言》'
]

function getRandomStr() {
    const r = Math.random() * (randomStr.length - 1);
    return randomStr[Math.ceil(r)];
}
