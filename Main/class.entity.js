class Entity {
    
    constructor(self) {
        this._self = self;
        this._memory = this.self.memory;
    }

    get self() {
        return this._self;
    }

    set self(self) {
        this._self = self;
    }

    get memory() {
        return this._memory;
    }

    set memory(memory) {
        this._memory = memory;
    }
}

module.exports = Entity;