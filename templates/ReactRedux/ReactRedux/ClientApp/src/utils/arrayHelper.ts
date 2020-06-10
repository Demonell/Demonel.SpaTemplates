export const exceptArray = <T>(originArray: T[], arrayToExcept: T[]): T[] =>
    originArray.filter(c1 => !arrayToExcept.some(c2 => c2 === c1));

export const exceptArrayById = <T, R>(originArray: T[], arrayToExcept: T[], getId: (obj: T) => R): T[] =>
    originArray.filter(c1 => !arrayToExcept.some(c2 => getId(c2) === getId(c1)));

export const exceptArrayShallow = <T>(originArray: T[], arrayToExcept: T[]): T[] =>
    originArray.filter(c1 => !arrayToExcept.some(c2 => JSON.stringify(c2) === JSON.stringify(c1)));