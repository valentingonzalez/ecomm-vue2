function createAuthorizeNetComponent(cart)
{
  const st = cart.$store.state;

  const scriptUrl = st.authorize_net_live === true
        ? 'https://js.authorize.net/v3/AcceptUI.js'
        : 'https://jstest.authorize.net/v3/AcceptUI.js';


  const script = document.createElement('script');
  script.src = scriptUrl;
  script.async = true;
  document.body.appendChild(script);

  window.authorizeResponseHandler = cart.handleAuthorizeResponse;
}

export {
  createAuthorizeNetComponent
};
