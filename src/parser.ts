import { Transaction } from './types.js';
import Engine from './engines/_Engine.js';

import getEngine from './engines/index.js';

export default class Parser {
  #engine: Engine | null = null;
  #message: string = '';

  constructor(message: string) {
    this.#message = message;
  }

  async #setEngine() {
    const message = this.#message;
    let engineName = getEngine(message);

    if (engineName) {
      const Engine: new(message: string) => Engine = await import(`./engines/${engineName}.js`).then((module) => module.default);
      this.#engine = new Engine(message);
    }
  }

  public async parseMessage(): Promise<Transaction | null> {
    await this.#setEngine();

    if (!this.#engine) {
      return null;
    }

    return this.#engine.getTransaction();
  }
}
