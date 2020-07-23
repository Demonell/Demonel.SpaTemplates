import React from 'react';
import { StepperProps, Stepper } from '@material-ui/core';
import { StepperItem } from './StepperItem';

export const StepperContainer: React.FC<StepperProps> = ({ activeStep, children, ...rest }) => {
    const stepperItems: React.ReactNode[] = [];
    const stepperElements: React.ReactNode[] = [];
    React.Children.forEach(children, function (child) {
        if (React.isValidElement(child) && child.type === StepperItem) {
            stepperItems.push(child);
            stepperElements.push(child.props.children);
        }
    });

    return (
        <>
            <Stepper activeStep={activeStep} {...rest}>
                {stepperItems}
            </Stepper>
            {stepperElements[activeStep || 0]}
        </>
    );
}