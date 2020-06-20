import { useQueryParam, QueryParamConfig } from "use-query-params";
import { Filter } from "@devexpress/dx-react-grid";

export const useQueryFilters = (): [Filter[], (newValue: NewValueType<Filter[]>, updateType?: "replace" | "push" | "replaceIn" | "pushIn" | undefined) => void] => {
    return useQueryParam<Filter[]>('filter', queryParamConfig);
}

const queryParamConfig: QueryParamConfig<Filter[], Filter[]> = {
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
};

declare type NewValueType<D> = D | ((latestValue: D) => D);