import { isValid } from "date-fns";

export const setTimezoneToUtc = (date: Date | null): Date | null => {
    if (date === null || !isValid(date))
        return date;

    const originDate = typeof date === 'object'
        ? date as Date
        : new Date(date);
    return new Date(Date.UTC(originDate.getFullYear(), originDate.getMonth(), originDate.getDate(), originDate.getHours(), originDate.getMinutes(), originDate.getSeconds()));
}