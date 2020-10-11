import React from 'react';
import { useFormContext } from 'react-hook-form';
import { ObjPathProxy } from 'ts-object-path';
import { getPropertyFullPath } from '../../../utils/formatHelper';

export interface HiddenInputRHProps extends Omit<React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, 'name'> {
    name: ObjPathProxy<any, any>;
}

export const HiddenInputRH: React.FC<HiddenInputRHProps> = ({ name, ...props}) => {
    const { register } = useFormContext();
    const path = getPropertyFullPath(name);
    return <input name={path} ref={register!()} {...props} hidden />;
}