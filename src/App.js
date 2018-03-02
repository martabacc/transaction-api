import Blipp from 'blipp';
import TransactionController from './Controllers/TransactionController';
import UserController from './Controllers/UserController';

export default class App {
  constructor(server) {
    this._server = server;
  }

  async configure() {
    await this._server.register(Blipp);
    new UserController(this._server);
    new TransactionController(this._server);
  }

  async start() {
    await this.configure();
    this._server.start();
  }
}
