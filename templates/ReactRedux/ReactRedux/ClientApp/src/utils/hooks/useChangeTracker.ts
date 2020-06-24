import { usePrevious } from ".";

export function useChangeTracker<T>(value: T): boolean {
    const valuePrev = usePrevious(value);
    return value !== valuePrev;
}
