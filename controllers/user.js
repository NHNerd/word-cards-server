import UserModel from '../models/userModel.js';

class UserController {
  async registration(req, res) {
    try {
      const { email, passwordHash } = req.body;
      const activationLink = 1;
      const createdDate = 1;

      // check: is existe user with this email
      const candidate = await UserModel.findOne({ email: email });
      if (candidate) return res.status(409).json({ message: 'User with this email already exists' });

      const user = await UserModel.create({
        email: email,
        passwordHash: passwordHash,
        createdDate: new Date(),
        activationLink,
      });
      return res.status(200).json({ message: 'user added success! :)' });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Server error' });
    }
  }
  async userData(req, res) {
    try {
      const { email } = req.query;

      const user = await UserModel.findOne({ email: email });
      return res.status(200).json({ _id: user._id });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Server error' });
    }
  }
}

export default new UserController();
