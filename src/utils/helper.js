import _ from 'lodash';
import { getLocale as getLocaleString } from 'umi-plugin-locale';
// import JSEncrypt from 'jsencrypt';
import Moment from 'moment';
import PathToRegexp from 'path-to-regexp';
import FingerPrint2 from 'fingerprintjs2';

export function px2Rem(px) {
  return px / 100;
}

export function timestampToTime(timestamp) {
  return Moment(timestamp).format('YYYY-MM-DD HH:mm:ss');
}

export function px2RemStr(px) {
  return `${px2Rem(px)}rem`;
}

export function getLocale() {
  return getLocaleString();
}

export function getToken() {
  return '';
}

export function hasString(value) {
  return _.isString(value) && !_.isEmpty(value);
}

export function mergeObject(...args) {
  return _.mergeWith(...args, customizerFn);
}

export function hasPlainObject(value) {
  return _.isPlainObject(value) && !_.isEmpty(value);
}

export function customizerFn(objValue, srcValue, key, object, source, stack) {
  if (_.isArray(srcValue) || _.isArrayBuffer(srcValue) || _.isArrayLikeObject(srcValue)) {
    return srcValue;
  }

  if (_.isPlainObject(srcValue) && _.isEmpty(srcValue)) {
    return srcValue;
  }
}

export function hasValue(value) {
  return !_.isNil(value);
}

export function hasArray(value) {
  return _.isArray(value) && !_.isEmpty(value);
}

export function flattenObject(obj, depth, prefix = '') {
  const limit = _.isInteger(depth);
  return _.reduce(
    _.keys(obj),
    (acc, k) => {
      const pre = prefix.length ? prefix + '.' : '';
      if ((limit ? depth > 1 : true) && hasPlainObject(obj[k])) {
        _.assign(acc, flattenObject(obj[k], limit ? depth - 1 : depth, pre + k));
      } else {
        acc[pre + k] = obj[k];
      }
      return acc;
    },
    {}
  );
}

// export function rsaEncrypt(message, publicKey = PUBLIC_KEY) {
//   const crypt = new JSEncrypt();
//   crypt.setPublicKey(publicKey);
//   return crypt.encrypt(message);
// }

export function getFingerPrint(options = {}) {
  // https://github.com/Valve/fingerprintjs2
  return FingerPrint2.getPromise(options).then(components => {
    return FingerPrint2.x64hash128(_.map(components, pair => pair.value).join(), 31);
  });
}

export function asyncCall(fn, timeout = 0) {
  return (...args) =>
    new Promise((resolve, reject) =>
      window.setTimeout(() => {
        try {
          resolve(fn(...args));
        } catch (error) {
          reject(error);
        }
      }, timeout)
    );
}

export function generateSubscriptionByRoutes(routes) {
  const pathName = _.keys(routes);
  // const asyncCall = fn => (...args) => window.setTimeout(() => fn(...args));

  return ({ dispatch, history }, onError) => {
    if (!hasPlainObject(routes)) {
      return;
    }

    let prevPathName = null;
    // eslint-disable-next-line complexity
    return history.listen((location, action) => {
      const { pathname: currPathName } = location;
      const event = { location, action, dispatch, onError };

      if (prevPathName === currPathName) {
        return;
      }

      for (let i = 0; i < pathName.length; i++) {
        const path = pathName[i];
        // console.log('\t@path:', path, '\t@prevPathName:', prevPathName, '\t@currPathName:', currPathName);

        const regexp = PathToRegexp(path);
        const prevMatch = regexp.exec(prevPathName);
        const currMatch = regexp.exec(currPathName);
        // console.log('\t@prevMatch:', prevMatch, '\t@currMatch:', currMatch);

        // TODO
        // if (hasArray(prevMatch) && hasArray(currMatch) && prevMatch.length !== currMatch.length) {
        //   const prev = routes[prevMatch.length > 1 ? path : prevPathName];
        //   if (hasPlainObject(prev) && _.isFunction(prev.onLeave)) {
        //     asyncCall(prev.onLeave)(_.assign({}, event, { match: prevMatch }), prev.context)
        //       .then(() => {
        //         prev.context = {};
        //       })
        //       .catch(error => onError(error));
        //   }

        //   const curr = routes[currMatch.length > 1 ? path : currPathName];
        //   if (hasPlainObject(curr) && _.isFunction(curr.onEnter)) {
        //     curr.context = {};
        //     asyncCall(curr.onEnter)(_.assign({}, event, { match: currMatch }), curr.context).catch(error =>
        //       onError(error)
        //     );
        //   }

        //   continue;
        // }

        if (hasArray(prevMatch) && currMatch === null) {
          const prev = routes[prevMatch.length > 1 ? path : prevPathName];
          if (hasPlainObject(prev) && _.isFunction(prev.onLeave)) {
            asyncCall(prev.onLeave)(_.assign({}, event, { match: prevMatch }), prev.context)
              .then(() => {
                prev.context = {};
              })
              .catch(error => onError(error));
          }

          continue;
        }

        if (prevMatch === null && hasArray(currMatch)) {
          const curr = routes[currMatch.length > 1 ? path : currPathName];
          if (hasPlainObject(curr) && _.isFunction(curr.onEnter)) {
            curr.context = {};
            asyncCall(curr.onEnter)(_.assign({}, event, { match: currMatch }), curr.context).catch(error =>
              onError(error)
            );
          }

          continue;
        }
      }

      prevPathName = currPathName;
    });
  };
}
