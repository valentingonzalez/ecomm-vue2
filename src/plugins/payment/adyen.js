function createAdyenComponent(cart, prepayData)
{
  const st = cart.$store.state;

  // technically, if the amount changes, it could change the result returned from
  // prePayment. however since amount is optional there i'm just going to leave it alone,
  // since having to rebuild the payment form after every change sounds like hell.
  const configuration = {
    locale: "en-US",
    environment: st.adyen_environment,
    originKey: st.adyen_origin_key,
    paymentMethodsResponse: prepayData,
    showPayButton: false,
    onChange: (state, component) => {
      console.log('adyen.onChange', state, component);
      if ( state.isValid ) {
        cart.adyenDataToSubmit = state.data.paymentMethod; // goes to payments
      }
    },
    onAdditionalDetails: (state, component) => {
      console.log('adyen.onAdditionalDetails', state, component);
      // const dataToSend = state.data; // goes to payments/details
    }
  };
  const checkout = new AdyenCheckout(configuration);
  return checkout.create('card').mount(cart.$refs.card_element);
}

export {
  createAdyenComponent
};
