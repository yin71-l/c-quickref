/* =========================================================================
 * 顶栏音效开关：把 Sfx 的状态同步到按钮上
 * 独立成文件，避免再动 app.js 的主体逻辑。
 * ========================================================================= */
(function (global) {
  'use strict';

  function init() {
    var btn = document.getElementById('sound-toggle');
    if (!btn || !global.Sfx) return;

    function render() {
      var on = global.Sfx.isOn();
      btn.textContent = on ? '🔊 音效' : '🔇 静音';
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      btn.title = on ? '答题音效：开（点击关闭）' : '答题音效：关（点击开启）';
    }

    btn.addEventListener('click', function () {
      global.Sfx.toggle();
      render();
    });

    render();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})(window);
