import React, { useEffect, useMemo, useCallback, useState } from "react";
import { Paper, Grid, makeStyles, IconButton, Menu, MenuItem, Checkbox, ListItemText } from "@material-ui/core";
import { VirtualTableState, createRowCache, Sorting, Column, SortingState, Filter, FilteringState, IntegratedSorting, IntegratedFiltering } from "@devexpress/dx-react-grid";
import { Grid as GridTable, VirtualTable, TableHeaderRow, Table, TableFilterRow, TableColumnVisibility, DragDropProvider, TableColumnReordering } from "@devexpress/dx-react-grid-material-ui";
import { useQueryFilters, useQuerySortings, usePartialReducer, useComponentDidUnmount, useChangeTracker } from "../../../utils/hooks";
import { httpAuth, showErrorSnack, showErrorSnackByResponse } from "../../../clients/apiHelper";
import { FlexGrow } from "../FlexGrow";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { selectTableSettingOfCurrentPathname, toggleColumnVisibility, initTableSettings, updateColumnOrder, TableSetting } from "./TableSettings/duck";
import { VisibilityOff as VisibilityOffIcon } from '@material-ui/icons';
import { LoadingButton } from "..";
import { DateRange } from "@material-ui/pickers";

const VIRTUAL_PAGE_SIZE = 50;
const FILTER_DELAY = 600;
const MAX_ROWS = 50000;

interface TableUniversalState<T> {
    rows: T[];
    loading: boolean;
    totalCount: number;
    requestedSkip: number;
    skip: number;
    take: number;
    filters: Filter[];
    refreshCounter: number;
    columnVisibilityMenuAnchorEl: null | HTMLElement;
}

const initialState: TableUniversalState<any> = {
    rows: [],
    loading: false,
    totalCount: 0,
    requestedSkip: 0,
    skip: 0,
    take: VIRTUAL_PAGE_SIZE * 2,
    filters: [],
    refreshCounter: 0,
    columnVisibilityMenuAnchorEl: null
};

export interface UniversalColumn<T> {
    name: string;
    title?: string;
    width?: number | string;
    align?: 'left' | 'right' | 'center';
    wordWrapEnabled?: boolean;
    hiddenByDefault?: boolean;
    filteringEnabled?: boolean;
    sortingEnabled?: boolean;
    getCellValue?: (row: T, filters: Filter[]) => any;
    FilterCellComponent?: React.FunctionComponent<TableFilterRow.CellProps>;
    Provider?: (columnaName: string) => React.ReactElement;
    DateRangeFilter?: (dateRange: DateRange, onDateSelected: (dateRange: DateRange) => void) => React.ReactElement;
}

export interface TableUniversalProps<R, T> {
    baseUrl?: string;
    data?: T[];
    getItems: (response: R) => T[];
    getTotalCount: (response: R) => number;
    getRowId: (row: T) => React.ReactText;
    onRowClick?: (row: T) => void;
    columns: UniversalColumn<T>[];
    defaultColumnOrder?: string[];
    topRowRight?: React.ReactNode;
    topRowLeft?: React.ReactNode;
    enableStateFiltersAndSorts?: boolean;
}

