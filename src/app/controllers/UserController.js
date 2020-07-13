/* eslint-disable no-restricted-syntax */
import * as Yup from 'yup';
import { Op } from 'sequelize';
import User from '../models/User';
import Address from '../models/Address';
import Phone from '../models/Phone';

class UserController {
  async index(req, res) {
    try {
      const { name, email } = req.query;
      let users = [];

      const attributes = ['id', 'email', 'name', 'createdAt', 'updatedAt'];

      switch (true) {
        case name && email == null: {
          users = await User.findAll({
            where: { name: { [Op.like]: `${name}%` } },
            include: ['addresses'],
            attributes,
          });
          break;
        }
        case email && name == null: {
          users = await User.findAll({
            where: { email: { [Op.like]: `${email}%` } },
            include: ['addresses'],
            attributes,
          });
          break;
        }
        case email && name: {
          users = await User.findAll({
            where: {
              name: { [Op.like]: `${name}%` },
              email: { [Op.like]: `${email}%` },
              include: ['addresses'],
              attributes,
            },
          });
          break;
        }
        default:
          users = await User.findAll();
          break;
      }

      return res.status(200).json(users);
    } catch (error) {
      return res.status(400).json({ error: 'Unable to find users' });
    }
  }

  async show(req, res) {
    const { id } = req.params;

    try {
      const user = await User.findOne({
        where: { id },
        include: ['addresses, phones'],
      });

      if (!user) {
        return res.status(400).json({ error: 'User not found' });
      }

      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({ error: 'Unable to find User' });
    }
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      users: Yup.array()
        .of(
          Yup.object().shape({
            name: Yup.string().required(),
            email: Yup.string().email().required(),
            password: Yup.string().required().min(6),
            addresses: Yup.array().of(
              Yup.object().shape({
                zipCode: Yup.string()
                  .required()
                  .matches(/^[0-9]+$/, 'Must be only digits')
                  .min(8, 'Zip Code Must be exactly 8 digits')
                  .max(8, 'Zip Code Must be exactly 8 digits'),
                city: Yup.string().required(),
                state: Yup.string()
                  .required()
                  .matches(/^[a-zA-Z]+$/, 'State Must be only letters')
                  .min(2, 'State Must be exactly 2 digits')
                  .max(2, 'State must be excatly 2 digits'),
                street: Yup.string().required(),
                number: Yup.number().required(),
                complement: Yup.string(),
              })
            ),
            phones: Yup.array().of(
              Yup.object().shape({
                phone: Yup.string()
                  .max(14, 'Phone has 14 digits limit')
                  .required(),
              })
            ),
          })
        )
        .required(),
    });

    try {
      await schema.validate(req.body);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }

    const { users } = req.body;

    try {
      const result = await User.sequelize.transaction(async (t) => {
        for await (const user of users) {
          const hasUser = await User.findOne({ where: { email: user.email } });

          if (hasUser) {
            throw new Error('User already exists');
          }

          await User.create(user, {
            include: ['addresses', 'phones'],
            transaction: t,
          });
        }

        return true;
      });

      const allUsers = await User.findAll({ include: ['addresses', 'phones'] });

      return res.status(200).json(allUsers);
    } catch (err) {
      return res.status(400).json({ error: err.message || 'Validation fails' });
    }
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string()
        .min(6)
        .when('password', (password, field) =>
          password ? field.required().oneOf([Yup.ref('password')]) : field
        ),
      addresses: Yup.object().shape({
        add: Yup.array().of(
          Yup.object().shape({
            zipCode: Yup.string()
              .required()
              .matches(/^[0-9]+$/, 'Must be only digits')
              .min(8, 'Zip Code Must be exactly 8 digits')
              .max(8, 'Zip Code Must be exactly 8 digits'),
            city: Yup.string().required(),
            state: Yup.string()
              .required()
              .matches(/^[a-zA-Z]+$/, 'State Must be only letters')
              .min(2, 'State Must be exactly 2 digits')
              .max(2, 'State must be excatly 2 digits'),
            street: Yup.string().required(),
            number: Yup.number().required(),
            complement: Yup.string(),
          })
        ),
        edit: Yup.array().of(
          Yup.object().shape({
            id: Yup.number().required(),
            zipCode: Yup.string()
              .matches(/^[0-9]+$/, 'Must be only digits')
              .min(8, 'Zip Code Must be exactly 8 digits')
              .max(8, 'Zip Code Must be exactly 8 digits'),
            city: Yup.string(),
            state: Yup.string()
              .matches(/^[a-zA-Z]+$/, 'State Must be only letters')
              .min(2, 'State Must be exactly 2 digits')
              .max(2, 'State must be excatly 2 digits'),
            street: Yup.string(),
            number: Yup.number(),
            complement: Yup.string(),
          })
        ),
        remove: Yup.array().of(
          Yup.object().shape({
            id: Yup.number().required(),
          })
        ),
      }),
      phones: Yup.object().shape({
        add: Yup.array().of(
          Yup.object().shape({
            phone: Yup.string().max(14, 'Phone has 14 digits limit').required(),
          })
        ),
        edit: Yup.array().of(
          Yup.object().shape({
            id: Yup.number().required(),
            phone: Yup.string().max(14, 'Phone has 14 digits limit'),
          })
        ),
        remove: Yup.array().of(
          Yup.object().shape({
            id: Yup.number().required(),
          })
        ),
      }),
    });

    try {
      await schema.validate(req.body);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }

    const { name, email, oldPassword, addresses, password, phones } = req.body;

    const user = await User.findByPk(req.userId);

    if (email && email !== user.email) {
      const userEmail = await User.findOne({ where: { email } });
      if (userEmail)
        return res
          .status(400)
          .json({ error: 'Email already exists, choose another.' });
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    try {
      const result = await User.sequelize.transaction(async (t) => {
        if (addresses) {
          if (addresses.add) {
            for await (const address of addresses.add) {
              const {
                zipCode,
                street,
                number,
                city,
                state,
                complement,
              } = address;
              await Address.create(
                {
                  zipCode,
                  street,
                  number,
                  city,
                  state,
                  complement,
                  userId: req.userId,
                },
                { transaction: t }
              );
            }
          }

          if (addresses.edit) {
            for await (const address of addresses.edit) {
              const {
                id,
                zipCode,
                street,
                number,
                city,
                state,
                complement,
              } = address;
              await Address.update(
                {
                  zipCode,
                  street,
                  number,
                  city,
                  state,
                  complement,
                  userId: req.userId,
                },
                { where: { id }, transaction: t }
              );
            }
          }

          if (addresses.remove) {
            for await (const address of addresses.remove) {
              const { id } = address;
              await Address.destroy({ where: { id }, transaction: t });
            }
          }
        }

        if (phones) {
          if (phones.add) {
            for await (const userPhone of phones.add) {
              const { phone } = userPhone;
              await Phone.create(
                {
                  phone,
                  userId: req.userId,
                },
                { transaction: t }
              );
            }
          }

          if (phones.edit) {
            for await (const userPhone of phones.edit) {
              const { id, phone } = userPhone;
              await Phone.update(
                {
                  phone,
                  userId: req.userId,
                },
                { where: { id }, transaction: t }
              );
            }
          }

          if (phones.remove) {
            for await (const userPhone of phones.remove) {
              const { id } = userPhone;
              await Phone.destroy({ where: { id }, transaction: t });
            }
          }
        }

        if (name || email || password) {
          const userInfoToUpdate = {};

          if (name) userInfoToUpdate.name = name;
          if (email) userInfoToUpdate.email = name;
          if (password) userInfoToUpdate.password = name;

          await user.update(userInfoToUpdate, {
            transaction: t,
          });
        }

        return true;
      });

      const updatedUser = await User.findOne({
        where: req.userId,
        include: ['addresses', 'phones'],
        attributes: ['id', 'email', 'name', 'createdAt', 'updatedAt'],
      });

      return res.status(201).json(updatedUser);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async destroy(req, res) {
    const { id } = req.params;

    try {
      const user = await User.findOne({ where: { id } });

      if (!user) {
        return res.status(400).json({ error: 'User not Found' });
      }

      user.destroy();

      return res.status(200).json({ error: 'User deleted successfully' });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

export default new UserController();
