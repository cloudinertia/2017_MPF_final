let Rx = require('rxjs')

const labels = {}
const NUM = 2000000000 
let N = 8 

function take_some_time(num) {
	i = 0
	while( i< num )
		i++
	return i
}


/*
w1 = new Worker(URL.createObjectURL(new Blob([worker_str])))
w1.postMessage([NUM])
*/
let observable = Rx.Observable.create(function(obs){
    console.time('single')
    for(var i=0; i<N; i++)
        obs.next(NUM)
    obs.complete()
}).observeOn(Rx.Scheduler.asap)
observable.subscribe(
        {
            next:function(num) {
                take_some_time(num)
            },
            complete: function() { console.timeEnd('single') }
        }
)
/*
let count = 0 
class Observable {
    constructor(){}
    listen(fn) {
        this.listner = fn
    }
    push(arg) {
        let worker_str = `
            onmessage = function(e) {
                (${this.listner.toString()})(e.data[0])
                postMessage('done')
            }
        `
        let w1 = new Worker(URL.createObjectURL(new Blob([worker_str])))
        w1.postMessage([arg])
        w1.onmessage = e =>{ 
            count ++
            if (count == N)
                console.timeEnd('worker')
        }

    }
}
let obs = new Observable()
obs.listen(take_some_time)
console.time('worker');

for ( var i =0; i< N; i++ )
    obs.push(NUM);
*/
