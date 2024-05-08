import EZAxios from '@/ezaxios';

let token = localStorage.getItem('token') || sessionStorage.getItem('token');

export default {
  login(obj, codes, device_id) {
    let telephone = obj.phone && obj.phone;
    let email = obj.email && obj.email;
    let otp = codes.code && codes.code;
    let password = codes.password && codes.password;
    let magicLinkToken = obj.magicLinkToken;
    if(obj.magicLinkToken)
      return EZAxios.post(`use-magic-link`, { email, magicLinkToken, device_id });
    if(obj.phone)
      return EZAxios.post(`verify-otp`, { telephone, otp, device_id });
    else
      return EZAxios.post(`login`, { email, password, device_id });
  },
  loginByToken(data) {
    return EZAxios.post(`login-by-token`, data);
  },
  verifyEmailOrPhone(payload) {
    return EZAxios.post(`check-email-phone-exists`, payload);
  },
  sendOTP(telephone) {
    return EZAxios.post(`send-otp`, { telephone });
  },
  generateMagicLink(email) {
    return EZAxios.post(`send-magic-link`, {email: email});
  },
  logout() {
    return EZAxios.post(`logout?access_token=${token}`);
  },
  forgotPassword(email) {
    return EZAxios.post(`forget-password`, {email: email});
  },
  resetPassword(code, password, email) {
    let data = { code: parseInt(code), password: password, password_confirmation: password, email: email };
    return EZAxios.post(`reset-password`, data);
  }
};
