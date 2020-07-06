import React from 'react';
import { Formik } from 'formik';
import { Grid } from '@material-ui/core';
import { PaperLayout, LoadingButton, DatePickerFieldFormik } from '../../Common';
import { usePartialReducer } from '../../../utils/hooks';
import { productsClient } from '../../../clients/apiHelper';
import { ProductType } from '../../../clients/productsClient';
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
            >
                <FormGrid container spacing={6}>
                    <TextFieldFormik<ProductModel>
                        fieldName="name"
                        gridXs={6}
                        label="Наименование продукта"
                    />
                    <DatePickerFieldFormik<ProductModel>
                        fieldName="deliveryDate"
                        gridXs={6}
                        label="Дата доставки"
                        inputFormat="dd/MM/yyyy"
                        autoOk
                    />

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
            </Formik>
        </PaperLayout>
    );
}