const Entity = require('class.entity');

class StructTower extends Entity {

    constructor(self) {
        super(self);

        this._hostiles = this.self.room.find(FIND_HOSTILE_CREEPS);
    }

    get hostiles() {
        return this._hostiles;
    }

    set hostiles(hostiles) {
        this._hostiles = hostiles;
    }

    attack() {
        let user = this.hostiles[0].owner.username;
        Game.notify(`User ${user} spotted in room ${this.self.room}`);
        this.self.attack(this.hostiles[0]);
    }

    findDamagedStructure() {

        let damaged = this.self.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                let isFortification = (structure.structureType === STRUCTURE_WALL || structure.structureType === STRUCTURE_RAMPART);
                return ((!isFortification && structure.hits < structure.hitsMax) || (isFortification && structure.hits < 10000));
            }
        });

        damaged.sort((a,b) => a.hits - b.hits);

        return (damaged.length > 0) ? damaged[0] : null;
    }

    getWounded() {
        return this.self.room.find(FIND_MY_CREEPS, {
            filter: (creep) => {
                return creep.hits < creep.hitsMax;
            }
        });
    }

    heal() {
        let wounded = this.getWounded();

        if (wounded.length > 0) {
            wounded.sort((a,b) => a.hits - b.hits);
            this.self.heal(wounded[0]);
        } else {
            let damaged = this.findDamagedStructure();
            if (damaged) {
                this.self.repair(damaged);
            }
        }
    }

    run() {

        if (this.hostiles.length > 0) {
            this.attack(this.hostiles[0]);
        } else {
            this.heal();
        }

    }

}

module.exports = StructTower;