import { Transaction } from './types.js';

import getEngine from './engines/index.js';

export default class Parser {
  #engine = null;
  #message: string = '';

  constructor(message: string) {
    this.#message = message;
  }

  async #setEngine() {
    const message = this.#message;

    const Engine = await import(`./engines/${getEngine(message)}.js`).then((module) => module.default);
    this.#engine = new Engine(message);
  }

  public async parseMessage(): Promise<Transaction | null> {
    try {
      await this.#setEngine();
    } catch (error) {
      return null;
    }

    if (!this.#engine) {
      return null;
    }

    return (this.#engine as any).getTransaction();
  }
}
