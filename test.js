luainjs = require("lua-in-js")

console.log(new luainjs.Table(["A", "B", 12]))
console.log(new luainjs.Table([]))
console.log(new luainjs.Table({ x: "csdad", y: 12 }))
console.log(new luainjs.Table({}))
