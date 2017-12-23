let GPU = require('gpu.js')
const gpu = new GPU()

const mult = gpu.createKernel( function(x,y) {
        return x[this.thread.x]*y[this.thread.x]
}).setOutput([10])

var res = mult([1,2,3,4,5,6,7,8,9,10],[1,1,1,1,1,1,1,1,1,1])

console.log(res)

