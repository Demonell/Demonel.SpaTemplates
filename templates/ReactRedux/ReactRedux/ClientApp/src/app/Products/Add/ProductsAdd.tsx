import React from 'react';
import { Formik, Form } from 'formik';
import { Grid, Button } from '@material-ui/core';
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
                values,
                setFieldValue,
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
                                    {values.materials.map((model, index) =>
                                        <PaperCard
                                            key={model.id}
                                            label="Материал"
                                            className="my-2 bg-light"
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
                                                {values.materials.length > 1 &&
                                                    <Grid item xs={12} container justify='flex-end'>
                                                        <Button
                                                            color="primary"
                                                            onClick={() => {
                                                                const newMaterials = values.materials.filter(m => m.id !== model.id);
                                                                setFieldValue("materials", newMaterials);
                                                            }}
                                                        >
                                                            Удалить
                                                    </Button>
                                                    </Grid>}
                                            </Grid>
                                        </PaperCard>
                                    )}
                                    <Button
                                        color="primary"
                                        className="my-3"
                                        onClick={() => {
                                            const newMaterialId = values.materials.reduce((prev, current) => (prev.id > current.id) ? prev : current).id + 1;
                                            const newMaterials = [
                                                ...values.materials,
                                                {
                                                    id: newMaterialId,
                                                    name: '',
                                                    durability: ''
                                                }];
                                            setFieldValue("materials", newMaterials);
                                        }}
                                    >
                                        Добавить
                                    </Button>
                                </StepperItem>
                            </StepperContainer>
                        </PaperLayout>
                    </Form>
                )}
        </Formik>
    );
}