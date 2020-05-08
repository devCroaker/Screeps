const Creep = require('class.creep')

class Scout extends Creep {

    constructor(self) {
        super(self);
    }

    die() {

    }

    run() {

        if (this.self.ticksToLive <= 150) {
            let spawn = Game.spawns[this.memory.spawn];

            if (!spawn.spawning && spawn.store.getUsedCapacity(RESOURCE_ENERGY) > 50) {
                spawn.spawnCreep([MOVE], 'scout'+Game.time.toString(),{
                    memory: {
                        role: 'scout',
                        flag: flag.name,
                        spawn: spawn.id
                    }
                });
            }
        }

        let target = Game.flags[this.memory.flag];

        try {
            this.self.moveTo(target);
        } catch(err) {
            console.log(err);
        }
    }

}

module.exports = Scout;