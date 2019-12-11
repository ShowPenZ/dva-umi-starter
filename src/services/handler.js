import { getJson, postJson, postForm, putJson, patchJson, deleteJson } from '@/utils/request';
// import { mergeObject } from '@/utils/helper';

export function generateApi(fn, url) {
  return (...args) => fn(url, ...args);
}

// export function generateAuthApi(fn, url) {
//   return (data, options, ...args) => {
//     fn(url, data, mergeObject({}, options, {}), ...args);
//   };
// }

// export const AUTH = {
//   get: url => generateAuthApi(getJson, url),
//   post: url => generateAuthApi(postJson, url),
//   form: url => generateAuthApi(postForm, url),
//   put: url => generateAuthApi(putJson, url),
//   patch: url => generateAuthApi(patchJson, url),
//   delete: url => generateAuthApi(deleteJson, url),
// };

export const API = {
  get: url => generateApi(getJson, url),
  post: url => generateApi(postJson, url),
  form: url => generateApi(postForm, url),
  put: url => generateApi(putJson, url),
  patch: url => generateApi(patchJson, url),
  delete: url => generateApi(deleteJson, url),
};
