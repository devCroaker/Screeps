const Creep = require('class.creep');

class Upgrader extends Creep {

    constructor(self) {
        super(self);
    }

    findResource() {
        this.nullTarget();

        this.target = this.self.room.controller.pos.findClosestByPath(FIND_MY_STRUCTURES, {
            filter: (struct) => {
                return struct.structureType === STRUCTURE_LINK && struct.store.getUsedCapacity(RESOURCE_ENERGY) > 0;
            }
        });

        if (!this.target) {
            this.target = this.self.room.storage;

            if (this.target.store.getUsedCapacity(RESOURCE_ENERGY) < this.self.store.getFreeCapacity(RESOURCE_ENERGY)) {
                super.findResource();
            }
        }
    }

    store() {
        // Overwrite default
        this.working = true;
    }

};

module.exports = Upgrader;