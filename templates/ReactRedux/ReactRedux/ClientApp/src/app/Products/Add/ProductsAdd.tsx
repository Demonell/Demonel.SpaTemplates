import React from 'react';
import { Formik, Field, FieldConfig, FieldProps } from 'formik';
import { TextField, Grid } from '@material-ui/core';
import { PaperLayout, LoadingButton } from '../../Common';
import { usePartialReducer } from '../../../utils/hooks';
import { nameOf } from '../../../utils/nameof';
import { productsClient } from '../../../clients/apiHelper';
import { ProductType } from '../../../clients/productsClient';
import { DatePicker } from '@material-ui/pickers';
import { FormGrid, TextFieldFormik } from '../../Common';

interface ProductsAddState {
    loading: boolean;
}

const initialState: ProductsAddState = {
    loading: false
}

interface MaterialModel {
    name: string;
    durability: string;
}

interface ProductModel {
    name: string;
    deliveryDate: Date | null;
    productType: ProductType | '';
    materials: MaterialModel[];
}

const initialModel: ProductModel = {
    name: '',
    deliveryDate: null,
    productType: '',
    materials: []
}

type Props<TData> = {
    name: keyof TData;
} & Omit<FieldConfig, 'name'>;

function FormikField<T>({ name, ...props }: Props<T>) {
    return <Field name={name} {...props} />;
}

export const ProductsAddLink = '/products/add';
export const ProductsAdd = () => {
    const [state, setState] = usePartialReducer(initialState);
    const { loading } = state;

    const handleProductAdd = () => {
        productsClient.create({
            name: '',
            deliveryDate: new Date(),
            productType: ProductType.Common,
            materials: [{
                name: '',
                durability: '365:00:00.000'
            }]
        })
    };

    return (
        <PaperLayout label="Добавление продукта" size={600}>
            <Formik
                initialValues={initialModel}
                onSubmit={(model, actions) => {
                    console.log({ values: model, actions });
                    alert(JSON.stringify(model, null, 2));
                    actions.setSubmitting(false);
                }}
                render={formikBag => (
                    <FormGrid container spacing={6}>
                        <TextFieldFormik<ProductModel>
                            fieldName="name"
                            gridXs={6}
                            label="Наименование продукта"
                        />
                        <Grid item xs={6}>
                            <Field
                                name={nameOf((m: ProductModel) => m.deliveryDate)}
                                render={({ field, form, meta }: FieldProps<Date | null>) => {
                                    return (
                                        <>
                                            <DatePicker
                                                {...field}
                                                label="Дата доставки"
                                                inputFormat="dd/MM/yyyy"
                                                onChange={date => formikBag.setFieldValue(nameOf((m: ProductModel) => m.deliveryDate), date as Date)}
                                                renderInput={(props) => (
                                                    <TextField {...props} helperText="" />
                                                )}
                                            />
                                            {meta.touched && meta.error && meta.error}
                                        </>
                                    )
                                }}
                            />
                        </Grid>

                        <Grid container direction='row' justify='flex-end' className='mt-4'>
                            <LoadingButton
                                type='submit'
                                color="primary"
                                isLoading={loading}
                                className='m-2'
                            >
                                Добавить
                            </LoadingButton>
                        </Grid>
                    </FormGrid>
                )}
            />
        </PaperLayout>
    );
}