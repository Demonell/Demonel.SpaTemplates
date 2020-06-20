import { useQueryParam, QueryParamConfig } from "use-query-params";
import { Sorting } from "@devexpress/dx-react-grid";
import { useMemo } from "react";

export const useQuerySortings = (): [Sorting[], (newValue: NewValueType<Sorting[]>, updateType?: "replace" | "push" | "replaceIn" | "pushIn" | undefined) => void] => {
    const queryParamConfig: QueryParamConfig<Sorting[], Sorting[]> = useMemo(() => ({
        encode: sorts => sorts.map(s => (s.direction === 'asc' ? 'A' : 'D') + s.columnName).join(','),
        decode: sorts => sorts
            ? sorts.toString().split(',').map<Sorting>(s => ({
                direction: s.charAt(0) === 'A' ? 'asc' : 'desc',
                columnName: s.substring(1, s.length)
            }))
            : []
    }), []);

    return useQueryParam<Sorting[]>('sorts', queryParamConfig);
};

declare type NewValueType<D> = D | ((latestValue: D) => D);