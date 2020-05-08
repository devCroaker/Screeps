const Creep = require('class.creep');

class Miner extends Creep {

    constructor(self) {
        super(self);

        this.memory.source = (this.memory.source) ? this.memory.source : null;
    }

    get source() {
        return this.memory.source;
    }

    set source(source) {
        this.memory.source = source;
    }

    findSource() {
        if (!this.source) super.findSource();

        this.target = Game.getObjectById(this.source);
    }

    gather() {
        this.findSource();

        if(this.self.harvest(this.target) == ERR_NOT_IN_RANGE) {
            this.self.moveTo(this.target);
        }
    }

};

module.exports = Miner;