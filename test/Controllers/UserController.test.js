import { expect } from 'chai';
import Hapi from 'hapi';
import App from '../../src/App';
import models from '../../src/Models/index';

describe('UserController', () => {
  let server = null;

  beforeEach(() => {
    server = new Hapi.Server();
    new App(server).configure();
  });

  afterEach(() => {
    models.User.destroy({ where: {}, truncate: true });
  });

  describe('GET /users/{:id} [Find By Id]', () => {
    it('should return user of specified id', async () => {
      const userFromDB = await models.User.create(
        { name: 'Christo', email: 'christo_ganteng@mail.com' });
      const response = await server.inject(`/users/${userFromDB.id}`);
      const returnedUserResult = JSON.parse(response.payload);
      expect(returnedUserResult.id).to.eq(userFromDB.id);
      expect(returnedUserResult.name).to.eq('Christo');
      expect(returnedUserResult.email).to.eq('christo_ganteng@mail.com');
    });
    it('should return 404 if id is not exist', async () => {
      const response = await server.inject(`/users/10000`);
      expect(response.statusCode).to.equal(404);
    });
  });
  describe('POST /users  [Create]', () => {
    it('should create the given user in the database', async () => {
      const request = {
        method: 'POST',
        url: '/users',
        payload: {
          name: 'Christo',
          email: 'christo@ganteng.com',
        },
      };

      const response = await server.inject(request);
      expect(response.statusCode).to.equal(201);

      const dbResponse = await models.User.findOne();
      const serverResponse = JSON.parse(response.payload);

      expect(dbResponse.id).to.eq(serverResponse.id);
      expect(dbResponse.name).to.eq('Christo');
    });
  });
  describe('POST /users  [Create]', () => {
    it('should create the given user in the database', async () => {
      const createRequest = {
        method: 'POST',
        url: '/users',
        payload: {
          name: 'Christo',
          email: 'christo@ganteng.com',
        },
      };
      const response = await server.inject(createRequest);
      expect(response.statusCode).to.equal(201);

      const dbResponse = await models.User.findOne();
      const serverResponse = JSON.parse(response.payload);

      expect(dbResponse.id).to.eq(serverResponse.id);
      expect(dbResponse.name).to.eq('Christo');
    });
  });
  describe('PATCH /users  [Create]', () => {
    it('should update Christo email in the database', async () => {
      const createRequest = {
        method: 'POST',
        url: '/users',
        payload: {
          name: 'Christo',
          email: 'christo@ganteng.com',
        },
      };
      const createdUser = await server.inject(createRequest);
      const updateRequest = {
        method: 'PATCH',
        url: `/users/${createdUser.payload.id}`,
        payload: {
          email: 'christo_ganteng@mail.com',
        },
      };
      const updateResponse = await server.inject(updateRequest);
      expect(updateResponse.statusCode).to.equal(200);
      const updateUserDB = await models.User.findOne();

      expect(updateUserDB.email).to.eq('christo_ganteng@mail.com');
    });
    it('should return 204 status code for invalid update request', async () => {
      const updateRequest = {
        method: 'PATCH',
        url: `/users/-1000`,
        payload: {
          name: 'Roni'
        },
      };
      const updateResponse = await server.inject(updateRequest);
      expect(updateResponse.statusCode).to.equal(204);
    });
  });
});
