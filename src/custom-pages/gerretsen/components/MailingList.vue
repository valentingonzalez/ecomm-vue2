<template>
  <div class="mailing-list-wrapper">
    <div class="container">
      <form @submit.prevent="subscribe">
        <div class="subscribe-info">
          <div class="text-white mailing-headline-wrapper">
            <span class="mailing-headline">We write really great emails!</span>
          </div>
          <div class="input-wrapper">
            <div class="form-group text-right">
              <input type="email" v-model="email" class="form-control email-input" placeholder="Email Address" required/>
            </div>
          </div>
          <div class="btn-wrapper">
            <button :disabled="isSubscribing" type="submit" class="btn btn-go text-white">
              <span v-if="isSubscribing">
                <span class="fa fa-spinner fa-spin"></span>
              </span>
              <span v-else>
                GO
              </span>
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import SubscriberApiService from '@/api-services/subscriber.service';
export default {
  name: "Footer",
  data() {
    return {
      name: '',
      email: '',
      isSubscribing: false
    };
  },
  methods: {
    subscribe() {
      this.isSubscribing = true;

      SubscriberApiService.
      subscribe(this.email, this.name).then(() => {
        this.$swal('Subscribed', '', 'success');
      }).catch(err => {
        if (err.response.data.errors.hasOwnProperty('email')) {
          let error = err.response.data.errors.email;
          this.$swal('Oops', error[0], 'error');
        } else {
          this.$swal('Oops', 'Something went wrong. Please try again later.', 'error');
        }
      }).finally(() => this.isSubscribing = false);
    },
  }
};
</script>

<style lang="scss" scoped>
.subscribe-info {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .input-wrapper {
    flex: 1;
    width: 100%;
    margin: 0 24px;
  }

  .mailing-headline-wrapper  {
    flex: 1;
  }

  @media (max-width: 767px) {
    flex-direction: column;
    align-items: center;

    .input-wrapper {
      padding-right: 2px;
      margin: 18px 0 24px;
    }
  }
}

.mailing-list-wrapper {
  padding: 40px;
  background-color: #E31E24;

  .email-input {
    font-size: 16px;
    color: #6D6E70;
  }
  .input-wrapper .form-group {
    width: 100%;
  }
  span.mailing-headline {
    font-size: 24px;
    color: #fff;
    display: block;
    font-weight: bold;
  }
  .btn-go {
    background-color: #000;
    font-size: 18px;
    text-transform: uppercase;
  }
  .input-wrapper {
    padding-right: 2px;
  }
  .btn-wrapper {
    padding-left: 2px;
  }
  .form-group {
    margin-bottom: 0;
  }
}
</style>
