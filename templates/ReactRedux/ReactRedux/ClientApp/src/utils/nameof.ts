export type valueOf<T> = T[keyof T];
export function nameOf<T, V extends T[keyof T]>(f: (x: T) => V): string;
export function nameOf(f: (x: any) => any): string {
    var p = new Proxy({}, {
        get: (target, key) => key
    })
    return f(p);
}

export interface I_$<T> {
    nameOf<V extends T[keyof T]>(f: (x: T) => V): valueOf<{ [K in keyof T]: T[K] extends V ? K : never }>;
}

export function _$<T>(obj: T) {
    return {
        nameOf: (f: (x: any) => any) => {
            return nameOf(f);
        }
    } as I_$<T>;
}