let filterLoadTimeout = 0;
export function TableUniversal<R, T>(props: React.PropsWithChildren<TableUniversalProps<R, T>>) {
    const { baseUrl, data, enableStateFiltersAndSorts, getItems, getTotalCount, getRowId, onRowClick, columns,
        defaultColumnOrder, topRowRight, topRowLeft, children } = props;

    const classes = useStyles();
    const dispatch = useDispatch();
    const location = useLocation();
    const unmounted = useComponentDidUnmount();

    const [sortsQuery, setSortsQuery] = useQuerySortings();
    const [sortsState, setSortsState] = useState<Sorting[]>([]);
    const [sorts, setSorts] = enableStateFiltersAndSorts
        ? [sortsState, setSortsState]
        : [sortsQuery, setSortsQuery];

    const [filtersQuery, setFiltersQuery] = useQueryFilters();
    const [filtersState, setFiltersState] = useState<Filter[]>([]);
    const [filtersApplied, setFiltersApplied] = enableStateFiltersAndSorts
        ? [filtersState, setFiltersState]
        : [filtersQuery, setFiltersQuery];

    const [state, setState] = usePartialReducer({ ...initialState, filters: filtersApplied });
    const { rows, loading, totalCount, requestedSkip, skip, take, filters, refreshCounter,
        columnVisibilityMenuAnchorEl } = state;

    const cache = useMemo(() => createRowCache(VIRTUAL_PAGE_SIZE), []);
    const virtualTableRef = React.useRef<typeof VirtualTable>();

    const tableSettings = useSelector(selectTableSettingOfCurrentPathname)
        ?? getDefaultTableSetting(location.pathname, columns, defaultColumnOrder);

    useEffect(() => {
        dispatch(initTableSettings(getDefaultTableSetting(location.pathname, columns, defaultColumnOrder)));
    }, [dispatch, location.pathname, columns, defaultColumnOrder])

    const requestedSkipChanged = useChangeTracker(requestedSkip);
    const takeChanged = useChangeTracker(take);
    const sortsChanged = useChangeTracker(sorts);
    const filtersAppliedChanged = useChangeTracker(filtersApplied);
    const refreshCounterChanged = useChangeTracker(refreshCounter);
    useEffect(() => {
        const loadItems = () => {
            if (!baseUrl) {
                return;
            }

            const cached = cache.getRows(requestedSkip, take);
            if (cached.length === take) {
                setState({ skip: requestedSkip, rows: cache.getRows(requestedSkip, take) });
            } else {
                setState({ loading: true });
                const url = constructFetchUrl(baseUrl, sorts, filtersApplied, requestedSkip, take);
                httpAuth.fetch(url,
                    {
                        method: 'GET',
                        headers: { "Accept": "application/json" }
                    })
                    .then(response => {
                        if (!unmounted) {
                            if (response.ok) {
                                (response.json() as Promise<R>)
                                    .then(data => {
                                        cache.setRows(requestedSkip, getItems(data));
                                        const total = getTotalCount(data);
                                        setState({
                                            skip: requestedSkip,
                                            rows: cache.getRows(requestedSkip, take),
                                            totalCount: total < MAX_ROWS ? total : MAX_ROWS,
                                            loading: false
                                        });
                                    });
                            } else {
                                showErrorSnackByResponse(response);
                            }
                        }
                    })
                    .catch(error => {
                        setState({ loading: false });
                        showErrorSnack(JSON.stringify(error));
                    });
            }
        }

        if (sortsChanged || filtersAppliedChanged || refreshCounterChanged) {
            cache.invalidate();

            if (requestedSkip === 0) {
                loadItems();
            } else {
                virtualTableRef.current?.scrollToRow(VirtualTable.TOP_POSITION as any);
            }
        } else if (requestedSkipChanged || takeChanged) {
            loadItems();
        }

        // updated local filters if applied filters changed (as an example, user moved browser history)
        if (filtersAppliedChanged && !equalFilters(filtersApplied, filters)) {
            setState({ filters: filtersApplied });
        }
    });

    const handleColumnsOrderChange = useCallback((order: string[]) => {
        dispatch(updateColumnOrder(order))
    }, [dispatch]);

    const customFilterCell = useCallback((props: React.PropsWithChildren<TableFilterRow.CellProps>) => {
        const column = columns.filter(c => c.name === props.column.name)[0];
        const FilterCellComponent = column?.FilterCellComponent;
        return FilterCellComponent
            ? <FilterCellComponent {...props} />
            : <TableFilterRow.Cell {...props} />
    }, [columns]);

    const tableRow = useCallback((props: Table.DataRowProps) => {
        const row = props.row as T;
        return (
            <Table.Row
                {...props}
                onClick={() => {
                    const selectedText = getSelection()?.toString();
                    if (!selectedText) {
                        onRowClick?.(row);
                    }
                }}
                className={classes.tableRow}
            />
        )
    }, [onRowClick, classes]);

    const updateFilters = (filters: Filter[]) => {
        setState({ filters });
        window.clearTimeout(filterLoadTimeout);
        filterLoadTimeout = window.setTimeout(() => {
            if (!unmounted) {
                setFiltersApplied(filters);
            }
        }, FILTER_DELAY);
    };

    const tableColumns = useMemo(() => mapToColumns(columns, filtersApplied), [columns, filtersApplied]);

    const [columnExtensions, sortingColumnExtensions, filteringColumnExtensions, providers] = useMemo(() => {
        const columnExtensions = mapToColumnExtensions(columns);
        const sortingColumnExtensions = mapToSortingColumnExtensions(columns);
        const filteringColumnExtensions = mapToFilteringColumnExtensions(columns);
        const providers = mapToProviders(columns);
        return [columnExtensions, sortingColumnExtensions, filteringColumnExtensions, providers];
    }, [columns]);

    const dateRangeFilters = columns
        .filter(column => column.DateRangeFilter !== undefined)
        .map(column => {
            const dateRange = getDateRangeFromFilter(column.name, filtersApplied);
            const onDateSelected = (dateRange: DateRange) => {
                const newFilters = setDateRangeFilter(dateRange, column.name, filtersApplied);
                setFiltersApplied(newFilters);
            };
            const dateRangeFilter = column.DateRangeFilter!(dateRange, onDateSelected);
            return React.cloneElement(dateRangeFilter, { key: column.name });
        });

    return (
        <>
            <Grid container direction='row' justify='flex-end' alignItems='flex-end'>
                {topRowLeft}
                <FlexGrow />
                {topRowRight}
                {dateRangeFilters}
                <LoadingButton
                    color='primary'
                    className='m-2'
                    onClick={() => setState({ refreshCounter: refreshCounter + 1 })}
                    isLoading={loading}
                >
                    Обновить
                </LoadingButton>
                <IconButton
                    aria-label="column-chooser"
                    size="medium"
                    onClick={event => setState({ columnVisibilityMenuAnchorEl: event.currentTarget })}
                >
                    <VisibilityOffIcon fontSize="inherit" />
                </IconButton>
                <Menu
                    id="simple-menu"
                    anchorEl={columnVisibilityMenuAnchorEl}
                    open={Boolean(columnVisibilityMenuAnchorEl)}
                    onClose={() => setState({ columnVisibilityMenuAnchorEl: null })}
                    transitionDuration={100}
                >
                    {columns.map((col) => (
                        <MenuItem
                            key={col.name}
                            value={col.name}
                            onClick={() => dispatch(toggleColumnVisibility(location.pathname, col.name))}
                        >
                            <Checkbox checked={tableSettings.hiddenColumns.indexOf(col.name) === -1} className='m-n1' />
                            <ListItemText primary={col.title} />
                        </MenuItem>
                    ))}
                </Menu>
            </Grid>
            <Paper>
                <GridTable
                    rows={data || rows}
                    columns={tableColumns}
                    getRowId={getRowId}
                >
                    {children}
                    {providers}

                    <DragDropProvider />
                    <VirtualTableState
                        infiniteScrolling={false}
                        loading={loading}
                        totalRowCount={data ? data.length : totalCount}
                        pageSize={VIRTUAL_PAGE_SIZE}
                        skip={skip}
                        getRows={(newSkip, newTake) => {
                            if (newSkip !== requestedSkip || newTake !== take) {
                                setState({ requestedSkip: newSkip, take: newTake })
                            }
                        }}
                    />
                    <SortingState
                        sorting={sorts}
                        onSortingChange={setSorts}
                        columnExtensions={sortingColumnExtensions}
                    />
                    <FilteringState
                        filters={filters}
                        onFiltersChange={updateFilters}
                        columnExtensions={filteringColumnExtensions}
                    />

                    {data && <IntegratedFiltering />}
                    {data && <IntegratedSorting />}

                    <VirtualTable
                        ref={virtualTableRef as any}
                        rowComponent={tableRow}
                        columnExtensions={columnExtensions}
                        estimatedRowHeight={48}
                    />
                    <TableHeaderRow showSortingControls />
                    <TableFilterRow
                        cellComponent={customFilterCell}
                    />

                    <TableColumnReordering
                        order={tableSettings.columnOrder}
                        onOrderChange={handleColumnsOrderChange}
                    />

                    <TableColumnVisibility
                        hiddenColumnNames={tableSettings.hiddenColumns}
                    />
                </GridTable>
            </Paper>
        </>
    );
};

