import React from 'react';
import { Box } from '@material-ui/core';

export interface TabElementProps {
    label: React.ReactNode;
    index?: number;
    id?: string;
    ariaLabeledBy?: string;
    value?: number;
    children?: React.ReactNode;
}

export const TabElement: React.FC<TabElementProps> = ({ label, index, id, ariaLabeledBy, value, children, ...rest }) => {
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={id}
            aria-labelledby={ariaLabeledBy}
            {...rest}
        >
            {value === index && (
                <Box pl={3}>
                    {children}
                </Box>
            )}
        </div>
    );
}