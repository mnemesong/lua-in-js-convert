import * as luainjs from "lua-in-js"

/**
 * Converts any lua entity to js entity
 * @param entity - Lua entity
 * @returns js entity
 */
export function luaToJs(entity: any): any {
    if (typeof entity === "object") {
        if (entity instanceof luainjs.Table) {
            if (Object.keys(entity.strValues).length > 0) {
                const result = entity.strValues
                entity.keys.forEach((k) => {
                    result[k] = null
                })
                entity.numValues.concat(entity.values).forEach((v, i) => {
                    result[i] = luaToJs(v)
                })
                if ((result["0"] === undefined)
                    && (Object.keys(result).indexOf("0") !== -1)
                ) {
                    delete result["0"]
                }
                return result;
            }
            const result = entity.numValues
                .concat(entity.values)
                .map(v => luaToJs(v))
            if (result[0] === undefined) {
                result.shift()
            }
            return result
        }
        if (!entity) {
            return null
        }
    }
    return entity;
}

/**
 * Converts Js entity to Lua entity
 * @param entity  - any js entity
 * @returns - match lua entity
 */
export function jsToLua(entity: any): any {
    if (Array.isArray(entity)) {
        return new luainjs.Table(entity.map(v => jsToLua(v)))
    }
    if (typeof entity === "object") {
        if (!entity) { return null }
        if (entity instanceof luainjs.Table) {
            return jsToLua(luaToJs(entity));
        }
        const result = {}
        Object.keys(entity).forEach(k => {
            result[k] = jsToLua(entity[k])
        })
        return new luainjs.Table(result)
    }
    if (typeof entity === "undefined") {
        return null
    }
    return entity;
}