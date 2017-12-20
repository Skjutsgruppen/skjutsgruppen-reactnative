import { ToastCode } from '@config/toastCode';

export function getToast(toast) {
  const toastArray = [];

  if (toast.graphQLErrors) {
    toast.graphQLErrors.forEach(err => toastArray.push(ToastCode[err.code]));

    return toastArray.join('\n');
  }

  toast.forEach(err => toastArray.push(ToastCode[err]));

  return toastArray.join('\n');
}
