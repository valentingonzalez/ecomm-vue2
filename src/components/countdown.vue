<template>
  <div>
    <slot :day="day" :hour="hour" :min="min" :sec="sec"></slot>
    <p><span v-if="day != '00'">{{ day }}d</span> {{ hour }}h {{ min }}m {{ sec }}s</p>
  </div>
</template>

<script>
export default {
  props: {
    endDate: {
      // pass date object till when you want to run the timer
      type: String,
      coerce: str => Math.trunc(Date.parse(str) / 1000),
      default() {
        return new Date();
      }
    },
    negative: {
      // optional, should countdown after 0 to negative
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      now: new Date(),
      timer: null,
      oneDay: 24 * 60 * 60 * 1000
    };
  },
  mounted: function() {
    this.formatDate();
  },
  methods: {
    formatDate: function() {
      this.endDate = Date.parse(this.endDate);
      return this.endDate;
    }
  },
  computed: {
    day() {
      let d = Math.trunc((this.endDate - this.now) / this.oneDay);
      return d > 9 ? d : "0" + d;
    },
    hour() {
      let h = Math.trunc((this.endDate - this.now) / 1000 / 3600);
      if (h >= 24) {
        h = 23;
      }
      return h > 9 ? h : "0" + h;
    },
    min() {
      let m = Math.trunc((this.endDate - this.now) / 1000 / 60) % 60;
      return m > 9 ? m : "0" + m;
    },
    sec() {
      let s = Math.trunc((this.endDate - this.now) / 1000) % 60;
      return s > 9 ? s : "0" + s;
    }
  },
  watch: {
    endDate: {
      immediate: true,
      handler(newVal) {
        if (this.timer) {
          clearInterval(this.timer);
        }
        this.timer = setInterval(() => {
          this.now = new Date();
          if (this.negative) return;
          if (this.now > newVal) {
            this.now = newVal;
            this.$emit("endTime");
            clearInterval(this.timer);
          }
        }, 1000);
      }
    }
  },
  beforeDestroy() {
    clearInterval(this.timer);
  }
};
</script>
