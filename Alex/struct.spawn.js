const Entity = require('class.entity');

class StructSpawn extends Entity {

    constructor(self) {
        super(self);

        this.runnerFactor = 2;
        this.maxBuilders = 2;
        this.maxRepairs = 2;
        this.maxUpgraders = 2;

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
        this._upgraders = _.filter(Game.creeps, creep => creep.memory.role === 'upgrader');
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

    get upgraders() {
        return this._upgraders;
    }

    set upgraders(upgraders) {
        this._upgraders = upgraders;
    }

    buildCreep() {

        this.creep.name = this.creep.memory.role + Game.time.toString();
        this.creep.body.push(MOVE);

        let energy = this.self.room.energyAvailable-50;

        switch(this.creep.memory.role) {
            case 'miner':
                let source = this.sources.find(source => source.miners < source.maxMinerWORK);
                this.creep.memory.source = source.id;

                for (let i = 0; i < Math.floor(energy/100); i++) {
                    if ((source.miners + i) >= source.maxMinerWORK ) break;
                    this.creep.body.unshift(WORK);
                }
                break;
            case 'runner':
                this.creep.memory.source = this.sources.find(source => source.runners < source.maxRunners).id;

                for (let i = 0; i < Math.floor(energy/100); i++) {
                    this.creep.body.unshift(CARRY,MOVE);
                    if (this.creep.body.length >= 15) break;
                }
                break;
            case 'builder':
            case 'repair':
            case 'upgrader':
                for (let i = 0; i < Math.floor(energy/200); i++) {
                    this.creep.body.unshift(WORK,CARRY,MOVE);
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
        } else if (this.upgraders.length < this.maxUpgraders) {
            this.creep.memory.role = 'upgrader';
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
        if (!this.self.spawning) {
            this.updateSources();
            if (this.self.room.energyAvailable >= 650 || (this.self.room.energyAvailable >= 300 && this.self.minersWork < this.sources.length*5)) {
                this.getNextCreep();
                if (this.creep.name) this.spawn();
            }
        }
    }
    
    spawn() {
        if (this.creep.body.length < 2) {
            console.log('Trying to spawn weird creep');
            return;
        }

        console.log(`${this.self.room.storage.store.getUsedCapacity(RESOURCE_ENERGY)} energy stored`)
        console.log(`${this.miners.length} miners, ${this.runners.length} runners, ${this.builders.length} builders, ${this.repairs.length} repairs, ${this.upgraders.length} upgraders`);
        let spawn = this.self.spawnCreep(this.creep.body, this.creep.name, {memory: this.creep.memory});
        if (spawn === 0) console.log(`Spawning Creep: ${this.creep.name}`);
        else console.log(spawn);
    }
};

module.exports = StructSpawn;