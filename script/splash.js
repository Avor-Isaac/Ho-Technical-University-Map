// ================================
// HTU SPLASH SCREEN
// Add this BEFORE your closing </body> tag
// as: <script src="script/splash.js"></script>
// Make sure it loads BEFORE to.js
// ================================

(function () {
  const splash = document.getElementById('splashScreen');
  const loader = document.querySelector('.splash-loader');
  const enterBtn = document.querySelector('.splash-enter-btn');

  if (!splash) return;

  // After 2.2s, swap loader for the Enter button
  setTimeout(function () {
    if (loader) loader.style.display = 'none';
    if (enterBtn) {
      enterBtn.style.display = 'inline-block';
    }
  }, 2200);

  // Dismiss splash when Enter button is clicked
  if (enterBtn) {
    enterBtn.addEventListener('click', dismissSplash);
  }

  // Also allow tapping anywhere after the button appears
  splash.addEventListener('click', function () {
    if (enterBtn && enterBtn.style.display === 'inline-block') {
      dismissSplash();
    }
  });

  function dismissSplash() {
    splash.classList.add('hidden');
    // Remove from DOM after fade-out transition completes
    setTimeout(function () {
      splash.remove();
    }, 900);
  }
})();
