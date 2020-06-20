import React, { useEffect, useMemo, useCallback, useState } from "react";
import { Paper, Grid, makeStyles, IconButton, Menu, MenuItem, Checkbox, ListItemText } from "@material-ui/core";
import { VirtualTableState, createRowCache, Sorting, Column, SortingState, Filter, FilteringState, IntegratedSorting, IntegratedFiltering } from "@devexpress/dx-react-grid";
import { Grid as GridTable, VirtualTable, TableHeaderRow, Table, TableFilterRow, TableColumnVisibility, DragDropProvider, TableColumnReordering } from "@devexpress/dx-react-grid-material-ui";
import { usePrevious, useQueryFilters, useQuerySortings, usePartialReducer } from "../../../utils/hooks";
import { CustomFilterCell, CustomFilterCellExtension } from ".";
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
    filtersScrolledToTop: boolean;
    forceRefresh: boolean;
}

const initialState: TableUniversalState<any> = {
    rows: [],
    loading: false,
    totalCount: 0,
    requestedSkip: 0,
    skip: 0,
    take: VIRTUAL_PAGE_SIZE * 2,
    filters: [],
    filtersScrolledToTop: false,
    forceRefresh: false
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
    const classes = useStyles();
    const dispatch = useDispatch();

    const [columnVisibilityMenuAnchorEl, setColumnVisibilityMenuAnchorEl] = React.useState<null | HTMLElement>(null);

    const { baseUrl, data, enableStateFiltersAndSorts, getItems, getTotalCount, getRowId, onRowClick, columns,
        defaultColumnOrder, topRowRight, topRowLeft, children } = props;

    const location = useLocation();

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
    const { rows, loading, totalCount, requestedSkip, skip, take, filters, filtersScrolledToTop, forceRefresh } = state;

    const cache = useMemo(() => createRowCache(VIRTUAL_PAGE_SIZE), []);

    const virtualTableRef = React.useRef<typeof VirtualTable>();
    const scrollToTop = useCallback(() => {
        virtualTableRef.current?.scrollToRow(VirtualTable.TOP_POSITION as any);
    }, [virtualTableRef]);

    console.log(` - render table (reqSkip: ${requestedSkip}, skip: ${skip}, take: ${take})`);

    useEffect(() => {
        dispatch(initTableSettings(getDefaultTableSetting(location.pathname, columns, defaultColumnOrder)));
    }, [dispatch, location.pathname, columns, defaultColumnOrder])

    const tableSettings = useSelector(selectTableSettingOfCurrentPathname)
        ?? getDefaultTableSetting(location.pathname, columns, defaultColumnOrder);
    // useEffect(() => console.log('tableSettings changed'), [tableSettings]);

    const filtersJson = JSON.stringify(filters);
    const filtersUrlJson = JSON.stringify(filtersApplied);
    const filtersUrlJsonPrev = usePrevious(filtersUrlJson);
    const sortsJson = JSON.stringify(sorts);
    const sortsJsonPrev = usePrevious(sortsJson);
    const requestedSkipPrev = usePrevious(requestedSkip);
    const takePrev = usePrevious(take);
    useEffect(() => {
        const loadData = () => {
            if (!baseUrl) {
                return;
            }

            const cached = cache.getRows(requestedSkip, take);
            if (cached.length === take) {
                // console.log(`from cache... (skip: ${requestedSkip}, take: ${take})`);
                setState({ skip: requestedSkip, rows: cache.getRows(requestedSkip, take) });
            } else {
                // console.log(`from fetch... (skip: ${requestedSkip}, take: ${take})`);
                loadItems(baseUrl, sorts, filtersApplied, requestedSkip, take);
            }
        };

        if (filtersUrlJson !== filtersUrlJsonPrev && filtersJson !== filtersUrlJson) {
            // console.log('~~ update filters');
            setState({ filters: filtersApplied });
        }

        if (sortsJson !== sortsJsonPrev || filtersUrlJson !== filtersUrlJsonPrev) {
            // console.log('!clear cache!');
            cache.invalidate();
            scrollToTop();
            setState({ requestedSkip: 0, take: VIRTUAL_PAGE_SIZE * 2 });

            if (requestedSkip === 0) {
                loadData();
            }
        } else if (!filtersScrolledToTop && (requestedSkip !== requestedSkipPrev || take !== takePrev)) {
            loadData();
        } else if (forceRefresh) {
            // console.log('force refresh');
            cache.invalidate();
            scrollToTop();
            setState({ forceRefresh: false, requestedSkip: 0, take: VIRTUAL_PAGE_SIZE * 2, rows: [] });
            loadItems(baseUrl, sorts, filtersApplied, 0, VIRTUAL_PAGE_SIZE * 2);
        }
    });

    const loadItems = async (baseUrl: string | undefined, sorts: Sorting[], filters: Filter[], skip: number, take: number) => {
        if (!baseUrl) {
            return;
        }

        setState({ loading: true });
        const url = constructFetchUrl(baseUrl, sorts, filters, skip, take);
        await httpAuth.fetch(url,
            {
                method: 'GET',
                headers: { "Accept": "application/json" }
            })
            .then(response => {
                if (response.ok) {
                    (response.json() as Promise<R>)
                        .then(data => {
                            // console.log(`set new items to cache. (skip: ${skip}, take: ${take})`);
                            cache.setRows(skip, getItems(data));
                            const total = getTotalCount(data);
                            setState({
                                skip: skip,
                                rows: cache.getRows(skip, take),
                                totalCount: total < MAX_ROWS ? total : MAX_ROWS
                            });
                        });
                } else {
                    showErrorSnackByResponse(response);
                }
            })
            .catch(error => showErrorSnack(JSON.stringify(error)))
            .finally(() => {
                setState({ loading: false });
            });
    };

    const updateFilters = (filters: Filter[]) => {
        // console.log('~~ filters have been changed');
        const filtersWithoutOperations = filters.map(f => ({ ...f, operation: undefined }));
        setState({ filters: filtersWithoutOperations, filtersScrolledToTop: true });
        window.clearTimeout(filterLoadTimeout);
        filterLoadTimeout = window.setTimeout(() => {
            setState({ filtersScrolledToTop: false });
            if (JSON.stringify(filtersWithoutOperations) !== filtersUrlJson) {
                // console.log('~~ update filters url');
                setFiltersApplied(filters);
            }
        }, FILTER_DELAY);
    };

    const getRows = (skip: number, take: number) => setState({ requestedSkip: skip, take });

    const tableRow = (props: Table.DataRowProps) => {
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
    };

    const customFilterCell = useCallback((props: React.PropsWithChildren<TableFilterRow.CellProps>) => {
        const filterCellExtensions = mapToCustomFilterCellExtensions(columns);
        return <CustomFilterCell filterCellExtensions={filterCellExtensions || []} {...props} />
    }, [columns]);

    const dateRangeFilters = useMemo(() => {
        return columns
            .filter(column => column.DateRangeFilter !== undefined)
            .map(column => {
                const dateRange = getDateRangeFromFilter(column.name, filtersApplied);
                const onDateSelected = (dateRange: DateRange) => {
                    const newFilters = updateDateRangeFilter(dateRange, column.name, filtersApplied);
                    setFiltersApplied(newFilters);
                };
                const dateRangeFilter = column.DateRangeFilter!(dateRange, onDateSelected);
                return React.cloneElement(dateRangeFilter, { key: 'date-range-filter-' + column.name });
            })
    }, [columns, filtersApplied, setFiltersApplied]);

    const tableColumns = mapToColumns(columns, filtersApplied);
    const columnExtensions = mapToColumnExtensions(columns);
    const sortingColumnExtensions = mapToSortingColumnExtensions(columns);
    const filteringColumnExtensions = mapToFilteringColumnExtensions(columns);

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
                    onClick={() => setState({ forceRefresh: true })}
                    isLoading={loading}
                >
                    Обновить
                </LoadingButton>
                <IconButton
                    aria-label="column-chooser"
                    size="medium"
                    onClick={event => setColumnVisibilityMenuAnchorEl(event.currentTarget)}
                >
                    <VisibilityOffIcon fontSize="inherit" />
                </IconButton>
                <Menu
                    id="simple-menu"
                    anchorEl={columnVisibilityMenuAnchorEl}
                    open={Boolean(columnVisibilityMenuAnchorEl)}
                    onClose={() => setColumnVisibilityMenuAnchorEl(null)}
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
                <GridTable rows={data || rows} columns={tableColumns} getRowId={getRowId}>
                    {children}

                    {columns.filter(column => column.Provider).map(column => {
                        const provider = column.Provider!(column.name);
                        return React.cloneElement(provider, { key: column.name });
                    })}

                    <DragDropProvider />
                    <VirtualTableState
                        infiniteScrolling={false}
                        loading={loading}
                        totalRowCount={filtersScrolledToTop ? 0 : (data ? data.length : totalCount)}
                        pageSize={VIRTUAL_PAGE_SIZE}
                        skip={skip}
                        getRows={getRows}
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
                    <TableFilterRow cellComponent={customFilterCell} />

                    <TableColumnReordering
                        order={tableSettings.columnOrder}
                        onOrderChange={order => dispatch(updateColumnOrder(location.pathname, order))}
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

const updateDateRangeFilter = (dateRange: DateRange, columnName: string, filters: Filter[]): Filter[] => {
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

function mapToCustomFilterCellExtensions<T>(columns: UniversalColumn<T>[]): CustomFilterCellExtension[] {
    return columns
        .filter(column => column.FilterCellComponent)
        .map(column => ({
            columnName: column.name,
            CellComponent: column.FilterCellComponent
        }) as CustomFilterCellExtension);
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