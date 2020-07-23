import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import { Grid, Button } from '@material-ui/core';
import { PaperLayout, DatePickerFormik, StepperItem, StepperContainer, SelectFormik, PaperCard, validateNotEmpty, validateNotEmptyDate, StepperNavigation } from '../../../Common';
import { usePartialReducer } from '../../../../utils/hooks';
import { productsClient, showErrorSnackByException } from '../../../../clients/apiHelper';
import { ProductType, CreateProductCommand } from '../../../../clients/productsClient';
import { TextFieldFormik } from '../../../Common';
import { productTypeDescriptors, materialNameDescriptors, materialDurabilityDescriptors } from '../../../../utils/descriptors';
import { ProductsIdLink } from '../../Id';
import { useHistory } from 'react-router-dom';

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

export const ProductsAddFormikLink = '/products/add/formik';
export const ProductsAddFormik = () => {
    const [step, setStep] = useState(0);
    const [state, setState] = usePartialReducer(initialState);
    const { loading } = state;

    const history = useHistory();
    const handleProductAdd = (model: ProductModel) => {
        const command: CreateProductCommand = {
            name: model.name,
            deliveryDate: model.deliveryDate!,
            productType: ProductType.Common,
            materials: model.materials.map(material => ({
                name: material.name,
                durability: material.durability
            }))
        };

        setState({ loading: true });
        productsClient
            .create(command)
            .then(productId => history.push(ProductsIdLink(productId)))
            .catch(ex => showErrorSnackByException(ex))
            .finally(() => setState({ loading: false }));
    };

    return (
        <Formik
            initialValues={initialModel}
            onSubmit={(values, actions) => {
                actions.setTouched({}, true);
                handleProductAdd(values);
                actions.setSubmitting(false);
            }}
        >
            {({
                values,
                errors,
                touched,
                setFieldTouched,
                setFieldValue,
            }) => (
                    <Form>
                        <PaperLayout label="Добавление продукта" size={600}>
                            <StepperContainer activeStep={step}>
                                <StepperItem label='Общие параметры'>
                                    <Grid container spacing={6}>
                                        <TextFieldFormik<ProductModel>
                                            fieldName="name"
                                            validate={validateNotEmpty}
                                            gridXs={6}
                                            label="Название"
                                            autoFocus
                                        />
                                        <DatePickerFormik<ProductModel>
                                            fieldName="deliveryDate"
                                            validate={validateNotEmptyDate}
                                            gridXs={6}
                                            label="Дата доставки"
                                            inputFormat="dd/MM/yyyy"
                                        />
                                        <SelectFormik<ProductModel, ProductType>
                                            fieldName="productType"
                                            validate={validateNotEmpty}
                                            gridXs={6}
                                            label="Тип"
                                            descriptors={productTypeDescriptors}
                                            required
                                        />
{/* TODO: implement it here
beforeStepChange={(currentStep, _) => {
                                    if (currentStep === 0 && Object.keys(touched).length < 3) {
                                        setFieldTouched("name", true);
                                        setFieldTouched("deliveryDate", true);
                                        setFieldTouched("productType", true);
                                        return false;
                                    } else if (Object.keys(errors).length > 0) {
                                        return false;
                                    }

                                    return true;
                                }} */}
                                        <StepperNavigation step={step} setStep={setStep} loading={loading} />
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
                                                    validate={validateNotEmpty}
                                                    gridXs={6}
                                                    label="Название"
                                                    descriptors={materialNameDescriptors}
                                                    required
                                                    autoFocus
                                                />
                                                <SelectFormik<MaterialModel, string>
                                                    fieldName={`materials[${index}].durability`}
                                                    validate={validateNotEmpty}
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

                                    <StepperNavigation step={step} setStep={setStep} loading={loading} last />
                                </StepperItem>
                            </StepperContainer>
                        </PaperLayout>
                    </Form>
                )}
        </Formik>
    );
}