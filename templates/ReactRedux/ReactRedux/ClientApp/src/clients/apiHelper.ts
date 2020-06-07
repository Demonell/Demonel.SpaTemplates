import { openTimedSnack } from '../app/Snack/duck';
import { RuntimeConfig } from '../RuntimeConfig';
import { store } from "..";

export const httpAuth = {
    fetch(url: RequestInfo, init?: RequestInit): Promise<Response> {
        const token = store.getState().oidc.user?.access_token;
        const headers = {
            'Authorization': `Bearer ${token}`,
            ...init?.headers as Headers
        };
        return window.fetch(url, { ...init, headers });
    }
}

export const showErrorSnack = (message: string): void => {
    store.dispatch<any>(openTimedSnack('error', message));
    console.log({ error: message });
}

export const showErrorSnackByException = (exception: any): void => {
    // console.log('type: ' + typeof exception);
    // TODO: determines wrong instance
    // if (exception instanceof ApiException) {
    //     switch (exception.status) {
    //         case 400:
    //             const validationProblemDetails = exception.result as ValidationProblemDetails;
    //             const firstError = getFirstValue(validationProblemDetails.errors)?.[0] || 'Ошибка валидации';
    //             store.dispatch<any>(openErrorSnack(firstError));
    //             break;
    //         case 404:
    //             store.dispatch<any>(openErrorSnack('Страница не найдена'));
    //             break;
    //         case 422:
    //             const apiExceptionResult = exception.result as ApiExceptionResult;
    //             store.dispatch<any>(openErrorSnack(apiExceptionResult.code + ': ' + apiExceptionResult.message));
    //             break;
    //         case 500:
    //             store.dispatch<any>(openErrorSnack('Внутренняя ошибка сервиса, свяжитесь с администратором!'));
    //             break;
    //         default:
    //             store.dispatch<any>(openErrorSnack(`Ошибка! Сервер вернул статус код: ${exception.status}`));
    //             break;
    //     }
    // } else {
    //     store.dispatch<any>(openErrorSnack('Что-то пошло не так'));
    // }
    // console.log({exception});
}

export const showErrorSnackByResponse = (response: Response): void => {
    // switch (response.status) {
    //     case 400:
    //         (response.json() as Promise<ValidationProblemDetails>)
    //             .then(validationProblemDetails => {
    //                 const firstError = getFirstValue(validationProblemDetails.errors)?.[0] || 'Ошибка валидации';
    //                 store.dispatch<any>(openErrorSnack(firstError));
    //             });
    //         break;
    //     case 404:
    //         store.dispatch<any>(openErrorSnack('Страница не найдена'));
    //         break;
    //     case 422:
    //         (response.json() as Promise<ApiExceptionResult>)
    //             .then(apiExceptionResult => {
    //                 store.dispatch<any>(openErrorSnack(apiExceptionResult.code + ': ' + apiExceptionResult.message));
    //             });
    //         break;
    //     case 500:
    //         store.dispatch<any>(openErrorSnack('Внутренняя ошибка сервиса, свяжитесь с администратором!'));
    //         break;
    //     default:
    //         store.dispatch<any>(openErrorSnack(`Ошибка! Сервер вернул статус код: ${response.status}`));
    //         break;
    // }
}

const getFirstValue = (data: { [key: string]: string[] } | undefined): string[] | undefined => {
    for (var prop in data)
        return data[prop];

    return undefined;
}