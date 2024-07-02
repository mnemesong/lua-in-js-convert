"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jsToLua = exports.luaToJs = void 0;
var luainjs = __importStar(require("lua-in-js"));
/**
 * Converts any lua entity to js entity
 * @param entity - Lua entity
 * @returns js entity
 */
function luaToJs(entity) {
    if (typeof entity === "object") {
        if (entity instanceof luainjs.Table) {
            if (Object.keys(entity.strValues).length > 0) {
                var result_1 = {};
                Object.keys(entity.strValues).forEach(function (k) {
                    result_1[k] = luaToJs(entity.strValues[k]);
                });
                entity.keys.forEach(function (k) {
                    result_1[k] = null;
                });
                entity.numValues.concat(entity.values).forEach(function (v, i) {
                    result_1[i] = luaToJs(v);
                });
                if ((result_1["0"] === undefined)
                    && (Object.keys(result_1).indexOf("0") !== -1)) {
                    delete result_1["0"];
                }
                return result_1;
            }
            var result = entity.numValues
                .concat(entity.values)
                .map(function (v) { return luaToJs(v); });
            if (result[0] === undefined) {
                result.shift();
            }
            return result;
        }
        if (!entity) {
            return null;
        }
    }
    return entity;
}
exports.luaToJs = luaToJs;
/**
 * Converts Js entity to Lua entity
 * @param entity  - any js entity
 * @returns - match lua entity
 */
function jsToLua(entity) {
    if (Array.isArray(entity)) {
        return new luainjs.Table(entity.map(function (v) { return jsToLua(v); }));
    }
    if (typeof entity === "object") {
        if (!entity) {
            return null;
        }
        if (entity instanceof luainjs.Table) {
            return jsToLua(luaToJs(entity));
        }
        var result_2 = {};
        Object.keys(entity).forEach(function (k) {
            result_2[k] = jsToLua(entity[k]);
        });
        return new luainjs.Table(result_2);
    }
    if (typeof entity === "undefined") {
        return null;
    }
    return entity;
}
exports.jsToLua = jsToLua;
