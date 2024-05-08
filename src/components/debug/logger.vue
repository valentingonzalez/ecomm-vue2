<template>
  <div class="logger-wrapper" v-if="isAdmin && !$route.query.wizard_step && !$route.query.wizard">
    {{ $route.query.wizard }}
    <a class="toggler" href="#" @click.prevent="toggleLogger">Toggle Stats</a>
    <div class="logger p-3" :class="{'opened': opened}">
      <div class="my-2 font-weight-bold">ADMIN STATS</div>
      <b-tabs fill content-class="mt-3">
        <b-tab title="Page">
          <template v-if="!Object.keys(pageLogs).length">
            No settings are being tracked on this page.
          </template>
          <template>
            <div class="block" v-for="(k,i) in pageHeadings" :key="`heading-${i}`">
              <p class="heading">{{i + 1}}. {{k}}</p>
              <ul>
                <li v-for="(log, index) in pageLogs[k]" :key="`pl-${k}-${index}`" :ref="`pl-${k}-${index}`" class="d-flex log" @keydown.esc="resetProp(log, `pl-${k}-${index}`, $event)">
                  {{ log.label }}{{ !log.hidevalue ? ':' : ''}}
                  <div v-if="!log.hidevalue">
                    <select class="boolean" @blur="onSelectBlur(log, `pl-${k}-${index}`, $event)" @change="updateLog(log, $event)" v-show="log.type == 'boolean' && editing == `pl-${k}-${index}`" v-model="log.value">
                      <option :value="true">true</option>
                      <option :value="false">false</option>
                    </select>

                    <select class="dropdown" @blur="onSelectBlur(log, `pl-${k}-${index}`, $event)" @change="updateLog(log, $event)" v-if="log.type == 'dropdown' && editing == `pl-${k}-${index}`" v-model="log.value">
                      <option v-for="o in log.plugin.data" :key="o.value" :value="o.value">{{ o.text }}</option>
                    </select>

                    <span @keyup="updateLog(log, $event)" class="value" v-html="`${log.value}`" @blur.stop.prevent="onBlur(log, `pl-${k}-${index}`, $event)" />
                  </div>
                  <div class="edit-buttons flex-grow-1" v-if="!log.readonly">
                    <a href="#" class="edit-bt ml-2" @click.prevent="focusLog(`pl-${k}-${index}`, log)" v-if="editing != `pl-${k}-${index}`" aria-label="Focus">
                      <svg width="12" height="12" xmlns="http://www.w3.org/2000/svg"><path d="M10.99 4.307L7.691 1.012 8.02.684a2.33 2.33 0 113.298 3.295l-.328.328zm-1.06 1.06L7.743 7.553l-2.95 2.95c-.374.342-4.189 1.46-4.189 1.46a.43.43 0 01-.567-.567s1.117-3.815 1.46-4.188l2.95-2.95 2.19-2.188L9.93 5.366z" fill="#FFF" fill-rule="evenodd"/></svg>
                    </a>
                    <a href="#" tabindex="-1" class="cancel-bt ml-2" @click.prevent="resetProp(log, `pl-${k}-${index}`, $event)" v-if="editing == `pl-${k}-${index}`" aria-label="Reset">
                      <svg width="14" height="14" xmlns="http://www.w3.org/2000/svg"><g fill="#EEE" fill-rule="nonzero"><path d="M7 0a7 7 0 107 7 7.008 7.008 0 00-7-7zm0 13.125A6.125 6.125 0 1113.125 7 6.132 6.132 0 017 13.125z"/><path d="M9.366 4.113L7.002 6.475 4.64 4.113a.372.372 0 10-.526.525L6.477 7 4.113 9.362a.37.37 0 10.516.534l.01-.01 2.363-2.361 2.364 2.362a.372.372 0 00.525-.525L7.528 7 9.89 4.638a.371.371 0 10-.525-.525z"/></g></svg>
                    </a>
                    <a href="#" tabindex="-1" class="save-bt ml-2" @click.prevent.stop="saveLog(log, `pl-${k}-${index}`, $event)" v-if="editing == `pl-${k}-${index}`" aria-label="Save">
                      <svg width="14" height="14" xmlns="http://www.w3.org/2000/svg"><path d="M0 14V2.059C0 .926.863 0 1.918 0H14v14H0zM10 3V1H2v2h8zm-3 9a3 3 0 100-6 3 3 0 000 6z" fill="#FFF" fill-rule="nonzero"/></svg>
                    </a>
                  </div>
                </li>
              </ul>
            </div>
          </template>
        </b-tab>
        <b-tab title="Global" active>
          <div class="block" v-for="(k,i) in generalHeadings" :key="`heading-${i}`">
            <p class="heading">{{i + 1}}. {{k}}</p>
            <ul>
              <li v-for="(log, index) in generalLogs[k]" :key="`gl-${k}-${index}`" :ref="`gl-${k}-${index}`" class="d-flex log" @keydown.esc="resetProp(log, `gl-${k}-${index}`, $event)">
                {{ log.label }}
                <span v-if="!log.hidevalue">:
                  <select class="boolean" @blur="onSelectBlur(log, `gl-${k}-${index}`, $event)" @change="updateLog(log, $event)" v-show="log.type == 'boolean' && editing == `gl-${k}-${index}`" v-model="log.value">
                    <option :value="true">true</option>
                    <option :value="false">false</option>
                  </select>

                  <select class="dropdown" @blur="onSelectBlur(log, `gl-${k}-${index}`, $event)" @change="updateLog(log, $event)" v-if="log.type == 'dropdown' && editing == `gl-${k}-${index}`" v-model="log.value">
                    <option v-for="o in log.plugin.data" :key="o.value" :value="o.value">{{ o.text }}</option>
                  </select>

                  <span @keyup="updateLog(log, $event)" class="value" v-html="`${log.value}`" @blur.stop.prevent="onBlur(log, `gl-${k}-${index}`, $event)" />
                </span>
                <div class="edit-buttons flex-grow-1" v-if="!log.readonly">
                  <a href="#" class="edit-bt ml-2" @click.prevent="focusLog(`gl-${k}-${index}`, log)" v-if="editing != `gl-${k}-${index}`" aria-label="Focus">
                    <svg width="12" height="12" xmlns="http://www.w3.org/2000/svg"><path d="M10.99 4.307L7.691 1.012 8.02.684a2.33 2.33 0 113.298 3.295l-.328.328zm-1.06 1.06L7.743 7.553l-2.95 2.95c-.374.342-4.189 1.46-4.189 1.46a.43.43 0 01-.567-.567s1.117-3.815 1.46-4.188l2.95-2.95 2.19-2.188L9.93 5.366z" fill="#FFF" fill-rule="evenodd"/></svg>
                  </a>
                  <a href="#" tabindex="-1" class="cancel-bt ml-2" @click.prevent="resetProp(log, `gl-${k}-${index}`, $event)" v-if="editing == `gl-${k}-${index}`" aria-label="Reset">
                    <svg width="14" height="14" xmlns="http://www.w3.org/2000/svg"><g fill="#EEE" fill-rule="nonzero"><path d="M7 0a7 7 0 107 7 7.008 7.008 0 00-7-7zm0 13.125A6.125 6.125 0 1113.125 7 6.132 6.132 0 017 13.125z"/><path d="M9.366 4.113L7.002 6.475 4.64 4.113a.372.372 0 10-.526.525L6.477 7 4.113 9.362a.37.37 0 10.516.534l.01-.01 2.363-2.361 2.364 2.362a.372.372 0 00.525-.525L7.528 7 9.89 4.638a.371.371 0 10-.525-.525z"/></g></svg>
                  </a>
                  <a href="#" tabindex="-1" class="save-bt ml-2" @click.prevent.stop="saveLog(log, `gl-${k}-${index}`, $event)" v-if="editing == `gl-${k}-${index}`" aria-label="Save">
                    <svg width="14" height="14" xmlns="http://www.w3.org/2000/svg"><path d="M0 14V2.059C0 .926.863 0 1.918 0H14v14H0zM10 3V1H2v2h8zm-3 9a3 3 0 100-6 3 3 0 000 6z" fill="#FFF" fill-rule="nonzero"/></svg>
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </b-tab>
        <b-tab title="Admin" v-if="showAdminTab">
          <div class="block" v-for="(k,i) in adminHeadings" :key="`aheading-${i}`">
            <p class="heading">{{i + 1}}. {{k}}</p>
            <ul>
              <li v-for="(log, index) in adminLogs[k]" :key="`al-${k}-${index}`" :ref="`al-${k}-${index}`" class="d-flex log">
                {{ log.label }}
                <button v-if="log.type == 'button'" type="button" class="btn btn-white btn-xs ml-3 mb-2"  @click.prevent="openSettingsModal(log)">
                  Open
                </button>
                <span v-else>:
                  <span class="value" v-html="`${log.value}`" />
                </span>
              </li>
            </ul>
          </div>
        </b-tab>
      </b-tabs>
    </div>

    <b-modal size="xl" ref="settingsValueModal" :title="modalSettings.heading" ok-only>
      <b-container fluid>
        <b-row v-for="(s,i) in modalSettings.values" :key="`ms-${i}`" class="mb-2">
          <b-col cols="4" class="text-left font-weight-bold"> {{ s.label }}</b-col>
          <b-col class="text-center">{{ s.value }}</b-col>
        </b-row>
      </b-container>
    </b-modal>
  </div>
