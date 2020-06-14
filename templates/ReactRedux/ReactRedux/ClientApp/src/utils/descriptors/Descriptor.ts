export interface Descriptor<T> {
    value: T;
    description: string;
}

export function getDescription<T>(value: T, descriptors: Descriptor<T>[], except?: T[]) {
    return descriptors
        .filter(e => !except?.some(x => x === e.value) && e.value === value)[0]?.description || '';
}