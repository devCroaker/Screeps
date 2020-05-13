const Creep = require('class.creep')

class Scout extends Creep {

    constructor(self) {
        super(self);

        this.memory.replaced = false;
    }

    run() {
        if (this.self.ticksToLive <= 150 && !this.memory.replaced) {
            try{
                let spawn = Game.spawns[this.memory.spawn];

                if (!spawn.spawning && spawn.store.getUsedCapacity(RESOURCE_ENERGY) > 50) {
                    /*let replace = spawn.spawnCreep([MOVE], 'scout'+ Game.time.toString(),{
                        memory: {
                            role: 'scout',
                            flag: this.memory.flag.name,
                            spawn: spawn.name
                        }
                    });*/

                    //if (replace === 0) this.memory.replaced = true; 
                }
            } catch(err) {
                console.log(err);
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