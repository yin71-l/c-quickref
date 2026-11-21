/* =========================================================================
 * 音效反馈（Web Audio 合成，不依赖任何音频文件）
 * -------------------------------------------------------------------------
 * 设计考虑：
 *   1. 零资源：用振荡器合成短音，不需要下载 mp3/wav，离线也能用。
 *   2. 浏览器限制：AudioContext 必须由用户手势创建或恢复，
 *      所以第一次点击时才初始化，不在页面加载时创建。
 *   3. 可关闭：偏好存 localStorage；系统开启「减少动态效果」时默认静音。
 *   4. 极短：每个音都在 60~120ms 内结束，避免连点时嘈杂。
 *
 * 对外接口：window.Sfx = { click, correct, wrong, done, toggle, isOn }
 * ========================================================================= */
(function (global) {
  'use strict';

  var LS_KEY = 'c-quickref-sound';
  var ctx = null;
  var enabled = null;   // null = 尚未初始化

  function prefersReduced() {
    try {
      return global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (e) {
      return false;
    }
  }

  function readEnabled() {
    if (enabled !== null) return enabled;
    try {
      var v = global.localStorage.getItem(LS_KEY);
      if (v === '0') { enabled = false; return enabled; }
      if (v === '1') { enabled = true; return enabled; }
    } catch (e) { /* 隐私模式忽略 */ }
    // 没有存过：跟随系统「减少动态效果」偏好
    enabled = !prefersReduced();
    return enabled;
  }

  function saveEnabled(v) {
    enabled = v;
    try { global.localStorage.setItem(LS_KEY, v ? '1' : '0'); } catch (e) { /* 忽略 */ }
  }

  /* 懒创建 AudioContext：必须在用户手势中调用，否则被浏览器挂起 */
  function ensureCtx() {
    if (!readEnabled()) return null;
    try {
      var AC = global.AudioContext || global.webkitAudioContext;
      if (!AC) return null;
      if (!ctx) ctx = new AC();
      if (ctx.state === 'suspended' && ctx.resume) ctx.resume();
      return ctx;
    } catch (e) {
      return null;
    }
  }

  /* 播放一个短音：type 波形、freq 频率、dur 时长、gain 音量 */
  function tone(opts) {
    var c = ensureCtx();
    if (!c) return;
    try {
      var t0 = c.currentTime;
      var osc = c.createOscillator();
      var g = c.createGain();
      osc.type = opts.type || 'sine';
      osc.frequency.setValueAtTime(opts.freq, t0);
      if (opts.slideTo) {
        osc.frequency.exponentialRampToValueAtTime(opts.slideTo, t0 + opts.dur);
      }
      // 短促的淡入淡出，避免爆音（pop）
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(opts.gain || 0.06, t0 + 0.008);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + opts.dur);
      osc.connect(g);
      g.connect(c.destination);
      osc.start(t0);
      osc.stop(t0 + opts.dur + 0.02);
    } catch (e) { /* 音频不可用就静默跳过，绝不影响功能 */ }
  }

  var Sfx = {
    /* 点击反馈：极短的高频轻响 */
    click: function () {
      tone({ freq: 880, dur: 0.05, gain: 0.05, type: 'triangle' });
    },
    /* 答对音效随连对次数递进：
     * 第 1 次 660Hz，之后每次升 110Hz，到第 6 次封顶。
     *
     * 注意：单个条目只有 3 道题，若计数只在条目内累加，最高只能到 3 级。
     * 所以连对状态由 Sfx 自己维护（跨条目保留），连对能真正爬到高阶。
     * 答错时由调用方调 resetStreak()，回到第 1 级。 */
    correct: function (streak) {
      var n = Math.max(1, Math.min(Number(streak) || 1, 6));
      var base = 660 + (n - 1) * 110;
      tone({ freq: base, slideTo: base * 1.25, dur: 0.12, gain: 0.07, type: 'sine' });
      if (n >= 3) {
        // 连对 3 次起叠五度和声，阶数越高越明亮
        setTimeout(function () {
          tone({ freq: base * 1.5, dur: 0.1, gain: 0.045, type: 'triangle' });
        }, 55);
      }
      if (n >= 5) {
        // 高位再叠一个八度，作为「连续答对」的明显奖励
        setTimeout(function () {
          tone({ freq: base * 2, dur: 0.09, gain: 0.035, type: 'sine' });
        }, 105);
      }
    },
    /* 答错：连错时音调更低、更长，避免和正确音混淆 */
    wrong: function (streak) {
      var n = Math.max(1, Math.min(Number(streak) || 1, 3));
      var base = 220 - (n - 1) * 30;
      tone({ freq: base, slideTo: base * 0.7, dur: 0.16 + n * 0.02, gain: 0.07, type: 'square' });
    },
    done: function () {
      tone({ freq: 523, dur: 0.09, gain: 0.06, type: 'sine' });
      setTimeout(function () {
        tone({ freq: 784, dur: 0.12, gain: 0.06, type: 'sine' });
      }, 100);
    },
    isOn: function () { return readEnabled(); },
    toggle: function () {
      saveEnabled(!readEnabled());
      if (readEnabled()) Sfx.click();
      return readEnabled();
    },

    /* ---- 连对状态：跨条目保留，让递进音效真的能爬到高阶 ---- */
    _streak: 0,
    getStreak: function () { return Sfx._streak; },
    /* 答对：连对数 +1，返回新的连对数，并播放对应阶数的音 */
    bumpStreak: function () {
      Sfx._streak = Math.min(Sfx._streak + 1, 6);
      Sfx.correct(Sfx._streak);
      return Sfx._streak;
    },
    /* 答错：连对清零，播放错误音（连错次数单独计） */
    resetStreak: function () {
      Sfx._streak = 0;
      return 0;
    }
  };

  global.Sfx = Sfx;
})(window);
