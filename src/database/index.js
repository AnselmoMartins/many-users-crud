import Sequelize from 'sequelize';

import User from '../app/models/User';
import Address from '../app/models/Address';
import Phone from '../app/models/Phone';

import databaseConfig from '../config/database';

const models = [User, Address, Phone];
class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models.map((model) => model.init(this.connection));
    models.map((model) => {
      if (model.associate) {
        model.associate(this.connection.models);
      }
      return model;
    });
  }
}

export default new Database();
