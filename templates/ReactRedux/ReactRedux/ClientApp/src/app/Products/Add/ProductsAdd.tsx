import React from 'react';
import { Formik } from 'formik';
import { Grid } from '@material-ui/core';
import { PaperLayout, LoadingButton, DatePickerFieldFormik } from '../../Common';
import { usePartialReducer } from '../../../utils/hooks';
import { productsClient } from '../../../clients/apiHelper';
import { ProductType } from '../../../clients/productsClient';
import { FormGrid, TextFieldFormik } from '../../Common';

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

interface ProductsAddState {
    loading: boolean;
    model: ProductModel;
}

const initialState: ProductsAddState = {
    loading: false,
    model: initialModel
}

export const ProductsAddLink = '/products/add';
export const ProductsAdd = () => {
    const [state, setState] = usePartialReducer(initialState);
    const { loading } = state;

    const handleProductAdd = (model: ProductModel) => {
        setState({ loading: true });
        productsClient
            .create({
                name: model.name,
                deliveryDate: model.deliveryDate!,
                productType: ProductType.Common,
                materials: [{
                    name: '',
                    durability: '365:00:00.000'
                }]
            })
            .finally(() => {
                setState({ loading: false });
            })
    };

    return (
        <PaperLayout label="Добавление продукта" size={600}>
            <Formik
                initialValues={initialModel}
                onSubmit={(model, actions) => {
                    console.log({ values: model, actions });
                    alert(JSON.stringify(model, null, 2));
                    setState({ loading: !loading });
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
                            isLoading={false}
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