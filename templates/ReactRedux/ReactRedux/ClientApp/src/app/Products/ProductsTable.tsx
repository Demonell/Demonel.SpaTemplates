import React from 'react';
import { ProductVm, TotalListOfProductVm } from '../../clients/productsClient';
import { nameOf } from '../../utils/nameof';
import { UniversalColumn, BackOfficeTableProps, BackOfficeTable } from '../Common';
import { RuntimeConfig } from '../../RuntimeConfig';

const columns: UniversalColumn<ProductVm>[] = [
    {
        title: 'Уникальный идентификатор', name: nameOf<ProductVm, number>(o => o.id),
        getCellValue: m => m.id
    },
    {
        title: 'Наименование продукта', name: nameOf((m: ProductVm) => m.name),
        getCellValue: m => m.name
    },
    {
        title: 'Тип продукта', name: nameOf((m: ProductVm) => m.productType),
        getCellValue: m => m.productType
    },
    {
        title: 'Наименование материала', name: 'materialName',
        getCellValue: (m, filters) => {
            const materialNameFilter = filters.filter(f => f.columnName === 'materialName')[0]?.value;

            if (materialNameFilter) {
                return m.materials!.filter(d => d.name?.includes(materialNameFilter))[0]?.name;
            } else {
                return m.materials![0]?.name;
            }
        }
    },
    {
        title: 'Тип материала', name: 'materialDurability',
        getCellValue: (m, filters) => {
            const materialNameFilter = filters.filter(f => f.columnName === 'materialName')[0]?.value;

            if (materialNameFilter) {
                return m.materials!.filter(d => d.name?.includes(materialNameFilter))[0]?.durability;
            } else {
                return m.materials![0]?.durability;
            }
        }
    }
];

const getItems = (response: TotalListOfProductVm) => response.items || [];
const getTotalCount = (response: TotalListOfProductVm) => response.total;
const getRowId = (row: ProductVm) => row.id;

export const ProductsTable: React.FC<Partial<BackOfficeTableProps<TotalListOfProductVm, ProductVm>>> = (props) => {
    console.log('render table');
    return (
        <BackOfficeTable<TotalListOfProductVm, ProductVm>
            baseUrl={RuntimeConfig.ProductsUrl + '/api/products'}
            getItems={getItems}
            getTotalCount={getTotalCount}
            getRowId={getRowId}
            columns={columns}
            {...props}
        />
    );
}