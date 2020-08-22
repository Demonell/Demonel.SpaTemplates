import React from 'react';
import { useFormContext } from 'react-hook-form';

export const HiddenInputRH: React.FC<React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>> = props => {
    const { register } = useFormContext();
    return <input ref={register!()} {...props} hidden />;
}