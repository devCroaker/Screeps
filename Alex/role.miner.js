const Creep = require('class.creep');

class Miner extends Creep {

    constructor(self) {
        super(self);

        this.memory.source = (this.memory.source) ? this.memory.source : null;
        this.container = (this.memory.container) ? this.memory.container : null;
    }

    get source() {
        return this.memory.source;
    }

    set source(source) {
        this.memory.source = source;
    }

    get container() {
        return this.memory.container;
    }

    set container(container) {
        this.memory.container = container;
    }

    findSource() {
        if (!this.source) super.findSource();

        this.target = Game.getObjectById(this.source);

        this.container = this.target.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (struct) => {
                return struct.structureType === STRUCTURE_CONTAINER && struct.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            }
        });
    }

    gather() {
        this.findSource();

        if(this.self.harvest(this.target) == ERR_NOT_IN_RANGE) {
            this.self.moveTo(this.target);
        }
    }

};

module.exports = Miner;