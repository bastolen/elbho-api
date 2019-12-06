import { helper } from '../config';

const authMiddleWare = (req, res, next) => {
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
        return res
          .status(401)
          .send({ success: false, message: 'Unauthorized', error: err });
      }
      req.user = decoded;
      next();
    });
  } else {
    return res.status(401).send({ success: false, message: 'Unauthorized' });
  }
};

export { authMiddleWare };
