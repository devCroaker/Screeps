const Entity = require('class.entity');
//const maxHarvesters = require('util.maxHarvesters');

const BUILDERS = 2;
const REPAIRS = 2;
const RUNNERFACTOR = 3;

/** @param {Spawn} spawn **/
class StructSpawn extends Entity {

    constructor(self) {
        super(self);

        this.runnerFactor = 2;
        this.maxBuilders = 4;
        this.maxRepairs = 4;

        this._creep = {
            name: null,
            body: [],
            memory: {
                role: null,
                home: this.self.room.id
            }
        };

        this._sources = [];
    
        this._miners = _.filter(Game.creeps, creep => creep.memory.role === 'miner');
        this._minerWork = _.reduce(this.miners, (total, curr) => total + curr.body.filter((part) => part.type === WORK).length,0);
        this._runners = _.filter(Game.creeps, creep => creep.memory.role === 'runner');
        this._builders = _.filter(Game.creeps, creep => creep.memory.role === 'builder');
        this._repairs = _.filter(Game.creeps, creep => creep.memory.role === 'repair');
    }

    get creep() {
        return this._creep;
    }

    set creep(creep) {
        this._creep = creep;
    }

    get sources() {
        return this._sources;
    }

    set sources(sources) {
        this._sources = sources;
    }

    get miners() {
        return this._miners;
    }

    set miners(miners) {
        this._miners = miners;
    }

    get minerWork() {
        return this._minerWork;
    }

    set minerWork(minerWork) {
        this._minerWork = mineminerWorkrs;
    }

    get runners() {
        return this._runners;
    }

    set runners(runners) {
        this._runners = runners;
    }

    get builders() {
        return this._builders;
    }

    set builders(builders) {
        this._builders = builders;
    }

    get repairs() {
        return this._repairs;
    }

    set repairs(repairs) {
        this._repairs = repairs;
    }

    buildCreep() {

        this.creep.name = this.creep.memory.role + Game.time.toString();
        this.creep.body.push(MOVE);

        switch(this.creep.memory.role) {
            case 'miner':
                let source = this.sources.find(source => source.miners < source.maxMinerWORK);
                this.creep.memory.source = source.id;

                for (let i = 0; i < Math.floor(this.self.room.energyAvailable/100)-1; i++) {
                    if ((source.miners + i) >= source.maxMinerWORK ) break;
                    this.creep.body.unshift(WORK);
                }
                break;
            case 'runner':
                this.creep.memory.source = this.sources.find(source => source.runners < source.maxRunners).id;

                for (let i = 0; i < Math.floor(this.self.room.energyAvailable/100)-1; i++) {
                    this.creep.body.unshift(CARRY,MOVE);
                    if (this.creep.body.length >= 15) break;
                }
                break;
            case 'builder':
            case 'repair':
                for (let i = 0; i < Math.floor(this.self.room.energyAvailable/150)-1; i++) {
                    this.creep.body.unshift(WORK,CARRY);
                    if (this.creep.body.length >= 15) break;
                }
                break;
            default:
                this.creep.body.unshift(WORK,CARRY);
                break;
        }

    }

    getNextCreep() {

        if (this.minerWork < this.sources.length*5 && this.runners.length >= this.miners.length) {
            this.creep.memory.role = 'miner';
        } else if (this.runners.length < this.sources.length*this.runnerFactor) {
            this.creep.memory.role = 'runner';
        } else if (this.builders.length < this.maxBuilders) {
            this.creep.memory.role = 'builder';
        } else if (this.repairs.length < this.maxRepairs) {
            this.creep.memory.role = 'repair';
        }

        if (this.creep.memory.role) this.buildCreep();

    }

    updateSources() {

        for (let source of this.self.room.find(FIND_SOURCES)) {

            let miners = _.filter(Game.creeps, creep => (creep.memory.source == source.id && creep.memory.role === 'miner'));
            this.sources.push({
                id: source.id,
                maxRunners: this.runnerFactor,
                runners: _.filter(Game.creeps, creep => (creep.memory.source == source.id && creep.memory.role === 'runner')).length,
                maxMinerWORK: 5,
                miners: _.reduce(miners, (total, curr) => total + curr.body.filter((part) => part.type === WORK).length,0)
            });
        }
    }

    run() {
        this.updateSources();
        if (!this.self.spawning) {
            this.getNextCreep();
            if (this.creep.name) this.spawn();
        }
    }
    
    spawn() {
        if (this.creep.role === 'miner' && this.creep.body.length < 2) {
            console.log('Trying to spawn weird miner');
            return;
        }

        console.log(`${this.miners.length} miners, ${this.runners.length} runners, ${this.builders.length} builders, ${this.repairs.length} repairs`);
        let spawn = this.self.spawnCreep(this.creep.body, this.creep.name, {memory: this.creep.memory});
        if (spawn === 0) console.log(`Spawning Creep: ${this.creep.name}`);
        else console.log(spawn);
    }
};

module.exports = StructSpawn;