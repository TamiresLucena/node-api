const uuid = require('uuid');
const bcrypt = require('bcrypt');

class UserController {
    users = []

    index(req, res) {
      return res.json(this.users);
    }

    show(req, res) {
      const { login } = req.params;

      const user = this.users.find((existentUser) => existentUser.login === login);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      delete user.id;
      delete user.password;
      return res.json(user);
    }

    async store(req, res) {
      const { login, password } = req.body;

      if (!login || !password) {
        return res.status(400).json({ message: 'Invalid name or password!' });
      }

      const userExists = this.users.find((user) => user.login === login);

      if (userExists) {
        return res.status(409).json({ message: 'User already exists!' });
      }

      const id = uuid.v4();
      const hashedPassword = await bcrypt.hash(password, 10);

      this.users.push({ id, login, password: hashedPassword });
      return res.status(200).json({ message: 'User added successfully!' });
    }

    async update(req, res) {
      const { login } = req.params;

      const userId = this.users.findIndex((user) => user.login === login);

      if (userId === -1) {
        return res.status(404).json({ message: 'User not found' });
      }

      // const newLogin = req.body.login
      // const password = req.body.password

      const { login: newLogin, password } = req.body;

      if (!newLogin || !password) {
        return res.status(400).json({ message: 'Invalid login or password' });
      }

      let hashedPassword;

      if (password) {
        hashedPassword = await bcrypt.hash(password, 10);
      }

      const user = this.users[userId];

      const loginExists = newLogin || user.login;
      const passwordExists = password ? hashedPassword : user.password;

      this.users[userId].login = loginExists;
      this.users[userId].password = passwordExists;

      return res.status(204).json({ message: 'User updated successfully' });
    }

    delete(req, res) {
      const { login } = req.params;

      const userId = this.users.findIndex((user) => user.login === login);

      if (userId === -1) {
        return res.status(404).json({ message: 'User not found' });
      }

      delete this.users[userId];

      return res.status(204).json({ message: 'User deleted' });
    }
}

module.exports = { UserController };
