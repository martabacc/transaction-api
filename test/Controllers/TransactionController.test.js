import { expect } from 'chai';
import Hapi from 'hapi';
import App from '../../src/App';
import models from '../../src/Models/index';

describe('TransactionController', () => {
  let server = null;
  let user = null;

  beforeEach(async () => {
    server = new Hapi.Server();
    new App(server).configure();
    user = await models.User.create({ name: 'Christo AP', email: 'christo_ganteng@mail.com' });
  });

  afterEach(async () => {
    await models.Transaction.destroy({ where: {}, truncate: true });
    await models.User.destroy({ where: { name: 'Christo AP' }, truncate: true });
  });

  describe('[READ] GET /transactions/{id}', async () => {
    it('should return the transaction of specified id', async () => {
      const transactionDate = Date.now();
      const transactionData = {
        amount: -1000000,
        description: 'Buying Rona some presents',
        date: transactionDate,
        user_id: user.id,
      };
      const transactionFromDB = await models.Transaction.create(transactionData);
      const response = await server.inject(`/transactions/${transactionFromDB.id}`);
      const transactionFromAPI = JSON.parse(response.payload);
      expect(transactionFromAPI.id).to.eq(transactionFromDB.id);
      expect(transactionFromAPI.amount).to.eq(-1000000);
      expect(transactionFromAPI.description).to.eq('Buying Rona some presents');
      const parsedActualDate = Date.parse(transactionFromAPI.date);
      expect(parsedActualDate).to.eq(transactionDate);
    });
    it('should return 404 when id is not found', async () => {
      const response = await server.inject('/transactions/9999');
      expect(response.statusCode).to.equal(404);
    });
  });

  describe('[CREATE] POST /transactions', async () => {
    it('should create the transaction', async () => {
      const transactionDate = Date.now();
      const transactionData = {
        amount: -1000000,
        description: 'Buying Rona birthday presents',
        date: transactionDate,
        user_id: user.id,
      };

      const transactionRequest = {
        method: 'POST',
        url: '/transactions',
        payload: transactionData,
      };

      const transactionFromAPI = await server.inject(transactionRequest);
      expect(transactionFromAPI.statusCode).to.equal(201);

      const transactionFromDB = await models.Transaction.findOne();
      const serverResponse = JSON.parse(transactionFromAPI.payload);

      expect(transactionFromDB.id).to.eq(serverResponse.id);
      expect(transactionFromDB.amount).to.eq(-1000000);
      expect(transactionFromDB.description).to.eq('Buying Rona birthday presents');

      const parsedActualDate = Date.parse(serverResponse.date);
      expect(parsedActualDate).to.eq(transactionDate);
    });
  });

  describe('[LIST: User] GET /users/{id}/transaction', () => {
    it('should create the transaction', async () => {
      const transactionData = {
        amount: -1000000,
        description: 'Buying Rona birthday presents',
        date: Date.now(),
        user_id: user.id,
      };
      const anotherTransactionData = {
        amount: -1000000,
        description: 'Buying Rona ice creams',
        date: Date.now(),
        user_id: user.id,
      };

      await server.inject({
        method: 'POST',
        url: '/transactions',
        payload: transactionData,
      });
      await server.inject({
        method: 'POST',
        url: '/transactions',
        payload: anotherTransactionData,
      });

      const transactionFromAPI = await server.inject(`/users/${user.id}/transactions`);
      const serverResponse = JSON.parse(transactionFromAPI.payload);

      expect(serverResponse[0].amount).to.eq(-1000000);
      expect(serverResponse[0].description).to.eq('Buying Rona birthday presents');
      const parsedActualFirstDate = Date.parse(serverResponse[0].date);
      expect(parsedActualFirstDate).to.eq(transactionData.date);

      expect(serverResponse[1].amount).to.eq(-1000000);
      expect(serverResponse[1].description).to.eq('Buying Rona ice creams');
      const parsedActualSecondDate = Date.parse(serverResponse[1].date);
      expect(parsedActualSecondDate).to.eq(anotherTransactionData.date);
    });
    it('should return 404 for invalid/inexist customer id', async () => {
      const badRequest = await server.inject('/users/99999/transactions');
      expect(badRequest.statusCode).to.eq(404);
    });
  });
});
