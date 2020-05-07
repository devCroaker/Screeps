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

    heal() {
        let wounded = this.self.room.find(FIND_MY_CREEPS, {
            filter: (creep) => {
                return creep.hits < creep.hitsMax;
            }
        });

        if (wounded.length > 0) {
            wounded.sort((a,b) => a.hits - b.hits);

            this.self.heal(wounded[0]);
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