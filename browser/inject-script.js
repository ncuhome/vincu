// ==UserScript==
// @name         Vincu
// @namespace    ncuhome
// @version      0.1
// @description  Virtual iNCU
// @author       ncuhome
// @match        http*://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

// Compat to Tampermonkey

const isTampermonkeyEnv = () => {
  return window.GM_registerMenuCommand != undefined && window.GM_getValue != undefined && window.GM_setValue != undefined
}

const tampermonkeyShouldInject = () => {
  let started = false
  if (GM_registerMenuCommand != undefined && GM_getValue != undefined && GM_setValue != undefined) {
    const VINCU_DEFAULT_LOAD = "VINCU_DEFAULT_LOAD"
    const vincu_default_load = GM_getValue(VINCU_DEFAULT_LOAD, true)
    if (vincu_default_load) {
      started = true
      GM_registerMenuCommand("强制默认关闭", () => {
        GM_setValue(VINCU_DEFAULT_LOAD, false)
        location.reload()
      })
    } else {
      GM_registerMenuCommand("强制默认开启", () => {
        GM_setValue(VINCU_DEFAULT_LOAD, true)
        location.reload()
      })
    }

    const VINCU_LOAD_ONCE = "VINCU_LOAD_ONCE"
    const vincu_load_once = GM_getValue(VINCU_LOAD_ONCE, false)
    if (vincu_load_once) {
      started = true
      GM_setValue(VINCU_LOAD_ONCE, false)
    }
    GM_registerMenuCommand("强制注入一次", () => {
      GM_setValue(VINCU_LOAD_ONCE, true)
      location.reload()
    })
  }
  return started
}

const inject = () => {

  const MINCU = "$mincu$"

  window.appReady = true;

  window.ReactNativeWebView = {
    postMessage: (message, ...rest) => {
      let data = message
      if (typeof message === 'string') {
        data = MINCU + message
      }
      window.postMessage(data, ...rest)
    }
  }

  window.addEventListener('message', message => {
    const { data } = message

    if (typeof data === 'string') {
      if (data.startsWith(MINCU)) {
        handleMincuData(data)
      }
    }
  })

  const handleMincuData = (text) => {
    try {
      const data = JSON.parse(text.slice(MINCU.length))
      const { type } = data
      if (type === 'call') {
        handleCall(data)
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handleCall = (data) => {
    const { baseClass, method, params, key } = data
    console.log(data)
  }
}

(function () {
  'use strict';
  /**
   * 1. 如果在 Tampermonkey 中启用脚本则根据 tampermoneky 脚本 menucommand 决定是否需要注入
   * 2. 如果在意 Chrome Extension 的方式使用，则默认载入 
   */
  if (isTampermonkeyEnv()) {
    const shouldInject = tampermonkeyShouldInject()
    if (shouldInject) {
      console.log('injected vincu')
      inject();
    }
  } else {
    console.log('injected vincu')
    inject();
  }
})();