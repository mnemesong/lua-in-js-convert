import { describe, it } from "mocha"
import * as assert from "assert"
import * as luainjs from "lua-in-js"
import { jsToLua, luaToJs } from "../src"


function execLua(script: string): any {
    return luainjs.createEnv().parse(script).exec()
}

describe("test luaToJs", () => {
    it("test string", () => {
        const given = execLua(`return "John"`)
        const result = luaToJs(given)
        assert.strictEqual(result, "John")
    })
    it("test number", () => {
        const given = execLua(`return 123125135432`)
        const result = luaToJs(given)
        assert.strictEqual(result, 123125135432)
    })
    it("test array", () => {
        const given = execLua(`return {11, 421, "asd"}`)
        const result = luaToJs(given)
        assert.deepStrictEqual(result, [11, 421, "asd"])
    })
    it("test function", () => {
        const given = execLua(`return function() return 12 end`)
        const result = luaToJs(given)
        assert.strictEqual(typeof result, "function")
    })
    it("test object", () => {
        const given = execLua(`a = {a=11, b=421}\na[12] = "asd"\nreturn a`)
        const result = luaToJs(given)
        assert.deepStrictEqual(result, { a: 11, b: 421, 12: "asd" })
    })
    it("test ordered object", () => {
        const given = execLua(`return {111, a={x=12, desc="is description"}, b=421, "dasf"}`)
        const result = luaToJs(given)
        assert.deepStrictEqual(result, {
            1: 111,
            a: { x: 12, desc: "is description" },
            b: 421,
            2: "dasf"
        })
    })
})

function execLuaF(fun) {
    const f = execLua(`
    function f(fun) 
        return fun()
    end
    return f
    `)
    return f(fun)[0]
}

function luaType(v) {
    const f = execLua(`
    function f(v) 
        return type(v)
    end
    return f
    `)
    return f(v)[0]
}

function luaReturn(v) {
    const f = execLua(`
    function f(v) 
        return v
    end
    return f
    `)
    return f(v)[0]
}

describe("test jsToLua", () => {
    it("test string", () => {
        const result = jsToLua("John")
        assert.strictEqual(luaReturn(result), "John")
        assert.strictEqual(luaType(result), "string")
    })
    it("test number", () => {
        const result = jsToLua(12412412)
        assert.strictEqual(luaReturn(result), 12412412)
        assert.strictEqual(luaType(result), "number")
    })
    it("test function", () => {
        const given = () => 12
        const result = jsToLua(given)
        assert.strictEqual(typeof result, "function")
        assert.strictEqual(execLuaF(result), 12)
    })
    it("test array", () => {
        const given = [12, "aboba", null]
        const result = luaToJs(luaReturn(jsToLua(given)))
        assert.deepStrictEqual(result, given)
    })
    it("test object", () => {
        const given = { 1: 111, a: 11, b: 421, 2: "dasf" }
        const result = luaToJs(luaReturn(jsToLua(given)))
        assert.deepStrictEqual(result, given)
    })
    it("test included object", () => {
        const given = { 1: 111, a: 11, b: 421, 2: [12, "aboba", null] }
        const result = luaToJs(luaReturn(jsToLua(given)))
        assert.deepStrictEqual(result, given)
    })
})