import React, { useState, useCallback } from 'react';
import { ProductType } from '../../../../clients/productsClient';
import { HiddenInputRH, PaperLayout, StepperContainer, StepperItem, StepperNavigation, FormRH, TextFieldRH, DatePickerRH, SelectRH, PaperCard, FieldArrayRH } from '../../../Common';
import { productTypeDescriptors, materialNameDescriptors, materialDurabilityDescriptors } from '../../../../utils/descriptors';
import { isValid } from 'date-fns';
import { Grid, Button } from '@material-ui/core';

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
    }],
}

let materialId = 1;

export const ProductsAddReactHookFormLink = '/products/add/raect-hook-form';
export const ProductsAddReactHookForm = () => {
    const [step, setStep] = useState(0);
    const [model, setModel] = useState<ProductModel>(initialModel);
    const [loading, setLoading] = useState(false);

    const onSubmitCommon = useCallback((modelSubmited: ProductModel) => {
        console.log({ modelSubmited });

        setModel(m => ({ ...m, ...modelSubmited }));

        setStep(step => step + 1);
    }, [setStep, setModel]);

    const onSubmitMaterials = useCallback((modelSubmited: ProductModel) => {
        console.log({ modelSubmited });

        // TODO: replace with request to api
        setModel(m => ({ ...m, ...modelSubmited }));

    }, [setModel]);

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

    return (
        <PaperLayout label="Добавление продукта" size={600}>
            <StepperContainer activeStep={step}>
                <StepperItem label='Общие параметры' >
                    <FormRH onSubmit={onSubmitCommon} defaultValues={model} grid container spacing={6}>
                        <TextFieldRH
                            gridXs={6}
                            label="Название"
                            name="name"
                            rules={{ required: 'Требуется заполнить поле' }}
                            autoFocus
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

                        <StepperNavigation step={step} loading={loading} submit />
                    </FormRH>
                </StepperItem>
                <StepperItem label='Метериалы'>
                    <FormRH onSubmit={onSubmitMaterials} defaultValues={model}>
                        <FieldArrayRH<MaterialModel>
                            name='materials'
                            render={({ fields, append, remove }) =>
                                <>
                                    {fields.map((material, index) =>
                                        <PaperCard
                                            key={material.id}
                                            label="Материал"
                                            className="my-3 bg-light"
                                        >
                                            <Grid container spacing={6}>
                                                <HiddenInputRH name={`materials[${index}].id`} defaultValue={material.id} />
                                                <SelectRH
                                                    gridXs={6}
                                                    label="Название"
                                                    name={`materials[${index}].name`}
                                                    rules={{ required: 'Требуется заполнить поле' }}
                                                    descriptors={materialNameDescriptors}
                                                    autoFocus={material.id === 0}
                                                    defaultValue={material.name}
                                                />
                                                <SelectRH
                                                    gridXs={6}
                                                    label="Долговечность"
                                                    name={`materials[${index}].durability`}
                                                    rules={{ required: 'Требуется заполнить поле' }}
                                                    descriptors={materialDurabilityDescriptors}
                                                    defaultValue={material.durability}
                                                />
                                                {fields.length > 1 &&
                                                    <Grid item xs={12} container justify='flex-end'>
                                                        <Button
                                                            color="primary"
                                                            onClick={() => remove(index)}
                                                        >
                                                            Удалить
                                                        </Button>
                                                    </Grid>}
                                            </Grid>
                                        </PaperCard>)}
                                    <Button
                                        color="primary"
                                        className="my-3"
                                        onClick={() => append({ id: materialId++, name: '', durability: '' }, false)}
                                    >
                                        Добавить
                                    </Button>
                                    <StepperNavigation step={step} setStep={setStep} loading={loading} submit last />
                                </>}
                        />
                    </FormRH>
                    {// TODO: add property "onBack" to navigation
                    }
                </StepperItem>
            </StepperContainer>
        </PaperLayout >
    );
}