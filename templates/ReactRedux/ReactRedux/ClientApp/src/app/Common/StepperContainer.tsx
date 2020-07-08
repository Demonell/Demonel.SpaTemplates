import React, { useState } from 'react';
import { StepperProps, Stepper, Grid, Button } from '@material-ui/core';
import { StepperItem } from './StepperItem';
import { LoadingButton } from '.';

export interface StepperContainerProps extends Omit<StepperProps, 'activeStep'> {
    loading?: boolean;
}

export const StepperContainer: React.FC<StepperContainerProps> = ({ loading, children, ...rest }) => {
    const [step, setStep] = useState(0);

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
            <Stepper activeStep={step} {...rest}>
                {stepperItems}
            </Stepper>
            {stepperElements[step]}
            <Grid container direction='row' justify='flex-end' className='mt-4'>
                <Button
                    disabled={step === 0}
                    onClick={() => setStep(step => step - 1)}
                    className='m-2'
                >
                    Назад
                </Button>
                {step < (stepperElements.length - 1)
                    ?
                    <Button
                        color="primary"
                        className='m-2'
                        onClick={() => setStep(step => step + 1)}
                    >
                        Дальше
                    </Button>
                    :
                    <LoadingButton
                        type='submit'
                        color="primary"
                        isLoading={loading === true}
                        className='m-2'
                    >
                        Завершить
                    </LoadingButton>}
            </Grid>
        </>
    );
}