import React, { useEffect, useMemo, useCallback, useState } from "react";
import { Paper, Grid, makeStyles, IconButton, Menu, MenuItem, Checkbox, ListItemText } from "@material-ui/core";
import { VirtualTableState, createRowCache, Sorting, Column, SortingState, Filter, FilteringState, IntegratedSorting, IntegratedFiltering } from "@devexpress/dx-react-grid";
import { Grid as GridTable, VirtualTable, TableHeaderRow, Table, TableFilterRow, TableColumnVisibility, DragDropProvider, TableColumnReordering } from "@devexpress/dx-react-grid-material-ui";
import { useQueryFilters, useQuerySortings, usePartialReducer, useComponentDidUnmount, useChangeTracker } from "../../../utils/hooks";
import { httpAuth, showErrorSnack, showErrorSnackByResponse } from "../../../clients/apiHelper";
import { FlexGrow } from "../FlexGrow";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, Link } from "react-router-dom";
import { selectTableSettingOfCurrentPathname, toggleColumnVisibility, initTableSettings, updateColumnOrder, TableSetting } from "./TableSettings/duck";
import { VisibilityOff as VisibilityOffIcon } from '@material-ui/icons';
import { LineClamperLineCount, LoadingButton } from "..";
import { DateRange } from "@material-ui/pickers";
import clsx from 'clsx';
import { LineClamper } from "../LineClamper";

const VIRTUAL_PAGE_SIZE = 50;
const FILTER_DELAY = 600;
const MAX_ROWS = 50000;

const SKIP_PROPERTY_NAME_IN_REQUEST = 'skip';
const TAKE_PROPERTY_NAME_IN_REQUEST = 'take';
const SORT_PROPERTY_NAME_IN_REQUEST = 'sort';
const DATE_FROM_PROPERTY_NAME_IN_REQUEST = 'from';
const DATE_TO_PROPERTY_NAME_IN_REQUEST = 'to';

const ROW_PADDING = 16;
const ROW_TEXT_LINE_HEIGHT = 16;

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
    nameForSort?: string;
    title?: string;
    width?: number | string;
    align?: 'left' | 'right' | 'center';
    wordWrapLineCount?: LineClamperLineCount;
    hiddenByDefault?: boolean;
    filteringEnabled?: boolean;
    sortingEnabled?: boolean;
    getCellValue?: (row: T, filters: Filter[]) => any;
    FilterCellComponent?: React.FunctionComponent<TableFilterRow.CellProps>;
    Provider?: (columnaName: string) => React.ReactElement;
    DateRangeFilter?: (dateRange: DateRange<Date>, onDateSelected: (dateRange: DateRange<Date>) => void) => React.ReactElement;
}

export interface SortColumnRename {
    originColumnName: string;
    sortColumnName: string;
}

export interface TableUniversalProps<R, T> {
    baseUrl?: string;
    data?: T[];
    getItems: (response: R) => T[];
    getTotalCount: (response: R) => number;
    getRowId: (row: T) => React.ReactText;
    getRowLink?: (row: T) => string;
    onRowClick?: (row: T) => void;
    columns: UniversalColumn<T>[];
    defaultColumnOrder?: string[];
    topRowRight?: React.ReactNode;
    topRowLeft?: React.ReactNode;
    enableStateFiltersAndSorts?: boolean;
}

let filterLoadTimeout = 0;
export function TableUniversal<R, T>({
    baseUrl, data, enableStateFiltersAndSorts, getItems, getTotalCount, getRowId, getRowLink, onRowClick, columns,
    defaultColumnOrder, topRowRight, topRowLeft, children }: React.PropsWithChildren<TableUniversalProps<R, T>>) {

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

    const [columnExtensions, sortingColumnExtensions, filteringColumnExtensions, sortColumnRenames, providers, rowHeight] =
        useMemo(() => {
            const columnExtensions = mapToColumnExtensions(columns);
            const sortingColumnExtensions = mapToSortingColumnExtensions(columns);
            const filteringColumnExtensions = mapToFilteringColumnExtensions(columns);
            const sortColumnRenames = mapToSortColumnRenames(columns);
            const providers = mapToProviders(columns);

            const wordWrapLineCounts = columns.filter(c => c.wordWrapLineCount !== undefined).map(c => Number(c.wordWrapLineCount));
            const maxRowLines = Math.max(1, ...wordWrapLineCounts);
            const rowHeight = ROW_PADDING * 2 + maxRowLines * ROW_TEXT_LINE_HEIGHT;

            return [columnExtensions, sortingColumnExtensions, filteringColumnExtensions, sortColumnRenames, providers, rowHeight];
        }, [columns]);

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
                const url = constructFetchUrl(baseUrl, sorts, sortColumnRenames, filtersApplied, requestedSkip, take);
                httpAuth.fetch(url,
                    {
                        method: 'GET',
                        headers: { "Accept": "application/json" }
                    })
                    .then(response => {
                        if (!unmounted.current) {
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
                className={clsx(classes.tableRow, onRowClick ? 'cursor-pointer' : '')}
                style={{ height: rowHeight }}
            />
        );
    }, [onRowClick, classes, rowHeight]);

    const cellComponent = useCallback((props: Table.DataCellProps) => {
        const row = props.row as T;

        return (
            <Table.Cell
                {...props}
                className={classes.tableCell}
            >
                <LineClamper lineCount={columns.filter(col => col.name === props.column.name)[0].wordWrapLineCount}>
                    {getRowLink !== undefined
                        ?
                        <Link to={getRowLink?.(row)} onClick={e => e.stopPropagation()}>
                            {props.children ?? props.column.getCellValue?.(row, props.column.name)}
                        </Link>
                        : props.children}
                </LineClamper>
            </Table.Cell>
        );
    }, [getRowLink, classes, columns]);

    const updateFilters = (filters: Filter[]) => {
        setState({ filters });
        window.clearTimeout(filterLoadTimeout);
        filterLoadTimeout = window.setTimeout(() => {
            if (!unmounted.current) {
                setFiltersApplied(filters);
            }
        }, FILTER_DELAY);
    };

    const tableColumns = useMemo(() => mapToColumns(columns, filtersApplied), [columns, filtersApplied]);

    const dateRangeFilters = columns
        .filter(column => column.DateRangeFilter !== undefined)
        .map(column => {
            const dateRange = getDateRangeFromFilter(column.name, filtersApplied);
            const onDateSelected = (dateRange: DateRange<Date>) => {
                const newFilters = setDateRangeFilter(dateRange, column.name, filtersApplied);
                setFiltersApplied(newFilters);
            };
            const dateRangeFilter = column.DateRangeFilter!(dateRange, onDateSelected);
            return React.cloneElement(dateRangeFilter, { key: column.name });
        });

    // TODO: increase height
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

                    {data
                        ? undefined
                        :
                        <VirtualTableState
                            infiniteScrolling={false}
                            loading={loading}
                            totalRowCount={totalCount}
                            pageSize={VIRTUAL_PAGE_SIZE}
                            skip={skip}
                            getRows={(newSkip, newTake) => {
                                if (newSkip !== requestedSkip || newTake !== take) {
                                    setState({ requestedSkip: newSkip, take: newTake })
                                }
                            }}
                        />
                    }

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
                        cellComponent={cellComponent}
                        rowComponent={tableRow}
                        columnExtensions={columnExtensions}
                        estimatedRowHeight={rowHeight}
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
            <Grid container justify='flex-end' className='p-2'>Всего: {totalCount}</Grid>
        </>
    );
};

