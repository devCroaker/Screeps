const Entity = require('class.entity');

class Screep extends Entity {

    constructor(self) {
        super(self);

        this.memory.working = (self.memory.working) ? self.memory.working : false;
        this.memory.target = (self.memory.target) ? Game.getObjectById(self.memory.target.id) : null;
    }

    get working() {
        return this.memory.working;
    }

    set working(working) {
        this.memory.working = working;
    }

    get target() {
        return this.memory.target;
    }

    set target(target) {
        this.memory.target = target;
    }

    die() {
        console.log(this.self.name + ' commiting suicide.')
        this.self.suicide();
    }

    findResource() {
        this.nullTarget();
        this.target = this.self.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {
            filter: (resource) => {
                return resource.amount >= this.self.carryCapacity;
            }
        });
    }

    findSource() {
        this.nullTarget();
        this.target = this.self.pos.findClosestByPath(FIND_SOURCES);
    }

    findStorage() {
        this.nullTarget();
        this.target = this.self.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                    structure.energy < structure.energyCapacity;
            }
        });
    }

    gather() {

        if (this.self.carry.energy >= 50) {
            this.store();
        } else {
            // Find closest dropped Resource
            this.findResource();

            if (this.target) {
                if(this.self.pickup(this.target) === ERR_NOT_IN_RANGE) {
                    this.self.moveTo(this.target);
                }
            } else {
                this.harvest();
            }

        }

    }

    harvest() {
        this.findSource();
        if(this.self.harvest(this.target) == ERR_NOT_IN_RANGE) {
            this.self.moveTo(this.target);
        }
    }

    nullTarget() {
        this.target = null;
    }

    run() {

        if (this.self.ticksToLive <= 1) {
            this.die();
        }
        
        if (!this.working) {
            this.gather();
        } else {
            this.work();
        }

    }

    store() {
        // Find a storage structure
        this.findStorage();

        if(this.target) {
            // Deposite resource
            if(this.self.transfer(this.target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                this.self.moveTo(this.target);
            }
        } else {
            this.working = true;
        }
    }

    upgrade() {
        if(this.self.upgradeController(this.self.room.controller) == ERR_NOT_IN_RANGE) {
            this.self.moveTo(this.self.room.controller);
        }
    }
    
    work() {
        if (this.self.carry.energy === 0) {
            this.working = false;
        } else {
            this.upgrade();
        }
    }

}

module.exports = Screep;