</template>

<script>

import LoggerApiService from '@/api-services/logger.service';
  export default {
    name: 'Logger',
    data() {
      return {
        pageHeadings: [],
        generalHeadings: [],
        adminHeadings: [],
        generalLogs: {},
        pageLogs: {},
        initLogs: {},
        adminLogs: {},
        opened: true,
        editing: false,
        wizard: localStorage.wizard,
        modalSettings: {
          heading: '',
          values: []
        }
      };
    },
    computed: {
      isAdmin() {
        const s = this.$store.state;
        return s.activeUser && s.activeUser.data && s.activeUser.data.is_developer;
      },
      showAdminTab() {
        return this.adminHeadings.length > 0;
      }
    },
    methods: {
      openSettingsModal(setting) {
        this.modalSettings = {
          heading: '',
          values: []
        };

        this.modalSettings.heading = setting.label;
        Object.entries(setting.value).forEach(([key, value]) => {
          this.modalSettings.values.push({ label: key, value: value });
        });
        this.$refs.settingsValueModal.show();
      },
      parseString: function(string) {
        if(typeof string != 'string')
          return string;
        switch(string.toLowerCase().trim()){
          case "true": case "yes": case "1": return true;
          case "false": case "no": case "0": case null: return false;
          default: return string;
        }
      },
      updateLog(log, $event) {
        let propArray = log.label.split('.');
        let propChild = propArray.pop();
        let $val = $event.target.value || $event.srcElement.innerHTML;
        $val = $val == 'undefined' ? undefined : $val;
        if(propArray.length)
          this.$set(propArray.splice(0, propArray.length - 1).reduce((p,c)=>p&&p[c]||null, this.$store.state.settings)[propArray.slice(-1)], propChild, this.parseString($val));
        else
          this.$set(this.$store.state.settings, propChild, this.parseString($val));
        this.$root.$children[0].addSettings();
      },
      saveLog(log, ref, $event) {
        let prop = log.label;
        let $val = null;
        if(log.type == 'string')
          $val = this.$refs[ref][0].querySelector('.value').innerHTML;
        else if(log.type == 'dropdown')
          $val = this.$refs[ref][0].querySelector('.dropdown').value;
        else if(log.type == 'boolean')
          $val = this.$refs[ref][0].querySelector('.boolean').value;

        this.updateLog(log, $event);
        this.blurLog();
        //
        LoggerApiService.update({key: prop, value_string: $val});
      },
      addLog(key, args) {
        let logs = args.global ? this.generalLogs : (args.admin ? this.adminLogs : this.pageLogs);
        let headings = args.global ? this.generalHeadings : (args.admin ? this.adminHeadings : this.pageHeadings);
        let type = args.type ? args.type : args.plugin ? args.plugin.type : 'string';
        if(args.type == 'boolean' && !args.value)
          args.value = false;
        let ob = {
          label: args.label,
          value: args.value,
          readonly: args.readonly,
          hidevalue: !('value' in args),
          type: type
        };
        if(args.plugin) {
          ob.plugin = args.plugin;
        }
        if(logs[key] === undefined) {
          logs[key] = [];
          logs[key].push(ob);
        } else {
          logs[key].indexOf(args.label) === -1 && logs[key].push(ob);
        }
        headings.indexOf(key) === -1 && headings.push(key);
      },
      addLogs(args) {
        args.data.forEach(e => {
          this.addLog(args.group, {...e, global: args.global, admin: args.admin});
        });
      },
      focusLog(ref, log) {
        let $val = this.$refs[ref][0].querySelector('.value');
        let $select = this.$refs[ref][0].querySelector('select');
        document.querySelectorAll('.value').forEach(e => e.classList.remove('d-none'));
        this.originalContent = $val.innerHTML;
        this.resetProp(log, ref);
        this.editing = ref;
        $val.setAttribute('contenteditable', true);
        $val.addEventListener('focus', () => document.execCommand('selectAll',false,null));
        $val.focus();
        $select && $select.focus();
        if(log.type != 'string') {
          $val.classList.add('d-none');
        }
      },
      blurLog() {
        let $val = document.querySelectorAll('.value');
        $val.forEach(e => e.classList.remove('d-none'));
        this.editing = false;
        window.getSelection().removeAllRanges();
        $val.forEach(e => e.setAttribute('contenteditable', false));
      },
      resetProp(log, ref, $event) {
        if($event && $event.relatedTarget) {
          if(
            $event.relatedTarget.classList.contains('save-bt') ||
            $event.relatedTarget.classList.contains('edit-bt') ||
            $event.relatedTarget.classList.contains('cancel-bt') ||
            $event.relatedTarget.classList.contains('vc-chrome')) {
            return;
          }
        }
        let $val = this.$refs[ref][0].querySelector('.value');
        log.value = this.originalContent;
        this.updateLog(log, {target: {value: this.originalContent}});
        this.blurLog();
        setTimeout(() => {
          $val.innerHTML = this.originalContent;
        }, 10);
      },
      onBlur(log, ref, $event) {
        if(log.type == 'string')
          this.resetProp(log, ref, $event);
      },
      onSelectBlur(log, ref, $event) {
        this.resetProp(log, ref, $event);
      },
      toggleLogger() {
        if(!this.isAdmin)
          return;
        this.opened = !this.opened;
        this.$emit('toggleLogger', this.opened);
      },
      clear() {
        this.pageLogs = {};
        this.pageHeadings = [];
      }
    },
    mounted() {
      this.toggleLogger();
    }
  };
