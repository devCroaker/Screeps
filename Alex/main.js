const StructSpawn = require('struct.spawn');
const StructTower = require('struct.tower');

const Screep = require('class.creep');
const Runner = require('role.runner');
const Miner = require('role.miner');
const Builder = require('role.builder');
const Repair = require('role.repair');
const Upgrader = require('role.upgrader');

const Scout = require('role.scout');
const linkManager = require('role.linkManager');

module.exports.loop = () => {
    
    // For Each Spawn
    for (let spawnId in Game.spawns) {
        let spawn = new StructSpawn(Game.spawns[spawnId]);
        spawn.run();


        for (let flag in Game.flags) {

            let scouts = _.filter(Game.creeps, (creep) => creep.memory.role === 'scout');
            flag = Game.flags[flag];
    
            if (flag.color === COLOR_WHITE) {
                if (_.filter(scouts, (creep) => creep.memory.flag === flag.name).length < 1) {

                    spawn = Game.spawns[spawnId];

                    if (!spawn.spawning && spawn.store.getUsedCapacity(RESOURCE_ENERGY) > 50) {
                        spawn.spawnCreep([MOVE], 'scout'+Game.time.toString(),{
                            memory: {
                                role: 'scout',
                                flag: flag.name,
                                spawn: spawn.name
                            }
                        });
                    }           
                }
            }
    
        }

    }

    // For each room
    for (let room in Game.rooms) {
        // For each Tower in room
        let towers = Game.rooms[room].find(FIND_MY_STRUCTURES, {
            filter: (struct) => {
                return struct.structureType === STRUCTURE_TOWER;
            }
        });
        for (let tower of towers) {
            tower = new StructTower(tower);
            tower.run();
        }
        
    }

    // For Each Creep
    for (let name in Memory.creeps) {

        // Delete Creeps from memory if they are dead
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        } else {
            // Run the Creeps routine
            let creep = Game.creeps[name];
            if(creep.memory.role == 'miner') {
                creep = new Miner(creep);
            } else if(creep.memory.role == 'runner') {
                creep = new Runner(creep);
            } else if(creep.memory.role == 'builder') {
                creep = new Builder(creep);
            } else if(creep.memory.role == 'repair') {
                creep = new Repair(creep);
            } else if(creep.memory.role == 'upgrader') {
                creep = new Upgrader(creep);
            } else if(creep.memory.role == 'scout') {
                creep = new Scout(creep);
            } else if(creep.memory.role == 'linkManager') {
                creep = new linkManager(creep);
            } else {
                creep = new Screep(creep);
            }
            creep.run();
        }
    }

}