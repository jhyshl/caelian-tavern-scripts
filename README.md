# 凯利安酒馆脚本

这是凯利安角色卡的远程脚本仓库。玩家端只需要保留一个很小的远程加载器，后续更新由仓库里的脚本文件控制，避免每次更新都重新导入整张角色卡导致存档风险。

## 玩家端入口

在酒馆助手脚本里保留这一句：

```js
import 'https://testingcf.jsdelivr.net/gh/jhyshl/caelian-tavern-scripts@main/loader.js';
```

测试版入口：

```js
import 'https://testingcf.jsdelivr.net/gh/jhyshl/caelian-tavern-scripts@main/loader-beta.js';
```

## 文件说明

- `loader.js`：远程加载器。读取 `manifest.json` 后加载正式脚本。
- `manifest.json`：版本清单。以后更新版本号和入口文件。
- `caelian-all-in-one.js`：当前整合后的主脚本包。
- `loader-stable.js`：稳定版入口。
- `loader-beta.js`：测试版入口。
- `IMPORT_THIS_IN_TAVERN_HELPER.txt`：给玩家复制用的一句话入口。

## 更新方法

1. 替换 `caelian-all-in-one.js`。
2. 打开 `manifest.json`。
3. 把 `channels.stable.version` 改成新版本，例如 `v6.126`。
4. 提交更改。

版本号一定要改。加载器会用版本号生成脚本链接，避免玩家继续读到旧缓存。

## 注意

旧的内置大脚本不要和远程 loader 同时启用，否则会重复注册按钮、重复监听事件，可能造成 UI 异常或数据重复写入。

第一次切换到远程版时，玩家仍然需要更新一次角色卡或导入一个小补丁，把原来的内置大脚本换成远程 loader。之后就可以通过 GitHub 维护脚本。
