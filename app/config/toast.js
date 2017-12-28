import { ApiToastCode, AppToastCode } from '@config/toastCode';

export function getToast(toast) {
  const toastArray = [];

  if (toast.graphQLErrors) {
    toast.graphQLErrors.forEach(err => toastArray.push(ApiToastCode[err.code]));

    return toastArray.join('\n');
  }

  toast.forEach(err => toastArray.push(AppToastCode[err]));

  return toastArray.join('\n');
}
