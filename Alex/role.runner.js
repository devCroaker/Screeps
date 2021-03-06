const Creep = require('class.creep');

class Runner extends Creep {

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

    findResource() {

        this.nullTarget();
        // See if assigned miner has resources
        if (this.source) {
            let source = Game.getObjectById(this.source);
            
            this.target = source.pos.findClosestByPath(FIND_DROPPED_RESOURCES);

            if (!this.target) {
                this.target = source.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (struct) => {
                        return struct.structureType === STRUCTURE_CONTAINER;
                    }
                });
            }

        } else {
            this.target = this.self.pos.findClosestByPath(FIND_DROPPED_RESOURCES);
        }

    }

    findStorage() {
        this.nullTarget();

        let priorityList = (this.self.room.find(FIND_HOSTILE_CREEPS).length < 1) ? 
            [STRUCTURE_SPAWN,STRUCTURE_EXTENSION,STRUCTURE_TOWER,STRUCTURE_STORAGE]: 
            [STRUCTURE_TOWER,STRUCTURE_SPAWN,STRUCTURE_EXTENSION,STRUCTURE_STORAGE];
            
        for (let priority of priorityList) {
            this.target = this.self.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType === priority && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0);
                }
            });
            if (this.target) break;
        }
        
        if (!this.target) {
            let creep = this.self.pos.findClosestByPath(FIND_MY_CREEPS, {
                filter: (creep) => {
                    return (creep.store.getFreeCapacity(RESOURCE_ENERGY) < creep.store[RESOURCE_ENERGY] && creep.memory.role !== 'runner');
                }
            });

            if (creep) {
                this.target = creep;
            } else {
                this.self.say('No target');
            }
        }
    }

    store() {
        // Find a storage structure
        
        if (!this.target || !this.target.store || this.target.store.getFreeCapacity(RESOURCE_ENERGY) < this.target.store[RESOURCE_ENERGY]) this.findStorage();

        if(this.target) {
            // Deposite resource
            if(this.self.transfer(this.target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                this.self.moveTo(this.target);
            }
        } else {
            // Do something else?
        }
    }

};

module.exports = Runner;