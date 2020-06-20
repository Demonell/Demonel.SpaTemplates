import { useQueryParam, QueryParamConfig } from "use-query-params";
import { Filter } from "@devexpress/dx-react-grid";
import { useMemo } from "react";

export const useQueryFilters = (): [Filter[], (newValue: NewValueType<Filter[]>, updateType?: "replace" | "push" | "replaceIn" | "pushIn" | undefined) => void] => {
    const queryParamConfig: QueryParamConfig<Filter[], Filter[]> = useMemo(() => ({
        encode: filter => filter.map(f => f.columnName + '::' + f.value),
        decode: filter => {
            if (!filter) {
                return [];
            }

            if (!Array.isArray(filter)) {
                filter = [filter];
            }

            return [...filter].map<Filter>(f => ({
                columnName: f!.split('::')[0],
                value: f!.split('::')[1]
            }));
        }
    }), []);

    return useQueryParam<Filter[]>('filter', queryParamConfig);
}

declare type NewValueType<D> = D | ((latestValue: D) => D);