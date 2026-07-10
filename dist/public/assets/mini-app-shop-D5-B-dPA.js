import { c as createLucideIcon, R as React, ah as useTheme, j as jsxRuntimeExports, B as Button, J as cn, d as useToast, u as useQuery, r as reactExports, ac as lookup, q as queryClient, f as useMutation, p as User, X, L as LoaderCircle, ai as ChevronRight, x as Send, P as Package, ae as Database } from "./index-BvnB0mBC.js";
import { B as Badge } from "./badge-Dah5lGFx.js";
import { D as Dialog, b as DialogContent, c as DialogHeader, d as DialogTitle, e as DialogDescription, f as DialogFooter } from "./dialog-BKbZn9LE.js";
import { m as motion, A as AnimatePresence } from "./proxy-EhhtaE69.js";
import { W as Wallet } from "./wallet-BbmXmwsA.js";
import { H as History } from "./history-Bi2YUjhe.js";
import { C as CreditCard } from "./credit-card-D50plIvP.js";
import { Z as Zap, P as Paperclip } from "./zap-DiXb8NCJ.js";
import { C as CircleCheck } from "./circle-check-C6DGT_9Y.js";
import { M as MessageCircle } from "./message-circle-DhvufKhR.js";
import { F as FileText } from "./file-text-h8S5JdZL.js";
import { C as Copy } from "./copy-ZiROSsJJ.js";
import { L as Lock } from "./lock-nMAptII9.js";
import { C as Clock } from "./clock-BDZAkZXp.js";
import { f as format } from "./format-Fqx7OmaC.js";
const Minimize2 = createLucideIcon("Minimize2", [
  ["polyline", { points: "4 14 10 14 10 20", key: "11kfnr" }],
  ["polyline", { points: "20 10 14 10 14 4", key: "rlmsce" }],
  ["line", { x1: "14", x2: "21", y1: "10", y2: "3", key: "o5lafz" }],
  ["line", { x1: "3", x2: "10", y1: "21", y2: "14", key: "1atl0r" }]
]);
const Moon = createLucideIcon("Moon", [
  ["path", { d: "M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z", key: "a7tn18" }]
]);
const Store = createLucideIcon("Store", [
  ["path", { d: "m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7", key: "ztvudi" }],
  ["path", { d: "M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8", key: "1b2hhj" }],
  ["path", { d: "M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4", key: "2ebpfo" }],
  ["path", { d: "M2 7h20", key: "1fcdvo" }],
  [
    "path",
    {
      d: "M22 7v3a2 2 0 0 1-2 2a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12a2 2 0 0 1-2-2V7",
      key: "6c3vgh"
    }
  ]
]);
const Sun = createLucideIcon("Sun", [
  ["circle", { cx: "12", cy: "12", r: "4", key: "4exip2" }],
  ["path", { d: "M12 2v2", key: "tus03m" }],
  ["path", { d: "M12 20v2", key: "1lh1kg" }],
  ["path", { d: "m4.93 4.93 1.41 1.41", key: "149t6j" }],
  ["path", { d: "m17.66 17.66 1.41 1.41", key: "ptbguv" }],
  ["path", { d: "M2 12h2", key: "1t8f8n" }],
  ["path", { d: "M20 12h2", key: "1q8mjw" }],
  ["path", { d: "m6.34 17.66-1.41 1.41", key: "1m8zz5" }],
  ["path", { d: "m19.07 4.93-1.41 1.41", key: "1shlcs" }]
]);
function base32ToUint8Array(base32) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  const clean = base32.replace(/=+$/, "").toUpperCase();
  const len = clean.length;
  const out = new Uint8Array(len * 5 / 8 | 0);
  let bits = 0;
  let value = 0;
  let index = 0;
  for (let i = 0; i < len; i++) {
    const val = alphabet.indexOf(clean[i]);
    if (val === -1) continue;
    value = value << 5 | val;
    bits += 5;
    if (bits >= 8) {
      out[index++] = value >>> bits - 8 & 255;
      bits -= 8;
    }
  }
  return out;
}
async function generateTOTP(secret, interval = 30) {
  try {
    const key = base32ToUint8Array(secret);
    const counter = Math.floor(Date.now() / 1e3 / interval);
    const counterBuffer = new ArrayBuffer(8);
    const counterView = new DataView(counterBuffer);
    counterView.setUint32(4, counter);
    const cryptoKey = await window.crypto.subtle.importKey(
      "raw",
      key,
      { name: "HMAC", hash: "SHA-1" },
      false,
      ["sign"]
    );
    const signature = await window.crypto.subtle.sign(
      "HMAC",
      cryptoKey,
      counterBuffer
    );
    const hmac = new Uint8Array(signature);
    const offset = hmac[hmac.length - 1] & 15;
    const code = (hmac[offset] & 127) << 24 | (hmac[offset + 1] & 255) << 16 | (hmac[offset + 2] & 255) << 8 | hmac[offset + 3] & 255;
    return (code % 1e6).toString().padStart(6, "0");
  } catch (err) {
    console.error("TOTP Generation failed:", err);
    return "000000";
  }
}
function getRemainingSeconds(interval = 30) {
  return interval - Math.floor(Date.now() / 1e3) % interval;
}
const getTelegramWebApp = () => {
  if (typeof window !== "undefined" && window.Telegram?.WebApp) {
    return window.Telegram.WebApp;
  }
  return null;
};
const getTelegramInitData = () => {
  const webApp = getTelegramWebApp();
  return webApp?.initData || "";
};
const expandTelegramWebApp = () => {
  const webApp = getTelegramWebApp();
  webApp?.expand();
};
var DefaultContext = {
  color: void 0,
  size: void 0,
  className: void 0,
  style: void 0,
  attr: void 0
};
var IconContext = React.createContext && /* @__PURE__ */ React.createContext(DefaultContext);
var _excluded = ["attr", "size", "title"];
function _objectWithoutProperties(e, t) {
  if (null == e) return {};
  var o, r, i = _objectWithoutPropertiesLoose(e, t);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]);
  }
  return i;
}
function _objectWithoutPropertiesLoose(r, e) {
  if (null == r) return {};
  var t = {};
  for (var n in r) if ({}.hasOwnProperty.call(r, n)) {
    if (-1 !== e.indexOf(n)) continue;
    t[n] = r[n];
  }
  return t;
}
function _extends() {
  return _extends = Object.assign ? Object.assign.bind() : function(n) {
    for (var e = 1; e < arguments.length; e++) {
      var t = arguments[e];
      for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
    }
    return n;
  }, _extends.apply(null, arguments);
}
function ownKeys(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function(r2) {
      return Object.getOwnPropertyDescriptor(e, r2).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys(Object(t), true).forEach(function(r2) {
      _defineProperty(e, r2, t[r2]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r2) {
      Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t, r2));
    });
  }
  return e;
}
function _defineProperty(e, r, t) {
  return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: true, configurable: true, writable: true }) : e[r] = t, e;
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == typeof i ? i : i + "";
}
function _toPrimitive(t, r) {
  if ("object" != typeof t || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r);
    if ("object" != typeof i) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function Tree2Element(tree) {
  return tree && tree.map((node, i) => /* @__PURE__ */ React.createElement(node.tag, _objectSpread({
    key: i
  }, node.attr), Tree2Element(node.child)));
}
function GenIcon(data) {
  return (props) => /* @__PURE__ */ React.createElement(IconBase, _extends({
    attr: _objectSpread({}, data.attr)
  }, props), Tree2Element(data.child));
}
function IconBase(props) {
  var elem = (conf) => {
    var {
      attr,
      size,
      title
    } = props, svgProps = _objectWithoutProperties(props, _excluded);
    var computedSize = size || conf.size || "1em";
    var className;
    if (conf.className) className = conf.className;
    if (props.className) className = (className ? className + " " : "") + props.className;
    return /* @__PURE__ */ React.createElement("svg", _extends({
      stroke: "currentColor",
      fill: "currentColor",
      strokeWidth: "0"
    }, conf.attr, attr, svgProps, {
      className,
      style: _objectSpread(_objectSpread({
        color: props.color || conf.color
      }, conf.style), props.style),
      height: computedSize,
      width: computedSize,
      xmlns: "http://www.w3.org/2000/svg"
    }), title && /* @__PURE__ */ React.createElement("title", null, title), props.children);
  };
  return IconContext !== void 0 ? /* @__PURE__ */ React.createElement(IconContext.Consumer, null, (conf) => elem(conf)) : elem(DefaultContext);
}
function FaCcVisa(props) {
  return GenIcon({ "attr": { "viewBox": "0 0 576 512" }, "child": [{ "tag": "path", "attr": { "d": "M470.1 231.3s7.6 37.2 9.3 45H446c3.3-8.9 16-43.5 16-43.5-.2.3 3.3-9.1 5.3-14.9l2.8 13.4zM576 80v352c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V80c0-26.5 21.5-48 48-48h480c26.5 0 48 21.5 48 48zM152.5 331.2L215.7 176h-42.5l-39.3 106-4.3-21.5-14-71.4c-2.3-9.9-9.4-12.7-18.2-13.1H32.7l-.7 3.1c15.8 4 29.9 9.8 42.2 17.1l35.8 135h42.5zm94.4.2L272.1 176h-40.2l-25.1 155.4h40.1zm139.9-50.8c.2-17.7-10.6-31.2-33.7-42.3-14.1-7.1-22.7-11.9-22.7-19.2.2-6.6 7.3-13.4 23.1-13.4 13.1-.3 22.7 2.8 29.9 5.9l3.6 1.7 5.5-33.6c-7.9-3.1-20.5-6.6-36-6.6-39.7 0-67.6 21.2-67.8 51.4-.3 22.3 20 34.7 35.2 42.2 15.5 7.6 20.8 12.6 20.8 19.3-.2 10.4-12.6 15.2-24.1 15.2-16 0-24.6-2.5-37.7-8.3l-5.3-2.5-5.6 34.9c9.4 4.3 26.8 8.1 44.8 8.3 42.2.1 69.7-20.8 70-53zM528 331.4L495.6 176h-31.1c-9.6 0-16.9 2.8-21 12.9l-59.7 142.5H426s6.9-19.2 8.4-23.3H486c1.2 5.5 4.8 23.3 4.8 23.3H528z" }, "child": [] }] })(props);
}
function FaCcMastercard(props) {
  return GenIcon({ "attr": { "viewBox": "0 0 576 512" }, "child": [{ "tag": "path", "attr": { "d": "M482.9 410.3c0 6.8-4.6 11.7-11.2 11.7-6.8 0-11.2-5.2-11.2-11.7 0-6.5 4.4-11.7 11.2-11.7 6.6 0 11.2 5.2 11.2 11.7zm-310.8-11.7c-7.1 0-11.2 5.2-11.2 11.7 0 6.5 4.1 11.7 11.2 11.7 6.5 0 10.9-4.9 10.9-11.7-.1-6.5-4.4-11.7-10.9-11.7zm117.5-.3c-5.4 0-8.7 3.5-9.5 8.7h19.1c-.9-5.7-4.4-8.7-9.6-8.7zm107.8.3c-6.8 0-10.9 5.2-10.9 11.7 0 6.5 4.1 11.7 10.9 11.7 6.8 0 11.2-4.9 11.2-11.7 0-6.5-4.4-11.7-11.2-11.7zm105.9 26.1c0 .3.3.5.3 1.1 0 .3-.3.5-.3 1.1-.3.3-.3.5-.5.8-.3.3-.5.5-1.1.5-.3.3-.5.3-1.1.3-.3 0-.5 0-1.1-.3-.3 0-.5-.3-.8-.5-.3-.3-.5-.5-.5-.8-.3-.5-.3-.8-.3-1.1 0-.5 0-.8.3-1.1 0-.5.3-.8.5-1.1.3-.3.5-.3.8-.5.5-.3.8-.3 1.1-.3.5 0 .8 0 1.1.3.5.3.8.3 1.1.5s.2.6.5 1.1zm-2.2 1.4c.5 0 .5-.3.8-.3.3-.3.3-.5.3-.8 0-.3 0-.5-.3-.8-.3 0-.5-.3-1.1-.3h-1.6v3.5h.8V426h.3l1.1 1.4h.8l-1.1-1.3zM576 81v352c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V81c0-26.5 21.5-48 48-48h480c26.5 0 48 21.5 48 48zM64 220.6c0 76.5 62.1 138.5 138.5 138.5 27.2 0 53.9-8.2 76.5-23.1-72.9-59.3-72.4-171.2 0-230.5-22.6-15-49.3-23.1-76.5-23.1-76.4-.1-138.5 62-138.5 138.2zm224 108.8c70.5-55 70.2-162.2 0-217.5-70.2 55.3-70.5 162.6 0 217.5zm-142.3 76.3c0-8.7-5.7-14.4-14.7-14.7-4.6 0-9.5 1.4-12.8 6.5-2.4-4.1-6.5-6.5-12.2-6.5-3.8 0-7.6 1.4-10.6 5.4V392h-8.2v36.7h8.2c0-18.9-2.5-30.2 9-30.2 10.2 0 8.2 10.2 8.2 30.2h7.9c0-18.3-2.5-30.2 9-30.2 10.2 0 8.2 10 8.2 30.2h8.2v-23zm44.9-13.7h-7.9v4.4c-2.7-3.3-6.5-5.4-11.7-5.4-10.3 0-18.2 8.2-18.2 19.3 0 11.2 7.9 19.3 18.2 19.3 5.2 0 9-1.9 11.7-5.4v4.6h7.9V392zm40.5 25.6c0-15-22.9-8.2-22.9-15.2 0-5.7 11.9-4.8 18.5-1.1l3.3-6.5c-9.4-6.1-30.2-6-30.2 8.2 0 14.3 22.9 8.3 22.9 15 0 6.3-13.5 5.8-20.7.8l-3.5 6.3c11.2 7.6 32.6 6 32.6-7.5zm35.4 9.3l-2.2-6.8c-3.8 2.1-12.2 4.4-12.2-4.1v-16.6h13.1V392h-13.1v-11.2h-8.2V392h-7.6v7.3h7.6V416c0 17.6 17.3 14.4 22.6 10.9zm13.3-13.4h27.5c0-16.2-7.4-22.6-17.4-22.6-10.6 0-18.2 7.9-18.2 19.3 0 20.5 22.6 23.9 33.8 14.2l-3.8-6c-7.8 6.4-19.6 5.8-21.9-4.9zm59.1-21.5c-4.6-2-11.6-1.8-15.2 4.4V392h-8.2v36.7h8.2V408c0-11.6 9.5-10.1 12.8-8.4l2.4-7.6zm10.6 18.3c0-11.4 11.6-15.1 20.7-8.4l3.8-6.5c-11.6-9.1-32.7-4.1-32.7 15 0 19.8 22.4 23.8 32.7 15l-3.8-6.5c-9.2 6.5-20.7 2.6-20.7-8.6zm66.7-18.3H408v4.4c-8.3-11-29.9-4.8-29.9 13.9 0 19.2 22.4 24.7 29.9 13.9v4.6h8.2V392zm33.7 0c-2.4-1.2-11-2.9-15.2 4.4V392h-7.9v36.7h7.9V408c0-11 9-10.3 12.8-8.4l2.4-7.6zm40.3-14.9h-7.9v19.3c-8.2-10.9-29.9-5.1-29.9 13.9 0 19.4 22.5 24.6 29.9 13.9v4.6h7.9v-51.7zm7.6-75.1v4.6h.8V302h1.9v-.8h-4.6v.8h1.9zm6.6 123.8c0-.5 0-1.1-.3-1.6-.3-.3-.5-.8-.8-1.1-.3-.3-.8-.5-1.1-.8-.5 0-1.1-.3-1.6-.3-.3 0-.8.3-1.4.3-.5.3-.8.5-1.1.8-.5.3-.8.8-.8 1.1-.3.5-.3 1.1-.3 1.6 0 .3 0 .8.3 1.4 0 .3.3.8.8 1.1.3.3.5.5 1.1.8.5.3 1.1.3 1.4.3.5 0 1.1 0 1.6-.3.3-.3.8-.5 1.1-.8.3-.3.5-.8.8-1.1.3-.6.3-1.1.3-1.4zm3.2-124.7h-1.4l-1.6 3.5-1.6-3.5h-1.4v5.4h.8v-4.1l1.6 3.5h1.1l1.4-3.5v4.1h1.1v-5.4zm4.4-80.5c0-76.2-62.1-138.3-138.5-138.3-27.2 0-53.9 8.2-76.5 23.1 72.1 59.3 73.2 171.5 0 230.5 22.6 15 49.5 23.1 76.5 23.1 76.4.1 138.5-61.9 138.5-138.4z" }, "child": [] }] })(props);
}
function FaCcAmex(props) {
  return GenIcon({ "attr": { "viewBox": "0 0 576 512" }, "child": [{ "tag": "path", "attr": { "d": "M325.1 167.8c0-16.4-14.1-18.4-27.4-18.4l-39.1-.3v69.3H275v-25.1h18c18.4 0 14.5 10.3 14.8 25.1h16.6v-13.5c0-9.2-1.5-15.1-11-18.4 7.4-3 11.8-10.7 11.7-18.7zm-29.4 11.3H275v-15.3h21c5.1 0 10.7 1 10.7 7.4 0 6.6-5.3 7.9-11 7.9zM279 268.6h-52.7l-21 22.8-20.5-22.8h-66.5l-.1 69.3h65.4l21.3-23 20.4 23h32.2l.1-23.3c18.9 0 49.3 4.6 49.3-23.3 0-17.3-12.3-22.7-27.9-22.7zm-103.8 54.7h-40.6v-13.8h36.3v-14.1h-36.3v-12.5h41.7l17.9 20.2zm65.8 8.2l-25.3-28.1L241 276zm37.8-31h-21.2v-17.6h21.5c5.6 0 10.2 2.3 10.2 8.4 0 6.4-4.6 9.2-10.5 9.2zm-31.6-136.7v-14.6h-55.5v69.3h55.5v-14.3h-38.9v-13.8h37.8v-14.1h-37.8v-12.5zM576 255.4h-.2zm-194.6 31.9c0-16.4-14.1-18.7-27.1-18.7h-39.4l-.1 69.3h16.6l.1-25.3h17.6c11 0 14.8 2 14.8 13.8l-.1 11.5h16.6l.1-13.8c0-8.9-1.8-15.1-11-18.4 7.7-3.1 11.8-10.8 11.9-18.4zm-29.2 11.2h-20.7v-15.6h21c5.1 0 10.7 1 10.7 7.4 0 6.9-5.4 8.2-11 8.2zm-172.8-80v-69.3h-27.6l-19.7 47-21.7-47H83.3v65.7l-28.1-65.7H30.7L1 218.5h17.9l6.4-15.3h34.5l6.4 15.3H100v-54.2l24 54.2h14.6l24-54.2v54.2zM31.2 188.8l11.2-27.6 11.5 27.6zm477.4 158.9v-4.5c-10.8 5.6-3.9 4.5-156.7 4.5 0-25.2.1-23.9 0-25.2-1.7-.1-3.2-.1-9.4-.1 0 17.9-.1 6.8-.1 25.3h-39.6c0-12.1.1-15.3.1-29.2-10 6-22.8 6.4-34.3 6.2 0 14.7-.1 8.3-.1 23h-48.9c-5.1-5.7-2.7-3.1-15.4-17.4-3.2 3.5-12.8 13.9-16.1 17.4h-82v-92.3h83.1c5 5.6 2.8 3.1 15.5 17.2 3.2-3.5 12.2-13.4 15.7-17.2h58c9.8 0 18 1.9 24.3 5.6v-5.6c54.3 0 64.3-1.4 75.7 5.1v-5.1h78.2v5.2c11.4-6.9 19.6-5.2 64.9-5.2v5c10.3-5.9 16.6-5.2 54.3-5V80c0-26.5-21.5-48-48-48h-480c-26.5 0-48 21.5-48 48v109.8c9.4-21.9 19.7-46 23.1-53.9h39.7c4.3 10.1 1.6 3.7 9 21.1v-21.1h46c2.9 6.2 11.1 24 13.9 30 5.8-13.6 10.1-23.9 12.6-30h103c0-.1 11.5 0 11.6 0 43.7.2 53.6-.8 64.4 5.3v-5.3H363v9.3c7.6-6.1 17.9-9.3 30.7-9.3h27.6c0 .5 1.9.3 2.3.3H456c4.2 9.8 2.6 6 8.8 20.6v-20.6h43.3c4.9 8-1-1.8 11.2 18.4v-18.4h39.9v92h-41.6c-5.4-9-1.4-2.2-13.2-21.9v21.9h-52.8c-6.4-14.8-.1-.3-6.6-15.3h-19c-4.2 10-2.2 5.2-6.4 15.3h-26.8c-12.3 0-22.3-3-29.7-8.9v8.9h-66.5c-.3-13.9-.1-24.8-.1-24.8-1.8-.3-3.4-.2-9.8-.2v25.1H151.2v-11.4c-2.5 5.6-2.7 5.9-5.1 11.4h-29.5c-4-8.9-2.9-6.4-5.1-11.4v11.4H58.6c-4.2-10.1-2.2-5.3-6.4-15.3H33c-4.2 10-2.2 5.2-6.4 15.3H0V432c0 26.5 21.5 48 48 48h480.1c26.5 0 48-21.5 48-48v-90.4c-12.7 8.3-32.7 6.1-67.5 6.1zm36.3-64.5H575v-14.6h-32.9c-12.8 0-23.8 6.6-23.8 20.7 0 33 42.7 12.8 42.7 27.4 0 5.1-4.3 6.4-8.4 6.4h-32l-.1 14.8h32c8.4 0 17.6-1.8 22.5-8.9v-25.8c-10.5-13.8-39.3-1.3-39.3-13.5 0-5.8 4.6-6.5 9.2-6.5zm-57 39.8h-32.2l-.1 14.8h32.2c14.8 0 26.2-5.6 26.2-22 0-33.2-42.9-11.2-42.9-26.3 0-5.6 4.9-6.4 9.2-6.4h30.4v-14.6h-33.2c-12.8 0-23.5 6.6-23.5 20.7 0 33 42.7 12.5 42.7 27.4-.1 5.4-4.7 6.4-8.8 6.4zm-42.2-40.1v-14.3h-55.2l-.1 69.3h55.2l.1-14.3-38.6-.3v-13.8H445v-14.1h-37.8v-12.5zm-56.3-108.1c-.3.2-1.4 2.2-1.4 7.6 0 6 .9 7.7 1.1 7.9.2.1 1.1.5 3.4.5l7.3-16.9c-1.1 0-2.1-.1-3.1-.1-5.6 0-7 .7-7.3 1zm20.4-10.5h-.1zm-16.2-15.2c-23.5 0-34 12-34 35.3 0 22.2 10.2 34 33 34h19.2l6.4-15.3h34.3l6.6 15.3h33.7v-51.9l31.2 51.9h23.6v-69h-16.9v48.1l-29.1-48.1h-25.3v65.4l-27.9-65.4h-24.8l-23.5 54.5h-7.4c-13.3 0-16.1-8.1-16.1-19.9 0-23.8 15.7-20 33.1-19.7v-15.2zm42.1 12.1l11.2 27.6h-22.8zm-101.1-12v69.3h16.9v-69.3z" }, "child": [] }] })(props);
}
function FaAws(props) {
  return GenIcon({ "attr": { "viewBox": "0 0 640 512" }, "child": [{ "tag": "path", "attr": { "d": "M180.41 203.01c-.72 22.65 10.6 32.68 10.88 39.05a8.164 8.164 0 0 1-4.1 6.27l-12.8 8.96a10.66 10.66 0 0 1-5.63 1.92c-.43-.02-8.19 1.83-20.48-25.61a78.608 78.608 0 0 1-62.61 29.45c-16.28.89-60.4-9.24-58.13-56.21-1.59-38.28 34.06-62.06 70.93-60.05 7.1.02 21.6.37 46.99 6.27v-15.62c2.69-26.46-14.7-46.99-44.81-43.91-2.4.01-19.4-.5-45.84 10.11-7.36 3.38-8.3 2.82-10.75 2.82-7.41 0-4.36-21.48-2.94-24.2 5.21-6.4 35.86-18.35 65.94-18.18a76.857 76.857 0 0 1 55.69 17.28 70.285 70.285 0 0 1 17.67 52.36l-.01 69.29zM93.99 235.4c32.43-.47 46.16-19.97 49.29-30.47 2.46-10.05 2.05-16.41 2.05-27.4-9.67-2.32-23.59-4.85-39.56-4.87-15.15-1.14-42.82 5.63-41.74 32.26-1.24 16.79 11.12 31.4 29.96 30.48zm170.92 23.05c-7.86.72-11.52-4.86-12.68-10.37l-49.8-164.65c-.97-2.78-1.61-5.65-1.92-8.58a4.61 4.61 0 0 1 3.86-5.25c.24-.04-2.13 0 22.25 0 8.78-.88 11.64 6.03 12.55 10.37l35.72 140.83 33.16-140.83c.53-3.22 2.94-11.07 12.8-10.24h17.16c2.17-.18 11.11-.5 12.68 10.37l33.42 142.63L420.98 80.1c.48-2.18 2.72-11.37 12.68-10.37h19.72c.85-.13 6.15-.81 5.25 8.58-.43 1.85 3.41-10.66-52.75 169.9-1.15 5.51-4.82 11.09-12.68 10.37h-18.69c-10.94 1.15-12.51-9.66-12.68-10.75L328.67 110.7l-32.78 136.99c-.16 1.09-1.73 11.9-12.68 10.75h-18.3zm273.48 5.63c-5.88.01-33.92-.3-57.36-12.29a12.802 12.802 0 0 1-7.81-11.91v-10.75c0-8.45 6.2-6.9 8.83-5.89 10.04 4.06 16.48 7.14 28.81 9.6 36.65 7.53 52.77-2.3 56.72-4.48 13.15-7.81 14.19-25.68 5.25-34.95-10.48-8.79-15.48-9.12-53.13-21-4.64-1.29-43.7-13.61-43.79-52.36-.61-28.24 25.05-56.18 69.52-55.95 12.67-.01 46.43 4.13 55.57 15.62 1.35 2.09 2.02 4.55 1.92 7.04v10.11c0 4.44-1.62 6.66-4.87 6.66-7.71-.86-21.39-11.17-49.16-10.75-6.89-.36-39.89.91-38.41 24.97-.43 18.96 26.61 26.07 29.7 26.89 36.46 10.97 48.65 12.79 63.12 29.58 17.14 22.25 7.9 48.3 4.35 55.44-19.08 37.49-68.42 34.44-69.26 34.42zm40.2 104.86c-70.03 51.72-171.69 79.25-258.49 79.25A469.127 469.127 0 0 1 2.83 327.46c-6.53-5.89-.77-13.96 7.17-9.47a637.37 637.37 0 0 0 316.88 84.12 630.22 630.22 0 0 0 241.59-49.55c11.78-5 21.77 7.8 10.12 16.38zm29.19-33.29c-8.96-11.52-59.28-5.38-81.81-2.69-6.79.77-7.94-5.12-1.79-9.47 40.07-28.17 105.88-20.1 113.44-10.63 7.55 9.47-2.05 75.41-39.56 106.91-5.76 4.87-11.27 2.3-8.71-4.1 8.44-21.25 27.39-68.49 18.43-80.02z" }, "child": [] }] })(props);
}
function SiVultr(props) {
  return GenIcon({ "attr": { "role": "img", "viewBox": "0 0 24 24" }, "child": [{ "tag": "path", "attr": { "d": "M8.36 2.172A1.194 1.194 0 007.348 1.6H1.2A1.2 1.2 0 000 2.8a1.211 1.211 0 00.182.64l11.6 18.4a1.206 1.206 0 002.035 0l3.075-4.874a1.229 1.229 0 00.182-.64 1.211 1.211 0 00-.182-.642zm10.349 8.68a1.206 1.206 0 002.035 0L21.8 9.178l2.017-3.2a1.211 1.211 0 00.183-.64 1.229 1.229 0 00-.183-.64l-1.6-2.526a1.206 1.206 0 00-1.016-.571h-6.148a1.2 1.2 0 00-1.201 1.2 1.143 1.143 0 00.188.64z" }, "child": [] }] })(props);
}
function SiOpenai(props) {
  return GenIcon({ "attr": { "role": "img", "viewBox": "0 0 24 24" }, "child": [{ "tag": "path", "attr": { "d": "M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z" }, "child": [] }] })(props);
}
function SiHetzner(props) {
  return GenIcon({ "attr": { "role": "img", "viewBox": "0 0 24 24" }, "child": [{ "tag": "path", "attr": { "d": "M0 0v24h24V0H0zm4.602 4.025h2.244c.509 0 .716.215.716.717v5.64h8.883v-5.64c0-.509.215-.717.717-.717h2.229c.5 0 .71.23.724.717v14.516c0 .509-.215.717-.717.717h-2.23c-.51 0-.717-.215-.717-.717v-5.735H7.562v5.735c0 .516-.215.717-.716.717H4.602c-.51 0-.717-.208-.717-.717V4.742c0-.509.207-.717.717-.717z" }, "child": [] }] })(props);
}
function SiGooglegemini(props) {
  return GenIcon({ "attr": { "role": "img", "viewBox": "0 0 24 24" }, "child": [{ "tag": "path", "attr": { "d": "M11.04 19.32Q12 21.51 12 24q0-2.49.93-4.68.96-2.19 2.58-3.81t3.81-2.55Q21.51 12 24 12q-2.49 0-4.68-.93a12.3 12.3 0 0 1-3.81-2.58 12.3 12.3 0 0 1-2.58-3.81Q12 2.49 12 0q0 2.49-.96 4.68-.93 2.19-2.55 3.81a12.3 12.3 0 0 1-3.81 2.58Q2.49 12 0 12q2.49 0 4.68.96 2.19.93 3.81 2.55t2.55 3.81" }, "child": [] }] })(props);
}
function SiGooglecloud(props) {
  return GenIcon({ "attr": { "role": "img", "viewBox": "0 0 24 24" }, "child": [{ "tag": "path", "attr": { "d": "M12.19 2.38a9.344 9.344 0 0 0-9.234 6.893c.053-.02-.055.013 0 0-3.875 2.551-3.922 8.11-.247 10.941l.006-.007-.007.03a6.717 6.717 0 0 0 4.077 1.356h5.173l.03.03h5.192c6.687.053 9.376-8.605 3.835-12.35a9.365 9.365 0 0 0-2.821-4.552l-.043.043.006-.05A9.344 9.344 0 0 0 12.19 2.38zm-.358 4.146c1.244-.04 2.518.368 3.486 1.15a5.186 5.186 0 0 1 1.862 4.078v.518c3.53-.07 3.53 5.262 0 5.193h-5.193l-.008.009v-.04H6.785a2.59 2.59 0 0 1-1.067-.23h.001a2.597 2.597 0 1 1 3.437-3.437l3.013-3.012A6.747 6.747 0 0 0 8.11 8.24c.018-.01.04-.026.054-.023a5.186 5.186 0 0 1 3.67-1.69z" }, "child": [] }] })(props);
}
function SiDigitalocean(props) {
  return GenIcon({ "attr": { "role": "img", "viewBox": "0 0 24 24" }, "child": [{ "tag": "path", "attr": { "d": "M12.04 0C5.408-.02.005 5.37.005 11.992h4.638c0-4.923 4.882-8.731 10.064-6.855a6.95 6.95 0 014.147 4.148c1.889 5.177-1.924 10.055-6.84 10.064v-4.61H7.391v4.623h4.61V24c7.86 0 13.967-7.588 11.397-15.83-1.115-3.59-3.985-6.446-7.575-7.575A12.8 12.8 0 0012.039 0zM7.39 19.362H3.828v3.564H7.39zm-3.563 0v-2.978H.85v2.978z" }, "child": [] }] })(props);
}
function SiClaude(props) {
  return GenIcon({ "attr": { "role": "img", "viewBox": "0 0 24 24" }, "child": [{ "tag": "path", "attr": { "d": "m4.7144 15.9555 4.7174-2.6471.079-.2307-.079-.1275h-.2307l-.7893-.0486-2.6956-.0729-2.3375-.0971-2.2646-.1214-.5707-.1215-.5343-.7042.0546-.3522.4797-.3218.686.0608 1.5179.1032 2.2767.1578 1.6514.0972 2.4468.255h.3886l.0546-.1579-.1336-.0971-.1032-.0972L6.973 9.8356l-2.55-1.6879-1.3356-.9714-.7225-.4918-.3643-.4614-.1578-1.0078.6557-.7225.8803.0607.2246.0607.8925.686 1.9064 1.4754 2.4893 1.8336.3643.3035.1457-.1032.0182-.0728-.164-.2733-1.3539-2.4467-1.445-2.4893-.6435-1.032-.17-.6194c-.0607-.255-.1032-.4674-.1032-.7285L6.287.1335 6.6997 0l.9957.1336.419.3642.6192 1.4147 1.0018 2.2282 1.5543 3.0296.4553.8985.2429.8318.091.255h.1579v-.1457l.1275-1.706.2368-2.0947.2307-2.6957.0789-.7589.3764-.9107.7468-.4918.5828.2793.4797.686-.0668.4433-.2853 1.8517-.5586 2.9021-.3643 1.9429h.2125l.2429-.2429.9835-1.3053 1.6514-2.0643.7286-.8196.85-.9046.5464-.4311h1.0321l.759 1.1293-.34 1.1657-1.0625 1.3478-.8804 1.1414-1.2628 1.7-.7893 1.36.0729.1093.1882-.0183 2.8535-.607 1.5421-.2794 1.8396-.3157.8318.3886.091.3946-.3278.8075-1.967.4857-2.3072.4614-3.4364.8136-.0425.0304.0486.0607 1.5482.1457.6618.0364h1.621l3.0175.2247.7892.522.4736.6376-.079.4857-1.2142.6193-1.6393-.3886-3.825-.9107-1.3113-.3279h-.1822v.1093l1.0929 1.0686 2.0035 1.8092 2.5075 2.3314.1275.5768-.3218.4554-.34-.0486-2.2039-1.6575-.85-.7468-1.9246-1.621h-.1275v.17l.4432.6496 2.3436 3.5214.1214 1.0807-.17.3521-.6071.2125-.6679-.1214-1.3721-1.9246L14.38 17.959l-1.1414-1.9428-.1397.079-.674 7.2552-.3156.3703-.7286.2793-.6071-.4614-.3218-.7468.3218-1.4753.3886-1.9246.3157-1.53.2853-1.9004.17-.6314-.0121-.0425-.1397.0182-1.4328 1.9672-2.1796 2.9446-1.7243 1.8456-.4128.164-.7164-.3704.0667-.6618.4008-.5889 2.386-3.0357 1.4389-1.882.929-1.0868-.0062-.1579h-.0546l-6.3385 4.1164-1.1293.1457-.4857-.4554.0608-.7467.2307-.2429 1.9064-1.3114Z" }, "child": [] }] })(props);
}
function SiBinance(props) {
  return GenIcon({ "attr": { "role": "img", "viewBox": "0 0 24 24" }, "child": [{ "tag": "path", "attr": { "d": "M16.624 13.9202l2.7175 2.7154-7.353 7.353-7.353-7.352 2.7175-2.7164 4.6355 4.6595 4.6356-4.6595zm4.6366-4.6366L24 12l-2.7154 2.7164L18.5682 12l2.6924-2.7164zm-9.272.001l2.7163 2.6914-2.7164 2.7174v-.001L9.2721 12l2.7164-2.7154zm-9.2722-.001L5.4088 12l-2.6914 2.6924L0 12l2.7164-2.7164zM11.9885.0115l7.353 7.329-2.7174 2.7154-4.6356-4.6356-4.6355 4.6595-2.7174-2.7154 7.353-7.353z" }, "child": [] }] })(props);
}
function VscAzure(props) {
  return GenIcon({ "attr": { "viewBox": "0 0 16 16", "fill": "currentColor" }, "child": [{ "tag": "path", "attr": { "fillRule": "evenodd", "clipRule": "evenodd", "d": "M15.3702 13.6799L11.3702 1.67989C11.3006 1.47291 11.1652 1.29438 10.9846 1.17159C10.804 1.0488 10.5882 0.988513 10.3702 0.999896H5.63017C5.42052 0.999354 5.21598 1.0647 5.04551 1.18672C4.87504 1.30875 4.74724 1.48127 4.68015 1.67989L0.630165 13.6799C0.577646 13.8346 0.56382 13.9998 0.589943 14.1611C0.616066 14.3225 0.681335 14.4749 0.780007 14.6052C0.878678 14.7354 1.00778 14.8395 1.15598 14.9083C1.30419 14.9771 1.46699 15.0086 1.63017 14.9999H4.56016C4.76809 14.9984 4.97035 14.932 5.13883 14.8101C5.30731 14.6883 5.43363 14.5169 5.50016 14.3199L6.11015 12.5399L9.11015 14.8099C9.28448 14.9362 9.49495 15.0028 9.71018 14.9999H14.3902C14.5517 15.0052 14.7121 14.9712 14.8576 14.901C15.0032 14.8307 15.1295 14.7263 15.2259 14.5965C15.3222 14.4668 15.3856 14.3156 15.4107 14.156C15.4359 13.9963 15.422 13.833 15.3702 13.6799ZM9.75016 14.3399C9.67748 14.3399 9.60693 14.3153 9.55015 14.2699L3.90018 10.0799L3.81016 10.0099H6.81016L6.89017 9.79988L7.89017 7.26988L10.1302 13.8999C10.1482 13.9555 10.1515 14.0148 10.1399 14.072C10.1283 14.1293 10.1022 14.1826 10.064 14.2269C10.0258 14.2711 9.97689 14.3047 9.92191 14.3245C9.86694 14.3443 9.80778 14.3496 9.75016 14.3399V14.3399ZM14.4201 14.3399H10.7002C10.7749 14.1262 10.7749 13.8935 10.7002 13.6799L6.65018 1.67989H10.3702C10.4408 1.68024 10.5095 1.70258 10.5669 1.74379C10.6242 1.78501 10.6673 1.84308 10.6902 1.9099L14.7402 13.9099C14.7538 13.9597 14.756 14.012 14.7464 14.0628C14.7369 14.1136 14.7159 14.1615 14.6851 14.203C14.6542 14.2444 14.6144 14.2783 14.5685 14.302C14.5226 14.3257 14.4718 14.3387 14.4201 14.3399V14.3399Z" }, "child": [] }] })(props);
}
function ThemeToggle({ className }) {
  const { theme, setTheme } = useTheme();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Button,
    {
      variant: "ghost",
      size: "icon",
      className: cn("rounded-full border border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all text-foreground", className),
      onClick: () => setTheme(theme === "light" ? "dark" : "light"),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Sun, { className: "h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Moon, { className: "absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sr-only", children: "Toggle theme" })
      ]
    }
  );
}
const safeLocalStorage = {
  getItem: (key) => {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.warn("localStorage is not available:", e);
      return null;
    }
  },
  setItem: (key, value) => {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.warn("localStorage is not available:", e);
    }
  },
  removeItem: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.warn("localStorage is not available:", e);
    }
  }
};
const miniApiRequest = async (method, path, body) => {
  const initData = getTelegramInitData();
  let webUserId = safeLocalStorage.getItem("web_user_id") || "";
  if (!webUserId) {
    webUserId = "web_guest_" + Math.random().toString(36).substring(2, 15);
    safeLocalStorage.setItem("web_user_id", webUserId);
  }
  const res = await fetch(path, {
    method,
    headers: {
      "Content-Type": "application/json",
      "x-telegram-init-data": initData,
      "x-web-user-id": webUserId
    },
    body: body ? JSON.stringify(body) : void 0
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Request failed");
  }
  return res;
};
const getProviderTheme = (name, type) => {
  const n = (name + " " + type).toLowerCase();
  const themes = {
    aws: {
      logo: "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg",
      color: "text-[#FF9900]",
      bg: "bg-[#FF9900]/5 dark:bg-white",
      hover: "group-hover:bg-[#FF9900]"
    },
    digitalocean: {
      logo: "https://www.vectorlogo.zone/logos/digitalocean/digitalocean-icon.svg",
      color: "text-[#0080FF]",
      bg: "bg-[#0080FF]/5",
      hover: "group-hover:bg-[#0080FF]"
    },
    azure: {
      logo: "https://www.vectorlogo.zone/logos/microsoft_azure/microsoft_azure-icon.svg",
      color: "text-[#0089D6]",
      bg: "bg-[#0089D6]/5",
      hover: "group-hover:bg-[#0089D6]"
    },
    oracle: {
      logo: "https://www.vectorlogo.zone/logos/oracle/oracle-icon.svg",
      color: "text-[#F11010]",
      bg: "bg-[#F11010]/5",
      hover: "group-hover:bg-[#F11010]"
    },
    google: {
      logo: "https://www.vectorlogo.zone/logos/google_cloud/google_cloud-icon.svg",
      color: "text-[#4285F4]",
      bg: "bg-[#4285F4]/5",
      hover: "group-hover:bg-[#4285F4]"
    },
    vultr: {
      logo: "https://www.vectorlogo.zone/logos/vultr/vultr-icon.svg",
      color: "text-[#007BFF]",
      bg: "bg-[#007BFF]/5",
      hover: "group-hover:bg-[#007BFF]"
    },
    hetzner: {
      logo: "https://v1.hetzner.com/img/hetzner-logo.svg",
      color: "text-[#D50C2D]",
      bg: "bg-[#D50C2D]/5",
      hover: "group-hover:bg-[#D50C2D]"
    },
    binance: {
      logo: "https://www.vectorlogo.zone/logos/binance/binance-icon.svg",
      color: "text-[#F3BA2F]",
      bg: "bg-[#F3BA2F]/5",
      hover: "group-hover:bg-[#F3BA2F]"
    },
    claude: {
      logo: "https://svgl.app/library/claude.svg",
      color: "text-[#D97706]",
      bg: "bg-[#D97706]/5",
      hover: "group-hover:bg-[#D97706]"
    },
    gemini: {
      logo: "https://svgl.app/library/gemini.svg",
      color: "text-[#1A73E8]",
      bg: "bg-[#1A73E8]/5",
      hover: "group-hover:bg-[#1A73E8]"
    },
    cursor: {
      logo: "https://svgl.app/library/cursor.svg",
      color: "text-white",
      bg: "bg-white/5",
      hover: "group-hover:bg-white/20"
    },
    chatgpt: {
      logo: "https://svgl.app/library/chatgpt.svg",
      color: "text-[#10A37F]",
      bg: "bg-[#10A37F]/5",
      hover: "group-hover:bg-[#10A37F]"
    },
    capcut: {
      logo: "https://svgl.app/library/capcut.svg",
      color: "text-[#00C4FF]",
      bg: "bg-[#00C4FF]/5",
      hover: "group-hover:bg-[#00C4FF]"
    }
  };
  let target = null;
  if (n.includes("aws") || n.includes("amazon")) target = themes.aws;
  else if (n.includes("digitalocean") || n.includes("digital ocean")) target = themes.digitalocean;
  else if (n.includes("vultr")) target = themes.vultr;
  else if (n.includes("azure") || n.includes("microsoft")) target = themes.azure;
  else if (n.includes("oracle")) target = themes.oracle;
  else if (n.includes("hetzner")) target = themes.hetzner;
  else if (n.includes("google") || n.includes("gcp")) target = themes.google;
  else if (n.includes("binance")) target = themes.binance;
  else if (n.includes("claude")) target = themes.claude;
  else if (n.includes("gemini")) target = themes.gemini;
  else if (n.includes("cursor")) target = themes.cursor;
  else if (n.includes("chatgpt") || n.includes("openai") || n.includes("gpt")) target = themes.chatgpt;
  else if (n.includes("capcut") || n.includes("cap cut")) target = themes.capcut;
  if (target) {
    return {
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: target.logo, alt: name, className: "w-7 h-7 object-contain group-hover:brightness-0 group-hover:invert transition-all duration-300" }),
      color: target.color,
      bg: target.bg,
      hover: target.hover
    };
  }
  return {
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "w-6 h-6" }),
    color: "text-neutral-600",
    bg: "bg-neutral-50",
    hover: "group-hover:bg-neutral-600"
  };
};
const getProviderIcon = (name, type) => {
  return getProviderTheme(name, type).icon;
};
const UserAvatar = ({ fallback: Fallback, className, googleAvatarUrl }) => {
  const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
  const photoUrl = googleAvatarUrl || tgUser?.photo_url;
  if (photoUrl) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "img",
      {
        src: photoUrl,
        alt: "Profile",
        className: `${className} object-cover rounded-[30%]`,
        onError: (e) => {
          e.target.style.display = "none";
        },
        referrerPolicy: "no-referrer"
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Fallback, { className: "w-5 h-5 text-white" });
};
function LiveTOTP({ secret, onCopy }) {
  const [code, setCode] = reactExports.useState("000000");
  const [timeLeft, setTimeLeft] = reactExports.useState(30);
  reactExports.useEffect(() => {
    const updateCode = async () => {
      const newCode = await generateTOTP(secret);
      setCode(newCode);
    };
    updateCode();
    const timer = setInterval(() => {
      const remaining = getRemainingSeconds();
      setTimeLeft(remaining);
      if (remaining === 30) {
        updateCode();
      }
    }, 1e3);
    return () => clearInterval(timer);
  }, [secret]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gradient-to-br from-purple-600 to-indigo-700 p-4 rounded-2xl text-white shadow-lg relative overflow-hidden group mb-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 right-0 w-24 h-24 bg-white/5 blur-2xl rounded-full translate-x-8 -translate-y-8" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[9px] font-black uppercase tracking-widest text-purple-100/60 flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1 h-1 rounded-full bg-green-400 animate-pulse" }),
          "Live 2FA"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-2xl font-black tracking-widest font-mono tabular-nums", children: [
          code.slice(0, 3),
          " ",
          code.slice(3)
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-11 h-11 flex items-center justify-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { className: "w-full h-full -rotate-90", viewBox: "0 0 48 48", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "circle",
              {
                cx: "24",
                cy: "24",
                r: "19",
                stroke: "currentColor",
                strokeWidth: "4",
                fill: "transparent",
                className: "text-white/20"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "circle",
              {
                cx: "24",
                cy: "24",
                r: "19",
                stroke: "currentColor",
                strokeWidth: "4",
                fill: "transparent",
                strokeDasharray: 119.38,
                strokeDashoffset: 119.38 - 119.38 * timeLeft / 30,
                strokeLinecap: "round",
                className: "text-white transition-all duration-1000 ease-linear"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "absolute text-[9px] font-black tabular-nums", children: [
            timeLeft,
            "s"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "ghost",
            size: "icon",
            className: "w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white shadow-sm transition-all active:scale-90",
            onClick: () => onCopy(code),
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "w-4 h-4" })
          }
        )
      ] })
    ] })
  ] });
}
const formatChatMessage = (text) => {
  if (!text) return "";
  const lines = text.split("\n");
  return lines.map((line, idx) => {
    const isBullet = line.trim().startsWith("* ") || line.trim().startsWith("- ");
    const content = isBullet ? line.trim().substring(2) : line;
    const boldRegex = /\*\*(.*?)\*\*/g;
    const elements = [];
    let lastIndex = 0;
    let match;
    while ((match = boldRegex.exec(content)) !== null) {
      const matchIndex = match.index;
      const matchText = match[1];
      if (matchIndex > lastIndex) {
        elements.push(content.substring(lastIndex, matchIndex));
      }
      elements.push(/* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "font-black text-purple-400 dark:text-purple-300", children: matchText }, matchIndex));
      lastIndex = boldRegex.lastIndex;
    }
    if (lastIndex < content.length) {
      elements.push(content.substring(lastIndex));
    }
    if (isBullet) {
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 pl-2 py-0.5 leading-relaxed text-[11px]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-purple-500 dark:text-purple-400 font-black", children: "•" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1", children: elements.length > 0 ? elements : content })
      ] }, idx);
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-[1.25em] leading-relaxed text-[11px]", children: elements.length > 0 ? elements : content }, idx);
  });
};
function hexToHsl(hex) {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, (_, r2, g2, b2) => r2 + r2 + g2 + g2 + b2 + b2);
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return "275 100% 70%";
  let r = parseInt(result[1], 16) / 255;
  let g = parseInt(result[2], 16) / 255;
  let b = parseInt(result[3], 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  h = Math.round(h * 360);
  s = Math.round(s * 100);
  l = Math.round(l * 100);
  return `${h} ${s}% ${l}%`;
}
function MiniAppShop() {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["/api/mini/user"],
    queryFn: async () => {
      const res = await miniApiRequest("GET", "/api/mini/user");
      return res.json();
    }
  });
  const [displayCurrency, setDisplayCurrency] = reactExports.useState(localStorage.getItem("display_currency") || "USD");
  const { data: rateLkrSetting } = useQuery({
    queryKey: ["/api/settings/CURRENCY_RATE_LKR"]
  });
  const { data: categoryOrderSetting } = useQuery({
    queryKey: ["/api/settings/CATEGORY_ORDER"]
  });
  const renderCategoryIcon = (iconName) => {
    switch (iconName) {
      case "Aws":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(FaAws, { className: "w-4 h-4" });
      case "Digitalocean":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(SiDigitalocean, { className: "w-4 h-4" });
      case "Azure":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(VscAzure, { className: "w-4 h-4" });
      case "Googlecloud":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(SiGooglecloud, { className: "w-4 h-4" });
      case "Vultr":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(SiVultr, { className: "w-4 h-4" });
      case "Hetzner":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(SiHetzner, { className: "w-4 h-4" });
      case "Database":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Database, { className: "w-4 h-4" });
      case "Openai":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(SiOpenai, { className: "w-4 h-4", style: { color: "#10a37f" } });
      case "Claude":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(SiClaude, { className: "w-4 h-4", style: { color: "#D4A574" } });
      case "Googlegemini":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(SiGooglegemini, { className: "w-4 h-4", style: { color: "#4285F4" } });
      case "Cursor":
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { viewBox: "0 0 24 24", className: "w-4 h-4", fill: "none", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { width: "24", height: "24", rx: "6", fill: "#000" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M12 4L20 19H4L12 4Z", fill: "white" })
        ] });
      case "Capcut":
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { viewBox: "0 0 24 24", className: "w-4 h-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { width: "24", height: "24", rx: "4", fill: "#000" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M7 7h4v10H7zM13 7h4v10h-4z", fill: "white" })
        ] });
      default:
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "w-4 h-4" });
    }
  };
  const shopCategories = (() => {
    if (categoryOrderSetting?.value) {
      try {
        const parsed = JSON.parse(categoryOrderSetting.value);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        console.error("Failed to parse CATEGORY_ORDER setting:", e);
      }
    }
    return [
      { id: "all", label: "All", icon: "Package" },
      { id: "aws", label: "AWS", icon: "Aws" },
      { id: "digitalocean", label: "DO", icon: "Digitalocean" },
      { id: "azure", label: "Azure", icon: "Azure" },
      { id: "google", label: "GCP", icon: "Googlecloud" },
      { id: "vultr", label: "Vultr", icon: "Vultr" },
      { id: "hetzner", label: "Hetzner", icon: "Hetzner" },
      { id: "oracle", label: "Oracle", icon: "Database" },
      { id: "chatgpt", label: "ChatGPT", icon: "Openai" },
      { id: "claude", label: "Claude", icon: "Claude" },
      { id: "gemini", label: "Gemini", icon: "Googlegemini" },
      { id: "cursor", label: "Cursor", icon: "Cursor" },
      { id: "capcut", label: "CapCut", icon: "Capcut" }
    ];
  })();
  const { data: p2pRateData } = useQuery({
    queryKey: ["/api/mini/p2p-rate"],
    refetchInterval: 5 * 60 * 1e3,
    // refetch every 5 min
    staleTime: 4 * 60 * 1e3
  });
  const liveLkrRate = p2pRateData?.rate || (rateLkrSetting?.value ? parseFloat(rateLkrSetting.value) : 350);
  const getRate = (currency) => {
    if (currency === "LKR") return liveLkrRate;
    if (currency === "USDT") return 1;
    if (currency === "TRX") return 8;
    return 1;
  };
  const formatPrice = (amountInCents, fromCurrency = "USD", toCurrency) => {
    if (fromCurrency === toCurrency) {
      const amount = amountInCents / 100;
      if (toCurrency === "LKR") return `Rs. ${amount.toFixed(2)}`;
      if (toCurrency === "USDT") return `₮ ${amount.toFixed(2)}`;
      if (toCurrency === "TRX") return `${amount.toFixed(2)} TRX`;
      return `$${amount.toFixed(2)}`;
    }
    const fromRate = getRate(fromCurrency);
    const amountInUsdCents = Math.round(amountInCents / fromRate);
    const toRate = getRate(toCurrency);
    const convertedAmount = amountInUsdCents / 100 * toRate;
    if (toCurrency === "LKR") return `Rs. ${convertedAmount.toFixed(2)}`;
    if (toCurrency === "USDT") return `₮ ${convertedAmount.toFixed(2)}`;
    if (toCurrency === "TRX") return `${convertedAmount.toFixed(2)} TRX`;
    return `$${convertedAmount.toFixed(2)}`;
  };
  const getUserBalanceString = () => {
    if (!user) return "$0.00";
    if (displayCurrency === "LKR") return `Rs. ${((user.balanceLkr || 0) / 100).toFixed(2)}`;
    if (displayCurrency === "USDT") return `₮ ${((user.balanceUsdt || 0) / 100).toFixed(2)}`;
    if (displayCurrency === "TRX") return `${((user.balanceTrx || 0) / 100).toFixed(2)} TRX`;
    return `$${((user.balance || 0) / 100).toFixed(2)}`;
  };
  const isDarkMode = theme === "dark" || theme === "system" && typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches;
  if (typeof window !== "undefined") {
    const bg = isDarkMode ? "#121212" : "#f8f7ff";
    document.body.style.background = bg;
    document.body.style.backgroundColor = bg;
  }
  const [activeTab, setActiveTab] = reactExports.useState("store");
  const [selectedProduct, setSelectedProduct] = reactExports.useState(null);
  const [viewingOrder, setViewingOrder] = reactExports.useState(null);
  const [currentSlide, setCurrentSlide] = reactExports.useState(0);
  const autoSwapRef = reactExports.useRef(null);
  const [purchaseSuccess, setPurchaseSuccess] = reactExports.useState(false);
  const [purchaseQuantity, setPurchaseQuantity] = reactExports.useState(1);
  const [selectedOffer, setSelectedOffer] = reactExports.useState(null);
  const [selectedCategory, setSelectedCategory] = reactExports.useState("all");
  const [activeTutorial, setActiveTutorial] = reactExports.useState(null);
  const [isDepositModalOpen, setIsDepositModalOpen] = reactExports.useState(false);
  const [depositAmount, setDepositAmount] = reactExports.useState("10.00");
  const [depositMethod, setDepositMethod] = reactExports.useState("binance");
  const [selectedDepositCurrency, setSelectedDepositCurrency] = reactExports.useState("USD");
  const [activeDeposit, setActiveDeposit] = reactExports.useState(null);
  const [txidInput, setTxidInput] = reactExports.useState("");
  const [isVerifyingPayment, setIsVerifyingPayment] = reactExports.useState(false);
  const [emailInput, setEmailInput] = reactExports.useState("");
  const [otpInput, setOtpInput] = reactExports.useState("");
  const [otpSent, setOtpSent] = reactExports.useState(false);
  const [isAuthSubmitting, setIsAuthSubmitting] = reactExports.useState(false);
  const [isLoginDialogOpen, setIsLoginDialogOpen] = reactExports.useState(false);
  const handleSendOtp = async () => {
    if (!emailInput || !emailInput.includes("@")) {
      toast({ title: "Error", description: "Please enter a valid email address", variant: "destructive" });
      return;
    }
    setIsAuthSubmitting(true);
    try {
      const res = await fetch("/api/mini/auth/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailInput })
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to send code");
      }
      const data = await res.json();
      setOtpSent(true);
      toast({ title: "OTP Sent", description: "Verification code sent to your email." });
    } catch (err) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setIsAuthSubmitting(false);
    }
  };
  const handleVerifyOtp = async () => {
    if (!otpInput || otpInput.trim().length !== 6) {
      toast({ title: "Error", description: "Please enter a valid 6-digit OTP code", variant: "destructive" });
      return;
    }
    setIsAuthSubmitting(true);
    try {
      const res = await fetch("/api/mini/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailInput, code: otpInput })
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Verification failed");
      }
      const data = await res.json();
      localStorage.setItem("web_user_id", data.user.telegramId);
      toast({ title: "Login Successful", description: `Welcome back, ${data.user.firstName}!` });
      setOtpSent(false);
      setOtpInput("");
      setEmailInput("");
      setIsLoginDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["/api/mini/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/mini/orders"] });
      queryClient.invalidateQueries({ queryKey: ["/api/mini/payments"] });
    } catch (err) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setIsAuthSubmitting(false);
    }
  };
  const handleLogout = () => {
    localStorage.removeItem("web_user_id");
    toast({ title: "Logged Out", description: "You have been logged out and returned to guest session." });
    queryClient.invalidateQueries({ queryKey: ["/api/mini/user"] });
    queryClient.invalidateQueries({ queryKey: ["/api/mini/orders"] });
    queryClient.invalidateQueries({ queryKey: ["/api/mini/payments"] });
  };
  const handleCreateDeposit = async () => {
    try {
      if (depositMethod === "stripe" && isStripeLocked) {
        toast({ title: "Stripe Payment Locked", description: "Stripe deposits are temporarily locked by the administrator.", variant: "destructive" });
        return;
      }
      const amt = parseFloat(depositAmount);
      if (isNaN(amt) || amt <= 0) {
        toast({ title: "Invalid Amount", description: "Please enter a positive number.", variant: "destructive" });
        return;
      }
      const minDepositLimit2 = minDepositSetting?.value ? parseFloat(minDepositSetting.value) : 1;
      const rateLkr = liveLkrRate;
      const actualMinDeposit = selectedDepositCurrency === "LKR" ? minDepositLimit2 * rateLkr : minDepositLimit2;
      if (amt < actualMinDeposit) {
        toast({
          title: "Minimum Deposit Required",
          description: `Minimum deposit amount is ${selectedDepositCurrency === "LKR" ? "Rs. " : selectedDepositCurrency === "USDT" ? "₮ " : selectedDepositCurrency === "TRX" ? "TRX " : "$"}${actualMinDeposit.toFixed(2)}.`,
          variant: "destructive"
        });
        return;
      }
      const res = await miniApiRequest("POST", "/api/mini/deposit", {
        amount: amt,
        method: depositMethod,
        currency: selectedDepositCurrency,
        exchangeRate: selectedDepositCurrency === "LKR" ? liveLkrRate.toString() : void 0
      });
      const data = await res.json();
      if (depositMethod === "stripe") {
        toast({ title: "Redirection", description: "Redirecting you to Stripe checkout..." });
        setIsDepositModalOpen(false);
        window.location.href = data.url;
      } else {
        setActiveDeposit({
          paymentId: data.paymentId,
          walletAddress: data.walletAddress,
          amount: data.amount,
          method: depositMethod,
          remark: data.remark,
          currency: selectedDepositCurrency,
          exchangeRate: selectedDepositCurrency === "LKR" ? liveLkrRate.toString() : void 0
        });
      }
    } catch (err) {
      toast({ title: "Failed to deposit", description: err.message, variant: "destructive" });
    }
  };
  const handleResumePendingPayment = (payment) => {
    let walletAddress = "Not Set";
    const method = payment.paymentMethod.toLowerCase();
    if (method === "trc20") {
      walletAddress = trc20WalletSetting?.value || "Txxxx...";
    } else if (method === "aptos") {
      walletAddress = aptosWalletSetting?.value || "0xxxx...";
    } else if (method === "binance") {
      walletAddress = binancePayIdSetting?.value || "999999...";
    }
    setActiveDeposit({
      paymentId: payment.id,
      walletAddress,
      amount: payment.amount / 100,
      method,
      remark: payment.cryptomusUuid || "",
      currency: payment.currency,
      exchangeRate: payment.exchangeRate
    });
    setIsDepositModalOpen(true);
  };
  const handleVerifyCryptoPayment = async () => {
    if (!activeDeposit || activeDeposit.method !== "binance" && !txidInput.trim()) {
      toast({ title: "TXID Required", description: "Please enter the Transaction ID (TXID) first.", variant: "destructive" });
      return;
    }
    setIsVerifyingPayment(true);
    try {
      const res = await miniApiRequest("POST", "/api/mini/check-payment", {
        paymentId: activeDeposit.paymentId,
        txId: activeDeposit.method === "binance" ? activeDeposit.remark || "binance" : txidInput.trim()
      });
      const data = await res.json();
      toast({ title: "Payment Verified", description: data.message });
      queryClient.invalidateQueries({ queryKey: ["/api/mini/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/mini/payments"] });
      setActiveDeposit(null);
      setTxidInput("");
      setIsDepositModalOpen(false);
    } catch (err) {
      toast({ title: "Verification Failed", description: err.message, variant: "destructive" });
    } finally {
      setIsVerifyingPayment(false);
    }
  };
  const [isChatOpen, setIsChatOpen] = reactExports.useState(false);
  const [chatMessage, setChatMessage] = reactExports.useState("");
  const [chatHistory, setChatHistory] = reactExports.useState([
    { role: "bot", content: "Hello! 👋 I'm your AI Support Concierge. How can I help you today?" }
  ]);
  const [isSendingChat, setIsSendingChat] = reactExports.useState(false);
  const chatEndRef = reactExports.useRef(null);
  const [chatMode, setChatMode] = reactExports.useState("ai");
  const [liveMessages, setLiveMessages] = reactExports.useState([]);
  const [isLiveLoading, setIsLiveLoading] = reactExports.useState(false);
  const [isRequestingHuman, setIsRequestingHuman] = reactExports.useState(false);
  const [isSupportMenuOpen, setIsSupportMenuOpen] = reactExports.useState(false);
  const [activeButtonIcon, setActiveButtonIcon] = reactExports.useState("chat");
  const [isUploadingFile, setIsUploadingFile] = reactExports.useState(false);
  const [uploadedAttachment, setUploadedAttachment] = reactExports.useState(null);
  const fileInputRef = reactExports.useRef(null);
  const compressImage = (file) => {
    return new Promise((resolve) => {
      if (!file.type.startsWith("image/") || file.type.includes("gif") || file.type.includes("svg")) {
        return resolve(file);
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;
          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (!ctx) return resolve(file);
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob);
              } else {
                resolve(file);
              }
            },
            "image/jpeg",
            0.75
          );
        };
        img.onerror = () => resolve(file);
        img.src = event.target?.result;
      };
      reader.onerror = () => resolve(file);
      reader.readAsDataURL(file);
    });
  };
  const handleUploadFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Maximum file size is 10MB. Please choose a smaller file.",
        variant: "destructive"
      });
      return;
    }
    setIsUploadingFile(true);
    try {
      const uploadFile = await compressImage(file);
      const formData = new FormData();
      formData.append("file", uploadFile, file.name);
      const initData = getTelegramInitData();
      let webUserId = safeLocalStorage.getItem("web_user_id") || "";
      if (!webUserId) {
        webUserId = "web_guest_" + Math.random().toString(36).substring(2, 15);
        safeLocalStorage.setItem("web_user_id", webUserId);
      }
      let res;
      try {
        res = await fetch("/api/support/upload", {
          method: "POST",
          headers: {
            "x-telegram-init-data": initData || "",
            "x-web-user-id": webUserId
          },
          body: formData
        });
      } catch (netErr) {
        throw new Error("Network error: " + (netErr.message || "Cannot connect to server"));
      }
      if (!res.ok) {
        let errMsg = `Upload failed (${res.status})`;
        try {
          const errData = await res.json();
          errMsg = errData.message || errMsg;
        } catch {
        }
        throw new Error(errMsg);
      }
      const data = await res.json();
      let fileUrl = data.fileUrl || "";
      if (fileUrl.startsWith("http://")) {
        fileUrl = fileUrl.replace("http://", "https://");
      }
      setUploadedAttachment({
        url: fileUrl,
        type: file.type.startsWith("image/") ? "image" : file.type === "application/pdf" ? "pdf" : "document",
        name: file.name
      });
      toast({
        title: "File Uploaded ✅",
        description: `${file.name} uploaded successfully.`
      });
    } catch (err) {
      console.error("[Upload Error]", err);
      toast({
        title: "Upload Failed",
        description: err.message || "Failed to upload file. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploadingFile(false);
    }
  };
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const formatTime = (dateStr) => {
    if (!dateStr) return "";
    try {
      const normalizedStr = typeof dateStr === "string" ? dateStr.replace(" ", "T") : dateStr;
      const d = new Date(normalizedStr);
      if (isNaN(d.getTime())) return "";
      return format(d, "hh:mm a");
    } catch (e) {
      return "";
    }
  };
  reactExports.useEffect(() => {
    if (isChatOpen) scrollToBottom();
  }, [chatHistory, liveMessages, isChatOpen]);
  const fetchLiveMessages = async () => {
    setIsLiveLoading(true);
    try {
      const res = await miniApiRequest("GET", "/api/mini/support/messages");
      const data = await res.json();
      setLiveMessages(data);
    } catch (err) {
      console.error("Failed to load live support messages:", err);
    } finally {
      setIsLiveLoading(false);
    }
  };
  const handleRequestHuman = async () => {
    setIsRequestingHuman(true);
    try {
      const res = await miniApiRequest("POST", "/api/mini/support/request");
      const data = await res.json();
      setChatMode("human");
      await fetchLiveMessages();
    } catch (err) {
      toast({
        title: "Request Failed",
        description: err.message || "Failed to contact live support.",
        variant: "destructive"
      });
    } finally {
      setIsRequestingHuman(false);
    }
  };
  const handleBankTransferTopup = async () => {
    setIsDepositModalOpen(false);
    setIsChatOpen(true);
    try {
      await miniApiRequest("POST", "/api/mini/support/request");
      setChatMode("human");
      const autoMsg = `🏦 I want to top up my LKR balance via Bank Transfer. Please guide me on how to proceed.`;
      const res = await miniApiRequest("POST", "/api/mini/support/send", { message: autoMsg });
      const data = await res.json();
      setLiveMessages((prev) => {
        if (prev.some((m) => m.id === data.message.id)) return prev;
        return [...prev, data.message];
      });
      await fetchLiveMessages();
    } catch (err) {
      toast({
        title: "Connecting to Agent",
        description: "Opening live support for bank transfer instructions."
      });
    }
  };
  const handleSendLiveMessage = async () => {
    if (!chatMessage.trim() && !uploadedAttachment || isSendingChat || !user?.telegramId) return;
    const userMsg = chatMessage.trim();
    const attachmentUrl = uploadedAttachment?.url || null;
    const attachmentType = uploadedAttachment?.type || null;
    setChatMessage("");
    setUploadedAttachment(null);
    setIsSendingChat(true);
    try {
      const res = await miniApiRequest("POST", "/api/mini/support/send", {
        message: userMsg,
        attachmentUrl,
        attachmentType
      });
      const data = await res.json();
      setLiveMessages((prev) => {
        if (prev.some((m) => m.id === data.message.id)) return prev;
        return [...prev, data.message];
      });
    } catch (err) {
      toast({
        title: "Send Failed",
        description: err.message || "Failed to send message to live agent.",
        variant: "destructive"
      });
    } finally {
      setIsSendingChat(false);
    }
  };
  reactExports.useEffect(() => {
    if (!isChatOpen || chatMode !== "human" || !user?.telegramId) return;
    const socket = lookup();
    socket.on("support_message", (msg) => {
      if (msg.telegramId === user.telegramId.toString()) {
        setLiveMessages((prev) => {
          if (prev.some((m) => m.id === msg.id)) return prev;
          return [...prev, msg];
        });
      }
    });
    return () => {
      socket.disconnect();
    };
  }, [isChatOpen, chatMode, user?.telegramId]);
  reactExports.useEffect(() => {
    if (chatMode === "human") {
      fetchLiveMessages();
    }
  }, [chatMode]);
  const handleSendChat = async () => {
    if (!chatMessage.trim() || isSendingChat) return;
    const userMsg = chatMessage.trim();
    setChatHistory((prev) => [...prev, { role: "user", content: userMsg }]);
    setChatMessage("");
    setIsSendingChat(true);
    try {
      const res = await fetch("/api/support/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg })
      });
      const data = await res.json();
      setChatHistory((prev) => [...prev, { role: "bot", content: data.answer || "I'm offline right now." }]);
    } catch (err) {
      setChatHistory((prev) => [...prev, { role: "bot", content: `Sorry, I'm having trouble connecting. Reach out to ${supportUsername}.` }]);
    } finally {
      setIsSendingChat(false);
    }
  };
  reactExports.useEffect(() => {
    expandTelegramWebApp();
    const webApp = window.Telegram?.WebApp;
    const isDark = theme === "dark" || theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches;
    const bgLight = "#f8f7ff";
    const bgDark = "#121212";
    const bg = isDark ? bgDark : bgLight;
    document.body.style.background = bg;
    document.body.style.backgroundColor = bg;
    if (webApp) {
      webApp.setHeaderColor(isDark ? "#1a1a1a" : "#ffffff");
      webApp.setBackgroundColor(bg);
    }
    if (isDark) {
      document.body.classList.add("tg-body");
    } else {
      document.body.classList.remove("tg-body");
    }
    const params = new URLSearchParams(window.location.search);
    const paymentStatus = params.get("payment");
    const sessionId = params.get("session_id");
    const webUserIdParam = params.get("web_user_id");
    if (webUserIdParam) {
      safeLocalStorage.setItem("web_user_id", webUserIdParam);
      toast({ title: "Login Successful", description: "Successfully signed in with Google!" });
      queryClient.invalidateQueries({ queryKey: ["/api/mini/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/mini/orders"] });
      queryClient.invalidateQueries({ queryKey: ["/api/mini/payments"] });
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    if (paymentStatus === "success" && sessionId) {
      fetch("/api/mini/stripe-verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-telegram-init-data": getTelegramInitData(),
          "x-web-user-id": safeLocalStorage.getItem("web_user_id") || ""
        },
        body: JSON.stringify({ sessionId })
      }).then((res) => res.json()).then((data) => {
        if (data.success) {
          toast({ title: "Deposit Credited", description: data.message || "Your Stripe payment was successfully credited!" });
        } else {
          toast({ title: "Verification Failed", description: data.message || "Could not verify payment.", variant: "destructive" });
        }
        queryClient.invalidateQueries({ queryKey: ["/api/mini/user"] });
        queryClient.invalidateQueries({ queryKey: ["/api/mini/payments"] });
        window.history.replaceState({}, document.title, window.location.pathname);
      }).catch((err) => {
        console.error("Error crediting simulated stripe:", err);
      });
    } else if (paymentStatus === "cancel") {
      toast({ title: "Payment Cancelled", description: "You cancelled the Stripe checkout.", variant: "destructive" });
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    return () => {
      document.body.classList.remove("tg-body");
      document.body.style.background = "";
      document.body.style.backgroundColor = "";
    };
  }, [theme]);
  reactExports.useEffect(() => {
    const interval = setInterval(() => {
      setActiveButtonIcon((prev) => prev === "chat" ? "whatsapp" : "chat");
    }, 4e3);
    return () => clearInterval(interval);
  }, []);
  reactExports.useEffect(() => {
    if (user?.telegramId) {
      const checkActiveSupport = async () => {
        try {
          const res = await miniApiRequest("GET", "/api/mini/support/messages");
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data) && data.length > 0) {
              setChatMode("human");
              setLiveMessages(data);
            } else {
              setChatMode("ai");
            }
          }
        } catch (err) {
          console.error("Error checking support mode:", err);
        }
      };
      checkActiveSupport();
    }
  }, [user?.telegramId]);
  const copyToClipboard = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to Clipboard",
      description: "Credential details have been copied successfully.",
      duration: 2e3
    });
  };
  const { data: stripeEnabledSetting } = useQuery({
    queryKey: ["/api/settings/STRIPE_ENABLED"],
    staleTime: 0
  });
  const isStripeLocked = stripeEnabledSetting?.value === "false";
  const { data: storeNameSetting } = useQuery({
    queryKey: ["/api/settings/STORE_NAME"],
    staleTime: 0
  });
  const { data: supportUsernameSetting } = useQuery({
    queryKey: ["/api/settings/SUPPORT_USERNAME"],
    staleTime: 0
  });
  const { data: supportBtnTextSetting } = useQuery({
    queryKey: ["/api/settings/SUPPORT_BTN_TEXT"],
    staleTime: 0
  });
  const { data: loadingTextSetting } = useQuery({
    queryKey: ["/api/settings/LOADING_TEXT"],
    staleTime: 0
  });
  const { data: minDepositSetting } = useQuery({
    queryKey: ["/api/settings/MIN_DEPOSIT_LIMIT"],
    staleTime: 0
  });
  const { data: trc20WalletSetting } = useQuery({
    queryKey: ["/api/settings/TRC20_WALLET_ADDRESS"],
    staleTime: 0
  });
  const { data: aptosWalletSetting } = useQuery({
    queryKey: ["/api/settings/APTOS_WALLET_ADDRESS"],
    staleTime: 0
  });
  const { data: binancePayIdSetting } = useQuery({
    queryKey: ["/api/settings/BINANCE_PAY_ID"],
    staleTime: 0
  });
  const { data: bannerImagesSetting } = useQuery({
    queryKey: ["/api/settings/BANNER_IMAGES"],
    staleTime: 0
  });
  const { data: themeColorSetting } = useQuery({
    queryKey: ["/api/settings/THEME_COLOR"],
    staleTime: 0
  });
  const { data: googleLoginEnabledSetting } = useQuery({
    queryKey: ["/api/settings/GOOGLE_LOGIN_ENABLED"],
    staleTime: 0
  });
  const { data: googleClientIdSetting } = useQuery({
    queryKey: ["/api/settings/GOOGLE_CLIENT_ID"],
    staleTime: 0
  });
  const { data: defaultThemeSetting } = useQuery({
    queryKey: ["/api/settings/DEFAULT_THEME"],
    staleTime: 0
  });
  const { data: whatsappLinkSetting } = useQuery({
    queryKey: ["/api/settings/WHATSAPP_CONTACT_LINK"],
    staleTime: 0
  });
  const whatsappLink = whatsappLinkSetting?.value || "https://wa.me/94760895782";
  reactExports.useEffect(() => {
    if (!localStorage.getItem("shopeefy-theme") && defaultThemeSetting?.value) {
      setTheme(defaultThemeSetting.value);
    }
  }, [defaultThemeSetting, setTheme]);
  const googleEnabled = googleLoginEnabledSetting?.value === "true";
  const googleClientId = googleClientIdSetting?.value ? googleClientIdSetting.value.trim() : null;
  const isGuest = user?.telegramId?.startsWith("web_guest_");
  const handleGoogleRedirectLogin = () => {
    if (!googleClientId) return;
    const redirectUri = `${window.location.origin}/api/auth/google/callback`;
    const oauthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=openid%20email%20profile&state=client`;
    window.location.href = oauthUrl;
  };
  reactExports.useEffect(() => {
    if (!googleEnabled || !googleClientId) return;
    const renderButtons = () => {
      try {
        if (window.google?.accounts?.id) {
          window.google.accounts.id.initialize({
            client_id: googleClientId,
            callback: async (response) => {
              setIsAuthSubmitting(true);
              try {
                const res = await fetch("/api/mini/auth/google", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ credential: response.credential })
                });
                if (!res.ok) {
                  const err = await res.json();
                  throw new Error(err.message || "Google Login failed");
                }
                const data = await res.json();
                localStorage.setItem("web_user_id", data.user.telegramId);
                toast({ title: "Login Successful", description: `Welcome back, ${data.user.firstName}!` });
                setIsLoginDialogOpen(false);
                queryClient.invalidateQueries({ queryKey: ["/api/mini/user"] });
                queryClient.invalidateQueries({ queryKey: ["/api/mini/orders"] });
                queryClient.invalidateQueries({ queryKey: ["/api/mini/payments"] });
              } catch (err) {
                toast({ title: "Error", description: err.message, variant: "destructive" });
              } finally {
                setIsAuthSubmitting(false);
              }
            }
          });
          const containers = ["google-signin-btn-drawer", "google-signin-btn-dialog"];
          containers.forEach((id) => {
            const el = document.getElementById(id);
            if (el && window.google?.accounts?.id) {
              window.google.accounts.id.renderButton(el, {
                theme: "outline",
                size: "large",
                width: el.clientWidth || 300,
                shape: "pill",
                text: "signin_with"
              });
            }
          });
        }
      } catch (e) {
        console.error("Failed to render Google buttons:", e);
      }
    };
    if (!document.getElementById("google-gsi-client")) {
      const script = document.createElement("script");
      script.id = "google-gsi-client";
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = () => {
        setTimeout(renderButtons, 300);
      };
      document.body.appendChild(script);
    } else {
      setTimeout(renderButtons, 300);
    }
  }, [googleEnabled, googleClientId, isGuest, isLoginDialogOpen]);
  const storeName = storeNameSetting?.value || "Shopeefy";
  const supportUsername = supportUsernameSetting?.value || "@support";
  supportBtnTextSetting?.value || "Write to Support";
  const loadingText = loadingTextSetting?.value || "Shopeefy...";
  const minDepositLimit = minDepositSetting?.value ? parseFloat(minDepositSetting.value) : 1;
  const themeColor = themeColorSetting?.value || "#a855f7";
  reactExports.useEffect(() => {
    try {
      const color = themeColor && typeof themeColor === "string" && themeColor.trim() !== "" ? themeColor : "#a855f7";
      const hslVal = hexToHsl(color) || "275 100% 70%";
      const parts = hslVal.split(" ");
      const h = parts[0] || "275";
      const s = parts[1] || "100%";
      const l = parseInt(parts[2]) || 70;
      const sClean = s.replace("%", "");
      let styleTag = document.getElementById("dynamic-theme-style");
      if (!styleTag) {
        styleTag = document.createElement("style");
        styleTag.id = "dynamic-theme-style";
        document.head.appendChild(styleTag);
      }
      styleTag.innerHTML = `
        :root, .dark {
          --primary: ${hslVal} !important;
          --ring: ${hslVal} !important;
          
          --theme-color: hsl(${h} ${s} ${l}%) !important;
          --theme-color-hover: hsl(${h} ${s} ${Math.max(0, l - 10)}%) !important;
          --theme-color-border: hsla(${h}, ${sClean}%, ${l}%, 0.15) !important;
          --theme-color-bg-light: hsla(${h}, ${sClean}%, ${l}%, 0.05) !important;
          --theme-color-bg-trans: hsla(${h}, ${sClean}%, ${l}%, 0.1) !important;
        }

        /* Override all hardcoded Tailwind purple classes inside the mini app */
        .tg-mini-app .bg-purple-600,
        .tg-mini-app .bg-purple-500 {
          background-color: var(--theme-color) !important;
        }

        .tg-mini-app .hover\\:bg-purple-600:hover,
        .tg-mini-app .hover\\:bg-purple-700:hover {
          background-color: var(--theme-color-hover) !important;
        }

        .tg-mini-app .text-purple-600,
        .tg-mini-app .text-purple-500,
        .tg-mini-app .text-purple-400,
        .tg-mini-app .text-purple-300 {
          color: var(--theme-color) !important;
        }

        .tg-mini-app .border-purple-600,
        .tg-mini-app .border-purple-500,
        .tg-mini-app .border-purple-200,
        .tg-mini-app .border-purple-100,
        .tg-mini-app .border-purple-50 {
          border-color: var(--theme-color-border) !important;
        }

        .tg-mini-app .bg-purple-50,
        .tg-mini-app .bg-purple-50\\/50,
        .tg-mini-app .bg-purple-500\\/10 {
          background-color: var(--theme-color-bg-light) !important;
        }
        
        .tg-mini-app .ring-purple-500\\/20 {
          --tw-ring-color: var(--theme-color-border) !important;
        }

        .tg-mini-app .shadow-purple-500\\/\\[0\\.02\\] {
          --tw-shadow-color: hsla(${h}, ${sClean}%, ${l}%, 0.02) !important;
        }
        
        .tg-mini-app .text-purple-100\\/60,
        .tg-mini-app .text-purple-100\\/80 {
          color: hsla(${h}, ${sClean}%, 90%, 0.7) !important;
        }

        .tg-mini-app .from-purple-600 {
          --tw-gradient-from: var(--theme-color) !important;
          --tw-gradient-to: var(--theme-color-hover) !important;
          --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to) !important;
        }

        /* SVG and Icon colors */
        .tg-mini-app svg.text-purple-600,
        .tg-mini-app svg.text-purple-500 {
          color: var(--theme-color) !important;
          stroke: var(--theme-color) !important;
        }
      `;
    } catch (err) {
      console.error("Theme color dynamic styling failed:", err);
    }
  }, [themeColor]);
  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ["/api/mini/products"],
    queryFn: async () => {
      const res = await miniApiRequest("GET", "/api/mini/products");
      return res.json();
    }
  });
  const { data: offers, isLoading: offersLoading } = useQuery({
    queryKey: ["/api/mini/offers"],
    queryFn: async () => {
      const res = await miniApiRequest("GET", "/api/mini/offers");
      return res.json();
    },
    enabled: activeTab === "store"
  });
  reactExports.useEffect(() => {
    const activeOffers = offers?.filter((o) => o.status === "active") ?? [];
    let customBannersCount = 0;
    if (bannerImagesSetting?.value) {
      try {
        const parsed = JSON.parse(bannerImagesSetting.value);
        if (Array.isArray(parsed) && parsed.length > 0) {
          customBannersCount = parsed.length;
        }
      } catch (e) {
      }
    }
    const bannerCount = customBannersCount === 0 ? 1 : customBannersCount;
    const totalSlides = bannerCount + activeOffers.length;
    if (totalSlides <= 1) return;
    if (autoSwapRef.current) clearInterval(autoSwapRef.current);
    autoSwapRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 3e3);
    return () => {
      if (autoSwapRef.current) clearInterval(autoSwapRef.current);
    };
  }, [offers, bannerImagesSetting]);
  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ["/api/mini/orders"],
    queryFn: async () => {
      const res = await miniApiRequest("GET", "/api/mini/orders");
      return res.json();
    },
    enabled: activeTab === "orders" || activeTab === "store"
  });
  const { data: payments, isLoading: paymentsLoading } = useQuery({
    queryKey: ["/api/mini/payments"],
    queryFn: async () => {
      const res = await miniApiRequest("GET", "/api/mini/payments");
      return res.json();
    },
    enabled: activeTab === "payments"
  });
  const purchaseMutation = useMutation({
    mutationFn: async ({ productId, quantity }) => {
      const res = await miniApiRequest("POST", "/api/mini/purchase", { productId, quantity, currency: displayCurrency });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/mini/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/mini/orders"] });
      setPurchaseSuccess(true);
      setSelectedProduct(null);
      toast({ title: "Purchase Successful!", description: "Account credentials sent to your DM." });
    },
    onError: (error) => {
      toast({ title: "Purchase Failed", description: error.message, variant: "destructive" });
    }
  });
  const purchaseOfferMutation = useMutation({
    mutationFn: async (offerId) => {
      const res = await miniApiRequest("POST", "/api/mini/purchase-offer", { offerId, currency: displayCurrency });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/mini/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/mini/orders"] });
      setPurchaseSuccess(true);
      setSelectedOffer(null);
      toast({ title: "Bundle Claimed!", description: "Your premium bundle credentials have been sent to your DM." });
    },
    onError: (error) => {
      toast({ title: "Claim Failed", description: error.message, variant: "destructive" });
    }
  });
  const renderStore = () => {
    const activeOffers = offers?.filter((o) => o.status === "active") ?? [];
    const customBanners = [];
    if (bannerImagesSetting?.value) {
      try {
        const parsed = JSON.parse(bannerImagesSetting.value);
        if (Array.isArray(parsed)) {
          customBanners.push(...parsed);
        }
      } catch (e) {
      }
    }
    const showDefaultHero = customBanners.length === 0;
    const bannerCount = showDefaultHero ? 1 : customBanners.length;
    const totalSlides = bannerCount + activeOffers.length;
    const offerGradients = [
      "from-amber-500 via-orange-500 to-red-600",
      "from-emerald-500 via-teal-500 to-cyan-600",
      "from-pink-500 via-rose-500 to-red-500",
      "from-violet-600 via-purple-500 to-pink-500",
      "from-sky-500 via-blue-500 to-indigo-600"
    ];
    const offerIndicatorColors = [
      "bg-orange-500",
      "bg-teal-500",
      "bg-rose-500",
      "bg-purple-500",
      "bg-blue-500"
    ];
    const handleDragEnd = (_, info, goTo) => {
      if (info.offset.x < -50 && goTo < totalSlides - 1) setCurrentSlide(goTo + 1);
      if (info.offset.x > 50 && goTo > 0) setCurrentSlide(goTo - 1);
      if (autoSwapRef.current) clearInterval(autoSwapRef.current);
      autoSwapRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % totalSlides);
      }, 3e3);
    };
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative overflow-hidden group", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AnimatePresence, { mode: "wait", children: [
          showDefaultHero && currentSlide === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.section,
            {
              initial: { opacity: 0, x: 50 },
              animate: { opacity: 1, x: 0 },
              exit: { opacity: 0, x: -50 },
              transition: { type: "spring", stiffness: 300, damping: 30 },
              drag: "x",
              dragConstraints: { left: 0, right: 0 },
              onDragEnd: (e, info) => handleDragEnd(e, info, 0),
              className: "relative rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-700 p-8 text-white cursor-grab active:cursor-grabbing",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-white/20 hover:bg-white/30 text-white border-0 px-3 py-1 mb-4 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-md", children: "Elite Cloud Services" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-3xl font-black tracking-tighter leading-none mb-2", children: [
                    "Instant",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                    "Deployment"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-purple-100/80 text-[11px] font-medium max-w-[200px] leading-relaxed", children: "High-tier verified accounts for AWS, DigitalOcean & more." })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "absolute bottom-6 right-8 w-12 h-12 text-white/10" })
              ]
            },
            "hero-main"
          ),
          !showDefaultHero && currentSlide < bannerCount && /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.section,
            {
              initial: { opacity: 0, x: 50 },
              animate: { opacity: 1, x: 0 },
              exit: { opacity: 0, x: -50 },
              transition: { type: "spring", stiffness: 300, damping: 30 },
              drag: "x",
              dragConstraints: { left: 0, right: 0 },
              onDragEnd: (e, info) => handleDragEnd(e, info, currentSlide),
              className: "relative rounded-[2.5rem] overflow-hidden h-[180px] bg-neutral-900 text-white cursor-grab active:cursor-grabbing border-0 shadow-lg",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: customBanners[currentSlide], className: "w-full h-full object-cover", alt: "Banner" })
            },
            `custom-banner-${currentSlide}`
          ),
          activeOffers.map((offer, idx) => currentSlide === idx + bannerCount && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.section,
            {
              initial: { opacity: 0, x: 50 },
              animate: { opacity: 1, x: 0 },
              exit: { opacity: 0, x: -50 },
              transition: { type: "spring", stiffness: 300, damping: 30 },
              drag: "x",
              dragConstraints: { left: 0, right: 0 },
              onDragEnd: (e, info) => handleDragEnd(e, info, idx + bannerCount),
              className: `relative rounded-[2.5rem] overflow-hidden bg-gradient-to-br ${offerGradients[idx % offerGradients.length]} p-8 text-white cursor-grab active:cursor-grabbing`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-white/20 hover:bg-white/30 text-white border-0 px-3 py-1 mb-4 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-md", children: "Hot Bundle 🔥" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-black tracking-tighter leading-tight mb-1", children: offer.name }),
                  offer.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/75 text-[11px] font-medium max-w-[210px] leading-relaxed mb-4", children: offer.description }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end gap-3 mt-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[9px] font-black uppercase tracking-widest text-white/60 mb-0.5", children: [
                        "Bundle × ",
                        offer.bundleQuantity
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-4xl font-black tracking-tighter leading-none", children: formatPrice(offer.price, offer.product?.currency || "USD", displayCurrency) })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        size: "sm",
                        className: "mb-1 h-10 px-5 rounded-full bg-white/95 hover:bg-white text-neutral-900 font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-95 transition-all",
                        onClick: () => setSelectedOffer(offer),
                        children: "Claim Now"
                      }
                    )
                  ] }),
                  offer.expiresAt && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[9px] font-black text-white/50 uppercase tracking-widest mt-3", children: [
                    "⏰ Expires ",
                    new Date(offer.expiresAt).toLocaleDateString()
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { className: "absolute bottom-6 right-8 w-12 h-12 text-white/10" })
              ]
            },
            `offer-${offer.id}`
          ))
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center gap-1.5 mt-4", children: Array.from({ length: totalSlides }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => {
              setCurrentSlide(i);
              if (autoSwapRef.current) clearInterval(autoSwapRef.current);
              autoSwapRef.current = setInterval(() => {
                setCurrentSlide((prev) => (prev + 1) % totalSlides);
              }, 3e3);
            },
            className: `h-1.5 rounded-full transition-all duration-300 ${currentSlide === i ? `w-5 ${i < bannerCount ? "bg-purple-600" : offerIndicatorColors[(i - bannerCount) % offerIndicatorColors.length]}` : "w-1.5 bg-neutral-200"}`
          },
          i
        )) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-lg font-black tracking-tighter flex items-center gap-2 text-neutral-800 dark:text-foreground uppercase italic", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { className: "w-5 h-5 text-purple-600" }),
            " ",
            storeName
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: "text-[10px] border-purple-100 text-purple-600 font-black px-3 py-1 rounded-full uppercase", children: [
            products?.length || 0,
            " Products"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-3 overflow-x-auto pb-2 px-1 scrollbar-hide no-scrollbar", children: shopCategories.map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => setSelectedCategory(cat.id),
            className: `flex items-center gap-2 px-4 py-2.5 rounded-2xl whitespace-nowrap text-[11px] font-black uppercase tracking-widest transition-all ${selectedCategory === cat.id ? "bg-purple-600 text-white" : "bg-white dark:bg-card text-neutral-400 border border-purple-50/50 dark:border-white/5"}`,
            children: [
              renderCategoryIcon(cat.icon),
              cat.label
            ]
          },
          cat.id
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-3.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "popLayout", children: products?.filter((p) => {
          if (selectedCategory === "all") return true;
          const n = (p.name + " " + p.type).toLowerCase();
          if (selectedCategory === "aws") return n.includes("aws") || n.includes("amazon");
          if (selectedCategory === "digitalocean") return n.includes("digitalocean") || n.includes("digital ocean");
          if (selectedCategory === "chatgpt") return n.includes("chatgpt") || n.includes("openai") || n.includes("gpt");
          if (selectedCategory === "capcut") return n.includes("capcut") || n.includes("cap cut");
          return n.includes(selectedCategory);
        }).map((product, index) => {
          const theme2 = getProviderTheme(product.name, product.type);
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              layout: true,
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 },
              transition: { delay: index * 0.05 },
              onClick: () => {
                setPurchaseQuantity(1);
                setSelectedProduct(product);
              },
              className: `group relative bg-white dark:bg-card p-5 rounded-[2rem] border border-purple-50/50 dark:border-white/10 shadow-sm hover:shadow-xl hover:border-purple-200 dark:hover:border-purple-500 hover:-translate-y-0.5 transition-all cursor-pointer flex items-center justify-between active:scale-[0.97]`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-inner ${theme2.bg} ${theme2.color} ${theme2.hover} group-hover:text-white`, children: theme2.icon }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-black text-neutral-900 dark:text-card-foreground tracking-tight text-base leading-tight", children: product.name }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-black text-neutral-400 uppercase tracking-widest", children: product.type }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-1.5 h-1.5 rounded-full bg-neutral-100" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-green-50 text-green-600 border-0 hover:bg-green-50 text-[9px] font-black px-2 py-0.5 uppercase", children: [
                        product.stockCount,
                        " Stock"
                      ] })
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-black text-xl text-neutral-900 dark:text-card-foreground tracking-tighter", children: formatPrice(product.price, product.currency || "USD", displayCurrency) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-sm ${theme2.bg} ${theme2.color} ${theme2.hover} group-hover:text-white`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-5 h-5" }) })
                ] })
              ]
            },
            product.id
          );
        }) }) })
      ] })
    ] });
  };
  const renderOrders = () => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1 px-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-2xl font-black tracking-tighter text-neutral-900 uppercase italic", children: "Your Orders" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-neutral-400 text-xs font-bold uppercase tracking-widest", children: "History of your success" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: ordersLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center py-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-8 h-8 animate-spin text-purple-600" }) }) : orders?.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-20 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mx-auto text-purple-200", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "w-10 h-10" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-neutral-300 font-black uppercase tracking-widest text-xs", children: "No orders found yet" })
    ] }) : orders?.map((order, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, x: -10 },
        animate: { opacity: 1, x: 0 },
        transition: { delay: i * 0.05 },
        whileTap: { scale: 0.98 },
        onClick: () => setViewingOrder(order),
        className: "group bg-white p-6 rounded-[2.5rem] border border-neutral-100 shadow-sm space-y-4 relative overflow-hidden cursor-pointer",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-start relative z-10", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h5", { className: "font-black text-neutral-900 tracking-tight text-lg leading-tight uppercase italic group-hover:text-purple-600 transition-colors", children: order.product?.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-neutral-400", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3.5 h-3.5" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-black uppercase tracking-tight", children: format(new Date(order.createdAt || Date.now()), "MMM dd, yyyy • hh:mm a") })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-green-500 text-white border-0 rounded-full text-[9px] font-black uppercase tracking-widest px-3 py-1 shadow-lg", children: "Delivered" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-neutral-50 p-4 rounded-2xl border border-neutral-100 font-mono text-[11px] text-neutral-600 break-all flex items-center justify-between group/code relative cursor-pointer", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "line-clamp-1 pr-8 pointer-events-none", children: order.credential?.content || "Check your Telegram DM" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                onClick: (e) => {
                  e.stopPropagation();
                  copyToClipboard(order.credential?.content || "");
                },
                className: "absolute right-3 p-2 bg-white rounded-xl border border-neutral-100 shadow-sm opacity-0 group-hover/code:opacity-100 transition-opacity active:scale-90 pointer-events-auto",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: "w-3.5 h-3.5 text-purple-600" })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 right-0 w-24 h-24 bg-purple-50/30 rounded-full translate-x-12 -translate-y-12" })
        ]
      },
      order.id
    )) })
  ] });
  const renderPayments = () => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-2xl font-black tracking-tighter text-neutral-900 dark:text-white uppercase italic", children: "Payments" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-neutral-400 text-xs font-bold uppercase tracking-widest", children: "Full account financial history" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          onClick: () => setIsDepositModalOpen(true),
          className: "rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-black uppercase tracking-widest text-[10px] h-10 px-4 shadow-md",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "w-3.5 h-3.5 mr-2" }),
            " Top Up"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: paymentsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center py-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-8 h-8 animate-spin text-purple-600" }) }) : payments?.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-20 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mx-auto text-purple-200", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: "w-10 h-10" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-neutral-300 font-black uppercase tracking-widest text-xs", children: "No payments found" })
    ] }) : payments?.map((payment, i) => {
      const isPendingCrypto = payment.status === "pending" && ["trc20", "aptos", "binance"].includes(payment.paymentMethod.toLowerCase());
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, scale: 0.95 },
          animate: { opacity: 1, scale: 1 },
          transition: { delay: i * 0.05 },
          onClick: () => {
            if (isPendingCrypto) {
              handleResumePendingPayment(payment);
            }
          },
          className: `bg-white dark:bg-card p-5 rounded-3xl border border-neutral-100 dark:border-white/10 flex items-center justify-between shadow-sm relative overflow-hidden group ${isPendingCrypto ? "cursor-pointer hover:border-purple-200 dark:hover:border-purple-500 hover:shadow-md transition-all active:scale-[0.98]" : ""}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 relative z-10", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${payment.paymentMethod.toLowerCase().includes("binance") ? "bg-amber-50 text-amber-500 group-hover:bg-amber-500 group-hover:text-white dark:bg-amber-950/20 dark:text-amber-400 dark:group-hover:bg-amber-500 dark:group-hover:text-neutral-900" : payment.paymentMethod.toLowerCase().includes("stripe") ? "bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white dark:bg-indigo-950/20 dark:text-indigo-400 dark:group-hover:bg-indigo-500" : payment.paymentMethod.toLowerCase().includes("aptos") ? "bg-sky-50 text-sky-500 group-hover:bg-sky-500 group-hover:text-white dark:bg-sky-950/20 dark:text-sky-400 dark:group-hover:bg-sky-500" : "bg-teal-50 text-teal-600 group-hover:bg-teal-600 group-hover:text-white dark:bg-teal-950/20 dark:text-teal-400 dark:group-hover:bg-teal-500"}`, children: (() => {
                const method = payment.paymentMethod.toLowerCase();
                if (method.includes("binance")) {
                  return /* @__PURE__ */ jsxRuntimeExports.jsx(SiBinance, { className: "w-6 h-6" });
                } else if (method.includes("stripe")) {
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-8 h-8 flex items-center justify-center", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(FaCcVisa, { className: "w-4.5 h-4.5 absolute -left-1.5 -rotate-12 transition-transform duration-300 group-hover:-translate-x-0.5" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(FaCcMastercard, { className: "w-4.5 h-4.5 absolute z-10 transition-transform duration-300 group-hover:-translate-y-0.5" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(FaCcAmex, { className: "w-4.5 h-4.5 absolute -right-1.5 rotate-12 transition-transform duration-300 group-hover:translate-x-0.5" })
                  ] });
                } else if (method.includes("aptos")) {
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { viewBox: "0 0 74.67 74.96", className: "w-6 h-6 fill-current", xmlns: "http://www.w3.org/2000/svg", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M57.84,25.08H51.23a2.67,2.67,0,0,1-2-.91l-2.68-3a2.12,2.12,0,0,0-3.15,0l-2.3,2.6a4,4,0,0,1-3,1.34H2a37.24,37.24,0,0,0-2,9.25H34.13a2.21,2.21,0,0,0,1.59-.68l3.18-3.32a2.13,2.13,0,0,1,1.52-.64h.13a2.05,2.05,0,0,1,1.57.71l2.68,3a2.69,2.69,0,0,0,2,.91H74.67a36.79,36.79,0,0,0-2-9.25H57.84Z" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M20.65,53.78a2.17,2.17,0,0,0,1.59-.68l3.18-3.31a2.1,2.1,0,0,1,1.52-.65h.13a2.12,2.12,0,0,1,1.58.71l2.68,3a2.7,2.7,0,0,0,2,.9H71.09a37.09,37.09,0,0,0,3.07-9.34H37.92a2.67,2.67,0,0,1-2-.91l-2.68-3a2.1,2.1,0,0,0-3.15,0l-2.3,2.59a4,4,0,0,1-3,1.34H.51a37.5,37.5,0,0,0,3.07,9.34Z" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M47.44,15A2.23,2.23,0,0,0,49,14.29L52.21,11a2.09,2.09,0,0,1,1.52-.64h.13a2.09,2.09,0,0,1,1.57.7l2.68,3a2.67,2.67,0,0,0,2,.91H67.3A37.48,37.48,0,0,0,7.37,15Z" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M33,63H23.2a2.7,2.7,0,0,1-2-.9l-2.68-3a2.1,2.1,0,0,0-3.15,0l-2.3,2.6a4,4,0,0,1-3,1.33H9.94a37.44,37.44,0,0,0,54.79,0Z" })
                  ] });
                } else {
                  return /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { viewBox: "0 0 24 24", className: "w-6 h-6 fill-current", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M18.7538 10.5176c0 .6251-2.2379 1.1483-5.2381 1.2812l.0028.0007c-.0848.0064-.5233.0325-1.5012.0325-.7778 0-1.33-.0233-1.5237-.0325-3.0059-.1322-5.2495-.6555-5.2495-1.2819s2.2436-1.149 5.2495-1.2834v2.0442c.1965.0142.7594.0474 1.5372.0474.9334 0 1.4008-.0389 1.4849-.0466V9.2356c2.9994.1337 5.2381.657 5.2381 1.282zm5.19.5466L12.1248 22.389a.1803.1803 0 0 1-.2496 0L.0562 11.0635a.1781.1781 0 0 1-.0382-.2079l4.3762-9.1921a.1767.1767 0 0 1 .1626-.1026h14.8878a.1768.1768 0 0 1 .1612.1032l4.3762 9.1922a.1782.1782 0 0 1-.0382.2079zm-4.478-.4038c0-.8068-2.5515-1.4799-5.9473-1.6369V7.195h4.186V4.4055H6.3076V7.195h4.1852v1.8286c-3.4018.1562-5.9601.83-5.9601 1.6376 0 .8075 2.5583 1.4806 5.9601 1.6376v5.8618h3.025v-5.8639c3.394-.1563 5.948-.8295 5.948-1.6363z" }) });
                }
              })() }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-black text-neutral-400 uppercase tracking-widest", children: payment.paymentMethod }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[12px] font-black text-neutral-900 dark:text-white italic", children: format(new Date(payment.createdAt || Date.now()), "MMMM dd, HH:mm") })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right relative z-10", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-lg font-black text-neutral-900 dark:text-white tracking-tighter", children: (() => {
                const currency = payment.currency || "USD";
                const amt = payment.amount / 100;
                if (currency === "LKR") {
                  return `+Rs. ${amt.toFixed(2)}`;
                } else if (currency === "USDT") {
                  return `+${amt.toFixed(2)} USDT`;
                } else if (currency === "TRX") {
                  return `+${amt.toFixed(4)} TRX`;
                }
                return `+$${amt.toFixed(2)}`;
              })() }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: `bg-transparent p-0 text-[10px] font-black uppercase tracking-[0.2em] ${payment.status === "completed" ? "text-green-500" : "text-amber-500"}`, children: [
                "● ",
                payment.status,
                " ",
                isPendingCrypto && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] text-purple-600 dark:text-purple-400 animate-pulse font-extrabold normal-case tracking-normal ml-1", children: "(Resume)" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute left-0 bottom-0 w-full h-[3px] bg-green-500/10 group-hover:bg-green-500/50 transition-all" })
          ]
        },
        payment.id
      );
    }) })
  ] });
  const renderProfile = () => {
    const isGuest2 = user?.telegramId?.startsWith("web_guest_");
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8 animate-in", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1 px-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-2xl font-black tracking-tighter text-neutral-900 dark:text-white uppercase italic", children: "Profile" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-neutral-400 dark:text-neutral-500 text-xs font-bold uppercase tracking-widest", children: isGuest2 ? "Guest Session" : "Account Details" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-card rounded-[3rem] p-10 border border-purple-50 dark:border-white/5 relative overflow-hidden shadow-xl shadow-purple-500/[0.02]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 flex flex-col items-center text-center space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -inset-1.5 bg-gradient-to-tr from-purple-600 via-pink-500 to-blue-600 rounded-[35%] blur-sm opacity-70 group-hover:opacity-100 transition duration-700 group-hover:duration-300" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative w-24 h-24 rounded-[30%] bg-neutral-900 flex items-center justify-center text-white shadow-2xl rotate-12 group-hover:rotate-0 transition-transform duration-500 overflow-hidden ring-4 ring-white dark:ring-neutral-900", children: /* @__PURE__ */ jsxRuntimeExports.jsx(UserAvatar, { fallback: User, className: "w-full h-full -rotate-12 group-hover:rotate-0 transition-transform duration-500", googleAvatarUrl: user?.avatarUrl }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-green-500 border-4 border-white dark:border-neutral-900 flex items-center justify-center shadow-lg z-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4 text-white" }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-2xl font-black text-neutral-900 dark:text-white tracking-tighter italic", children: isGuest2 ? "Temporary Guest" : user?.firstName || "Web Client" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-neutral-50 dark:bg-white/5 border border-purple-100/50 dark:border-white/5 text-neutral-600 dark:text-white/80 text-xs font-semibold shadow-inner group", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-purple-500 animate-ping" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] text-neutral-400 uppercase tracking-widest", children: isGuest2 ? "Guest ID:" : "Email:" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono font-bold text-neutral-800 dark:text-white", children: isGuest2 ? user?.telegramId?.substring(10, 18) : user?.telegramId?.replace("email:", "") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => {
                    const idText = isGuest2 ? user?.telegramId?.substring(10, 18) : user?.telegramId?.replace("email:", "");
                    if (idText) {
                      copyToClipboard(idText);
                    }
                  },
                  className: "p-1 hover:text-purple-600 dark:hover:text-purple-400 text-neutral-400 transition-colors duration-150 rounded-md hover:bg-neutral-200/50 dark:hover:bg-white/10 ml-0.5",
                  title: "Copy ID",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "w-3 h-3 group-hover:scale-110 transition-transform duration-200" })
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-px bg-neutral-100 dark:bg-white/5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4 w-full", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                onClick: () => setIsDepositModalOpen(true),
                className: "bg-neutral-50/60 dark:bg-white/5 p-6 rounded-[2.5rem] border border-neutral-100 dark:border-white/5 flex flex-col items-center gap-3 cursor-pointer hover:bg-purple-50/30 dark:hover:bg-purple-950/10 hover:border-purple-200 dark:hover:border-purple-500/20 hover:scale-[1.03] transition-all duration-300 active:scale-[0.97] shadow-sm",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 ring-1 ring-purple-500/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "w-6 h-6" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-0.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-widest", children: "Balance" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xl font-black text-neutral-900 dark:text-white tracking-tighter", children: getUserBalanceString() })
                  ] })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                onClick: () => setActiveTab("orders"),
                className: "bg-neutral-50/60 dark:bg-white/5 p-6 rounded-[2.5rem] border border-neutral-100 dark:border-white/5 flex flex-col items-center gap-3 cursor-pointer hover:bg-blue-50/30 dark:hover:bg-blue-950/10 hover:border-blue-200 dark:hover:border-blue-500/20 hover:scale-[1.03] transition-all duration-300 active:scale-[0.97] shadow-sm",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 ring-1 ring-blue-500/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "w-6 h-6" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-0.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-widest", children: "Orders" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xl font-black text-neutral-900 dark:text-white tracking-tighter", children: orders?.length || 0 })
                  ] })
                ]
              }
            )
          ] }),
          !isGuest2 && /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              className: "w-full h-14 rounded-[2rem] border-red-200 dark:border-red-500/30 hover:bg-red-50 dark:hover:bg-red-500/10 text-red-500 dark:text-red-400 font-black uppercase tracking-[0.2em] shadow-sm transition-all hover:scale-[1.01] active:scale-[0.99] mt-2",
              onClick: handleLogout,
              children: "Log Out Account"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 left-0 w-full h-2.5 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500" })
      ] }),
      isGuest2 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card border border-purple-100/50 rounded-[3rem] p-8 space-y-6 relative overflow-hidden bg-white/80 backdrop-blur-xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-xl font-black text-neutral-800 tracking-tight uppercase", children: "Save Progress / Sign In" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-neutral-400 font-bold uppercase tracking-wider", children: "Unified Email OTP Login & Register" })
        ] }),
        !otpSent ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-black text-neutral-400 uppercase tracking-widest pl-2", children: "Email Address" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "email",
                placeholder: "Enter your email address",
                value: emailInput,
                onChange: (e) => setEmailInput(e.target.value),
                className: "w-full h-14 px-5 rounded-2xl bg-neutral-50 border border-neutral-100 text-sm font-semibold placeholder:text-neutral-300 text-neutral-800 focus:outline-none focus:border-purple-300 transition-all"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              className: "w-full h-14 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-black uppercase tracking-wider shadow-md disabled:opacity-50",
              disabled: isAuthSubmitting || !emailInput,
              onClick: handleSendOtp,
              children: isAuthSubmitting ? "Sending..." : "Send Verification Code"
            }
          ),
          googleEnabled && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-3 pt-4 border-t border-neutral-100", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-black text-neutral-400 uppercase tracking-widest", children: "Or Sign In with Google" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: handleGoogleRedirectLogin,
                className: "w-full h-14 rounded-2xl border border-neutral-200 bg-white hover:bg-neutral-50 flex items-center justify-center gap-3 text-neutral-700 font-black tracking-wider text-sm shadow-sm transition-all active:scale-[0.98] focus:outline-none uppercase",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { className: "w-5 h-5 shrink-0", viewBox: "0 0 24 24", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "path",
                      {
                        fill: "#4285F4",
                        d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "path",
                      {
                        fill: "#34A853",
                        d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "path",
                      {
                        fill: "#FBBC05",
                        d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "path",
                      {
                        fill: "#EA4335",
                        d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Sign In with Google" })
                ]
              }
            )
          ] })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-black text-neutral-400 uppercase tracking-widest pl-2", children: "Verification Code" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "text",
                maxLength: 6,
                placeholder: "Enter 6-digit OTP",
                value: otpInput,
                onChange: (e) => setOtpInput(e.target.value),
                className: "w-full h-14 px-5 rounded-2xl bg-neutral-50 border border-neutral-100 text-center font-mono text-lg font-black tracking-widest text-neutral-800 focus:outline-none focus:border-purple-300 transition-all"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "ghost",
                className: "flex-1 h-14 rounded-2xl font-black uppercase tracking-wider text-neutral-400 hover:bg-neutral-50",
                onClick: () => {
                  setOtpSent(false);
                },
                children: "Back"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                className: "flex-1 h-14 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-black uppercase tracking-wider shadow-md disabled:opacity-50",
                disabled: isAuthSubmitting || otpInput.length !== 6,
                onClick: handleVerifyOtp,
                children: isAuthSubmitting ? "Verifying..." : "Verify & Login"
              }
            )
          ] })
        ] })
      ] })
    ] });
  };
  if (userLoading || productsLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex flex-col items-center justify-center p-8 overflow-hidden", style: { background: "#f8f7ff" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative w-16 h-16", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          className: "w-full h-full relative",
          animate: { rotate: 360 },
          transition: { duration: 1.5, repeat: Infinity, ease: "linear" },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.div,
              {
                animate: { scale: [1, 1.3, 1] },
                transition: { duration: 1, repeat: Infinity, ease: "easeInOut" },
                className: "absolute top-0 left-1/2 -ml-2.5 w-5 h-5 rounded-full bg-purple-600 shadow-lg"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.div,
              {
                animate: { scale: [1, 1.3, 1] },
                transition: { duration: 1, repeat: Infinity, ease: "easeInOut", delay: 0.3 },
                className: "absolute bottom-0 left-0 w-5 h-5 rounded-full bg-blue-600 shadow-lg"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.div,
              {
                animate: { scale: [1, 1.3, 1] },
                transition: { duration: 1, repeat: Infinity, ease: "easeInOut", delay: 0.6 },
                className: "absolute bottom-0 right-0 w-5 h-5 rounded-full bg-pink-600 shadow-lg"
              }
            )
          ]
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-16 text-center space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-black italic tracking-tighter text-neutral-800 uppercase", children: storeName }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-black text-[9px] text-purple-600/40 tracking-[0.5em] uppercase animate-pulse", children: loadingText })
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "tg-mini-app min-h-screen text-neutral-900 dark:text-foreground font-sans selection:bg-purple-200 pb-32", style: { background: "inherit" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "sticky top-0 z-50 bg-white/95 dark:bg-background/80 backdrop-blur-2xl border-b border-purple-50/50 dark:border-white/10 px-6 py-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between max-w-md mx-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-center gap-3.5 cursor-pointer hover:opacity-80 transition-opacity",
          onClick: () => {
            if (isGuest) {
              setIsLoginDialogOpen(true);
            } else {
              setActiveTab("profile");
            }
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.div,
              {
                whileHover: { rotate: 10 },
                className: "w-11 h-11 rounded-2xl bg-neutral-900 flex items-center justify-center shadow-lg transition-all overflow-hidden",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(UserAvatar, { fallback: User, className: "w-full h-full", googleAvatarUrl: user?.avatarUrl })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-[0.25em] leading-none mb-1", children: isGuest ? "Demo Guest" : "Authenticated" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base font-black tracking-tighter text-neutral-900 dark:text-white leading-none italic", children: isGuest ? "WEB" : user?.firstName?.toUpperCase() || user?.username?.toUpperCase() || (user?.telegramId ? `ID: ${user.telegramId}` : "CUSTOMER") })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            whileTap: { scale: 0.95 },
            onClick: () => setIsDepositModalOpen(true),
            className: "px-5 py-2.5 bg-neutral-50 dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 flex items-center gap-3 shadow-inner cursor-pointer hover:opacity-95 transition-opacity",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "w-4 h-4 text-purple-600" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg font-black tracking-tighter text-neutral-900 dark:text-white leading-none italic", children: getUserBalanceString() })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ThemeToggle, { className: "bg-neutral-50 dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800 text-neutral-900 dark:text-white hover:bg-neutral-200 dark:hover:bg-neutral-800 shadow-inner" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "max-w-md mx-auto p-6 pb-28 min-h-[60vh]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, scale: 0.98, y: 10 },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.98, y: -10 },
        transition: { type: "spring", stiffness: 300, damping: 30 },
        children: [
          activeTab === "store" && renderStore(),
          activeTab === "orders" && renderOrders(),
          activeTab === "payments" && renderPayments(),
          activeTab === "profile" && renderProfile()
        ]
      },
      activeTab
    ) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "fixed bottom-2 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-sm z-[100]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-neutral-900/95 backdrop-blur-xl rounded-[2.5rem] p-2 flex items-center justify-between shadow-2xl border border-white/10 relative overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        TabButton,
        {
          active: activeTab === "store",
          onClick: () => setActiveTab("store"),
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { className: "w-5 h-5" }),
          label: "Shop"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        TabButton,
        {
          active: activeTab === "orders",
          onClick: () => setActiveTab("orders"),
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(History, { className: "w-5 h-5" }),
          label: "Stock"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        TabButton,
        {
          active: activeTab === "payments",
          onClick: () => setActiveTab("payments"),
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: "w-5 h-5" }),
          label: "Funds"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        TabButton,
        {
          active: activeTab === "profile",
          onClick: () => setActiveTab("profile"),
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "w-5 h-5" }),
          label: "ID"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!selectedProduct, onOpenChange: (open) => !open && setSelectedProduct(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "rounded-[2.5rem] border-0 bg-white/95 backdrop-blur-xl p-8 shadow-2xl max-w-[90vw] mx-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 rounded-3xl bg-purple-50 flex items-center justify-center text-purple-600 shadow-inner", children: selectedProduct && getProviderIcon(selectedProduct.name, selectedProduct.type) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-2xl font-black tracking-tighter text-neutral-900 uppercase italic", children: selectedProduct?.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { className: "text-xs font-bold uppercase tracking-widest text-neutral-400 mt-1", children: "Select quantity and confirm" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-6 space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-black text-neutral-400 uppercase tracking-widest", children: "Select Quantity" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-6 bg-purple-50/50 p-2 rounded-[2rem] border border-purple-100", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "ghost",
                size: "icon",
                className: "w-12 h-12 rounded-[1.25rem] bg-white shadow-md hover:bg-purple-600 hover:text-white text-purple-600 transition-all disabled:opacity-30 border border-purple-50",
                disabled: purchaseQuantity <= 1,
                onClick: () => setPurchaseQuantity((q) => q - 1),
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Minimize2, { className: "w-5 h-5" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center min-w-[3rem]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-3xl font-black text-neutral-900 tabular-nums leading-none", children: purchaseQuantity }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-black text-purple-400 uppercase tracking-tighter mt-1", children: "Items" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "ghost",
                size: "icon",
                className: "w-12 h-12 rounded-[1.25rem] bg-white shadow-md hover:bg-purple-600 hover:text-white text-purple-600 transition-all disabled:opacity-30 border border-purple-50",
                disabled: selectedProduct && purchaseQuantity >= (selectedProduct.stockCount || 0),
                onClick: () => setPurchaseQuantity((q) => q + 1),
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-5 h-5 rotate-45" })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-purple-50/50 p-5 rounded-3xl border border-purple-100 flex justify-between items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-black text-purple-900/40 uppercase tracking-widest", children: "Total Price" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl font-black text-purple-900 tracking-tighter", children: selectedProduct ? formatPrice(selectedProduct.price * purchaseQuantity, selectedProduct.currency || "USD", displayCurrency) : formatPrice(0, "USD", displayCurrency) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "flex-col sm:flex-row gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "ghost",
            className: "flex-1 h-14 rounded-2xl font-black uppercase tracking-widest text-neutral-400 hover:bg-neutral-50",
            onClick: () => setSelectedProduct(null),
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            className: "flex-1 h-14 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-black uppercase tracking-widest shadow-xl disabled:opacity-50",
            disabled: purchaseMutation.isPending || !selectedProduct || (selectedProduct.stockCount || 0) < purchaseQuantity,
            onClick: () => {
              if (selectedProduct) {
                purchaseMutation.mutate({ productId: selectedProduct.id, quantity: purchaseQuantity });
              }
            },
            children: purchaseMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-5 h-5 animate-spin" }) : "Confirm Buy"
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!selectedOffer, onOpenChange: (open) => !open && setSelectedOffer(null), children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogContent, { className: "rounded-[3rem] border-0 bg-gradient-to-br from-neutral-900 to-neutral-800 p-0 shadow-2xl max-w-[90vw] mx-auto overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-8 space-y-6 relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 right-0 w-40 h-40 bg-purple-500/10 blur-3xl rounded-full translate-x-12 -translate-y-12" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center relative z-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 rounded-full bg-gradient-to-tr from-amber-400 to-orange-600 flex items-center justify-center text-white shadow-2xl shadow-orange-500/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-10 h-10 fill-white/20" }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-2 relative z-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-amber-500/20 text-amber-400 border-amber-500/30 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-2", children: "Exclusive Bundle Deal" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-3xl font-black tracking-tighter text-white uppercase italic", children: selectedOffer?.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-neutral-400 text-[11px] font-medium max-w-[250px] mx-auto leading-relaxed", children: selectedOffer?.description })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4 relative z-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white/5 p-4 rounded-3xl border border-white/5 flex flex-col items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[8px] font-black text-neutral-500 uppercase tracking-widest", children: "Quantity" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xl font-black text-white", children: [
            selectedOffer?.bundleQuantity,
            " Units"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white/5 p-4 rounded-3xl border border-white/5 flex flex-col items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[8px] font-black text-neutral-500 uppercase tracking-widest", children: "Bundle Price" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xl font-black text-amber-400", children: selectedOffer ? formatPrice(selectedOffer.price, selectedOffer.product?.currency || "USD", displayCurrency) : formatPrice(0, "USD", displayCurrency) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          className: "w-full h-16 rounded-3xl bg-amber-500 hover:bg-amber-400 text-neutral-900 font-black uppercase tracking-[0.2em] shadow-2xl shadow-amber-500/20 group relative z-10",
          disabled: purchaseOfferMutation.isPending,
          onClick: () => {
            if (selectedOffer) {
              purchaseOfferMutation.mutate(selectedOffer.id);
            }
          },
          children: purchaseOfferMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-6 h-6 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            "Claim Offer ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" })
          ] })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => setSelectedOffer(null),
          className: "w-full text-center text-neutral-500 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors py-2",
          children: "Maybe later"
        }
      )
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: purchaseSuccess && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        className: "fixed inset-0 z-[200] bg-white/90 backdrop-blur-xl flex flex-col items-center justify-center p-8 text-center",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { scale: 0.5, rotate: -45 },
              animate: { scale: 1, rotate: 0 },
              transition: { type: "spring", stiffness: 200, damping: 15 },
              className: "w-32 h-32 rounded-[2.5rem] bg-green-500 text-white flex items-center justify-center mb-8",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-16 h-16" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-black tracking-tighter text-neutral-900 uppercase italic mb-2", children: "Order Confirmed!" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-neutral-500 text-[11px] font-bold uppercase tracking-widest mb-8", children: "Your credentials have been sent to your Telegram DM" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              className: "h-14 px-10 rounded-2xl bg-neutral-900 hover:bg-black text-white font-black uppercase tracking-widest shadow-xl",
              onClick: () => setPurchaseSuccess(false),
              children: "Return to Store"
            }
          )
        ]
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: viewingOrder !== null, onOpenChange: (open) => !open && setViewingOrder(null), children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogContent, { className: "bg-white/95 backdrop-blur-2xl rounded-[2.5rem] p-6 border-0 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)] max-w-[90%] sm:max-w-md overflow-hidden", children: viewingOrder && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-2xl bg-neutral-50 flex items-center justify-center mb-1 mx-auto shadow-inner group", children: getProviderIcon(viewingOrder.product?.name || "", viewingOrder.product?.type || "") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-xl font-black text-center text-neutral-900 tracking-tighter uppercase italic leading-none", children: "Order Details" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { className: "text-center text-neutral-400 font-bold text-[10px] px-4 uppercase tracking-[0.1em] leading-relaxed", children: format(new Date(viewingOrder.createdAt || Date.now()), "MMMM dd, yyyy • hh:mm a") })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "my-3 space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-neutral-50/80 p-4 rounded-3xl border border-neutral-100 flex flex-col gap-2 relative group", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-black text-neutral-400 uppercase tracking-widest", children: "Credentials" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "ghost",
                size: "sm",
                className: "h-7 rounded-full bg-white text-purple-600 hover:bg-purple-600 hover:text-white border border-purple-100 shadow-sm font-black text-[8px] uppercase px-3",
                onClick: () => copyToClipboard(viewingOrder.credential?.content || ""),
                children: "Copy All"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white p-3.5 rounded-2xl border border-neutral-100 font-mono text-[11px] text-neutral-700 break-all leading-relaxed shadow-inner max-h-[120px] overflow-y-auto scrollbar-hide", children: viewingOrder.credential?.content || "Credentials not found" })
        ] }),
        (() => {
          const content = viewingOrder.credential?.content || "";
          const secretMatch = content.match(/[A-Z2-7]{16,32}/);
          if (secretMatch) {
            return /* @__PURE__ */ jsxRuntimeExports.jsx(LiveTOTP, { secret: secretMatch[0], onCopy: (text) => {
              navigator.clipboard.writeText(text);
              toast({ title: "2FA Code Copied", description: "The live verification code is now in your clipboard." });
            } });
          }
          return null;
        })(),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-neutral-50/50 p-3.5 rounded-[1.25rem] border border-neutral-100/50 text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[8px] font-black text-neutral-400 uppercase tracking-widest mb-0.5", children: "Status" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-black text-green-600 uppercase", children: "Delivered" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-neutral-50/50 p-3.5 rounded-[1.25rem] border border-neutral-100/50 text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[8px] font-black text-neutral-400 uppercase tracking-widest mb-0.5", children: "Stock ID" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] font-black text-neutral-900 italic", children: [
              "#",
              viewingOrder.id.toString().padStart(4, "0")
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogFooter, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          onClick: () => setViewingOrder(null),
          className: "w-full h-12 rounded-[1.25rem] bg-neutral-900 hover:bg-black text-white font-black uppercase tracking-[0.2em] transition-all shadow-xl active:scale-95 text-[10px]",
          children: "Close Record"
        }
      ) })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed bottom-24 right-4 z-50", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: isChatOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, scale: 0.9, y: 20 },
          animate: { opacity: 1, scale: 1, y: 0 },
          exit: { opacity: 0, scale: 0.9, y: 20 },
          className: "absolute bottom-16 right-0 w-[320px] h-[420px] bg-[#1a1625]/95 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 bg-white/5 border-b border-white/10 flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 animate-in fade-in", children: chatMode === "ai" ? /* @__PURE__ */ jsxRuntimeExports.jsx(SiDigitalocean, { className: "w-4 h-4 text-primary animate-pulse" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "w-4 h-4 text-purple-400 animate-pulse" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-black text-white uppercase tracking-widest transition-all", children: chatMode === "ai" ? "AI Concierge" : "Live Chat" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[8px] text-green-400 flex items-center gap-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-1 h-1 rounded-full bg-green-400 animate-pulse" }),
                    chatMode === "ai" ? "Online Support" : "Human Agent"
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                chatMode === "human" ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: async () => {
                      try {
                        await miniApiRequest("DELETE", "/api/mini/support/clear");
                        setChatMode("ai");
                        setLiveMessages([]);
                      } catch (e) {
                        setChatMode("ai");
                        setLiveMessages([]);
                      }
                    },
                    className: "text-[8px] font-extrabold uppercase bg-white/10 hover:bg-white/20 hover:scale-105 active:scale-95 text-white px-2.5 py-1.5 rounded-full transition-all duration-300",
                    children: "AI Mode"
                  }
                ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: handleRequestHuman,
                    disabled: isRequestingHuman,
                    className: "text-[8px] font-extrabold uppercase bg-purple-600 hover:bg-purple-700 hover:scale-105 active:scale-95 text-white px-2.5 py-1.5 rounded-full transition-all duration-300 flex items-center gap-1 shadow-md shadow-purple-900/30",
                    children: isRequestingHuman ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-2.5 h-2.5 animate-spin" }) : "Live Agent"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setIsChatOpen(false), className: "text-white/40 hover:text-white transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Minimize2, { className: "w-4 h-4" }) })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide min-h-0", children: [
              chatMode === "ai" ? chatHistory.map((msg, i) => {
                const showContactBtn = msg.role === "bot" && (msg.content.toLowerCase().includes("contact") || msg.content.toLowerCase().includes("support") || msg.content.toLowerCase().includes("@"));
                return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `flex flex-col w-full ${msg.role === "user" ? "items-end" : "items-start"} animate-in slide-in-from-bottom-2 duration-300`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `max-w-[85%] p-3 rounded-2xl text-[11px] leading-relaxed ${msg.role === "user" ? "bg-primary text-white rounded-tr-none shadow-lg" : "bg-white/5 text-white/90 border border-white/10 rounded-tl-none"}`, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1", children: msg.role === "user" ? msg.content : formatChatMessage(msg.content) }),
                  showContactBtn && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 pt-2 border-t border-white/10 flex justify-start", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      onClick: handleRequestHuman,
                      disabled: isRequestingHuman,
                      className: "inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white rounded-full text-[9px] font-black uppercase tracking-wider transition-all active:scale-95 shadow-md shadow-purple-900/40 disabled:opacity-50",
                      children: [
                        isRequestingHuman ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-3 h-3 animate-spin text-white" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "w-3 h-3 text-white" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Contact Agent" })
                      ]
                    }
                  ) })
                ] }) }, i);
              }) : /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: isLiveLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center items-center h-full min-h-[250px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-5 h-5 animate-spin text-primary" }) }) : liveMessages.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-12 text-white/30 text-[9px] uppercase font-black tracking-widest animate-pulse", children: [
                "No messages yet.",
                /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                "Requesting connection to a human..."
              ] }) : liveMessages.map((msg, i) => {
                const isAdmin = msg.sender === "admin";
                const COPY_MARKER = "||COPY||";
                const hasCopyMarker = isAdmin && msg.message?.includes(COPY_MARKER);
                const displayMessage = hasCopyMarker ? msg.message.replace(COPY_MARKER, "").trimEnd() : msg.message;
                const copyText = displayMessage;
                return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `flex flex-col w-full ${!isAdmin ? "items-end" : "items-start"} animate-in slide-in-from-bottom-2 duration-300`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `max-w-[85%] p-3 rounded-2xl text-[11px] leading-relaxed ${!isAdmin ? "bg-primary text-white rounded-tr-none shadow-lg" : "bg-gradient-to-br from-purple-600 to-indigo-700 text-white rounded-tl-none border border-white/5 shadow-md"}`, children: [
                  msg.attachmentUrl && msg.attachmentType === "image" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-2 max-w-full overflow-hidden rounded-xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "img",
                    {
                      src: msg.attachmentUrl,
                      alt: "attachment",
                      className: "max-w-full h-auto rounded-xl hover:opacity-90 transition-opacity cursor-pointer",
                      onClick: () => window.open(msg.attachmentUrl, "_blank")
                    }
                  ) }),
                  msg.attachmentUrl && (msg.attachmentType === "pdf" || msg.attachmentType === "document") && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "a",
                    {
                      href: msg.attachmentUrl,
                      target: "_blank",
                      rel: "noreferrer",
                      className: "flex items-center gap-2 p-2.5 bg-black/25 rounded-xl mb-2 hover:bg-black/35 transition-all text-purple-300 font-bold border border-white/5",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "w-4 h-4 text-purple-400 shrink-0" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate text-[9px] hover:underline", children: msg.attachmentType === "pdf" ? "View PDF Document" : "View Document File" })
                      ]
                    }
                  ),
                  (!msg.attachmentUrl || displayMessage !== "📷 Photo Attachment" && displayMessage !== "📄 PDF Attachment" && displayMessage !== "📄 Attachment") && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1 break-all whitespace-pre-wrap", children: displayMessage }),
                  hasCopyMarker && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 pt-1.5 border-t border-white/10 flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      onClick: () => {
                        navigator.clipboard.writeText(copyText).then(() => {
                          toast({ title: "Copied!", description: "Message copied to clipboard." });
                        }).catch(() => {
                          const el = document.createElement("textarea");
                          el.value = copyText;
                          document.body.appendChild(el);
                          el.select();
                          document.execCommand("copy");
                          document.body.removeChild(el);
                          toast({ title: "Copied!", description: "Message copied to clipboard." });
                        });
                      },
                      className: "inline-flex items-center gap-1 px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white/80 hover:text-white rounded-full text-[8px] font-bold uppercase tracking-wider transition-all active:scale-95",
                      title: "Copy message",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "w-2.5 h-2.5" }),
                        "Copy"
                      ]
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[7px] text-white/30 text-right mt-1 font-semibold uppercase", children: formatTime(msg.createdAt) })
                ] }) }, msg.id || i);
              }) }),
              chatMode === "human" && liveMessages.length > 0 && liveMessages[liveMessages.length - 1].sender === "user" && !liveMessages.some((m) => m.sender === "admin") && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center p-5 bg-purple-950/10 border border-purple-500/20 rounded-2xl gap-3 animate-pulse mt-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex items-center justify-center", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "animate-ping absolute inline-flex h-4 w-4 rounded-full bg-purple-500 opacity-75" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "relative inline-flex rounded-full h-3 w-3 bg-purple-600" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-black uppercase text-purple-400 tracking-wider", children: "Connecting to Live Agent..." }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[8px] text-white/40 text-center font-medium leading-relaxed", children: "We have notified our support agents. Please wait while we join your chat." })
              ] }),
              isSendingChat && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-start", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white/5 p-3 rounded-2xl rounded-tl-none border border-white/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-3 h-3 animate-spin text-primary" }) }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: chatEndRef })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 bg-white/5 border-t border-white/10 flex flex-col gap-2", children: [
              uploadedAttachment && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-2 bg-purple-950/20 border border-purple-500/20 rounded-xl animate-in slide-in-from-bottom-2 duration-300", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-[10px] font-bold text-white truncate", children: [
                  uploadedAttachment.type === "image" ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: uploadedAttachment.url, alt: "preview", className: "w-8 h-8 rounded object-cover border border-white/10 shrink-0" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "w-6 h-6 text-purple-400 shrink-0" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: uploadedAttachment.name })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: () => setUploadedAttachment(null),
                    className: "p-1 text-white/50 hover:text-white hover:bg-white/5 rounded-full transition-colors",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" })
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 w-full", children: [
                chatMode === "human" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "file",
                      ref: fileInputRef,
                      className: "hidden",
                      onChange: handleUploadFile,
                      accept: "image/*,application/pdf"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      onClick: () => fileInputRef.current?.click(),
                      disabled: isUploadingFile || isSendingChat,
                      className: "w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center transition-all hover:bg-white/10 active:scale-95 disabled:opacity-50 shrink-0",
                      children: isUploadingFile ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin text-purple-400" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Paperclip, { className: "w-4 h-4 text-white/60" })
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "text",
                    placeholder: chatMode === "ai" ? "Ask anything..." : "Reply to live agent...",
                    className: "flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-[11px] text-white focus:outline-none focus:border-primary/50 min-w-0",
                    value: chatMessage,
                    onChange: (e) => setChatMessage(e.target.value),
                    onKeyPress: (e) => e.key === "Enter" && (chatMode === "human" ? handleSendLiveMessage() : handleSendChat())
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: chatMode === "human" ? handleSendLiveMessage : handleSendChat,
                    disabled: !chatMessage.trim() && !uploadedAttachment || isSendingChat,
                    className: "w-10 h-10 rounded-xl bg-primary flex items-center justify-center transition-transform active:scale-90 disabled:opacity-50 shrink-0",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "w-4 h-4 text-white" })
                  }
                )
              ] })
            ] })
          ]
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: isDepositModalOpen, onOpenChange: (open) => {
        if (!open) {
          setIsDepositModalOpen(false);
          setActiveDeposit(null);
          setTxidInput("");
        }
      }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { onOpenAutoFocus: (e) => e.preventDefault(), className: "rounded-[2.5rem] border-0 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl p-5 sm:p-8 shadow-2xl max-w-[90vw] mx-auto text-neutral-900 dark:text-white", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-3xl bg-purple-50 dark:bg-purple-950/50 flex items-center justify-center text-purple-600 shadow-inner", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "w-8 h-8" }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-2xl font-black tracking-tighter uppercase italic", children: activeDeposit ? "Verify Crypto Payment" : "Top Up Balance" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { className: "text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mt-1", children: activeDeposit ? "Submit transaction details" : "Select amount and method" }),
            !activeDeposit && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5", children: [
              { id: "USD", name: "USD", symbol: "$", balance: (user?.balance || 0) / 100, defaultMethod: "binance" },
              { id: "LKR", name: "LKR", symbol: "Rs.", balance: (user?.balanceLkr || 0) / 100, defaultMethod: "binance" },
              { id: "USDT", name: "USDT", symbol: "₮", balance: (user?.balanceUsdt || 0) / 100, defaultMethod: "trc20" },
              { id: "TRX", name: "TRX", symbol: "TRX", balance: (user?.balanceTrx || 0) / 100, defaultMethod: "trc20" }
            ].map((curr) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => {
                  setSelectedDepositCurrency(curr.id);
                  setDepositMethod(curr.defaultMethod);
                  setDisplayCurrency(curr.id);
                  localStorage.setItem("display_currency", curr.id);
                },
                className: `flex flex-col items-center justify-center p-3 rounded-2xl border transition-all duration-300 text-center relative overflow-hidden ${selectedDepositCurrency === curr.id ? "bg-purple-600/10 border-purple-500 text-neutral-900 dark:text-white shadow-lg ring-1 ring-purple-500" : "bg-neutral-50 dark:bg-white/5 border-purple-50/50 dark:border-white/5 text-neutral-500 hover:border-purple-200 dark:hover:border-purple-500/50"}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-widest leading-none mb-1", children: curr.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-black tracking-tight whitespace-nowrap", children: [
                    curr.symbol,
                    " ",
                    curr.balance.toFixed(2)
                  ] })
                ]
              },
              curr.id
            )) })
          ] })
        ] }),
        !activeDeposit ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-4 space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-[10px] font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-widest flex justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "Amount (",
                selectedDepositCurrency,
                ")"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-purple-500 font-bold lowercase tracking-normal", children: [
                "Min: ",
                selectedDepositCurrency === "LKR" ? "Rs. " : selectedDepositCurrency === "USDT" ? "₮ " : selectedDepositCurrency === "TRX" ? "TRX " : "$",
                selectedDepositCurrency === "LKR" ? (minDepositLimit * 300).toFixed(2) : minDepositLimit.toFixed(2),
                " ",
                selectedDepositCurrency
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "text",
                value: depositAmount,
                onChange: (e) => setDepositAmount(e.target.value),
                placeholder: "20.00",
                className: "w-full h-14 rounded-2xl bg-purple-50/50 dark:bg-white/5 border border-purple-100 dark:border-white/10 px-4 text-lg font-black focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 focus:ring-1 focus:ring-purple-500 text-center"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-widest block", children: "Payment Method" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3", children: [
              ...selectedDepositCurrency === "USD" ? [
                {
                  id: "binance",
                  name: "Binance Pay",
                  icon: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { viewBox: "0 0 24 24", className: "w-4 h-4 fill-current text-[#F0B90B]", xmlns: "http://www.w3.org/2000/svg", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("title", { children: "Binance" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M16.624 13.9202l2.7175 2.7154-7.353 7.353-7.353-7.352 2.7175-2.7164 4.6355 4.6595 4.6356-4.6595zm4.6366-4.6366L24 12l-2.7154 2.7164L18.5682 12l2.6924-2.7164zm-9.272.001l2.7163 2.6914-2.7164 2.7174v-.001L9.2721 12l2.7164-2.7154zm-9.2722-.001L5.4088 12l-2.6914 2.6924L0 12l2.7164-2.7164zM11.9885.0115l7.353 7.329-2.7174 2.7154-4.6356-4.6356-4.6355 4.6595-2.7174-2.7154 7.353-7.353z" })
                  ] })
                },
                {
                  id: "stripe",
                  name: "Stripe / Card",
                  icon: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { viewBox: "0 0 24 24", className: "w-4 h-4 fill-current text-[#635BFF]", xmlns: "http://www.w3.org/2000/svg", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("title", { children: "Stripe" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.594-7.305h.003z" })
                  ] })
                }
              ] : [],
              ...selectedDepositCurrency === "LKR" ? [
                {
                  id: "binance",
                  name: "Binance Pay",
                  icon: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { viewBox: "0 0 24 24", className: "w-4 h-4 fill-current text-[#F0B90B]", xmlns: "http://www.w3.org/2000/svg", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("title", { children: "Binance" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M16.624 13.9202l2.7175 2.7154-7.353 7.353-7.353-7.352 2.7175-2.7164 4.6355 4.6595 4.6356-4.6595zm4.6366-4.6366L24 12l-2.7154 2.7164L18.5682 12l2.6924-2.7164zm-9.272.001l2.7163 2.6914-2.7164 2.7174v-.001L9.2721 12l2.7164-2.7154zm-9.2722-.001L5.4088 12l-2.6914 2.6924L0 12l2.7164-2.7164zM11.9885.0115l7.353 7.329-2.7174 2.7154-4.6356-4.6356-4.6355 4.6595-2.7174-2.7154 7.353-7.353z" })
                  ] })
                },
                {
                  id: "bank_transfer",
                  name: "Bank Transfer",
                  icon: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { viewBox: "0 0 24 24", className: "w-4 h-4 fill-current text-emerald-500", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M2 10h20v2H2zm0 4h20v2H2zM12 2L2 7h20L12 2zm0 18l10-5H2l10 5z" }) })
                }
              ] : [],
              ...selectedDepositCurrency === "USDT" ? [
                {
                  id: "trc20",
                  name: "USDT (TRC20)",
                  icon: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { viewBox: "0 0 24 24", className: "w-4 h-4 fill-current text-[#26A17B]", xmlns: "http://www.w3.org/2000/svg", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("title", { children: "Tether" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M18.7538 10.5176c0 .6251-2.2379 1.1483-5.2381 1.2812l.0028.0007c-.0848.0064-.5233.0325-1.5012.0325-.7778 0-1.33-.0233-1.5237-.0325-3.0059-.1322-5.2495-.6555-5.2495-1.2819s2.2436-1.149 5.2495-1.2834v2.0442c.1965.0142.7594.0474 1.5372.0474.9334 0 1.4008-.0389 1.4849-.0466V9.2356c2.9994.1337 5.2381.657 5.2381 1.282zm5.19.5466L12.1248 22.389a.1803.1803 0 0 1-.2496 0L.0562 11.0635a.1781.1781 0 0 1-.0382-.2079l4.3762-9.1921a.1767.1767 0 0 1 .1626-.1026h14.8878a.1768.1768 0 0 1 .1612.1032l4.3762 9.1922a.1782.1782 0 0 1-.0382.2079zm-4.478-.4038c0-.8068-2.5515-1.4799-5.9473-1.6369V7.195h4.186V4.4055H6.3076V7.195h4.1852v1.8286c-3.4018.1562-5.9601.83-5.9601 1.6376 0 .8075 2.5583 1.4806 5.9601 1.6376v5.8618h3.025v-5.8639c3.394-.1563 5.948-.8295 5.948-1.6363z" })
                  ] })
                },
                {
                  id: "aptos",
                  name: "USDT (Aptos)",
                  icon: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { viewBox: "0 0 74.67 74.96", className: "w-4 h-4 fill-current text-[#1ea7d6]", xmlns: "http://www.w3.org/2000/svg", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("title", { children: "Aptos" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M57.84,25.08H51.23a2.67,2.67,0,0,1-2-.91l-2.68-3a2.12,2.12,0,0,0-3.15,0l-2.3,2.6a4,4,0,0,1-3,1.34H2a37.24,37.24,0,0,0-2,9.25H34.13a2.21,2.21,0,0,0,1.59-.68l3.18-3.32a2.13,2.13,0,0,1,1.52-.64h.13a2.05,2.05,0,0,1,1.57.71l2.68,3a2.69,2.69,0,0,0,2,.91H74.67a36.79,36.79,0,0,0-2-9.25H57.84Z" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M20.65,53.78a2.17,2.17,0,0,0,1.59-.68l3.18-3.31a2.1,2.1,0,0,1,1.52-.65h.13a2.12,2.12,0,0,1,1.58.71l2.68,3a2.7,2.7,0,0,0,2,.9H71.09a37.09,37.09,0,0,0,3.07-9.34H37.92a2.67,2.67,0,0,1-2-.91l-2.68-3a2.1,2.1,0,0,0-3.15,0l-2.3,2.59a4,4,0,0,1-3,1.34H.51a37.5,37.5,0,0,0,3.07,9.34Z" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M47.44,15A2.23,2.23,0,0,0,49,14.29L52.21,11a2.09,2.09,0,0,1,1.52-.64h.13a2.09,2.09,0,0,1,1.57.7l2.68,3a2.67,2.67,0,0,0,2,.91H67.3A37.48,37.48,0,0,0,7.37,15Z" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M33,63H23.2a2.7,2.7,0,0,1-2-.9l-2.68-3a2.1,2.1,0,0,0-3.15,0l-2.3,2.6a4,4,0,0,1-3,1.33H9.94a37.44,37.44,0,0,0,54.79,0Z" })
                  ] })
                }
              ] : [],
              ...selectedDepositCurrency === "TRX" ? [
                {
                  id: "trc20",
                  name: "TRX Direct Transfer",
                  icon: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-500 font-bold text-[10px]", children: "TRX" })
                }
              ] : []
            ].map((m) => {
              const isStripe = m.id === "stripe";
              const isLocked = isStripe && isStripeLocked;
              return /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    if (isLocked) {
                      toast({
                        title: "Method Locked 🔒",
                        description: "Card deposits are temporarily disabled by the administrator. Please use another method.",
                        variant: "destructive"
                      });
                      return;
                    }
                    if (m.id === "bank_transfer") {
                      handleBankTransferTopup();
                      return;
                    }
                    setDepositMethod(m.id);
                  },
                  className: `flex items-center gap-3 p-4 rounded-2xl border text-xs font-black uppercase tracking-wider transition-all relative overflow-hidden ${isLocked ? "bg-neutral-100 dark:bg-white/5 text-neutral-400 dark:text-neutral-500 border-neutral-200 dark:border-white/5 opacity-50 cursor-not-allowed" : depositMethod === m.id ? "bg-purple-600 text-white border-purple-600" : "bg-white dark:bg-card text-neutral-500 dark:text-neutral-400 border-purple-50/50 dark:border-white/5 hover:border-purple-200 dark:hover:border-purple-500"}`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "pointer-events-none flex items-center gap-3 w-full justify-between", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-3", children: [
                      m.icon,
                      m.name
                    ] }),
                    isLocked && /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-3.5 h-3.5 text-neutral-400 dark:text-neutral-500" })
                  ] })
                },
                m.id
              );
            }) })
          ] }),
          depositMethod === "stripe" && (() => {
            const amt = parseFloat(depositAmount);
            if (!isNaN(amt) && amt > 0) {
              const fee = amt * 0.045 + 0.3;
              const total = amt + fee;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-purple-50/30 dark:bg-white/5 p-4 rounded-2xl border border-purple-100/50 dark:border-white/5 space-y-2 text-xs", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center text-neutral-500 dark:text-neutral-400", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold uppercase tracking-wider text-[10px]", children: "Deposit Amount:" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono font-black", children: [
                    "$",
                    amt.toFixed(2)
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center text-neutral-500 dark:text-neutral-400", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold uppercase tracking-wider text-[10px]", children: "Stripe Processing Fee (4.5% + $0.30):" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono font-black", children: [
                    "$",
                    fee.toFixed(2)
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px bg-purple-100 dark:bg-white/5 my-1" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center text-neutral-900 dark:text-white font-black", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "uppercase tracking-wider text-[10px]", children: "Total Amount:" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-sm", children: [
                    "$",
                    total.toFixed(2)
                  ] })
                ] })
              ] });
            }
            return null;
          })(),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogFooter, { className: "pt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              className: "w-full h-14 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-black uppercase tracking-widest shadow-xl transition-all",
              onClick: handleCreateDeposit,
              children: "Continue to Pay"
            }
          ) })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-4 space-y-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-purple-50/50 dark:bg-white/5 p-5 rounded-3xl border border-purple-100 dark:border-white/10 space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center text-xs", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-neutral-400 uppercase tracking-widest", children: "Send Exactly:" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-black text-neutral-900 dark:text-white flex items-center", children: (() => {
                const depCurrency = activeDeposit.currency || selectedDepositCurrency;
                const rateLkr = activeDeposit.exchangeRate ? parseFloat(activeDeposit.exchangeRate) : liveLkrRate;
                if (activeDeposit.method === "binance" && depCurrency === "LKR") {
                  const usdt = activeDeposit.amount / rateLkr;
                  const usdtText = usdt.toFixed(4);
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-neutral-400 text-[10px]", children: [
                      "Rs. ",
                      activeDeposit.amount.toFixed(2),
                      " LKR →"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-teal-400 font-bold flex items-center gap-1", children: [
                      usdtText,
                      " USDT",
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Button,
                        {
                          variant: "ghost",
                          size: "icon",
                          className: "w-5 h-5 rounded bg-neutral-100 hover:bg-neutral-200 dark:bg-white/5 dark:hover:bg-white/10 p-0 border border-neutral-200 dark:border-white/10 shadow-sm",
                          onClick: () => {
                            copyToClipboard(usdtText);
                            toast({ title: "USDT Amount Copied", description: `${usdtText} USDT copied to clipboard.` });
                          },
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "w-2.5 h-2.5 text-purple-600 dark:text-purple-400" })
                        }
                      )
                    ] })
                  ] });
                }
                let amtText = "";
                let labelText = "";
                if (depCurrency === "LKR") {
                  amtText = activeDeposit.amount.toFixed(2);
                  labelText = `Rs. ${amtText} LKR`;
                } else if (depCurrency === "USDT") {
                  amtText = activeDeposit.amount.toFixed(2);
                  labelText = `${amtText} USDT`;
                } else if (depCurrency === "TRX") {
                  amtText = activeDeposit.amount.toFixed(4);
                  labelText = `${amtText} TRX`;
                } else {
                  amtText = activeDeposit.amount.toFixed(2);
                  labelText = `$${amtText} USD`;
                }
                return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 text-teal-400 font-bold", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: labelText }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      variant: "ghost",
                      size: "icon",
                      className: "w-5 h-5 rounded bg-neutral-100 hover:bg-neutral-200 dark:bg-white/5 dark:hover:bg-white/10 p-0 border border-neutral-200 dark:border-white/10 shadow-sm",
                      onClick: () => {
                        copyToClipboard(amtText);
                        toast({ title: "Amount Copied", description: `${amtText} copied to clipboard.` });
                      },
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "w-2.5 h-2.5 text-purple-600 dark:text-purple-400" })
                    }
                  )
                ] });
              })() })
            ] }),
            activeDeposit.method === "binance" && (activeDeposit.currency || selectedDepositCurrency) === "LKR" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center text-[10px] text-neutral-400", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "uppercase tracking-widest font-bold", children: "Rate:" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "1 USDT ≈ Rs. ",
                (activeDeposit.exchangeRate ? parseFloat(activeDeposit.exchangeRate) : liveLkrRate).toFixed(2),
                " LKR"
              ] }),
              !activeDeposit.exchangeRate && p2pRateData && !p2pRateData.cached && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-2 text-[9px] text-teal-400 font-bold uppercase", children: "● Live" }),
              activeDeposit.exchangeRate && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-2 text-[9px] text-neutral-400 font-bold uppercase", children: "🔒 Locked" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5 pt-2 border-t border-purple-100/50 dark:border-white/5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold text-neutral-400 uppercase tracking-widest", children: activeDeposit.method === "binance" ? "To Binance Pay ID:" : "To Wallet Address:" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-neutral-950 p-3 rounded-xl border border-neutral-100 dark:border-white/5 flex items-center justify-between text-xs font-mono select-all", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "line-clamp-1 break-all pr-4", children: activeDeposit.walletAddress }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "ghost",
                    size: "icon",
                    className: "w-8 h-8 rounded-lg bg-neutral-50 dark:bg-white/5 border dark:border-white/5 shadow-sm",
                    onClick: () => copyToClipboard(activeDeposit.walletAddress),
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "w-3.5 h-3.5 text-purple-600" })
                  }
                )
              ] })
            ] }),
            activeDeposit.method === "binance" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5 pt-2 border-t border-purple-100/50 dark:border-white/5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold text-neutral-400 uppercase tracking-widest", children: "Required Remark:" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-neutral-950 p-3 rounded-xl border border-neutral-100 dark:border-white/5 flex items-center justify-between text-xs font-mono select-all", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "line-clamp-1 break-all pr-4 text-purple-600 dark:text-purple-400 font-black", children: activeDeposit.remark }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "ghost",
                    size: "icon",
                    className: "w-8 h-8 rounded-lg bg-neutral-50 dark:bg-white/5 border dark:border-white/5 shadow-sm",
                    onClick: () => {
                      copyToClipboard(activeDeposit.remark || "");
                      toast({ title: "Remark Copied", description: "Make sure to include this remark in your payment!" });
                    },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "w-3.5 h-3.5 text-purple-600" })
                  }
                )
              ] })
            ] })
          ] }),
          activeDeposit.method !== "binance" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-widest", children: "Transaction ID (TXID / Hash)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "text",
                value: txidInput,
                onChange: (e) => setTxidInput(e.target.value),
                placeholder: "Enter your transaction hash...",
                className: "w-full h-14 rounded-2xl bg-purple-50/50 dark:bg-white/5 border border-purple-100 dark:border-white/10 px-4 text-xs font-mono focus:outline-none focus:border-purple-500 dark:focus:border-purple-400"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-wider leading-relaxed", children: "* Payments are verified automatically on the blockchain network within 1-3 minutes of submission." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "flex-col sm:flex-row gap-3 pt-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "ghost",
                className: "flex-1 h-14 rounded-2xl font-black uppercase tracking-widest text-neutral-400 hover:bg-neutral-50 dark:hover:bg-white/5",
                onClick: () => setActiveDeposit(null),
                children: "Back"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                className: "flex-1 h-14 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-black uppercase tracking-widest shadow-xl disabled:opacity-50",
                disabled: isVerifyingPayment || activeDeposit.method !== "binance" && !txidInput.trim(),
                onClick: handleVerifyCryptoPayment,
                children: isVerifyingPayment ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-5 h-5 animate-spin" }) : "Verify Payment"
              }
            )
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: isLoginDialogOpen, onOpenChange: (open) => {
        if (!open) {
          setIsLoginDialogOpen(false);
          setOtpSent(false);
          setOtpInput("");
          setEmailInput("");
        }
      }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "rounded-[2.5rem] border-0 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl p-5 sm:p-8 shadow-2xl max-w-[90vw] mx-auto text-neutral-900 dark:text-white", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-3xl bg-purple-50 dark:bg-purple-950/50 flex items-center justify-center text-purple-600 shadow-inner", children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "w-8 h-8" }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-2xl font-black tracking-tighter uppercase italic", children: "Sign In to Save Progress" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { className: "text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mt-1", children: "Unified Email OTP Login" })
          ] })
        ] }),
        !otpSent ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-4 space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-widest pl-2", children: "Email Address" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "email",
                placeholder: "Enter your email address",
                value: emailInput,
                onChange: (e) => setEmailInput(e.target.value),
                className: "w-full h-14 px-5 rounded-2xl bg-purple-50/50 dark:bg-white/5 border border-purple-100 dark:border-white/10 text-sm font-semibold placeholder:text-neutral-300 text-neutral-800 dark:text-white focus:outline-none focus:border-purple-500 transition-all text-center"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogFooter, { className: "pt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              className: "w-full h-14 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-black uppercase tracking-wider shadow-md disabled:opacity-50",
              disabled: isAuthSubmitting || !emailInput,
              onClick: handleSendOtp,
              children: isAuthSubmitting ? "Sending..." : "Send Verification Code"
            }
          ) }),
          googleEnabled && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-3 pt-4 border-t border-neutral-100 dark:border-white/5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-widest", children: "Or Sign In with Google" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: handleGoogleRedirectLogin,
                className: "w-full h-14 rounded-2xl border border-neutral-200 bg-white hover:bg-neutral-50 flex items-center justify-center gap-3 text-neutral-700 font-black tracking-wider text-sm shadow-sm transition-all active:scale-[0.98] focus:outline-none uppercase",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { className: "w-5 h-5 shrink-0", viewBox: "0 0 24 24", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "path",
                      {
                        fill: "#4285F4",
                        d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "path",
                      {
                        fill: "#34A853",
                        d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "path",
                      {
                        fill: "#FBBC05",
                        d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "path",
                      {
                        fill: "#EA4335",
                        d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Sign In with Google" })
                ]
              }
            )
          ] })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-4 space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-widest pl-2", children: "Verification Code" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "text",
                maxLength: 6,
                placeholder: "Enter 6-digit OTP",
                value: otpInput,
                onChange: (e) => setOtpInput(e.target.value),
                className: "w-full h-14 px-5 rounded-2xl bg-purple-50/50 dark:bg-white/5 border border-purple-100 dark:border-white/10 text-center font-mono text-lg font-black tracking-widest text-neutral-800 dark:text-white focus:outline-none focus:border-purple-500 transition-all"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "flex gap-3 pt-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "ghost",
                className: "flex-1 h-14 rounded-2xl font-black uppercase tracking-wider text-neutral-400 hover:bg-neutral-50 dark:hover:bg-white/5",
                onClick: () => {
                  setOtpSent(false);
                },
                children: "Back"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                className: "flex-1 h-14 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-black uppercase tracking-wider shadow-md disabled:opacity-50",
                disabled: isAuthSubmitting || otpInput.length !== 6,
                onClick: handleVerifyOtp,
                children: isAuthSubmitting ? "Verifying..." : "Verify & Login"
              }
            )
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: isSupportMenuOpen && !isChatOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 15, scale: 0.9 },
          animate: { opacity: 1, y: 0, scale: 1 },
          exit: { opacity: 0, y: 15, scale: 0.9 },
          transition: { type: "spring", stiffness: 350, damping: 25 },
          className: "flex flex-col items-end gap-3 mb-3",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5 group", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-black uppercase text-white bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/5 shadow-md", children: "WhatsApp Support" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.button,
                {
                  whileHover: { scale: 1.1 },
                  whileTap: { scale: 0.9 },
                  onClick: () => {
                    window.open(whatsappLink, "_blank");
                    setIsSupportMenuOpen(false);
                  },
                  className: "w-12 h-12 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg shadow-green-600/30 border border-green-400/20",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-5 h-5 fill-current", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.966C16.588 1.974 14.116 1.05 11.752 1.05c-5.444 0-9.87 4.372-9.873 9.802-.001 1.77.478 3.497 1.388 5.041l-.95 3.468 3.73-.967z" }) })
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5 group", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-black uppercase text-white bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/5 shadow-md", children: "Live Agent" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.button,
                {
                  whileHover: { scale: 1.1 },
                  whileTap: { scale: 0.9 },
                  onClick: () => {
                    setIsChatOpen(true);
                    setIsSupportMenuOpen(false);
                  },
                  className: "w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-lg shadow-purple-600/30 border border-purple-400/20",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "w-5 h-5" })
                }
              )
            ] })
          ]
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.button,
        {
          whileHover: { scale: 1.05 },
          whileTap: { scale: 0.9 },
          onClick: () => {
            if (isChatOpen) {
              setIsChatOpen(false);
            } else {
              setIsSupportMenuOpen(!isSupportMenuOpen);
            }
          },
          className: `w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 ${isChatOpen ? "bg-white text-black rotate-90" : isSupportMenuOpen ? "bg-red-500 text-white shadow-red-500/30 rotate-90" : activeButtonIcon === "whatsapp" ? "bg-[#25D366] text-white shadow-green-600/30" : "bg-purple-600 text-white shadow-purple-600/30"}`,
          children: isChatOpen || isSupportMenuOpen ? /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-6 h-6" }) : activeButtonIcon === "whatsapp" ? /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-7 h-7 fill-current animate-pulse", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.966C16.588 1.974 14.116 1.05 11.752 1.05c-5.444 0-9.87 4.372-9.873 9.802-.001 1.77.478 3.497 1.388 5.041l-.95 3.468 3.73-.967z" }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "w-7 h-7" })
        }
      )
    ] })
  ] });
}
function TabButton({ active, onClick, icon, label }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      onClick,
      className: `relative flex flex-col items-center justify-center flex-1 py-1 transition-all duration-500 overflow-hidden ${active ? "text-white" : "text-neutral-500 hover:text-neutral-300"}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            animate: {
              y: active ? -2 : 0,
              scale: active ? 1.1 : 1
            },
            className: "z-10",
            children: icon
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-[8px] font-black uppercase tracking-widest mt-1 transition-all duration-500 ${active ? "opacity-100 scale-100" : "opacity-0 scale-50"}`, children: label }),
        active && /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            layoutId: "activeTab",
            className: "absolute inset-0 bg-white/5 rounded-2xl",
            transition: { type: "spring", stiffness: 500, damping: 30 }
          }
        )
      ]
    }
  );
}
export {
  MiniAppShop as default
};
