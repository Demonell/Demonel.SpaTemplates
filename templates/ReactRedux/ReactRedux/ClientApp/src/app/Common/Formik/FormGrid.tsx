import React from 'react';
import { GridProps, Grid } from '@material-ui/core';
import { Form } from 'formik';

export const FormGrid: React.FC<GridProps> = ({children, ...rest}) => {
    return (
        <Form>
            <Grid {...rest}>
                {children}
            </Grid>
        </Form>
    )
}