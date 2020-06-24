import { useRef, useEffect } from "react";

export function useComponentDidUnmount(): boolean {
    const unmounted = useRef(false);
    useEffect(() => {
        return () => { unmounted.current = true }
    }, []);

    return unmounted.current;
}
