class Pack {
	constructor(inputs) {
          this.inputs = inputs
          this.now = 0
    	}
    push(obs) {
        for(var i=0; i<this.inputs.length; i++)
        {
            var to_push = { value:this.inputs[this.now++] }
            to_push.pack = this
            obs.push(to_push)
        }
    }
}

class Observer{
    constructor() {
        this.tmp_pack = []
    }
    push(input) {
        if (input.constructor == Pack)
            input.push(this)
        else
            this.listner(input)
    }
    subscribe(fn) {
        this.listner = fn
    }
    sync() {
        return {
            "push": (input) => {
                if ( input.pack.constructor == Pack ){
                    this.tmp_pack.push(input.value)
                    if ( input['pack'].now == input.pack.inputs.length){
                        this.push(this.tmp_pack)
                        this.tmp_pack = [] // refresh
                    }
                }
            }
        }
    }
}

// test
var ob = new Observer()
var ob2 = new Observer()
var p = new Pack( [1,2,3] )
ob.subscribe( x => ob2.sync().push(x) )
ob2.subscribe( x => console.log(x))
ob.push(p)
