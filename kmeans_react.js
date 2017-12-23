let Rx = require('rxjs')
let GPU = require('gpu.js')
let counter = 0
const gpu = new GPU()

function kmeans_parallel(data, k)
{
    // get range of data
    let min_x = data[0][0]; let min_y=data[0][1]
    let max_x = data[0][0]; let max_y=data[0][1]
    for (let i in data)
    {
        if (data[i][0] < min_x)
            min_x = data[i][0]
        if (data[i][1] < min_y)
            min_y = data[i][1]
        if (data[i][0] > max_x)
            max_x = data[i][0]
        if (data[i][1] > max_x)
            max_y = data[i][1]
    }
    let range_x = max_x - min_x
    let range_y = max_y - min_y
    // init centroid
    let centroid = []
    for (let i=0; i<k; i++)
    {
        let x = Math.random()*range_x + min_x
        let y = Math.random()*range_y + min_y
        centroid.push([x,y])
    }

    const assign_centroid = gpu.createKernel( function( data, centroid) {
                    var subsets = [] 
                    for (var i=0; i<this.constants.k; i++)
                        subsets[i] = []
                    function nearest(item) {
                        var minimum_centroid = 0
                        var dist = function(index){return Math.pow(centroid[index][0]-item[0],2) +  Math.pow(centroid[index][1]-item[1],2)}
                        var minimum_distance = dist(0) 
                        for(var i=0; i<this.constants.k; i++)
                        {
                            if (dist(i) < minimum_distance)
                            {
                                minimum_distance = dist(i)
                                minimum_centroid = i
                            }
                        }
                        return minimum_centroid 
                    }
                    for (var i = 0; i < this.constants.size ; i++)
                    {
                        subsets[nearest(data[this.thread.x])].push(data[this.thread.x])
                    }
                    return subsets
    }, {
        constants: { size:data.length, k:centroid.length},
        output: [data.length]
    })
      
    // loop
    for (let i=0; i<100; i++)
    {
    // 1. make k-set
    // 2. calculate nearest centroid
    /*
    function nearest(item) {
        let minimum_centroid = 0
        let dist = index => Math.pow(centroid[index][0]-item[0],2) +  Math.pow(centroid[index][1]-item[1],2)
        let minimum_distance = dist(0) 
        for(let i in centroid)
        {
            if (dist(i) < minimum_distance)
            {
                minimum_distance = dist(i)
                minimum_centroid = i
            }
        }
        return minimum_centroid 
    }
    for (let i in data)
    {
        subsets[nearest(data[i])].push(data[i])
    }
    */
     let subsets = assign_centroid( data, centroid)
    // 3. re-calculate centroids
    function cal_centroid(key) {
        let len = subsets[key].length
        let x = 0
        let y = 0
        for (let i in subsets[key])
        {
            x += subsets[key][i][0]
            y += subsets[key][i][1]
        }
        return [x/len, y/len]
    }
    for (let key in subsets)
        centroid[key] = cal_centroid(key) 
    }
    return subsets
}
let input = []
for ( let i=0; i < 10; i++)
{
    for (let j=0; j < 10; j++)
        input.push( [i,j] )
}
let result = kmeans_parallel( input, 4)
console.log(result)
