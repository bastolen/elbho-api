import { AuthService } from '../service';

class AuthController {
  static login(req, res) {
    if (!req.body) {
      return res.sendStatus(400);
    }

    const { email, password } = req.body;
    if (!email || !password) {
      return res.sendStatus(400);
    }
    AuthService.login(email, password, (err, result) => {
      if (err || !result) {
        if (err === 'not found') {
          console.log(`Tried logging in with the email: ${email}`);
          return res.sendStatus(403);
        }
        return res.sendStatus(403);
      }
      return res.send({ token: result });
    });
  }
}

export { AuthController };