const useStyles = makeStyles({
    tableRow: {
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
        }
    }
});

function getDefaultTableSetting<T>(pathname: string, columns: UniversalColumn<T>[], defaultColumnOrder: string[] | undefined): TableSetting {
    return {
        tableUrl: pathname,
        hiddenColumns: mapToDefaultHiddenColumns(columns) || [],
        columnOrder: defaultColumnOrder || columns.map(c => c.name)
    };
}

const constructFetchUrl = (baseUrl: string, sorts: Sorting[], filters: Filter[], skip: number, take: number): string => {
    let url = baseUrl.replace(/[?]$/, "") + '?';
    url += "skip=" + encodeURIComponent("" + skip) + "&";
    url += "take=" + encodeURIComponent("" + take) + "&";
    if (sorts.length > 0) {
        const sortsQuery = sorts
            .map(s =>
                (s.direction === 'asc' ? '+' : '-')
                + s.columnName.charAt(0).toUpperCase()
                + s.columnName.slice(1))
            .join(',');
        url += "sort=" + encodeURIComponent("" + sortsQuery) + "&";
    }
    for (let i = 0; i < filters.length; i++) {
        const filterName = filters[i].columnName.charAt(0).toUpperCase() + filters[i].columnName.slice(1);
        const filterValue = filters[i].value;
        url += filterName + '=' + encodeURIComponent("" + filterValue) + "&";
    }
    url = url.replace(/[?&]$/, "");
    return url;
}

