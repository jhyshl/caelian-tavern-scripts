// 凯利安酒馆脚本远程加载器
// 玩家酒馆助手里只需要保留：
// import 'https://testingcf.jsdelivr.net/gh/jhyshl/caelian-tavern-scripts@main/loader.js';

const CAELIAN_REMOTE_REPO = 'jhyshl/caelian-tavern-scripts';
const CAELIAN_REMOTE_BRANCH = 'main';
const CAELIAN_REMOTE_DEFAULT_CHANNEL = 'stable';
const CAELIAN_REMOTE_CDN_BASE = `https://testingcf.jsdelivr.net/gh/${CAELIAN_REMOTE_REPO}@${CAELIAN_REMOTE_BRANCH}`;
const CAELIAN_REMOTE_RAW_BASE = `https://raw.githubusercontent.com/${CAELIAN_REMOTE_REPO}/${CAELIAN_REMOTE_BRANCH}`;

function caelianRemoteTopWindow() {
  try { return window.parent || window; } catch (e) { return window; }
}

async function caelianFetchJson(url) {
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) throw new Error(`读取失败：${response.status} ${response.statusText}`);
  return response.json();
}

async function caelianLoadRemote() {
  const topWin = caelianRemoteTopWindow();
  const state = topWin.__CAELIAN_REMOTE_LOADER__ || (topWin.__CAELIAN_REMOTE_LOADER__ = {});
  if (state.loadingPromise) return state.loadingPromise;

  state.loadingPromise = (async () => {
    const requestedChannel = String(topWin.__CAELIAN_REMOTE_CHANNEL__ || CAELIAN_REMOTE_DEFAULT_CHANNEL || 'stable').trim() || 'stable';
    const manifestUrl = `${CAELIAN_REMOTE_RAW_BASE}/manifest.json?ts=${Date.now()}`;
    console.log('[CaelianRemote] 读取 manifest:', manifestUrl);
    const manifest = await caelianFetchJson(manifestUrl);
    const channelName = manifest.channels?.[requestedChannel] ? requestedChannel : (manifest.defaultChannel || 'stable');
    const channel = manifest.channels?.[channelName];
    if (!channel || !channel.entry) throw new Error(`manifest 中找不到频道或入口：${channelName}`);

    const version = String(channel.version || manifest.version || 'dev');
    if (state.loadedVersion === version && state.loadedChannel === channelName) {
      console.log(`[CaelianRemote] 已加载 ${channelName}/${version}，跳过重复加载。`);
      return { channel: channelName, version, skipped: true };
    }

    const entryPath = String(channel.entry).replace(/^\/+/, '');
    const entryUrl = `${CAELIAN_REMOTE_CDN_BASE}/${entryPath}?v=${encodeURIComponent(version)}`;
    console.log(`[CaelianRemote] 加载 ${channelName}/${version}:`, entryUrl);
    await import(entryUrl);

    state.loadedVersion = version;
    state.loadedChannel = channelName;
    state.loadedAt = Date.now();
    console.log(`[CaelianRemote] 凯利安脚本加载完成：${channelName}/${version}`);
    return { channel: channelName, version, skipped: false };
  })().catch(err => {
    try { console.error('[CaelianRemote] 加载失败：', err); } catch(e) {}
    throw err;
  }).finally(() => {
    state.loadingPromise = null;
  });

  return state.loadingPromise;
}

caelianLoadRemote();
export {};
