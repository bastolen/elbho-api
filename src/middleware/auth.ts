import { helper } from '../config';

const AuthMiddleWare = (req, res, next) => {
  const { authorization } = req.headers;
  if (
    authorization &&
    authorization.split(' ').length === 2 &&
    authorization
      .split(' ')[0]
      .toLowerCase()
      .includes('bearer') &&
    authorization.split(' ')[1].length > 0
  ) {
    helper.validateToken(authorization.split(' ')[1], (err, decoded) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.advisor = decoded;
      next();
    });
  } else {
    return res.sendStatus(403);
  }
};

export default AuthMiddleWare;
