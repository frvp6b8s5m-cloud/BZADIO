/* Bplugins shared public engine. The current public page remains compatible with its inline engine; this file is the reusable module for future pages. */
(() => {
  "use strict";
  const KEY = "bplugins_live_trades";
  window.Bplugins = window.Bplugins || {};
  window.Bplugins.readTrades = () => {
    try {
      const value = JSON.parse(localStorage.getItem(KEY) || "[]");
      return Array.isArray(value) ? value : [];
    } catch {
      return [];
    }
  };
  window.Bplugins.writeTrades = trades => localStorage.setItem(KEY, JSON.stringify(trades));
})();
