import React, { useRef, useState } from 'react';
import { usePartialReducer } from '../../../../utils/hooks';
import { productsClient, showErrorSnackByException } from '../../../../clients/apiHelper';
import { ProductType, CreateProductCommand } from '../../../../clients/productsClient';
import { ProductsIdLink } from '../../Id';
import { useHistory } from 'react-router-dom';
import { useForm, Controller } from "react-hook-form";
import { TextField, Grid, Select, MenuItem, Button, FormControl, InputLabel, FormHelperText } from '@material-ui/core';
import { DatePicker } from '@material-ui/pickers';
import { PaperLayout, StepperContainer, StepperItem, StepperNavigation } from '../../../Common';
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

    const history = useHistory();
    const onSubmitCommon = (m: ProductModel) => {
        console.log({ m });

        setState({ model: { ...model, ...m } });

        setStep(step => step + 1);
    };

    const onSubmitMaterials = (m: ProductModel) => {
        console.log({ m });

        const command: CreateProductCommand = {
            name: m.name,
            deliveryDate: m.deliveryDate!,
            productType: m.productType as ProductType,
            materials: m.materials.map(material => ({
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
    }

    const { register, handleSubmit, watch, errors, setValue, control } = useForm<ProductModel>({ defaultValues: model });

    // console.log(watch("deliveryDate")); // watch input value by passing the name of it

    const datePickerInputRef = useRef<HTMLInputElement | null>(null);
    const selectInputRef = useRef<HTMLInputElement | null>(null);
    const commonForm =
        <form onSubmit={handleSubmit(onSubmitCommon)}>
            <Grid container spacing={6}>
                <Grid item xs={6}>
                    <TextField
                        label="Название"
                        name="name"
                        inputRef={register({ required: 'Требуется заполнить поле' })}
                        error={errors.name !== undefined}
                        helperText={errors.name && errors.name.message}
                    />
                </Grid>

                <Grid item xs={6}>
                    <Controller
                        control={control}
                        name="deliveryDate"
                        rules={{ required: 'Требуется заполнить поле', validate: (record: string) => isValid(record) ? true : 'Некорректная дата' }}
                        onFocus={() => datePickerInputRef.current?.focus()}
                        render={({ onChange, onBlur, value }) => (
                            <DatePicker
                                label="Дата доставки"
                                value={value}
                                onChange={onChange}
                                renderInput={(props) => (
                                    <TextField
                                        {...props}
                                        onBlur={onBlur}
                                        inputRef={ref => {
                                            props.inputRef && (props.inputRef as (instance: any) => void)(ref);
                                            datePickerInputRef.current = ref;
                                        }}
                                        error={errors.deliveryDate !== undefined}
                                        helperText={errors.deliveryDate && errors.deliveryDate.message}
                                    />
                                )}
                                inputFormat="dd/MM/yyyy"
                            />
                        )}
                    />
                </Grid>

                <Grid item xs={6}>
                    <Controller
                        control={control}
                        name="productType"
                        rules={{ required: 'Требуется заполнить поле' }}
                        onFocus={() => selectInputRef.current?.focus()}
                        render={({ onChange, onBlur, value }) => (
                            <FormControl error={errors.productType !== undefined}>
                                <InputLabel id="product-type-label">Тип</InputLabel>
                                <Select
                                    labelId="product-type-label"
                                    value={value}
                                    onChange={onChange}
                                    onBlur={onBlur}
                                    inputRef={selectInputRef}
                                >
                                    <MenuItem value={''} disabled={true}><em>Не выбрано</em></MenuItem>
                                    {productTypeDescriptors.map(descriptor => (
                                        <MenuItem key={String(descriptor.value)} value={descriptor.value}>{descriptor.description}</MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>{errors.productType?.message}</FormHelperText>
                            </FormControl>
                        )}
                    />
                </Grid>

                {/* TODO: data resets when goes back **/} 
                <StepperNavigation step={step} setStep={setStep} loading={loading} submit />
            </Grid>
        </form>
        ;

    return (
        <PaperLayout label="Добавление продукта" size={600}>
            <StepperContainer activeStep={step}>
                <StepperItem label='Общие параметры' onSubmit={() => { handleSubmit(onSubmitCommon); return false; }}>
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