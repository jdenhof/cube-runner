export type ReduceCallbackFn<T> = (previousValue: T, currentValue: T, currentIndex: number, array: T[]) => T;
export type Vector3 = [number, number, number];
export type Vector2 = [number, number];
export type Vector = Vector2 | Vector3;

export const focalLength = 100;

export function zeros(length: number): 0[] {
    return Array.from<0>({length}).fill(0);
}

export function seperateComponents(vertices : number[][]): number[][] {
    if (!vertices[0]) { return [] }
    return Array.from<number[]>({length: vertices[0].length}).map(
        (_, idx) => vertices.map(v => v[idx] ?? NaN)
    );
}

export function reduce_row_wise<T>(callbackFn: ReduceCallbackFn<T>) {
    return (vectors: T[]) => {
        if (!vectors[0]) { return null }
        if (vectors.length === 1) {
            return vectors.reduce(callbackFn)
        }
        return vectors.slice(1).reduce(callbackFn, vectors[0]);
    }
}

export function elementWiseMinMax(numbers: number[]) {
    return { min: Math.min(...numbers), max: Math.max(...numbers)}
}

export function rowWiseMinMax<T extends number[]>(vectors: T[]) {
    const components = seperateComponents(vectors);
    return components.map(elementWiseMinMax);
}

export function mapNumbersToVectors<T extends number[]>(vectors: (T | number)[]): T[] {
    const degree = Math.max(...vectors.map(v => Array.isArray(v) ? v.length : 0));
    return vectors.map(v => Array.isArray(v) ? v : Array.from<number>({length: degree}).fill(v) as T);
}

export function add<T extends number[]>(...elements: (T | number)[]): T {
    const vectors = mapNumbersToVectors(elements);
    const apply_element_wise_add = reduce_row_wise<T>((acc, vector) => vector.map((e, i) => (acc[i] ?? NaN) + e ) as T);
    const result = apply_element_wise_add(vectors);
    if (result === null) {
        throw new Error(`Null after addition ${elements}`)
    }
    return result;
}

export function sub<T extends number[]>(...elements: (T | number)[]): T {
    const vectors = mapNumbersToVectors(elements);
    const apply_element_wise_add = reduce_row_wise<T>((acc, vector) => vector.map((e, i) => (acc[i] ?? NaN) - e) as T);
    const result = apply_element_wise_add(vectors);
    if (result === null) {
        throw new Error(`Null after subtraction ${elements}`)
    }
    return result;
}

export function mult<T extends number[]>(...elements: (T | number)[]): T {
    const vectors = mapNumbersToVectors(elements);
    const apply_element_wise_add = reduce_row_wise<T>((acc, vector) => vector.map((e, i) => (acc[i] ?? NaN) * e) as T);
    const result = apply_element_wise_add(vectors);
    if (result === null) {
        throw new Error(`Null after multiplication ${elements}`)
    }
    return result;
}

export function div<T extends number[]>(...elements: (T | number)[]): T {
    const vectors = mapNumbersToVectors(elements);
    const apply_element_wise_add = reduce_row_wise<T>((acc, vector) => vector.map((e, i) => (acc[i] ?? NaN) / e) as T);
    const result = apply_element_wise_add(vectors);
    if (result === null) {
        throw new Error(`Null after division ${elements}`)
    }
    return result;
}

export function norm<T extends number[]>(vector: T) {
    return Math.sqrt([...vector].map(e => Math.pow(e, 2)).reduce((acc, curr) => curr + acc, 0))
}

export function normalize<T extends number[]>(pos: T): T {
    const _norm = norm(pos);
    if (_norm < 1e-6) return zeros(pos.length) as T
    return div(pos, _norm)
}

export function dot<T extends Vector>(v1: T, v2: T): number {
    return mult(v1, v2).reduce((acc, curr) => acc + curr, 0);
}

export function cross(v1: Vector3, v2: Vector3): Vector3 {
    const [x1, y1, z1] = v1;
    const [x2, y2, z2] = v2;
    return [(y1*z2) - (z1*y2), (z1*x2) - (x1*z2), (x1*y2) - (y1*x2)]
}

export function rotatePoint(point: Vector3, thetaX: number, thetaY: number, origin: Vector3 = [0, 0, 0]): Vector3 {

    let x = point[0] * Math.cos(thetaY) - point[2] * Math.sin(thetaY);
    let z = point[0] * Math.sin(thetaY) + point[2] * Math.cos(thetaY);
    let y = point[1] * Math.cos(thetaX) - z * Math.sin(thetaX);
    z = point[1] * Math.sin(thetaX) + z * Math.cos(thetaX);
    return [ x, y, z ];
}

export function project3D(point: Vector3): Vector2 {
    const scale = focalLength / (focalLength + point[2]);
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;

    return [
        point[0] * scale + canvas.width / 2,
        point[1] * scale + canvas.height / 2
    ];
}