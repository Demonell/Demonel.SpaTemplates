import React from 'react';
import { Formik, Form } from 'formik';
import { Grid } from '@material-ui/core';
import { PaperLayout, DatePickerFormik, StepperItem, StepperContainer, SelectFormik, PaperCard } from '../../Common';
import { usePartialReducer } from '../../../utils/hooks';
import { productsClient } from '../../../clients/apiHelper';
import { ProductType } from '../../../clients/productsClient';
import { TextFieldFormik } from '../../Common';
import { productTypeDescriptors, materialNameDescriptors, materialDurabilityDescriptors } from '../../../utils/descriptors';

interface MaterialModel {
    id: number;
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
    materials: [{
        id: 0,
        name: '',
        durability: ''
    }]
}

interface ProductsAddState {
    loading: boolean;
}

const initialState: ProductsAddState = {
    loading: false,
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
        <Formik
            initialValues={initialModel}
            onSubmit={(model, actions) => {
                console.log({ values: model, actions });
                alert(JSON.stringify(model, null, 2));
                setState({ loading: !loading });
                actions.setSubmitting(false);
            }}
        >
            {({
                values: model,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                isSubmitting,
                /* and other goodies */
            }) => (
                    <Form>
                        <PaperLayout label="Добавление продукта" size={600}>
                            <StepperContainer loading={loading}>
                                <StepperItem label='Общие параметры'>
                                    <Grid container spacing={6}>
                                        <TextFieldFormik<ProductModel>
                                            fieldName="name"
                                            gridXs={6}
                                            label="Название"
                                        />
                                        <DatePickerFormik<ProductModel>
                                            fieldName="deliveryDate"
                                            gridXs={6}
                                            label="Дата доставки"
                                            inputFormat="dd/MM/yyyy"
                                            autoOk
                                        />
                                        <SelectFormik<ProductModel, ProductType>
                                            fieldName="productType"
                                            gridXs={6}
                                            label="Тип"
                                            descriptors={productTypeDescriptors}
                                            required
                                        />
                                    </Grid>
                                </StepperItem>
                                <StepperItem label='Метериалы'>
                                    {model.materials.map((model, index) =>
                                        <PaperCard
                                            key={model.id}
                                            label="Материал"
                                        >
                                            <Grid container spacing={6}>
                                                <SelectFormik<MaterialModel, string>
                                                    fieldName={`materials[${index}].name`}
                                                    gridXs={6}
                                                    label="Название"
                                                    descriptors={materialNameDescriptors}
                                                    required
                                                />
                                                <SelectFormik<MaterialModel, string>
                                                    fieldName={`materials[${index}].durability`}
                                                    gridXs={6}
                                                    label="Долговечность"
                                                    descriptors={materialDurabilityDescriptors}
                                                    required
                                                />
                                            </Grid>
                                        </PaperCard>
                                    )}
                                </StepperItem>
                            </StepperContainer>
                        </PaperLayout>
                    </Form>
                )}
        </Formik>
    );
}