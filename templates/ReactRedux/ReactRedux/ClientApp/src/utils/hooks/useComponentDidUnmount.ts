import { useRef, useEffect, MutableRefObject } from "react";

export function useComponentDidUnmount(): MutableRefObject<boolean> {
    const unmounted = useRef(false);
    useEffect(() => {
        return () => { unmounted.current = true }
    }, []);

    return unmounted;
}
