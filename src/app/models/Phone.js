import Sequelize, { Model } from 'sequelize';

class Phone extends Model {
  static init(sequelize) {
    super.init(
      {
        phone: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );
  }
}

export default Phone;
