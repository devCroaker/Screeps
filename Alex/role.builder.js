const Creep = require('class.creep');

class Builder extends Creep {

    constructor(self) {
        super(self);
    }

    build() {
        // Find a target
        this.findConstruction();

        if (this.target) {
            if(this.self.build(this.target) == ERR_NOT_IN_RANGE) {
                this.self.moveTo(this.target);
            }
        } else {
            this.recycle();
        }

    }

    findConstruction() {

        this.nullTarget();
        this.target = this.self.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);

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

    work() {
        if (this.self.carry.energy === 0) {
            this.working = false;
        } else {
            this.build();
        }
    }
};

module.exports = Builder;