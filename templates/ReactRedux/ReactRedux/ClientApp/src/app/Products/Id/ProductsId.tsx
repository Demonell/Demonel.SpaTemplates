import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import { Grid } from '@material-ui/core';
import { TabVerticalContainer, TabElement, Property, LinkButton, PaperCard } from '../../Common';
import { showErrorSnackByException, productsClient } from '../../../clients/apiHelper';
import { linkTo } from '../../../utils/formatHelper';
import { usePartialReducer } from '../../../utils/hooks';
import { ProductVm } from '../../../clients/productsClient';
import { productTypeDescriptors, materialNameDescriptors, getDescription } from '../../../utils/descriptors';
import { stopLoading, beginLoading } from '../../Layout/ProgressBar/duck';

interface ProductsIdState {
    product?: ProductVm;
}

const initialState: ProductsIdState = {
    product: undefined,
}

export const ProductsIdLink = (id?: string | number) => linkTo('/products/:id', id);
export const ProductsId = () => {
    const { id } = useParams();

    const [state, setState] = usePartialReducer(initialState);
    const { product } = state;

    useEffect(() => {
        const loadId = beginLoading();
        productsClient.get(Number(id))
            .then(entry => setState({ product: entry }))
            .catch(ex => showErrorSnackByException(ex))
            .finally(() => stopLoading(loadId));
    }, [setState, id]);

    const actions = (
        <Grid container direction='column' alignItems='flex-start' >
            <LinkButton className='m-1' to={''} disabled>
                Редактировать
            </LinkButton>
        </Grid >
    );

    return (
        <TabVerticalContainer id='product' actions={actions}>
            <TabElement label="Общая информация">
                <Grid container>
                    <Property gridXs={6} label="Уникальный идентификатор" value={product?.id} />
                    <Property gridXs={6} label="Дата доставки" value={product?.deliveryDate} variant='datetime' />
                    <Property gridXs={6} label="Наименование продукта" value={product?.name} />
                    <Property gridXs={6} label="Тип продукта" value={getDescription(product?.productType, productTypeDescriptors)} />
                </Grid>
            </TabElement>
            <TabElement label="Материалы">
                {product?.materials?.map(material => (
                    <PaperCard
                        key={material.name}
                        className='m-3 bg-light'
                        label={getDescription(material.name, materialNameDescriptors)}
                    >
                        <Grid container>
                            <Property gridXs={12} label="Ориентировочный срок службы" value={material.durability} variant='timespan' />
                        </Grid>
                    </PaperCard>
                ))}
            </TabElement>
        </TabVerticalContainer>
    );
}