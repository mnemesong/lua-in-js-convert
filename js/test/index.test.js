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
var mocha_1 = require("mocha");
var assert = __importStar(require("assert"));
var luainjs = __importStar(require("lua-in-js"));
var src_1 = require("../src");
function execLua(script) {
    return luainjs.createEnv().parse(script).exec();
}
(0, mocha_1.describe)("test luaToJs", function () {
    (0, mocha_1.it)("test string", function () {
        var given = execLua("return \"John\"");
        var result = (0, src_1.luaToJs)(given);
        assert.strictEqual(result, "John");
    });
    (0, mocha_1.it)("test number", function () {
        var given = execLua("return 123125135432");
        var result = (0, src_1.luaToJs)(given);
        assert.strictEqual(result, 123125135432);
    });
    (0, mocha_1.it)("test array", function () {
        var given = execLua("return {11, 421, \"asd\"}");
        var result = (0, src_1.luaToJs)(given);
        assert.deepStrictEqual(result, [11, 421, "asd"]);
    });
    (0, mocha_1.it)("test function", function () {
        var given = execLua("return function() return 12 end");
        var result = (0, src_1.luaToJs)(given);
        assert.strictEqual(typeof result, "function");
    });
    (0, mocha_1.it)("test object", function () {
        var given = execLua("a = {a=11, b=421}\na[12] = \"asd\"\nreturn a");
        var result = (0, src_1.luaToJs)(given);
        assert.deepStrictEqual(result, { a: 11, b: 421, 12: "asd" });
    });
    (0, mocha_1.it)("test ordered object", function () {
        var given = execLua("return {111, a={x=12, desc=\"is description\"}, b=421, \"dasf\"}");
        var result = (0, src_1.luaToJs)(given);
        assert.deepStrictEqual(result, {
            1: 111,
            a: { x: 12, desc: "is description" },
            b: 421,
            2: "dasf"
        });
    });
});
function execLuaF(fun) {
    var f = execLua("\n    function f(fun) \n        return fun()\n    end\n    return f\n    ");
    return f(fun)[0];
}
function luaType(v) {
    var f = execLua("\n    function f(v) \n        return type(v)\n    end\n    return f\n    ");
    return f(v)[0];
}
function luaReturn(v) {
    var f = execLua("\n    function f(v) \n        return v\n    end\n    return f\n    ");
    return f(v)[0];
}
(0, mocha_1.describe)("test jsToLua", function () {
    (0, mocha_1.it)("test string", function () {
        var result = (0, src_1.jsToLua)("John");
        assert.strictEqual(luaReturn(result), "John");
        assert.strictEqual(luaType(result), "string");
    });
    (0, mocha_1.it)("test number", function () {
        var result = (0, src_1.jsToLua)(12412412);
        assert.strictEqual(luaReturn(result), 12412412);
        assert.strictEqual(luaType(result), "number");
    });
    (0, mocha_1.it)("test function", function () {
        var given = function () { return 12; };
        var result = (0, src_1.jsToLua)(given);
        assert.strictEqual(typeof result, "function");
        assert.strictEqual(execLuaF(result), 12);
    });
    (0, mocha_1.it)("test array", function () {
        var given = [12, "aboba", null];
        var result = (0, src_1.luaToJs)(luaReturn((0, src_1.jsToLua)(given)));
        assert.deepStrictEqual(result, given);
    });
    (0, mocha_1.it)("test object", function () {
        var given = { 1: 111, a: 11, b: 421, 2: "dasf" };
        var result = (0, src_1.luaToJs)(luaReturn((0, src_1.jsToLua)(given)));
        assert.deepStrictEqual(result, given);
    });
    (0, mocha_1.it)("test included object", function () {
        var given = { 1: 111, a: 11, b: 421, 2: [12, "aboba", null] };
        var result = (0, src_1.luaToJs)(luaReturn((0, src_1.jsToLua)(given)));
        assert.deepStrictEqual(result, given);
    });
});
