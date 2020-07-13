export const validateNotEmpty = (value: string): string | undefined => {
    let error: string | undefined = undefined;
    if (!value) {
        error = 'Требуется ввести значение';
    }
    return error;
}