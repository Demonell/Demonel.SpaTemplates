import React, { useRef } from 'react';
import { usePartialReducer } from '../../../../utils/hooks';
import { productsClient, showErrorSnackByException } from '../../../../clients/apiHelper';
import { ProductType, CreateProductCommand } from '../../../../clients/productsClient';
import { ProductsIdLink } from '../../Id';
import { useHistory } from 'react-router-dom';
import { useForm, Controller } from "react-hook-form";
import { TextField, Grid, Select, MenuItem } from '@material-ui/core';
import { DatePicker } from '@material-ui/pickers';
import { PaperLayout, StepperContainer, StepperItem } from '../../../Common';
import { productTypeDescriptors } from '../../../../utils/descriptors';

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

export const ProductsAddReactHookFormLink = '/products/add/raect-hook-form';
export const ProductsAddReactHookForm = () => {
    const [state, setState] = usePartialReducer(initialState);
    const { loading } = state;

    const history = useHistory();
    const onSubmit = (model: ProductModel) => {
        const command: CreateProductCommand = {
            name: model.name,
            deliveryDate: model.deliveryDate!,
            productType: model.productType as ProductType,
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

    const { register, handleSubmit, watch, errors, setValue, control } = useForm<ProductModel>({ defaultValues: initialModel });

    // console.log(watch("deliveryDate")); // watch input value by passing the name of it

    const datePickerInputRef = useRef<HTMLInputElement | null>(null);
    const commonForm =
        <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={6}>
                <Grid item xs={6}>
                    <TextField
                        label="Название"
                        name="name"
                        inputRef={register({ required: true })}
                        error={errors.name !== undefined}
                        helperText={errors.name && 'Требуется заполнить поле'}
                    />
                </Grid>

                <Grid item xs={6}>
                    <Controller
                        control={control}
                        name="deliveryDate"
                        rules={{ required: true }}
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
                                        helperText={errors.deliveryDate && 'Требуется заполнить поле'}
                                    />
                                )}
                                inputFormat="dd/MM/yyyy"
                            />
                        )}
                    />
                </Grid>

                {/** TODO: need to add FormControl for errors and test */}
                {/* <Grid item xs={6}>
                    <Select
                        label="Тип"
                        name="productType"
                        inputRef={register({ required: true })}
                    >
                        <MenuItem value={''} disabled={true}><em>Не выбрано</em></MenuItem>
                        {productTypeDescriptors.map(descriptor => (
                                <MenuItem key={String(descriptor.value)} value={descriptor.value}>{descriptor.description}</MenuItem>
                            ))}
                    </Select>
                </Grid> */}
            </Grid>
        </form>;

    return (
        <PaperLayout label="Добавление продукта" size={600}>
            <StepperContainer
                beforeStepChange={(currentStep, _) => {
                    return true;
                }}
                loading={loading}
            >
                <StepperItem label='Общие параметры'>
                    {commonForm}
                </StepperItem>
                <StepperItem label='Метериалы'>
                    В разработке...
                </StepperItem>
            </StepperContainer>
        </PaperLayout>
    );
}