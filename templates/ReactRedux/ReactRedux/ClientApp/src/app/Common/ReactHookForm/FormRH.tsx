import React, { PropsWithChildren, useEffect } from "react";
import { useForm, SubmitHandler, FormProvider } from "react-hook-form";
import { DeepPartial } from "react-hook-form/dist/types/utils";
import { UnpackNestedValue } from "react-hook-form/dist/types/form";
import { GridProps, Grid } from "@material-ui/core";
import { useChangeTracker } from "../../../utils/hooks";

export interface FormRHProps<T> extends Omit<GridProps, 'onSubmit'> {
    onSubmit: SubmitHandler<T>;
    defaultValues?: UnpackNestedValue<DeepPartial<T>>;
    grid?: boolean;
}

export function FormRH<T>({ onSubmit, defaultValues, grid, children, ...props }: PropsWithChildren<FormRHProps<T>>) {
    const methods = useForm<T>({ defaultValues });

    const defaultValuesChanged = useChangeTracker(defaultValues);
    useEffect(() => {
        if (defaultValuesChanged) {
            methods.reset(defaultValues);
        }
    });

    return (
        <FormProvider {...methods} >
            <form onSubmit={methods.handleSubmit(onSubmit)}>
                {grid
                    ? <Grid {...props}>{children}</Grid>
                    : children}
            </form>
        </FormProvider>
    );
}