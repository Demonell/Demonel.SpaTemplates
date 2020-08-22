import React from 'react';
import { Button, Grid } from '@material-ui/core';
import { LoadingButton } from '.';

export interface StepperNavigationProps {
    step: number;
    setStep?: (step: number) => void;
    onComplete?: () => void;
    last?: boolean;
    showComplete?: boolean;
    loading?: boolean;
    submit?: boolean;
}

export const StepperNavigation: React.FC<StepperNavigationProps> = ({ step, setStep, onComplete, last, showComplete, loading, submit }) => {
    return (
        <Grid container direction='row' justify='flex-end' className='mt-4'>
            <Button
                disabled={step === 0}
                onClick={setStep ? () => setStep(step - 1) : undefined}
                className='m-2'
            >
                Назад
            </Button>
            {!last &&
                <LoadingButton
                    color="primary"
                    className='m-2'
                    isLoading={loading === true}
                    onClick={!setStep || submit ? undefined : () => setStep(step + 1)}
                    type={submit ? 'submit' : undefined}
                >
                    Дальше
                </LoadingButton>}
            {(last === true || showComplete === true) &&
                <LoadingButton
                    color="primary"
                    isLoading={loading === true}
                    className='m-2'
                    onClick={submit ? undefined : onComplete}
                    type={submit ? 'submit' : undefined}
                >
                    Завершить
                </LoadingButton>}
        </Grid>
    );
}