<template>
  <div>
    <div :class="['__timepicker', tooltip ? 'focused' : '']">
      <input readonly v-model="fullTime" @focus="showTooltip" @blur="hideTooltip" type="text" class="time form-control" >
      <div class="timepicker-tooltip" @mousedown="()=>{usingPicker=true}" @mouseup="()=>{usingPicker=false}" :class="tooltip ? 'visible' : ''">
        <input v-model="dataHours" type="number" min="00" step="1" max="12" tabindex="500" class="form-control hours" @input="validateHours" />
        <span class="mx-1">:</span>
        <input v-model="dataMinutes" type="number" min="00" step="1" max="59" tabindex="500" class="form-control minutes" @input="validateMinutes" />
        <div class="meridiem-selector ml-2">
          <div @click="selectMeridiem" :class="['btn', 'am', this.dataMeridiem  == 'AM' ? 'selected' : '']" data-value="AM">am</div>
          <div @click="selectMeridiem" :class="['btn', 'pm', this.dataMeridiem  == 'PM' ? 'selected' : '']" data-value="PM">pm</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>


export default {
  name: 'TimePicker',
  props: {
    time: {
      type: String,
      default: '00:00 AM'
    }
  },
  data() {
    return {
      tooltip: false,
      usingPicker: false,
      selectedTooltip: null,
      dataHours: '',
      dataMinutes: '',
      dataMeridiem: ''
    };
  },
  computed: {
    fullTime() {
      return `${this.dataHours}:${this.dataMinutes} ${this.dataMeridiem}`;
    }
  },
  mounted() {
    let self = this;
    // Assign data from parent
    if(this.time) {
      this.dataHours = this.time.split(':')[0];
      this.dataMinutes = this.time.split(':')[1].split(' ')[0];
      this.dataMeridiem = this.time.split(' ')[1];
      this.dataHours = this.dataHours.length == 1 ? '0' + this.dataHours : this.dataHours;
    }
    document.addEventListener('mousedown', () => {
      if(!this.usingPicker) {
        self.hideTooltip();
      }
    });
  },
  methods: {
    showTooltip() {
      this.tooltip = true;
    },
    hideTooltip() {
      if(!this.usingPicker)
        this.tooltip = false;
    },
    selectMeridiem(evt) {
      if(!evt.target.classList.contains('selected')) {
        this.dataMeridiem = evt.target.attributes['data-value'].value;
      }
    },
    validateHours() {
      if(this.dataHours.length > 2) {
        this.dataHours = this.dataHours.slice(1);
      }
      this.dataHours = this.dataHours > 12 ? 12 : this.dataHours;
      this.dataHours = this.dataHours < 0 ? 0 : this.dataHours;
      this.dataHours = this.dataHours.length == 1 ? '0' + this.dataHours : this.dataHours;
    },
    validateMinutes() {
      if(this.dataMinutes.length > 2) {
        this.dataMinutes = this.dataMinutes.slice(1);
      }
      this.dataMinutes = this.dataMinutes > 59 ? 59 : this.dataMinutes;
      this.dataMinutes = this.dataMinutes < 0 ? 0 : this.dataMinutes;
      this.dataMinutes = this.dataMinutes.length == 1 ? '0' + this.dataMinutes : this.dataMinutes;
    }
  },
  watch: {
    fullTime(value) {
      this.$emit('update', value);
    }
  }
};
</script>
<style scoped lang="scss">
  
  .__timepicker {
    position: relative;
    margin: 0 4px;

    &::after {
      content: '';
      mask: url('data:image/svg+xml;base64,Cjxzdmcgd2lkdGg9IjE0cHgiIGhlaWdodD0iMTRweCIgdmlld0JveD0iMCAwIDE0IDE0IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogICAgPGcgaWQ9IkFkbWluLVNldHRpbmdzLVdpcmVmcmFtZXMiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSJBZG1pbi1WaWV3QDJ4LUNvcHktMyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTEyOTUuMDAwMDAwLCAtNTU3LjAwMDAwMCkiIHN0cm9rZT0iIzk3OTc5NyI+CiAgICAgICAgICAgIDxnIGlkPSJHcm91cC0xNS1Db3B5IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxMjE4LjAwMDAwMCwgNTQ4LjAwMDAwMCkiPgogICAgICAgICAgICAgICAgPGcgaWQ9InRpbWUtY2xvY2siIHRyYW5zZm9ybT0idHJhbnNsYXRlKDc4LjAwMDAwMCwgMTAuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTYsMCBMNiwyLjE4MTgxODE4IiBpZD0iUGF0aCI+PC9wYXRoPgogICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0xMiw2IEw5LjgxODE4MTgyLDYiIGlkPSJQYXRoIj48L3BhdGg+CiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTYsMTIgTDYsOS44MTgxODE4MiIgaWQ9IlBhdGgiPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMCw2IEwyLjE4MTgxODE4LDYiIGlkPSJQYXRoIj48L3BhdGg+CiAgICAgICAgICAgICAgICAgICAgPGNpcmNsZSBpZD0iT3ZhbCIgc3Ryb2tlLWxpbmVjYXA9InNxdWFyZSIgY3g9IjYiIGN5PSI2IiByPSI2Ij48L2NpcmNsZT4KICAgICAgICAgICAgICAgICAgICA8cG9seWxpbmUgaWQ9IlBhdGgiIHN0cm9rZS1saW5lY2FwPSJzcXVhcmUiIHBvaW50cz0iMy44MTgxODE4MiAyLjcyNzI3MjczIDYgNiA4LjE4MTgxODE4IDYiPjwvcG9seWxpbmU+CiAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg==');
      -webkit-mask: url('data:image/svg+xml;base64,Cjxzdmcgd2lkdGg9IjE0cHgiIGhlaWdodD0iMTRweCIgdmlld0JveD0iMCAwIDE0IDE0IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogICAgPGcgaWQ9IkFkbWluLVNldHRpbmdzLVdpcmVmcmFtZXMiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSJBZG1pbi1WaWV3QDJ4LUNvcHktMyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTEyOTUuMDAwMDAwLCAtNTU3LjAwMDAwMCkiIHN0cm9rZT0iIzk3OTc5NyI+CiAgICAgICAgICAgIDxnIGlkPSJHcm91cC0xNS1Db3B5IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxMjE4LjAwMDAwMCwgNTQ4LjAwMDAwMCkiPgogICAgICAgICAgICAgICAgPGcgaWQ9InRpbWUtY2xvY2siIHRyYW5zZm9ybT0idHJhbnNsYXRlKDc4LjAwMDAwMCwgMTAuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTYsMCBMNiwyLjE4MTgxODE4IiBpZD0iUGF0aCI+PC9wYXRoPgogICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0xMiw2IEw5LjgxODE4MTgyLDYiIGlkPSJQYXRoIj48L3BhdGg+CiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTYsMTIgTDYsOS44MTgxODE4MiIgaWQ9IlBhdGgiPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMCw2IEwyLjE4MTgxODE4LDYiIGlkPSJQYXRoIj48L3BhdGg+CiAgICAgICAgICAgICAgICAgICAgPGNpcmNsZSBpZD0iT3ZhbCIgc3Ryb2tlLWxpbmVjYXA9InNxdWFyZSIgY3g9IjYiIGN5PSI2IiByPSI2Ij48L2NpcmNsZT4KICAgICAgICAgICAgICAgICAgICA8cG9seWxpbmUgaWQ9IlBhdGgiIHN0cm9rZS1saW5lY2FwPSJzcXVhcmUiIHBvaW50cz0iMy44MTgxODE4MiAyLjcyNzI3MjczIDYgNiA4LjE4MTgxODE4IDYiPjwvcG9seWxpbmU+CiAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg==');
      background: #979797;
      width: 14px;
      height: 14px;
      position: absolute;
      top: 9px;
      right: 8px;
      pointer-events: none;
    }
    &.focused::after {
      background: var(--primary);
    }
    .form-control {
      height: 32px;
      width: 100%;
      max-width: 140px;
      background: #fff;
      color: #000;
      border-color: #E8E8E8;
      padding-left: .5rem;
      padding-right: .5rem;
      position: relative;
      &:focus {
        border-color: var(--primary);
        box-shadow: none;
      }
    }
    .timepicker-tooltip {
      position: absolute;
      padding: 8px;
      background: #fff;
      border: 1px solid #d8d8d8;
      border-radius: 4px;
      margin-top: 4px;
      display: flex;
      align-items: center;
      margin-left: -20px;
      opacity: 0;
      pointer-events: none;
      transition: opacity .2s;
      z-index: 10;
      &:after, &:before {
        content: '';
        bottom: 100%;
        left: 50%;
        border: solid transparent;
        height: 0;
        width: 0;
        position: absolute;
      }
      &:after {
        border-color: rgba(255, 255, 255, 0);
        border-bottom-color: #fff;
        border-width: 4px;
        margin-left: -4px;
      }
      &:before {
        border-color: rgba(194, 237, 141, 0);
        border-bottom-color: #d8d8d8;
        border-width: 5px;
        margin-left: -5px;
      }
      &.visible {
        opacity: 1;
        pointer-events: all;
      }
      .form-control {
        width: 64px;
        padding-left: 3px;
        padding-right: 3px;
        text-align: center;
      }
      .meridiem-selector {
        width: 37px;
        height: 32px;
        border: 1px solid var(--primary);
        border-radius: 4px;
        .btn {
          border-radius: 0;
          color: var(--primary);
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          height: 15px;
          line-height: 15px;
          padding: 0;
          display: block;
          width: 35px;
          border: none;
          text-align: center;
          cursor: pointer;
          &.am {
            border-top-right-radius: 2px;
            border-top-left-radius: 2px;
          }
          &.pm {
            border-bottom-right-radius: 2px;
            border-bottom-left-radius: 2px;
          }
          &.selected {
            background: var(--primary);
            color: #fff;
            cursor: default;
          }
        }
      }
    }
  }
</style>