</script>

<style scoped lang="scss">
  .log {
    .value {
      padding: 1px 3px !important;
      color: #ce9178;
      &:focus {
        outline: -webkit-focus-ring-color auto 1px !important;
      }
    }
    .edit-buttons {
      display: none;
    }
    &:hover {
      .edit-buttons {
        display: flex;
      }
    }
  }
  .picker {
    width: 13px;
    height: 13px;
  }
  .logger-wrapper {
    position: fixed;
    right: 0;
    top: 0;
    z-index: 1000;
    font-family: monospace;
    :deep(.nav-link:not(.active)) {
      color: #fff;
    }
    .toggler {
      background: #202124;
      color: #fff !important;
      padding: 8px 10px;
      font-size: 12px;
      font-weight: bold;
      display: flex;
      border-radius: 4px;
      bottom: 10px;
      right: 8px;
      z-index: 2;
      position: fixed;
    }
    .logger {
      background-color:#202124;
      border-left: 1px solid lightgrey;
      border-right: 1px solid rgb(5, 5, 5);
      color: #fff;
      position: fixed;
      bottom: 0;
      right: -450px;
      width: 450px;
      height: 100vh;
      overflow-y: scroll;
      transition: right .15s;
      &.opened {
        right: 0;
      }
      .heading {
        color: #ffe100;
        font-weight: bold;
      }
      .block {
        border-bottom: 1px solid #525252;
        padding: 5px 0;
      }
      label{
        font-weight: bolder;
        text-align: center;
      }
      ul {
        list-style-type: none !important;
        padding: 0 0 0 15px;
      }
      :deep(.vc-chrome) {
        margin-top: 20px;
      }
    }
    @media print {
      display: none !important;
    }
  }
</style>

