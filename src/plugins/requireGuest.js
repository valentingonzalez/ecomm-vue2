import AuthController from '@/controllers/auth.controller';

let redirect = null;

async function requireGuest(to, from, next) {
  let auth = await AuthController.checkAuthStatus();
  if(auth != false) {
    redirect = to;
    next({ name: "index" });
  } else {
    redirect && next(redirect) || next();
    redirect = null;
  }
}

export {
  requireGuest
};
