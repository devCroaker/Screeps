const Creep = require('class.creep');

class Upgrader extends Creep {

    constructor(self) {
        super(self);
    }

    findResource() {
        this.nullTarget();
        this.target = this.self.room.storage;

        if (this.target.store.getUsedCapacity(RESOURCE_ENERGY) < this.self.store.getFreeCapacity(RESOURCE_ENERGY)) {
            super.findResource();
        }
    }

    store() {
        // Overwrite default
        this.working = true;
    }

};

module.exports = Upgrader;