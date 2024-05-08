<template>
    <div id="qb-posts"></div> 
  </template>
  
  <script>
    export default  {
      name: 'Blog',
      data() {
        return {
          
        };
      },
      mounted() {
        let recaptchaScript = document.createElement('script');
        recaptchaScript.setAttribute('src', 'https://app.quickblog.co/js/embed.js?qb_id=7553LQujaN3oRG4IqkbjPDCuAgegA45tb9J8r8Zyzz9G');
        document.head.appendChild(recaptchaScript);
      },
      methods: {
       
      }
    };
  </script>
  
  <style lang="scss" scoped>
  
  </style>
  