import models from '../Models/index';

export default class UserController {
  constructor(server) {
    server.route({
      method: 'GET',
      path: '/users/{id}',
      handler: this.find,
    });
    server.route({
      method: 'GET',
      path: '/users',
      handler: (request, h) => models.User.findAll(),
    });
    server.route({
      method: 'POST',
      path: '/users',
      handler: this.create,
    });
    server.route({
      method: 'PATCH',
      path: '/users/{id}',
      handler: this.update,
    });
  }

  async find(request, h) {
    const user = await models.User.findById(request.params.id);
    if(user){
      return h.response(user);
    }
    return h.response().code(404);
  }

  async create(request, h) {
    const created = await models.User.create(request.payload);
    if (created) {
      return h.response(created).code(201);
    }
    //it should not reach here
    return h.response().code(400);
  }

  async update(request, h) {
    const findUser = await models.User.find(request.payload.id);
    if(!findUser){
      return h.response(findUser).code(204);
    }
    console.log(findUser);

    return await findUser.update(request.payload)
      .then((updatedUser) => h.response(updatedUser));
  }
}
