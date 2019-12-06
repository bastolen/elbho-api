class AuthController {
  static login(req, res, next) {
    console.log('auth.controller.ts:3 | : ', req);
    console.log('auth.controller.ts:4 | : ', res);
    console.log('auth.controller.ts:5 | : ', next);
  }
}

export { AuthController };
