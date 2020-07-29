import React from 'react';
import { StepProps, Step, StepLabel } from '@material-ui/core';

export interface StepperItemProps extends StepProps {
    label: string;
}

export function StepperItem(props: StepperItemProps) {
    const { label, children, ...rest } = props;
    return (
        <Step {...rest}>
            <StepLabel>{label}</StepLabel>
        </Step>
    );
}