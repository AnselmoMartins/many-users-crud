import jwt from 'jsonwebtoken';
import authConfig from '../../config/auth';

import User from '../models/User';

class SessionController {
  async store(req, res) {
    const { email, password } = req.body;

    if (!email) {
      return res.status(401).json({ error: 'Email not Found' });
    }

    if (!password) {
      return res.status(401).json({ error: 'Password not Found' });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: 'password does not match' });
    }

    const { id } = user;

    const token = jwt.sign({ id }, authConfig.authSignature, {
      expiresIn: authConfig.expiresIn,
    });

    return res.status(200).json({
      id,
      email,
      token,
    });
  }
}

export default new SessionController();
