import _ from 'lodash';
import { getFingerPrint } from '@/utils/helper';
import { setFingerPrint } from '@/utils/store';

if (process.env.NODE_ENV === 'development' || _.includes(['local', 'pre'], process.env.UMI_ENV)) {
  const VConsole = require('vconsole');
  // eslint-disable-next-line no-new
  new VConsole();
}

function saveFingerPrint() {
  return getFingerPrint().then(fp => {
    return setFingerPrint(fp);
  });
}

function main() {
  saveFingerPrint();
}

window.setTimeout(main);
