import AuthController from '@/controllers/auth.controller';
import AuthApiService from '@/api-services/auth.service';
import EZAxios from '@/ezaxios';

let redirect = null;

async function requireAuth(to, from, next) {
  let auth = await AuthController.checkAuthStatus().is_admin;

  const autoLoginRoutes = ['admin-email-campaigns-edit', 'admin-email-campaigns', 'admin-prepare-order','admin-settings-widgets'];
  if(!auth && (autoLoginRoutes.includes(to.name)) && to.query['access-token']) {
    let data = { token: to.query['access-token'] };
    auth = false;
    await AuthApiService.loginByToken(data).then(r => {
        AuthController.login(r.data);
        if(!data.is_admin)
          console.log(`DON''T HAVE PERMISSION`);
        auth = true;
      })
      .catch(error => {
        console.log('LOGIN FAILED', error);
      });
    return (!auth && next({ name: 'index' })) || next();
  }

  if(auth) {
    // update permissions of the current admin
    const userData = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user'));
    const responseSubAccounts = await EZAxios.get('sub-accounts?auth=true');
    const currentAccount = responseSubAccounts.data['sub-accounts'].find(item => item.slug === userData.data.customer.slug);

    if(currentAccount) {
      const newUserData = { ...userData, data: { ...userData.data, customer: { ...userData.data.customer, permissions: currentAccount.permissions }} };

      localStorage.getItem('user') && localStorage.setItem('user', JSON.stringify(newUserData));
      sessionStorage.getItem('user') && sessionStorage.setItem('user', JSON.stringify(newUserData));
    }
  }
  if(!auth) {
    redirect = to;
    next({ name: 'login' });
  } else {
    redirect && next(redirect) || next();
    redirect = null;
  }
}

export {
  requireAuth
};
