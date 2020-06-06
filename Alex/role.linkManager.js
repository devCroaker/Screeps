const Creep = require('class.creep');

class LinkManager extends Creep {

    constructor(self) {
        super(self);
    }

    findResource() {
        this.nullTarget();
        this.target = this.self.room.storage;
    }

    findStorage() {
        this.nullTarget();
        this.target = Game.getObjectById(this.memory.spawn).pos.findClosestByPath(FIND_MY_STRUCTURES, {
            filter: (struct) => {
                return struct.structureType === STRUCTURE_LINK;
            }
        });
    }

    store() {
        // Find a storage structure
        this.findStorage();

        if(this.target) {
            // Deposite resource
            if(this.self.transfer(this.target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                this.self.moveTo(this.target);
            }
        }
    }

}

module.exports = LinkManager;