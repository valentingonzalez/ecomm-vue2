<template>
  <section class="about-text-wrapper">
    <div class="container">
      <div class="row">
        <div class="col-12 col-md-3 text-center">
          <img class="logo" width="200px" height="120px" src="/images/gerretsen/tal-holdings-logo.png" alt="Gerretsen Logo">
        </div>
        <div class="col-12 col-md-9">
          <p class="about-text">
            Based in Vancouver, Washington, TAL Holdings is a family-owned company helping to build better communities. At our ten home improvement stores located throughout the Pacific Northwest, we create a positive experience for our customers—pros and homeowners alike—by providing guidance for innovative, smart building solutions.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "About"
};
</script>

<style lang="scss" scoped>
  .about-text-wrapper {
    background-image: url("/images/gerretsen/wood-background.jpg");
    border-top: solid 3px #e31b23;
    padding: 30px 20px;
    .logo {
      margin-bottom: 30px;
    }
    .about-text {
      padding: 0 14px;
      height: 100%;
      width: 100%;
      display: flex;
      align-items: center;
      font-family: 'Open Sans', sans-serif;
      font-size: 16px;
      color: #000;
      text-align: left;
    }
  }
  @media only screen and (max-width: 768px) {
    .about-text-wrapper {
      .about-text {
        text-align: center;
      }
    }
  }
</style>
