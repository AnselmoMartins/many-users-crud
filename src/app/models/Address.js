import Sequelize, { Model } from 'sequelize';

class Address extends Model {
  static init(sequelize) {
    super.init(
      {
        zipCode: Sequelize.STRING,
        city: Sequelize.STRING,
        state: Sequelize.STRING,
        street: Sequelize.STRING,
        number: Sequelize.INTEGER,
        complement: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );
  }
}

export default Address;
