import React, { useCallback } from 'react';
import { ProductsTable } from '.';
import { ProductVm } from '../../clients/productsClient';
import { useHistory } from 'react-router';
import { ProductsIdLink } from './Id';

export const ProductsLink = '/products';
export const Products: React.FC = () => {
    const history = useHistory();

    const onRowClick = useCallback((row: ProductVm) => {
        history.push(ProductsIdLink(row.id));
    }, [history]);

    const getRowLink = useCallback((row: ProductVm) => ProductsIdLink(row.id), []);

    return (
        <ProductsTable
            onRowClick={onRowClick}
            getRowLink={getRowLink}
        />
    )
}