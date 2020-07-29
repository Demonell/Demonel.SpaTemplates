import React, { PropsWithChildren } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { DeepPartial } from "react-hook-form/dist/types/utils";
import { UnpackNestedValue } from "react-hook-form/dist/types/form";
import { GridProps, Grid } from "@material-ui/core";

export interface FormRHProps<T> extends Omit<GridProps, 'onSubmit'> {
    onSubmit: SubmitHandler<T>;
    defaultValues?: UnpackNestedValue<DeepPartial<T>>;
    grid?: boolean;
}

export function FormRH<T>({ onSubmit, defaultValues, grid, children, ...props }: PropsWithChildren<FormRHProps<T>>) {
    const { handleSubmit, register, control, errors } = useForm<T>({ defaultValues });

    let element: React.ReactNode = React.Children.map(children, child => {
        return React.isValidElement(child) && child.props.name
            ? React.createElement(child.type, {
                ...{
                    ...child.props,
                    register: register,
                    control: control,
                    errors: errors,
                    key: child.props.name
                }
            })
            : child;
    });

    element = grid ? <Grid {...props}>{element}</Grid> : element;

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            {element}
        </form>
    );
}