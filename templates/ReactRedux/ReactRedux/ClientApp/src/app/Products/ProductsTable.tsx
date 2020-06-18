import React from 'react';
import { ProductVm, TotalListOfProductVm } from '../../clients/productsClient';
import { nameOf } from '../../utils/nameof';
import { UniversalColumn, TableUniversalProps, TableUniversal } from '../Common';
import { RuntimeConfig } from '../../RuntimeConfig';
import { DescriptorFilterCell, DescriptorTypeProvider, TimespanTypeProvider, DateTypeProvider } from '../Common/TableUniversal/providers';
import { productTypeDescriptors, materialNameDescriptors } from '../../utils/descriptors';

const columns: UniversalColumn<ProductVm>[] = [
    {
        title: 'Уникальный идентификатор', name: nameOf<ProductVm, number>(o => o.id),
        getCellValue: m => m.id,
        hiddenByDefault: true
    },
    {
        title: 'Наименование продукта', name: nameOf((m: ProductVm) => m.name),
        getCellValue: m => m.name
    },
    {
        title: 'Тип продукта', name: nameOf((m: ProductVm) => m.productType),
        getCellValue: m => m.productType,
        FilterCellComponent: props => <DescriptorFilterCell descriptors={productTypeDescriptors} {...props} />,
        Provider: columnName => <DescriptorTypeProvider for={[columnName]} descriptors={productTypeDescriptors} />
    },
    {
        title: 'Дата доставки', name: nameOf((m: ProductVm) => m.deliveryDate),
        getCellValue: m => m.deliveryDate,
        Provider: columnName => <DateTypeProvider for={[columnName]} />,
        filteringEnabled: false,
        dateRangeFilterProps: {}
    },
    {
        title: 'Основной материал', name: 'materialName',
        getCellValue: (m, filters) => {
            const materialNameFilter = filters.filter(f => f.columnName === 'materialName')[0]?.value;

            if (materialNameFilter) {
                return m.materials!.filter(d => d.name?.includes(materialNameFilter))[0]?.name;
            } else {
                return m.materials![0]?.name;
            }
        },
        FilterCellComponent: props => <DescriptorFilterCell descriptors={materialNameDescriptors} {...props} />,
        Provider: columnName => <DescriptorTypeProvider for={[columnName]} descriptors={materialNameDescriptors} />
    },
    {
        title: 'Долговечность материала', name: 'materialDurability',
        getCellValue: (m, filters) => {
            const materialNameFilter = filters.filter(f => f.columnName === 'materialName')[0]?.value;

            if (materialNameFilter) {
                return m.materials!.filter(d => d.name?.includes(materialNameFilter))[0]?.durability;
            } else {
                return m.materials![0]?.durability;
            }
        },
        filteringEnabled: false,
        sortingEnabled: false,
        Provider: columnName => <TimespanTypeProvider for={[columnName]} />
    }
];

const getItems = (response: TotalListOfProductVm) => response.items || [];
const getTotalCount = (response: TotalListOfProductVm) => response.total;
const getRowId = (row: ProductVm) => row.id;

export const ProductsTable: React.FC<Partial<TableUniversalProps<TotalListOfProductVm, ProductVm>>> = (props) => {
    return (
        <TableUniversal<TotalListOfProductVm, ProductVm>
            baseUrl={RuntimeConfig.ProductsUrl + '/api/products'}
            getItems={getItems}
            getTotalCount={getTotalCount}
            getRowId={getRowId}
            columns={columns}
            {...props}
        />
    );
}