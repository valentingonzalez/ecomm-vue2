import AuthController from '@/controllers/auth.controller';

let redirect = null;

async function requireClient(to, from, next) {
  let auth = await AuthController.checkAuthStatus();
  if(auth && !auth.is_admin) {
    redirect && next(redirect) || next();
    redirect = null;
  } else {
    redirect = to;
    localStorage.setItem('pathToLoadAfterLogin', to.path);
    next({ name: 'login' });
  }
}

export {
    requireClient
};
