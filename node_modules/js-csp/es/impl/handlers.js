import noop from 'lodash/noop';
import { Box } from './boxes';

export class FnHandler {

  constructor(blockable, func) {
    this.blockable = blockable;
    this.func = func || noop;
  }

  isActive() {
    // eslint-disable-line
    return true;
  }

  isBlockable() {
    return this.blockable;
  }

  commit() {
    return this.func;
  }
}

export class AltHandler {

  constructor(flag, func) {
    this.flag = flag;
    this.func = func;
  }

  isActive() {
    return this.flag.value;
  }

  isBlockable() {
    // eslint-disable-line
    return true;
  }

  commit() {
    this.flag.value = false;
    return this.func;
  }
}