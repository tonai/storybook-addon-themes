export class Store {
  store = new Map();
  callbacks: ((key: any, value: any) => void)[] = [];

  get(key: any): any {
    return this.store.get(key);
  }

  has(key: any): boolean {
    return this.store.has(key);
  }

  set(key: any, value: any) {
    this.store.set(key, value);
    this.callbacks.forEach(callback => callback(key, value));
  }

  subscribe(callback: (key: any, value: any) => void) {
    this.callbacks.push(callback);
    return () => this.unsunscribe(callback);
  }

  unsunscribe(callback: (key: any, value: any) => void) {
    this.callbacks.splice(this.callbacks.indexOf(callback), 1);
  }
};
