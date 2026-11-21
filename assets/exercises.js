/* =========================================================================
 * 条目配套练习渲染
 * -------------------------------------------------------------------------
 * 挂在 window.Exercises.mount(entryId)，由 app.js 在渲染详情页后调用。
 * 依赖：window.C_EXERCISES（题库）、window.Sfx（音效，可缺失）
 * ========================================================================= */
(function (global) {
  'use strict';

  var DATA = global.C_EXERCISES || { byEntry: {}, tiers: {} };

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function sfx(name) {
    try {
      if (global.Sfx && global.Sfx[name]) global.Sfx[name]();
    } catch (e) { /* 音效失败不影响功能 */ }
  }

  /* 判断题统一用「正确 / 错误」两个选项展示 */
  function renderQuestion(q, idx) {
    var tierName = (DATA.tiers && DATA.tiers[q.tier]) || q.tier;
    var head = '<div class="ex-head">' +
      '<span class="ex-tier tier-' + esc(q.tier) + '">' + esc(tierName) + '</span>' +
      '<span class="ex-no">第 ' + (idx + 1) + ' 题</span>' +
      '</div>';

    var code = q.code ? '<pre class="ex-code"><code>' + esc(q.code) + '</code></pre>' : '';
    var stem = '<p class="ex-stem">' + esc(q.stem) + '</p>';

    var body = '';
    if (q.type === 'single' || q.type === 'judge') {
      var opts = q.type === 'judge'
        ? [{ label: '正确', value: 'true' }, { label: '错误', value: 'false' }]
        : q.options.map(function (o, i) {
            return { label: String.fromCharCode(65 + i) + '. ' + o, value: String(i) };
          });
      body = '<div class="ex-options">' + opts.map(function (o) {
        return '<button type="button" class="ex-option" data-value="' + esc(o.value) + '">' +
          esc(o.label) + '</button>';
      }).join('') + '</div>';
    } else {
      body = '<div class="ex-blank">' +
        '<input type="text" class="ex-input" placeholder="填答案，前后不要空格" autocomplete="off">' +
        '<button type="button" class="ex-check">检查</button></div>';
    }

    var fb = '<div class="ex-feedback" hidden></div>';

    return '<li class="ex-item" data-id="' + esc(q.id) + '" data-type="' + esc(q.type) + '">' +
      head + code + stem + body + fb + '</li>';
  }

  function judgeAnswer(q, value) {
    if (q.type === 'single') return Number(value) === q.answer;
    if (q.type === 'judge') return value === String(q.answer);
    if (q.type === 'blank') {
      var v = String(value).trim();
      if (!v) return false;
      return (q.acceptable || [q.answer]).indexOf(v) !== -1;
    }
    return false;
  }

  function correctText(q) {
    if (q.type === 'single') {
      return String.fromCharCode(65 + q.answer) + '. ' + q.options[q.answer];
    }
    if (q.type === 'judge') return q.answer ? '正确' : '错误';
    return q.answer;
  }

  function mount(entryId) {
    var box = document.getElementById('detail-exercise');
    var section = document.getElementById('detail-exercise-section');
    if (!box || !section) return;

    /* 每次渲染详情页都会调用 mount，必须先把上一次的监听器解绑，
     * 否则多次切换条目后，旧监听器仍持有旧题目的 list 闭包，
     * 导致点击新题时用旧数据判分（表现为「明明点对却判错」）。 */
    if (box._exHandlers) {
      box.removeEventListener('click', box._exHandlers.click);
      box.removeEventListener('keydown', box._exHandlers.keydown);
      box._exHandlers = null;
    }

    var list = (DATA.byEntry || {})[entryId];
    if (!list || !list.length) {
      box.innerHTML = '';
      section.hidden = true;
      return;
    }

    section.hidden = false;
    box.innerHTML = '<ol class="ex-list">' +
      list.map(function (q, i) { return renderQuestion(q, i); }).join('') +
      '</ol><p class="ex-summary" hidden></p>';

    var answered = {};
    var total = list.length;
    var streakWrong = 0;   // 连续答错次数（本条目内）

    /* 调用音效：
     * 答对时连对数由 Sfx 跨条目维护（bumpStreak），这样 3 道题也能
     * 接着上一条目继续递进，不会永远卡在第 3 级；
     * 答错时清零连对，并播放随连错次数降调的错误音。 */
    function tone(ok) {
      try {
        if (!global.Sfx) return;
        if (ok) {
          if (global.Sfx.bumpStreak) global.Sfx.bumpStreak();
          else if (global.Sfx.correct) global.Sfx.correct(1);
        } else {
          if (global.Sfx.resetStreak) global.Sfx.resetStreak();
          if (global.Sfx.wrong) global.Sfx.wrong(streakWrong);
        }
      } catch (e) { /* 音效失败不影响功能 */ }
    }

    function refreshSummary() {
      var done = Object.keys(answered).length;
      var right = Object.keys(answered).filter(function (k) { return answered[k]; }).length;
      var sum = box.querySelector('.ex-summary');
      if (!sum) return;
      if (done === total) {
        sum.hidden = false;
        sum.textContent = '本条目练习完成：答对 ' + right + ' / ' + total + ' 题。';
        if (right === total) sfx('done');
      } else {
        sum.hidden = true;
      }
    }

    function markItem(li, ok, q) {
      li.classList.add(ok ? 'right' : 'wrong');
      var fb = li.querySelector('.ex-feedback');
      fb.hidden = false;
      fb.innerHTML = '<span class="ex-verdict ' + (ok ? 'ok' : 'no') + '">' +
        (ok ? '✓ 正确' : '✗ 错误') + '</span>' +
        (ok ? '' : '　正确答案：' + esc(correctText(q))) +
        '<div class="ex-explain">' + esc(q.explanation) + '</div>';
      // 锁定本题，避免反复点击
      li.querySelectorAll('.ex-option').forEach(function (b) {
        b.disabled = true;
        b.classList.add('locked');
      });
      var inp = li.querySelector('.ex-input');
      if (inp) inp.disabled = true;
      var cb = li.querySelector('.ex-check');
      if (cb) cb.disabled = true;
    }

    var onKeydown = function (ev) {
      // 填空题按 Enter 直接检查
      if (ev.key === 'Enter' && ev.target.classList.contains('ex-input')) {
        var checkBtn = ev.target.closest('.ex-item').querySelector('.ex-check');
        if (checkBtn && !checkBtn.disabled) checkBtn.click();
      }
    };

    var onClick = function (ev) {
      var opt = ev.target.closest('.ex-option');
      if (opt && !opt.disabled) {
        var li = opt.closest('.ex-item');
        var q = list.find(function (x) { return x.id === li.getAttribute('data-id'); });
        if (!q) return;
        var ok = judgeAnswer(q, opt.getAttribute('data-value'));
        // 标记选中的那个
        opt.classList.add('picked');
        markItem(li, ok, q);
        answered[q.id] = ok;
        // 连对/连错计数：答对音效随连对次数递进
        if (ok) { streakWrong = 0; } else { streakWrong++; }
        tone(ok);
        refreshSummary();
        return;
      }

      var check = ev.target.closest('.ex-check');
      if (check && !check.disabled) {
        var li2 = check.closest('.ex-item');
        var q2 = list.find(function (x) { return x.id === li2.getAttribute('data-id'); });
        if (!q2) return;
        var inp = li2.querySelector('.ex-input');
        var ok2 = judgeAnswer(q2, inp ? inp.value : '');
        markItem(li2, ok2, q2);
        answered[q2.id] = ok2;
        if (ok2) { streakWrong = 0; } else { streakWrong++; }
        tone(ok2);
        refreshSummary();
      }
    };

    box.addEventListener('click', onClick);
    box.addEventListener('keydown', onKeydown);
    box._exHandlers = { click: onClick, keydown: onKeydown };
  }

  global.Exercises = { mount: mount };
})(window);
