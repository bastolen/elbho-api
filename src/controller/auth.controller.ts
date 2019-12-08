import { AuthService } from '../service';

class AuthController {
  static login(req, res) {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.sendStatus(400);
    }
    AuthService.login(email, password, (err, result) => {
      if (err || !result) {
        if (err === 'not found') {
          return res.sendStatus(401);
        }
        return res.sendStatus(500);
      }
      return res.send({ token: result });
    });
  }
}

export { AuthController };
