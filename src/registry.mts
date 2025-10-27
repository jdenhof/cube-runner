export type RegistryStore<T> = {
    [key: string]: T
}

export default class Registry<T extends {uuid: string}> {
    registry: RegistryStore<T> = {}
    constructor(...items: T[]) {
        items.forEach(this.register);
    }

    public register(item: T) {
        this.registry[item.uuid] = item;
    }

    public unregister(item: T) {
        delete this.registry[item.uuid];
    }

    public find(...uuids: string[]): T[] {
        return uuids.map(uuid => this.registry[uuid]).filter(obj => obj !== undefined);
    }

    public get(uuid: string): T {
        const results = this.find(uuid);
        const result = results[0];
        if (!result) {
            throw new Error(`Type: ${uuid} is not registered.`)
        }
        if (results.length !== 1) {
            throw new Error(`Ambigous uuid: '${uuid}' Qty: ${results.length}`);
        }
        return result;
    }
}