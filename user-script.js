// ==UserScript==
// @name         YouTube ▶ MPV Handler v1.6
// @version      1.6
// @match        https://www.youtube.com/watch*
// @grant        none
// @namespace    Violentmonkey Scripts
// @description  Adds buttons below the youtube player to allow the user to watch the video in mpv.
// @author       Darius
// ==/UserScript==

/**
 * Designed to work on Linux.
 *
 * Dependencies:
 * - mpv player
 * - yt-dlp
 * - mpv-handler https://github.com/akiirui/mpv-handler.git
 * - the Violentmonkey browser extension
 *
 * For details and installation instructions, see Readme
 *
 */

(function() {
  const btnStyle = `
    margin-left:8px;
    padding:6px 12px;
    background:#555;
    color:#fff;
    border:none;
    border-radius:4px;
    cursor:pointer;
    position:relative;
  `;

  const styles = `
    .spinner {
      display: inline-block;
      width: 12px;
      height: 12px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-left: 6px;
      vertical-align: middle;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .mpv-toast {
      position: fixed;
      bottom: 30px;
      right: 30px;
      background: #323232;
      color: white;
      padding: 60px 76px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.2);
      font-size: 14px;
      opacity: 0;
      transition: opacity 0.3s ease;
      z-index: 9999;
    }
    .mpv-toast.show {
      opacity: 1;
    }
  `;

  const styleEl = document.createElement('style');
  styleEl.textContent = styles;
  document.head.appendChild(styleEl);

  function showToast(msg) {
    const toast = document.createElement('div');
    toast.className = 'mpv-toast';
    toast.textContent = msg;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 500);
    }, 3000);
  }

  function getMpvUrl(quality = '') {
    const data = btoa(window.location.href);
    const safe = data.replace(/\//g, "_").replace(/\+/g, "-").replace(/\=/g, "");
    return `mpv://play/${safe}${quality ? ('/?quality=' + quality) : ''}`;
  }

  function handleClick(btn, quality = '') {
    const mpvUrl = getMpvUrl(quality);
    window.open(mpvUrl);
    document.querySelector('video')?.pause();

    showToast(`Launching in MPV ${quality ? `(${quality})` : ''}...`);

    if (!btn.querySelector('.spinner')) {
      const spinner = document.createElement('span');
      spinner.className = 'spinner';
      btn.appendChild(spinner);
    }

    const allButtons = document.querySelectorAll('.mpv-handler-btn');
    allButtons.forEach(b => b.disabled = true);
    setTimeout(() => {
      allButtons.forEach(b => {
        b.disabled = false;
        b.querySelector('.spinner')?.remove();
      });
    }, 10000);
  }

  function insertButtons() {
    const controls = document.querySelector('.ytp-left-controls');
    if (!controls || controls.querySelector('.mpv-handler-btn')) return;

    let playerResponse = window.ytplayer?.config?.args?.raw_player_response;

    const formats = [
      ...(playerResponse?.streamingData?.formats || []),
      ...(playerResponse?.streamingData?.adaptiveFormats || [])
    ];

    console.log('formats', formats);

    const availableQualities = new Set(
    formats
      .map(f => f.qualityLabel)
      .filter((h) => typeof h === 'string' && h != '')
    );
    console.log('availableQualities'. availableQualities);

    const acceptedQualities = ['1440p', '1080p', '1080p60', '720p', '480p'];


    console.log('availableResolutions', availableQualities);

    for (const quality of acceptedQualities) {
      // Always show the "max" button or if quality is available
      if (!quality || availableQualities.has(quality)) {
        const btn = document.createElement('button');
        btn.className = 'mpv-handler-btn';
        btn.style = btnStyle;
        btn.textContent = '▶ ' + quality;
        btn.onclick = () => handleClick(btn, quality);
        controls.insertBefore(btn, controls.firstChild);
      }
    }
  }


  function observeAndInsertButtons() {
    const observer = new MutationObserver(() => {
      insertButtons();
    });

    const waitForControls = setInterval(() => {
      const controls = document.querySelector('.ytp-left-controls');
      if (controls) {
        clearInterval(waitForControls);
        insertButtons();
        observer.observe(controls, { childList: true, subtree: false });
      }
    }, 500);
  }

  // Run on initial load
  observeAndInsertButtons();

  // Run again when navigating between videos
  document.addEventListener('yt-navigate-finish', () => {
    console.log('yt-navigate-finish');
    observeAndInsertButtons();
  });

})();
