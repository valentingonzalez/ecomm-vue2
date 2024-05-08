<template>
  <main>
    <div class="container mt-3">
      <div class="row">
        <div class="col-md-5 col-lg-6 pr-md-5 d-flex flex-column">
          <h2>Contact Us</h2>
          <p v-if="description">
            {{ description }}
          </p>
          <template v-if="$store.state.currentStore">
            <div class="d-flex mt-3 justify-content-between">
              <div>
                <div class="mb-2">
                  <a class="font-weight-bold" :href="`tel:${$store.state.currentStore.phone}`">
                    <svg class="mr-2" width="17" height="17" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><path fill="#F7F7F7" d="M-175-222h1440v1408H-175z"/><path fill="#F7F7F7" opacity=".1" d="M-175-222h1440v785H-175z"/><path d="M11.014 10.264l-1.222 1.528a12.89 12.89 0 01-4.584-4.584l1.528-1.222c.368-.295.491-.801.3-1.232L5.643 1.617a1.038 1.038 0 00-1.21-.583L1.78 1.72c-.512.134-.843.63-.771 1.154A15.407 15.407 0 0014.125 15.99a1.044 1.044 0 001.153-.771l.688-2.651a1.038 1.038 0 00-.583-1.21l-3.137-1.393a1.04 1.04 0 00-1.232.299z" stroke="#F46526" stroke-linecap="round" stroke-linejoin="round"/></g></svg>
                    {{ $store.state.currentStore.phone }}
                  </a>
                </div>
                <div v-if="$store.state.businessDetails.contact_email && $store.state.settings.contactUs && !$store.state.settings.contactUs.hideEmail">
                  <a class="font-weight-bold" :href="`mailto:${$store.state.businessDetails.contact_email}`">
                    <svg class="mr-2" width="16" height="13" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><path fill="#F7F7F7" d="M-176-262h1440v1408H-176z"/><path fill="#F7F7F7" opacity=".1" d="M-176-262h1440v785H-176z"/><g stroke="#F46526" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 12.5h-13a1 1 0 01-1-1v-10a1 1 0 011-1h13a1 1 0 011 1v10a1 1 0 01-1 1z"/><path d="M2.5 3.5L8 8l5.5-4.5M2.5 9.5L4 8M13.5 9.5L12 8"/></g></g></svg>
                    {{ $store.state.businessDetails.contact_email }}
                  </a>
                </div>
                <address v-if="$store.state.currentStore.address" class="text-capitalize">
                  {{ $store.state.currentStore.address | lowerCase }},
                  {{ $store.state.currentStore.state | lowerCase }},
                  {{ $store.state.currentStore.city | lowerCase }}
                </address>
                <div class="hours">
                  <template v-for="(hours, day) in $store.state.currentStore.hours">
                    <div class="row" :key="day.dayOfWeek">
                      <div class="col-4">
                        <b>{{ dayName(day) }}</b>
                      </div>
                      <div class="col-8 text-center">
                        <span class="ml-2">{{ dayHours(hours) }}</span>
                      </div>
                    </div>
                  </template>
                </div>
              </div>
            </div>

            <div class="flex-grow-1 d-flex flex-column justify-content-end">
              <GmapMap class="my-3 my-md-0 map" ref="map" :options="{mapTypeControl: false}" :center="{lng: 0, lat: 0}" :zoom="16" />
            </div>
          </template>
        </div>
        <div class="col-md-7 col-lg-6">
          <div class="card p-4 p-sm-5">
            <form @submit.prevent="submit" v-if="!submitted">
              <div class="form-group">
                <label for="name">Name</label>
                <input id="name" type="text" class="form-control" placeholder="Name" :disabled="isSubmitting" required v-model="name" />
              </div>
              <div class="form-group">
                <label for="email">Email</label>
                <input id="email" type="email" class="form-control" placeholder="Email" :disabled="isSubmitting" required v-model="email" />
              </div>
              <div class="form-group">
                <label for="phone">Phone Number</label>
                <input id="phone" type="tel" class="form-control" placeholder="Phone Number" required :disabled="isSubmitting" v-model="phone" />
              </div>
              <div class="form-group">
                <label for="message">Message</label>
                <textarea id="message" class="form-control" placeholder="Write a message" rows="4" required :disabled="isSubmitting" v-model="message"></textarea>
              </div>
              <div class="d-flex align-items-center justify-content-end">
                <button class="btn btn-primary font-weight-bold" type="submit" :disabled="isSubmitting">
                  <span v-if="isSubmitting" class="spinner-border spinner-border-sm mr-3"></span>
                  Submit{{isSubmitting ? 'ting' : ''}}
                </button>
              </div>
            </form>
            <template v-else>
              <h3>Thank you for contacting us!</h3>
              <div class="d-flex mt-3">
                <button class="btn btn-primary" @click="() => submitted = false">Go back</button>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import ContactApiService from '@/api-services/contact.service';
export default {
  name: 'ContactUs',
  props: ['description'],
  data() {
    return {
      isSubmitting: false,
      submitted: false,
      name: '',
      email: '',
      phone: '',
      message: '',
    };
  },
  mounted() {
    this.$ezSetTitle('Contact Us');
    setTimeout(() => {
      this.$gmapApiPromiseLazy().then(() => {
        setTimeout(() => {
          let store = this.$store.state.currentStore;
          this.addMarker(this.$refs.map.$mapObject, `${store.address},${store.city},${store.state}`);
        }, 10);
      });
    }, 2000);
  },
  methods: {
    dayName(day) {
      const map = { sun: 'Sunday', mon: 'Monday', tue: 'Tuesday', wed: 'Wednesday', thu: 'Thursday', fri: 'Friday', sat: 'Saturday' };
      return map[day];
    },
    dayHours(hours) {
      if (!hours || hours.closed) return 'Closed';
      return `${hours.open} - ${hours.close}`;
    },
    addMarker(map, address) {
      let geocoder = new google.maps.Geocoder();
      geocoder.geocode({'address': address}, (results, status) => {
        if (status === 'OK') {
          let latLng = results[0].geometry.location;
          map.setCenter(latLng);
          new google.maps.Marker({
            position: latLng,
            map: map,
            title: this.$store.state.currentStore.name
          });
        } else {
          console.log('Geocode was not successful for the following reason: ' + status);
        }
      });
    },
    submit() {
      this.isSubmitting = true;
      let info = {
        name: this.name,
        email: this.email,
        phone: this.phone,
        description: this.message
      };
      ContactApiService.sendContactInfo(info).then(resp => {
        if(resp.data.status == 'success') {
          this.$swal("Received!", 'Will be contacting you shortly!', "success");
          this.submitted = true;
        } else {
          this.$swal('Missing Field', resp.data.errors.message, 'error');

        }
        this.isSubmitting = false;
      });
    }
  }
};
</script>

<style scoped>
a svg * {
  stroke: var(--primary);
}
.map {
  width: 100%;
  height: 300px;
  box-shadow: 0 3px 8px rgba(0,0,0,.07);
}
address {
  font-size: 15px;
  font-style: italic;
}
.hours {
  font-size: 13px;
}
@media (max-width: 767px) {
  button[type=submit] {
    width: 100%;
  }
}
</style>
