import type { PublicEvent } from './event.public';

export type AdminEvent = PublicEvent & {
  status: 'DRAFT' | 'PUBLISHED';
};
