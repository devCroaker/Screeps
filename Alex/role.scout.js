const Creep = require('class.creep')

class Scout extends Creep {

    constructor(self) {
        super(self);
    }

    run() {
        let target = Game.flags[this.memory.flag];

        try {
            this.self.moveTo(target);
        } catch(err) {
            console.log(err);
        }
    }

}

module.exports = Scout;