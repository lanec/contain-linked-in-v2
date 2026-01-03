"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const alarms_1 = __importDefault(require("./alarms"));
const contextualIdentities_1 = __importDefault(require("./contextualIdentities"));
const cookies_1 = __importDefault(require("./cookies"));
const extension_1 = __importDefault(require("./extension"));
const i18n_1 = __importDefault(require("./i18n"));
const runtime_1 = __importDefault(require("./runtime"));
const storage_1 = __importDefault(require("./storage"));
const tabs_1 = __importDefault(require("./tabs"));
const windows_1 = __importDefault(require("./windows"));
exports.default = (options) => {
    return {
        alarms: alarms_1.default(),
        contextualIdentities: contextualIdentities_1.default(),
        cookies: cookies_1.default(),
        extension: extension_1.default(),
        i18n: i18n_1.default(options),
        runtime: runtime_1.default(),
        storage: storage_1.default(),
        tabs: tabs_1.default(),
        windows: windows_1.default(),
    };
};
