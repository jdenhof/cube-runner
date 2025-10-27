import { add, rotatePoint, Vector3 } from "calc";
import { GameObject } from "gameObject";
import Registry from "registry";
import PolyRegistryImpl, { PolyRegistry } from "polyRegistry";

interface RenderObject {
    typeId: string;
    uuid: string;
    vertices: Vector3[];
}

class RenderEngine extends Registry<RenderObject> {
    polyRegistry: PolyRegistry
    constructor(polyRegistry: PolyRegistry) {
        super();
        this.polyRegistry = polyRegistry;
    }
    
    public getPolyhedronVertices(obj: GameObject): Vector3[] {
        const poly = this.polyRegistry.get(obj.typeId);
        return poly.getRelativeVertices(obj).map(vertex => {
            const rotated = rotatePoint(vertex, obj.thetaX, obj.thetaY, obj.position);
            return add(obj.position, rotated);
        });
    }

    public renderObject(obj: GameObject) {
        const poly = this.polyRegistry.get(obj.typeId);
        this.register({
            typeId: poly.uuid,
            uuid: obj.uuid,
            vertices: this.getPolyhedronVertices(obj)
        });
    }

    public render(...objs: GameObject[]) {
        objs.forEach(this.renderObject);
    }
}




const _RenderEngine: RenderEngine = new RenderEngine(PolyRegistryImpl);
export default _RenderEngine;
