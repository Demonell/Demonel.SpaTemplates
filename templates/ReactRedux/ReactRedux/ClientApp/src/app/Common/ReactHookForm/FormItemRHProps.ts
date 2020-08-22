import { ValidationRules } from "react-hook-form/dist/types/form";

export interface FormItemRHProps {
    name: string;
    rules?: ValidationRules;
    gridXs?: boolean | "auto" | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | undefined;
}