const getDateRangeFromFilter = (columnName: string, filters: Filter[]): DateRange => {
    const dateRange: DateRange = [null, null];
    for (let i = 0; i < 2; i++) {
        const filterName = columnName + (i === 0 ? '.from' : '.to');
        const filter = filters.filter(f => f.columnName === filterName)?.[0];
        if (filter) {
            dateRange[i] = new Date(filter.value!);
        }
    }

    return dateRange;
};

const setDateRangeFilter = (dateRange: DateRange, columnName: string, filters: Filter[]): Filter[] => {
    dateRange.forEach((date, index) => {
        const filterName = columnName + (index === 0 ? '.from' : '.to');
        if (date) {
            const filter = filters.filter(f => f.columnName === filterName)?.[0];
            if (filter) {
                filter.value = date.toISOString();
            } else {
                filters.push({
                    columnName: filterName,
                    value: date.toISOString()
                });
            }
        } else {
            filters = filters.filter(f => f.columnName !== filterName);
        }
    });

    return filters;
};

function mapToColumns<T>(columns: UniversalColumn<T>[], filters: Filter[]): Column[] {
    return columns.map(column => ({
        name: column.name,
        title: column.title,
        getCellValue: column.getCellValue ? (row: T) => column.getCellValue!(row, filters) : undefined
    }) as Column);
}

function mapToColumnExtensions<T>(columns: UniversalColumn<T>[]): Table.ColumnExtension[] {
    return columns
        .filter(column => column.align || column.width || column.wordWrapEnabled)
        .map(column => ({
            columnName: column.name,
            align: column.align,
            width: column.width,
            wordWrapEnabled: column.wordWrapEnabled
        }) as Table.ColumnExtension);
}

function mapToSortingColumnExtensions<T>(columns: UniversalColumn<T>[]): SortingState.ColumnExtension[] {
    return columns
        .filter(column => column.sortingEnabled !== undefined)
        .map(column => ({
            columnName: column.name,
            sortingEnabled: column.sortingEnabled
        }) as SortingState.ColumnExtension);
}

function mapToFilteringColumnExtensions<T>(columns: UniversalColumn<T>[]): FilteringState.ColumnExtension[] {
    return columns
        .filter(column => column.filteringEnabled !== undefined)
        .map(column => ({
            columnName: column.name,
            filteringEnabled: column.filteringEnabled
        }) as FilteringState.ColumnExtension);
}

function mapToDefaultHiddenColumns<T>(columns: UniversalColumn<T>[]): string[] {
    return columns
        .filter(column => column.hiddenByDefault)
        .map(column => column.name);
}

function mapToProviders<T>(columns: UniversalColumn<T>[]): React.ReactElement[] {
    return columns.filter(column => column.Provider).map(column => {
        const provider = column.Provider!(column.name);
        return React.cloneElement(provider, { key: column.name });
    })
}

const equalFilters = (filters1: Filter[], filters2: Filter[]): boolean => {
    filters1 = filters1.map(f => ({ ...f, operation: undefined }));
    filters2 = filters2.map(f => ({ ...f, operation: undefined }));
    return JSON.stringify(filters1) === JSON.stringify(filters2);
}