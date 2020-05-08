const Entity = require('class.entity');
//const maxHarvesters = require('util.maxHarvesters');

const BUILDERS = 2;
const REPAIRS = 2;
const RUNNERFACTOR = 3;

/** @param {Spawn} spawn **/
class StructSpawn extends Entity {

    constructor(self) {
        super(self);
    }

    getData() {

        if (!this.memory.maxHarvesters || !this.memory.sources || !this.memory.maxRunners) {

            let sources = this.self.room.find(FIND_SOURCES);

            this.memory.maxHarvesters = 0;
            this.memory.sources = [];

            for (let source of sources) {
                let max = 1;
                this.memory.sources.push({
                    id: source.id,
                    maxHarvesters: max,
                    maxRunners: max*RUNNERFACTOR
                });
                this.memory.maxHarvesters += max;
                this.memory.maxRunners += max*RUNNERFACTOR;
            }
        }

        for (let source of this.memory.sources) {
            source.harvesters = _.filter(Game.creeps, creep => (creep.memory.source == source.id && creep.memory.role === 'miner')).length;
            source.runners = _.filter(Game.creeps, creep => (creep.memory.source == source.id && creep.memory.role === 'runner')).length;
        }

    }

    run() {
        
        this.getData();
        
        // Build the next creep to spawn
        let name,
            body,
            memory = {
                spawn: this.self.name
            };

        let harvesters = _.filter(Game.creeps, creep => creep.memory.role === 'miner');
        let runners = _.filter(Game.creeps, creep => creep.memory.role === 'runner');
        let builders = _.filter(Game.creeps, creep => creep.memory.role === 'builder');
        let repairs = _.filter(Game.creeps, creep => creep.memory.role === 'repair');
        
        if (this.self.room.energyAvailable >= 300 && !this.self.spawning) {

            console.log(`${harvesters.length} harvesters, ${runners.length} runners, ${builders.length} builders, ${repairs.length} repairs`);

            if (this.self.room.energyAvailable >= 550 && harvesters.length < this.memory.maxHarvesters && runners.length >= harvesters.length) {

                let source = this.memory.sources.find(element => element.harvesters < element.maxHarvesters);

                name = 'Mine' + Game.time.toString();
                memory.role = 'miner';
                memory.source = source.id;

                body = [MOVE];
                for (let i = 0; i < 5; i++) {
                    body.unshift(WORK);
                }

            } else if (runners.length < harvesters.length*RUNNERFACTOR && harvesters.length > 0) {

                let source = this.memory.sources.find(element => element.runners < element.maxRunners);

                name = 'Run' + Game.time.toString();
                memory.role = 'runner';
                memory.source = source.id;
                body = [CARRY,MOVE];
                for (let i = 0; i < Math.floor(this.self.room.energyAvailable/100)-1; i++) {
                    body.unshift(CARRY,MOVE);
                    if (body.length > 15) break;
                }

            } else if (harvesters.length >= this.memory.maxHarvesters && builders.length < BUILDERS) {

                name = 'Build' + Game.time.toString();
                memory.role = 'builder';

                body = [WORK,CARRY,MOVE];
                for (let i = 0; i < Math.floor(this.self.room.energyAvailable/200)-1; i++) {
                    body.unshift(WORK,CARRY,MOVE);
                    if (body.length > 15) break;
                }

            } else if (harvesters.length >= this.memory.maxHarvesters && repairs.length < REPAIRS) {

                name = 'Repair' + Game.time.toString();
                memory.role = 'repair';

                body = [WORK,CARRY,MOVE];
                for (let i = 0; i < Math.floor(this.self.room.energyAvailable/200)-1; i++) {
                    body.unshift(WORK,CARRY,MOVE);
                    if (body.length > 15) break;
                }

            }

            if (name) {
                let spawn = this.self.spawnCreep(body, name, {memory});
                if (spawn === 0) console.log(`Spawning Creep: ${name}`);
                else console.log(spawn);
            }
        }
	    
	}
};

module.exports = StructSpawn;