# lua-in-js-convert
Converts Lua entities to Js and back


## Example of usage
```typescript
import { jsToLua, luaToJs } from "../src"
import * as luainjs from "lua-in-js"

function execLua(script: string): any {
    return luainjs.createEnv().parse(script).exec()
}

function printlua(v): any {
    return execLua(`
    function p(v) print(v) end
    return p
    `)
}

const luaTable1 = jsToLua({x: 12, desc: "Coords"})
const printLua(luaTable1)
//{x=12, desc="Coords"}

const luaTable2 = execLua(`return {5, x=12}`)
const jsObj = luaToJs(luaTable2)
console.log(jsObj) //{"1": 5, "x": 12}

const luaTable3 = execLua(`return {5, "aboba", null}`)
const jsObj = luaToJs(luaTable3)
console.log(jsObj) //[5, "aboba", null]
```


## License
MIT


## Author
Anatoly Starodubtsev
tostar74@mail.ru