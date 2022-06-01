const injectJS = () => {
  const s = document.createElement('script');
  s.src = chrome.runtime.getURL('inject-script.js');
  s.onload = function() {
      this.remove();
  };
  
  (document.head || document.documentElement).appendChild(s);
}

injectJS()