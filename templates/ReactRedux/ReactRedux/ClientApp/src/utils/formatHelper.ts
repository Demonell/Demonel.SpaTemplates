import { format } from "date-fns";

export const getPropertyByPath = (object: any, path: string, defaultValue?: any) => path
        .split(/[.[\]'"]/)
        .filter(p => p)
        .reduce((o, p) => o ? o[p] : defaultValue, object);

/** 0/9 - обяз./необяз. цифра, 
 * R/L - обяз./необяз. англ. буква, 
 * Б - обяз. русская буква, 
 * E - необяз. англ. + пробел + точка, 
 * S - любая буква или цифра */
export const mask = (value: string | undefined, pattern: string | undefined): string | undefined => {
    if (value && pattern) {
        let i = 0;
        const v = value.toString();
        const result = pattern.replace(/[90LRБES]/g, _ => v[i++] || '');
        return result;
    }

    return value;
}

export const unmask = (value: string | undefined, pattern: string | undefined): string | undefined => {
    if (value && pattern) {
        let unmaskedValue = '';
        for (let i = 0; i < pattern.length; i++) {
            const patternChar = pattern.charAt(i);
            const char = value.charAt(i);
            if (patternChar.match(/[90LRБES]/g) && char !== '-') {
                unmaskedValue += char;
            }
        }
        return unmaskedValue;
    }

    return value;
}

export const validateByMask = (value: string | undefined, pattern: string): boolean => {
    if (value && pattern) {
        const regExps = convertToRegExpArray(pattern, true);

        let regExpString = '';
        for (let i = 0; i < regExps.length; i++) {
            const regexp = regExps[i];
            if (typeof regexp !== 'string') {
                regExpString += regexp.toString().replace(/\//gi, '');
            }
            // else {
            //     regExpString += '\\' + regexp;
            // }
        }

        const fullRegex = new RegExp(regExpString, 'gi');
        return value.match(fullRegex) !== null;
    }

    return true;
}

export const convertToRegExpArray = (value: string, includeExceptMetacharacter: boolean = false, startWith?: string): (string | RegExp)[] => {
    const regExps: (string | RegExp)[] = [];
    for (let i = 0, regexChars = 0; i < value.length; i++, regexChars++) {

        const char = value.charAt(i);
        switch (char) {
            case '9':
                if (regexChars < (startWith?.length ?? 0)) {
                    regExps.push(startWith!.charAt(regexChars));
                    break;
                }
                regExps.push(includeExceptMetacharacter ? /\d?/ : /\d/);
                break;
            case '0':
                if (regexChars < (startWith?.length ?? 0)) {
                    regExps.push(startWith!.charAt(regexChars));
                    break;
                }
                regExps.push(/\d/);
                break;
            case 'L':
                if (regexChars < (startWith?.length ?? 0)) {
                    regExps.push(startWith!.charAt(regexChars));
                    break;
                }
                regExps.push(includeExceptMetacharacter ? /[A-Za-z]?/ : /[A-Za-z]/);
                break;
            case 'R':
                if (regexChars < (startWith?.length ?? 0)) {
                    regExps.push(startWith!.charAt(regexChars));
                    break;
                }
                regExps.push(/[A-Za-z]/);
                break;
            case 'Б':
                if (regexChars < (startWith?.length ?? 0)) {
                    regExps.push(startWith!.charAt(regexChars));
                    break;
                }
                regExps.push(/[А-Яа-я]/);
                break;
            case 'E':
                if (regexChars < (startWith?.length ?? 0)) {
                    regExps.push(startWith!.charAt(regexChars));
                    break;
                }
                regExps.push(includeExceptMetacharacter ? /[A-Za-z .]?/ : /[A-Za-z .]/);
                break;
            case 'S':
                if (regexChars < (startWith?.length ?? 0)) {
                    regExps.push(startWith!.charAt(regexChars));
                    break;
                }
                regExps.push(/[A-Za-zА-Яа-я0-9]/);
                break;
            default:
                regexChars--;
                regExps.push(char);
                break;
        }
    }
    return regExps;
}

export const formatDate = (value: any): string => {
    return value
        ? format(new Date(value), 'dd.MM.yyyy')
        : '';
}

export const formatDateTime = (value: any): string => {
    return value
        ? format(new Date(value), 'dd.MM.yyyy HH:mm:ss')
        : '';
}

export const formatTimeDate = (value: any): string => {
    return value
        ? format(new Date(value), 'HH:mm:SS dd.MM.yyyy')
        : '';
}

export const formatMoney = (value: any): string => {
    return !isNaN(Number(value))
        ? Number(value).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$& ').replace('.', ',')
        : value;
}

export const formatMMYY = (value: any): string => {
    return value
        ? format(new Date(value), 'MM/yy')
        : '';
}

export const formatTimespan = (value: any): string => {
    if (value) {
        const values = (value as string).split(/[.:]/);

        let description = '';
        description += values[0] && Number(values[0]) > 0 ? Number(values[0]) + ' дней, ' : '';
        description += values[1] && Number(values[1]) > 0 ? Number(values[1]) + ' часов, ' : '';
        description += values[2] && Number(values[2]) > 0 ? Number(values[2]) + ' минут, ' : '';
        description += values[3] && Number(values[3]) > 0 ? Number(values[3]) + ' секунд, ' : '';
        description += values[4] && Number(values[4]) > 0 ? Number(values[4]) + ' милисекунд, ' : '';

        return description.replace(/, $/, '');
    }
    
    return value;
}

export const linkTo = (link: string, id: undefined | string | number, idParameterName: string = ':id'): string => {
    return link.replace(idParameterName, typeof id === 'number' ? id.toString() : (id ?? idParameterName));
}