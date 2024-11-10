import UserModel from '../models/userModel.js';

class UserController {
  async registration(req, res) {
    try {
      const { email, pass } = req.body;
      const activationLink = 1;

      // check: is existe user with this email
      const candidate = await UserModel.findOne({ email: email });
      if (candidate)
        return res.status(409).json({ message: 'User with email: ' + email + ' already exists :(' });

      //TODO HASH salt
      const passwordHash = pass;

      const user = await UserModel.create({
        email: email,
        passwordHash: passwordHash,
        createdDate: new Date(),
        updateDate: new Date(),
        activationLink,
      });

      const userDTO = user.toObject();
      delete userDTO.passwordHash;
      delete userDTO.createdDate;
      delete userDTO.updateDate;
      delete userDTO.__v;

      return res.status(201).json({ user: userDTO, message: 'user added success! :)' });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Server error' });
    }
  }
  async login(req, res) {
    try {
      const { email, pass } = req.body;

      // check: is existe user with this email
      const candidate = await UserModel.findOne({ email: email });
      if (!candidate)
        return res.status(404).json({ message: 'User with email: ' + email + ' is not exist :(' });

      // check: pass
      if (candidate.passwordHash !== pass) return res.status(404).json({ message: 'Pass incorrect :(' });

      return res.status(200).json({ _id: candidate._id, message: 'Sign-in is success! :)' });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Server error' });
    }
  }

  async userData(req, res) {
    try {
      const { email } = req.query;

      const user = await UserModel.findOne({ email: email }).select('-email -createdDate -__v');

      if (!user) {
        return res.status(404).json({ message: `User with email ${email} is not exist :(` });
      }

      return res.status(200).json({ _id: user._id });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Server error' });
    }
  }

  async emailById(req, res) {
    try {
      const { _id } = req.query;

      const user = await UserModel.findOne({ _id: _id }).select('-_id -createdDate -__v');

      if (!user) {
        return res.status(404).json({ message: `User with _id ${_id} is not exist :(` });
      }

      return res.status(200).json({ email: user.email });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Server error' });
    }
  }
}

export default new UserController();
