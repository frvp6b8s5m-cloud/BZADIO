/* PART 1: CRYPTOGRAPHIC LOGIN CONFIGURATION */
"use strict";

// SHA-256("benrz101:Donor02$477643").
// Plaintext credentials are deliberately not stored in this source.
const LOGIN_SIGNATURE = "bd7f377e4dc2e9680da2a8f44df4456e98053feb70ade8d544bcd59b07f87689";
const SESSION_KEY = "bplugins_authenticated";

function bufferToHex(buffer) {
  return [...new Uint8Array(buffer)]
    .map(byte => byte.toString(16).padStart(2, "0"))
    .join("");
}

/* PART 2: WEB CRYPTO SHA-256 VERIFICATION */
async function sha256Hex(value) {
  if (!window.crypto?.subtle) throw new Error("Web Crypto API unavailable.");
  const bytes = new TextEncoder().encode(value);
  const digest = await window.crypto.subtle.digest("SHA-256", bytes);
  return bufferToHex(digest);
}

async function verifyAdmission(username, password) {
  const candidateHash = await sha256Hex(`${username}:${password}`);
  return candidateHash === LOGIN_SIGNATURE;
}

/* PART 3: FORM EVENT / SESSION ROUTING */
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-form");
  const status = document.getElementById("login-status");
  if (!form) return;

  form.addEventListener("submit", async event => {
    event.preventDefault();
    status.textContent = "[HASH_GATE // PROCESSING]";

    const data = new FormData(form);
    const username = String(data.get("username") || "").trim();
    const password = String(data.get("password") || "");

    try {
      if (!username || !password) {
        status.textContent = "[ACCESS_DENIED // COMPLETE_ALL_FIELDS]";
        return;
      }

      const valid = await verifyAdmission(username, password);
      if (!valid) {
        status.textContent = "[ACCESS_DENIED // SIGNATURE_MISMATCH]";
        return;
      }

      sessionStorage.setItem(SESSION_KEY, "true");
      status.textContent = "[ACCESS_GRANTED // ROUTING_TO_WORKBENCH]";
      window.location.replace("./dashboard.html");
    } catch (error) {
      status.textContent = `[ERROR // ${error.message}]`;
    }
  });
});
