import { isValid } from "date-fns";
import { ParsableDate } from "@material-ui/pickers/constants/prop-types";

export const setTimezoneToUtc = (date: ParsableDate): ParsableDate => {
    if (date === null || date === undefined || !isValid(date))
        return date;

    const originDate = typeof date === 'object'
        ? date as Date
        : new Date(date);
    return new Date(Date.UTC(originDate.getFullYear(), originDate.getMonth(), originDate.getDate(), originDate.getHours(), originDate.getMinutes(), originDate.getSeconds()));
}