const useStyles = makeStyles({
    tableRow: {
        '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
        }
    },
    tableCell: {
        lineHeight: ROW_TEXT_LINE_HEIGHT + 'px !important'
    }
});

function getDefaultTableSetting<T>(pathname: string, columns: UniversalColumn<T>[], defaultColumnOrder: string[] | undefined): TableSetting {
    return {
        tableUrl: pathname,
        hiddenColumns: mapToDefaultHiddenColumns(columns) || [],
        columnOrder: defaultColumnOrder || columns.map(c => c.name)
    };
}

const constructFetchUrl =
    (baseUrl: string, sorts: Sorting[], sortColumnRenames: SortColumnRename[],
        filters: Filter[], skip: number, take: number): string => {

        let url = baseUrl.replace(/[?]$/, "") + '?';
        url += SKIP_PROPERTY_NAME_IN_REQUEST + "=" + encodeURIComponent("" + skip) + "&";
        url += TAKE_PROPERTY_NAME_IN_REQUEST + "=" + encodeURIComponent("" + take) + "&";
        if (sorts.length > 0) {
            const sortsQuery = sorts
                .map(sort => {
                    const sortColumnRename = sortColumnRenames.filter(r => r.originColumnName === sort.columnName)[0];
                    const columnName = sortColumnRename?.sortColumnName ?? sort.columnName;
                    const directionSymbol = sort.direction === 'asc' ? '+' : '-';
                    return directionSymbol + columnName.charAt(0).toUpperCase() + columnName.slice(1)
                })
                .join(',');
            url += SORT_PROPERTY_NAME_IN_REQUEST + "=" + encodeURIComponent("" + sortsQuery) + "&";
        }
        for (let i = 0; i < filters.length; i++) {
            const filterName = filters[i].columnName.charAt(0).toUpperCase() + filters[i].columnName.slice(1);
            const filterValue = filters[i].value;
            url += filterName + '=' + encodeURIComponent("" + filterValue) + "&";
        }
        url = url.replace(/[?&]$/, "");
        return url;
    }

const getDateRangeFromFilter = (columnName: string, filters: Filter[]): DateRange<Date> => {
    const dateRange: DateRange<Date> = [null, null];
    for (let i = 0; i < 2; i++) {
        const filterName = columnName + '.' + (i === 0 ? DATE_FROM_PROPERTY_NAME_IN_REQUEST : DATE_TO_PROPERTY_NAME_IN_REQUEST);
        const filter = filters.filter(f => f.columnName === filterName)?.[0];
        if (filter) {
            dateRange[i] = new Date(filter.value!);
        }
    }

    return dateRange;
};

const setDateRangeFilter = (dateRange: DateRange<Date>, columnName: string, filters: Filter[]): Filter[] => {
    dateRange.forEach((date, index) => {
        const filterName = columnName + '.' + (index === 0 ? DATE_FROM_PROPERTY_NAME_IN_REQUEST : DATE_TO_PROPERTY_NAME_IN_REQUEST);
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
        .filter(column => column.align || column.width || column.wordWrapLineCount)
        .map(column => ({
            columnName: column.name,
            align: column.align,
            width: column.width,
            wordWrapEnabled: column.wordWrapLineCount !== undefined
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

function mapToSortColumnRenames<T>(columns: UniversalColumn<T>[]): SortColumnRename[] {
    return columns
        .filter(column => column.nameForSort)
        .map(column => ({
            originColumnName: column.name,
            sortColumnName: column.nameForSort
        }) as SortColumnRename);
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