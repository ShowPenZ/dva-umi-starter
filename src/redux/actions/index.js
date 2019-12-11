import { generateActionsByTypes } from '@/redux/actions/handler';
import * as TYPES from '@/redux/types/index';

export default {
  ...generateActionsByTypes(TYPES),
};
