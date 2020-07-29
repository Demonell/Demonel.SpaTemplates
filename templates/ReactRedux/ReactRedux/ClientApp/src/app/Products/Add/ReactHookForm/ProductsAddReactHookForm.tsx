import React, { useState } from 'react';
import { usePartialReducer } from '../../../../utils/hooks';
import { ProductType } from '../../../../clients/productsClient';
import { PaperLayout, StepperContainer, StepperItem, StepperNavigation, FormRH, TextFieldRH, DatePickerRH, SelectRH } from '../../../Common';
import { productTypeDescriptors } from '../../../../utils/descriptors';
import { isValid } from 'date-fns';

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
    model: ProductModel;
    loading: boolean;
}

const initialState: ProductsAddState = {
    model: initialModel,
    loading: false,
}

export const ProductsAddReactHookFormLink = '/products/add/raect-hook-form';
export const ProductsAddReactHookForm = () => {
    const [step, setStep] = useState(0);
    const [state, setState] = usePartialReducer(initialState);
    const { model, loading } = state;
    console.log({ model });

    const onSubmitCommon = (m: ProductModel) => {
        console.log({ m });

        setState({ model: { ...model, ...m } });

        setStep(step => step + 1);
    };

    // const onSubmitMaterials = (m: ProductModel) => {
    //     console.log({ m });

    //     const command: CreateProductCommand = {
    //         name: m.name,
    //         deliveryDate: m.deliveryDate!,
    //         productType: m.productType as ProductType,
    //         materials: m.materials.map(material => ({
    //             name: material.name,
    //             durability: material.durability
    //         }))
    //     };

    //     setState({ loading: true });
    //     productsClient
    //         .create(command)
    //         .then(productId => history.push(ProductsIdLink(productId)))
    //         .catch(ex => showErrorSnackByException(ex))
    //         .finally(() => setState({ loading: false }));
    // }

    const commonForm =
        <FormRH onSubmit={onSubmitCommon} defaultValues={model} grid container spacing={6}>
            <TextFieldRH<ProductModel>
                gridXs={6}
                label="Название"
                name="name"
                rules={{ required: 'Требуется заполнить поле' }}
            />
            <DatePickerRH
                gridXs={6}
                label="Дата доставки"
                name="deliveryDate"
                // TODO: move validation to separate validation folder like validation/validateIsDate
                // TODO: check out what to do if we need validation based on property of another field
                rules={{ required: 'Требуется заполнить поле', validate: (record: string) => isValid(record) ? true : 'Некорректная дата' }}
                inputFormat="dd/MM/yyyy"
            />
            <SelectRH
                gridXs={6}
                label="Тип"
                name="productType"
                rules={{ required: 'Требуется заполнить поле' }}
                descriptors={productTypeDescriptors}
            />

            <StepperNavigation step={step} setStep={setStep} loading={loading} submit />
        </FormRH>;

    return (
        <PaperLayout label="Добавление продукта" size={600}>
            <StepperContainer activeStep={step}>
                <StepperItem label='Общие параметры' >
                    {commonForm}
                </StepperItem>
                <StepperItem label='Метериалы'>
                    В разработке...
                    <StepperNavigation step={step} setStep={setStep} loading={loading} last />
                </StepperItem>
            </StepperContainer>
        </PaperLayout>
    );
}