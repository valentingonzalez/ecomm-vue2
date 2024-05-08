<template>
  <div class="container">
    <div class="subscription-header">
      <h5 class="section-title">
        <img class="icon-shape" src="/icons/tile-shape.png"/>
        Subscription
        <span class="edit">
              <a><img src="/images/edit.png" alt="Edit" /></a>
              <a><img src="/images/remove.png" alt="Remove" /></a>
            </span>
      </h5>
    </div>
    <section class="bg-white">
      <div class="row">
        <div class="col-md-6">
          <img :src="options.image" alt="Flash deal" class="img-fluid">
        </div>
        <div class="col-md-6 d-flex align-items-center">
          <div id="flash-deal">
            <h1>{{ options.title }}</h1>
            <h2>{{ options.subtitle | upperCase }}</h2>

            <input
              id="subscriberEmail"
              v-model="subscriberEmail"
              type="text"
              class="form-control"
              placeholder="Enter Email Address"
              aria-label="Enter Email"
              @keypress.enter="subscribe">
            <small id="subscriberEmailSuccess" ref="subscriberEmailSuccess" class="d-none form-text">
              Successfully subscribed!
            </small>
            <button
              type="button"
              class="btn btn-primary"
              @click="subscribe">
              Submit
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>

</template>

<script>
  export default {
    name: 'SubscribeSection',
    data() {
      return {
        subscriberEmail: null
      };
    },
    computed: {
      options() {
        let subscribeSection = this.$store.state.homepage.find(x => x.widget_type === '3');
        return subscribeSection.data;
      }
    },
    methods: {
      subscribe() {

      }
    }
  };
</script>

<style lang="scss" scoped>
  .subscription-header {
    margin-bottom: 15px;
    padding-left: 30px;

    .section-title {
      display: flex;
      align-items: center;
      margin-bottom: 0;

      .icon-shape {
        padding-right: 10px;
      }

      .edit {
        margin-left: 5px;

        a {
          margin: 0 3px;
        }
      }
    }
  }

  @media (max-width: 1299px) {
    #flash-deal {
      padding: 15px;
    }
  }
</style>
