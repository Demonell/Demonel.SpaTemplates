import React from 'react';
import { Tabs, Tab, Grid, Theme, makeStyles } from '@material-ui/core';
import { TabsProps } from '@material-ui/core/Tabs';
import { TabElement, TabElementProps } from '.';
import { useQueryParam, QueryParamConfig } from 'use-query-params';

export interface TabContainerProps extends Omit<TabsProps, 'orientation' | 'value'> {
    id: string;
    tabsXs?: boolean | "auto" | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | undefined;
    tabElementsXs?: boolean | "auto" | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | undefined;
    actionsXs?: boolean | "auto" | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | undefined;
    actions?: React.ReactNode;
}

export const TabVerticalContainer: React.FC<TabContainerProps> =
    ({ id, tabsXs = 2, tabElementsXs = 8, actionsXs = 2, actions, children, ...rest }) => {
        const classes = useStyles();

        const [openedTab, setOpenedTab] = useQueryParam<number>('tab', queryParamConfig);

        const handleChangeTab = (_: React.ChangeEvent<{}>, newValue: number) => {
            setOpenedTab(newValue, 'replace');
        };

        const tabs: React.ReactNode[] = [];
        const tabElements: React.ReactNode[] = [];
        React.Children.forEach(children, (child, index) => {
            if (React.isValidElement(child) && child.type === TabElement) {
                const tabElement = child as React.ReactElement<TabElementProps>;
                const tabElementNew = React.cloneElement(tabElement, {
                    key: index,
                    id: `${id}-tabpanel-${index}`,
                    ariaLabeledBy: `${id}-tab-${index}`,
                    index: index,
                    value: openedTab
                });
                tabElements.push(tabElementNew);

                tabs.push(
                    <Tab
                        key={index}
                        label={tabElement.props.label}
                        id={`${id}-tab-${index}`}
                        aria-controls={`${id}-tabpanel-${index}`}
                    />
                );
            }
        });

        return (
            <Grid container>
                <Grid item xs={tabsXs}>
                    <Tabs
                        orientation='vertical'
                        value={openedTab}
                        onChange={handleChangeTab}
                        aria-label={id}
                        className={classes.tabs}
                        {...rest}
                    >
                        {tabs}
                    </Tabs>
                </Grid>
                <Grid item xs={tabElementsXs}>
                    {tabElements}
                </Grid>
                <Grid item xs={actionsXs}>
                    {actions}
                </Grid>
            </Grid>
        );
    }

const useStyles = makeStyles((theme: Theme) => ({
    tabs: {
        borderRight: `1px solid ${theme.palette.divider}`,
    },
}));

const queryParamConfig: QueryParamConfig<number, number> = {
    encode: tab => tab.toString(),
    decode: tab => tab
        ? Number(tab)
        : 0
};
