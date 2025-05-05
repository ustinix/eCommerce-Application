export type Listener<K> = (data: K) => void;

type IEvent<K> = Record<string, Listener<K>[]>;

export class EventEmitter<K> {
  private events: IEvent<K> = {};

  public subscribeListener(eventName: string, listener: Listener<K>): void {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(listener);
  }

  public emitEvent(eventName: string, data: K): void {
    const listenerList = this.events[eventName];

    listenerList?.forEach(listener => listener(data));
  }

  public unsubscribeListener(eventName: string, listener: Listener<K>): void {
    const listenerList = this.events[eventName];
    const index = listenerList.indexOf(listener);

    if (index !== -1) listenerList.splice(index, 1);
  }
}

export const authEmitter = new EventEmitter<Event>();
