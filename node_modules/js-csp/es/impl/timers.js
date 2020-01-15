import { queueDelay } from './dispatch';
import { chan, Channel } from './channels';

export function timeout(msecs) {
  // eslint-disable-line
  const ch = chan();

  queueDelay(() => ch.close(), msecs);

  return ch;
}