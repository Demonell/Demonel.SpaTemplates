import { Control } from "react-hook-form";
import { FieldErrors, FieldValues, FieldName, FieldElement, ValidationRules, Ref } from "react-hook-form/dist/types/form";

export interface FormItemRHProps<TFieldValues> extends Partial<FormItemRHBaseProps<TFieldValues>> {
    name: string;
    rules?: ValidationRules;
    gridXs?: boolean | "auto" | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | undefined;
}

export interface FormItemRHBaseProps<TFieldValues extends FieldValues = FieldValues> {
    errors: FieldErrors<TFieldValues>;
    register<TFieldElement extends FieldElement<TFieldValues>>(rules?: ValidationRules): (ref: (TFieldElement & Ref) | null) => void;
    register(name: FieldName<TFieldValues>, rules?: ValidationRules): void;
    register<TFieldElement extends FieldElement<TFieldValues>>(ref: (TFieldElement & Ref) | null, rules?: ValidationRules): void;
    control: Control<TFieldValues>;
}