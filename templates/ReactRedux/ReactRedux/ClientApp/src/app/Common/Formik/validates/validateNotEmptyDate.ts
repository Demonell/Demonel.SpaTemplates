import { isValid } from "date-fns";

export const validateNotEmptyDate = (value: Date | null): string | undefined => {
    let error: string | undefined = undefined;
    if (!value) {
        error = 'Требуется ввести значение';
    } else if (!isValid(value)) {
        error = 'Некорректная дата';
    }
    return error;
}