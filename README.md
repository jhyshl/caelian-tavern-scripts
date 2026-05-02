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


## 发布流程（强制）

以下流程用于保证稳定版可回滚、测试版可快速迭代：

1. **不要直接覆盖正式版文件**
   - 未收到“发布正式版”指令前，不直接修改 stable 当前正式入口文件。

2. **开发期间只改 beta 文件**
   - 日常开发/修复统一改 `caelian-beta.js`，或 `manifest.json` 中 `channels.beta.entry` 指向的文件。

3. **manifest.json 必须保留 stable / beta 双通道**
   - `stable` 给普通玩家。
   - `beta` 给测试玩家。

4. **一个开发周期内不频繁创建 beta 新文件**
   - 正式发布前可持续使用同一个 beta 文件（例如 `caelian-beta.js`）。
   - 不要为每个小改动创建 `beta.1`、`beta.2` 等子版本，除非明确要求。

5. **只在正式发布时创建新的正式版文件**
   - 收到“发布正式版”后，再创建新的正式文件（例如 `caelian-v6.126.js`）。
   - 然后再更新 `manifest.json` 的 `channels.stable.entry` 指向新文件。

6. **发布正式版时保留旧正式版**
   - 不删除旧正式文件（例如 `caelian-v6.125.js`），以便回滚。

7. **更新顺序固定**
   - 先改 beta 文件。
   - 再测试。
   - 再复制/整理成新的正式版文件。
   - 最后修改 `manifest.json` 的 stable 指向。

8. **任何修改都不能清空玩家存档**
   - 不重置 `localStorage`。
   - 不重置变量管理器里的玩家数据。
   - 新增字段必须写迁移逻辑，为旧存档补字段，不覆盖旧数据。

9. **每次提交前检查**
   - JS 语法无报错。
   - `manifest.json` 为合法 JSON。
   - stable 仍指向可用文件。
   - beta 可指向测试文件。
   - 未测试代码不得发布到 stable。
