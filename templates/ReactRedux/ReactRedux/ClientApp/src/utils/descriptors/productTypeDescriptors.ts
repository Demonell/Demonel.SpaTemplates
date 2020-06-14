import { Descriptor } from ".";
import { ProductType } from "../../clients/productsClient";

export const productTypeDescriptors: Descriptor<ProductType>[] = [
    {
        value: ProductType.Common,
        description: 'Стандартный'
    },
    {
        value: ProductType.Vip,
        description: 'Вип'
    }
];