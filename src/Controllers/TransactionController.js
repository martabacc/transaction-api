import models from '../Models/index';

export default class TransactionController {
  constructor(server) {
    server.route({
      method: 'GET',
      path: '/transactions/{id}',
      handler: this.find,
    });
    server.route({
      method: 'GET',
      path: '/transactions',
      handler: () => models.Transaction.findAll(),
    });
    server.route({
      method: 'POST',
      path: '/transactions',
      handler: this.create,
    });
    server.route({
      method: 'GET',
      path: '/users/{id}/transactions',
      handler: this.listByUser,
    });
  }

  async create(request, h) {
    const userCreated = await models.Transaction.create(request.payload);
    if (userCreated) {
      return h.response(userCreated).code(201);
    }
    // it should not reach here
    return h.response(userCreated).code(400);
  }

  async find(request, h) {
    const transaction = await models.Transaction.findById(request.params.id);
    if (transaction) {
      return h.response(transaction);
    }
    return h.response(transaction).code(404);
  }

  async listByUser(request, h) {
    const user = await models.User.findById(request.params.id);
    if (user) {
      const transaction = await user.getTransactions();
      return h.response(transaction);
    }
    return h.response('User Not Found!').code(404);
  }
}
