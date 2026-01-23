"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  useUserStore: () => useUserStore
});
module.exports = __toCommonJS(index_exports);

// src/stores/useUserStore.ts
var import_zustand = require("zustand");
var useUserStore = (0, import_zustand.create)((set, get) => ({
  userInfo: null,
  setUserInfo: (info) => set({ userInfo: info }),
  updateRole: (role) => set((state) => ({
    userInfo: state.userInfo ? { ...state.userInfo, role } : null
  })),
  clearUser: () => set({ userInfo: null }),
  isStudent: () => get().userInfo?.role === "STUDENTS",
  isClubMember: () => get().userInfo?.role === "CLUB_MEMBER",
  isClubLeader: () => get().userInfo?.role === "CLUB_LEADER"
}));
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useUserStore
});
