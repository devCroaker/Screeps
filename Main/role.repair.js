const Creep = require('class.creep');

class Repair extends Creep {

    constructor(self) {
        super(self);
    }

    findDamagedStructure() {

        this.nullTarget();
        let damaged = this.self.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.hits < structure.hitsMax*.75;
            }
        });

        damaged.sort((a,b) => a.hits - b.hits);

        this.target = (damaged.length > 0) ? damaged[0] : null;
    }

    repair() {
        // Find a target
        this.findDamagedStructure();

        if (this.target) {
            if(this.self.repair(this.target) == ERR_NOT_IN_RANGE) {
                this.self.moveTo(this.target);
            }
        } else {
            this.upgrade();
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
            this.repair();
        }
    }

}

module.exports = Repair;