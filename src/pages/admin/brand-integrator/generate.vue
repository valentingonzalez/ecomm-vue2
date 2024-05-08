<template>
  <div>
    <div class="py-4 px-3 card border-0 wizard-wrapper">
      <div class="d-flex flex-column pb-3 col-md-3">
        <h4 class="font-weight-bold">Brand Product Integrator</h4>
         <a @click="$refs.tutorialModal.show()" class="btn btn-tutorial btn-sm text-small bg-white btn-action">
                <i class="fa fa-play mr-1"></i>
                Click to Watch Tutorial Video
              </a>
      </div>
            <b-modal size="lg" ref="tutorialModal">
              <div slot="modal-header">
                <h5>Integraing Brands</h5>
              </div>
              <div>
                <video class="w-100" poster="/images/cover-brands-integrator-new.png" controls>
                  <source src="https://storage.googleapis.com/content.ezadtv.com/2023/12/28/658dbf42730eb_Product_Brand_Integrator.mov" type="video/mp4">
                </video>
              </div>
              <div slot="modal-footer">
                <button type="button" class="btn btn-primary" @click="$refs.tutorialModal.hide()">Done</button>
              </div>
            </b-modal>
      <div class="d-flex align-items-center p-3 bg-light">
          <label class="w-auto text-muted m-0 mr-3">Brand Product Integrator</label>
          <select class="form-control brand-select" v-model="brand_name">
            <option value="benjamin_moore">Benjamin Moore</option>
          </select>
      </div>
      <WizardStoreList :selectedStore="selectedStore" @onSelect="pushStore" :disableSelection="checking" class="border-bottom pb-4 mb-4 mt-3" />
      <template v-if="selectedStore">

        <div v-if="!loading" class="px-5 py-4 d-flex flex-column align-items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120" fill="none">
            <path d="M26.44 60.2C25.2 60.22 24.22 62.08 26.02 63.06C27.58 63.92 30.02 60.12 26.44 60.2Z" fill="#E1ECFF"/>
            <path d="M28.44 67.5798C26.74 68.7598 18.28 69.3998 16.12 68.8798C14.82 68.5798 14.04 67.5798 14.26 66.5398C14.4 65.8998 14.88 65.2598 15.82 64.6998C15.9 64.6598 15.96 64.6198 16.04 64.5798C17 64.0598 12.64 64.6998 11.56 63.0998C11.34 62.7598 11.2 62.4198 11.2 62.0798C11.12 60.7598 12.64 59.4398 16.44 59.0398C21.26 58.5398 24.64 58.8198 24.02 60.9598C23.4 63.1198 23.22 63.5598 25.54 64.1398C27.08 64.5198 28.6 65.3998 28.94 66.2798C29.14 66.7198 29.02 67.1798 28.44 67.5798Z" fill="#E1ECFF"/>
            <path d="M18.08 64.0196C17.76 64.4196 16.72 64.5796 15.82 64.6996C15.9 64.6596 15.96 64.6196 16.04 64.5796C17 64.0596 12.64 64.6996 11.56 63.0996C11.34 62.7596 11.2 62.4196 11.2 62.0796C11.42 62.4396 11.96 62.8596 13.24 63.0396C15.72 63.3996 18.58 63.4196 18.08 64.0196Z" fill="#CAE0FF"/>
            <path d="M28.44 67.5798C26.74 68.7598 18.28 69.3998 16.12 68.8798C14.82 68.5798 14.04 67.5798 14.26 66.5398C14.66 66.9998 15.78 67.8598 18.64 67.8398C22.46 67.7998 27.22 67.6398 28.34 66.9798C28.68 66.7798 28.86 66.5398 28.96 66.2798C29.14 66.7198 29.02 67.1798 28.44 67.5798Z" fill="#CAE0FF"/>
            <path d="M96.16 66.7002C96.06 67.0602 95.8 67.4402 95.32 67.8202C93.34 69.4402 89.4 68.6202 88.22 68.9802C87.88 69.0802 87.8 69.2602 87.88 69.4802C88.1 70.0402 89.4 70.8202 90.54 71.1402C92.54 71.7002 93.56 72.6202 93.94 73.5202C94.52 74.9002 93.62 76.2602 92.32 76.4002C90.18 76.6402 84.26 75.4202 81.46 76.1602C78.66 76.9002 77.02 77.3402 74.64 76.0202C72.94 75.0802 72.44 73.5602 72.8 72.3202C72.94 71.8202 73.2 71.3802 73.56 71.0202C74.86 69.7402 77.4 70.6202 77.62 69.9602C77.84 69.3002 76.04 67.2202 77.08 65.5402C78.12 63.8602 80.34 63.6402 83.06 64.1002C85.78 64.5602 91.34 64.0402 93.46 64.3802C95.1 64.6602 96.48 65.5602 96.16 66.7002Z" fill="#E1ECFF"/>
            <path d="M94.94 69.3403C93.38 69.3603 92.66 70.5403 93.88 71.5803C95.1 72.6203 97.2 71.7003 97.14 70.8203C97.08 69.9403 95.98 69.3203 94.94 69.3403Z" fill="#E1ECFF"/>
            <path d="M92.32 76.4203C90.18 76.6603 84.26 75.4403 81.46 76.1803C78.66 76.9203 77.02 77.3603 74.64 76.0403C72.94 75.1003 72.44 73.5803 72.8 72.3403C72.92 73.0603 73.46 74.0603 75.34 74.7203C78.58 75.8603 80.72 74.2003 83.58 74.2003C86.44 74.2003 89.48 76.0203 92.44 75.3403C93.76 75.0403 94.04 74.2803 93.94 73.5203C94.52 74.9203 93.62 76.2803 92.32 76.4203Z" fill="#CAE0FF"/>
            <path d="M96.16 66.7002C96.06 67.0602 95.8 67.4402 95.32 67.8202C93.34 69.4402 89.4 68.6202 88.22 68.9802C87.88 69.0802 87.8 69.2602 87.88 69.4802C87.72 69.4402 87.56 69.3802 87.42 69.3402C86.12 68.8802 85.86 68.0802 87.22 67.6202C88.58 67.1602 91.02 67.6802 93.9 67.2002C94.84 67.0602 95.6 66.8802 96.16 66.7002Z" fill="#CAE0FF"/>
            <path d="M61.24 50.8797L57.88 92.0397C57.86 92.1997 57.76 92.3397 57.6 92.3597C57.34 92.3997 57.08 92.1797 57.1 91.8997L60.36 50.7397C60.38 50.5597 60.52 50.4197 60.72 50.4197H60.82C61.04 50.3997 61.26 50.6197 61.24 50.8797Z" fill="#FEC272"/>
            <path d="M71.64 52.2999C71.14 53.6799 70.62 54.9799 70.1 56.1999C67.94 61.3199 65.74 65.1599 63.94 67.8599C62.16 70.5199 60.8 72.0599 60.26 72.6199C60.12 72.7799 60.02 72.8599 60.02 72.8599C60.02 72.8599 59.68 72.9799 59.06 73.1799C57.82 73.5599 55.54 74.1999 52.94 74.5599C52.42 74.6399 51.88 74.6999 51.36 74.7399C49.42 74.8999 47.4 74.8799 45.56 74.4599C44.86 74.2999 44.18 74.0799 43.54 73.7799C43.52 73.7799 43.5 73.7599 43.48 73.7599C43.48 73.7599 41.68 72.1599 39.24 69.3999C35.78 65.4999 31.02 59.2799 28.24 51.9399C27.9 51.0599 27.62 50.1599 27.36 49.2399C24.24 38.1599 26.74 24.3199 41.78 19.7599C43.36 19.2799 45.1 18.8999 46.98 18.6399C47.42 18.5799 47.86 18.5199 48.28 18.4999C49.22 18.3999 50.14 18.3799 51.02 18.3799C53.7 18.4199 56.14 18.8599 58.32 19.6799C71.14 24.3599 75.84 40.7999 71.64 52.2999Z" fill="#FEA691"/>
            <path d="M70.1 56.1997C65.2 67.8397 60.04 72.8597 60.04 72.8597C60.04 72.8597 59.7 72.9797 59.08 73.1797C57.84 73.5597 55.56 74.1997 52.96 74.5597C52.44 74.6397 51.9 74.6997 51.38 74.7397C49.44 74.8997 47.42 74.8797 45.58 74.4597C44.86 74.2797 44.14 74.0597 43.5 73.7597C43.5 73.7597 33.02 64.4797 28.26 51.9397C27.92 51.0597 27.64 50.1597 27.38 49.2397C31.32 52.7597 38.94 57.5597 51.4 57.8597C60.92 58.0597 66.68 57.1597 70.1 56.1997Z" fill="#F9917D"/>
            <path d="M51.36 74.72C49.42 74.88 47.4 74.86 45.56 74.44C42.96 70.04 39.56 63.34 37.26 55.2C36.62 52.94 36.06 50.58 35.62 48.12C33.26 34.68 37.92 25.08 41.76 19.76C43.34 19.28 45.08 18.9 46.96 18.64C47.4 18.58 47.84 18.52 48.26 18.5C46.6 20.9 42.78 28 43.68 41.66C44.02 46.82 45.02 52.3 46.24 57.46C47.84 64.28 49.88 70.54 51.36 74.72Z" fill="#FFD199"/>
            <path d="M65.96 44.4799C65.84 49.0999 65.24 53.3999 64.4 57.2999C62.98 63.8999 60.86 69.3399 59.06 73.1599C57.82 73.5399 55.54 74.1799 52.94 74.5399C54.18 70.7399 55.84 64.7799 56.74 57.8399C57.26 53.7599 57.52 49.3199 57.26 44.8199C56.56 32.7199 53.1 23.1799 51 18.3599C53.68 18.3999 56.12 18.8399 58.3 19.6599C62.18 25.1599 66.28 33.5799 65.96 44.4799Z" fill="#FFD199"/>
            <path d="M51.36 74.7197C49.42 74.8797 47.4 74.8597 45.56 74.4397C42.96 70.0397 39.56 63.3397 37.26 55.1997C39.82 56.1797 42.8 56.9997 46.22 57.4597C47.84 64.2797 49.88 70.5397 51.36 74.7197Z" fill="#FEC272"/>
            <path d="M64.3999 57.2998C62.9799 63.8998 60.8599 69.3398 59.0599 73.1598C57.8199 73.5398 55.5399 74.1798 52.9399 74.5398C54.1799 70.7398 55.8399 64.7798 56.7399 57.8398C59.7599 57.7798 62.2999 57.5798 64.3999 57.2998Z" fill="#FEC272"/>
            <path d="M63.94 67.8397C62.16 70.4997 60.8 72.0397 60.26 72.5997C58.58 71.8597 55.8 70.9397 52.28 71.0797C48.56 71.2197 45.38 72.6797 43.56 73.7397C43.54 73.7397 43.52 73.7197 43.5 73.7197C43.5 73.7197 41.7 72.1197 39.26 69.3597C40.98 67.7797 45.04 64.8597 51.92 64.5797C57.92 64.3597 61.86 66.3597 63.94 67.8397Z" fill="#FFD199"/>
            <path d="M43.5399 73.7601C43.5399 73.7601 46.8399 71.5601 51.8199 71.1001C56.7999 70.6401 60.2599 72.6201 60.2599 72.6201C60.2599 72.6201 60.2999 73.7001 51.9799 74.7601C45.6999 75.5401 43.5399 73.7601 43.5399 73.7601Z" fill="#FEC272"/>
            <path d="M28.94 52.88L49.68 94.92C49.76 95.08 49.72 95.28 49.58 95.4L49.52 95.4599C49.32 95.6399 49.02 95.58 48.9 95.34L28.1 53.32C28 53.12 28.08 52.9 28.26 52.8L28.4 52.72C28.6 52.6 28.84 52.68 28.94 52.88Z" fill="#FEC272"/>
            <path d="M41.5 51.8598L52.88 93.6398C52.92 93.7998 52.86 93.9798 52.7 94.0998L52.64 94.1598C52.4 94.3398 52.1 94.2798 52.04 94.0198L40.58 52.2598C40.52 52.0798 40.64 51.8398 40.84 51.7398L40.98 51.6598C41.2 51.5598 41.44 51.6398 41.5 51.8598Z" fill="#FEC272"/>
            <path d="M71.72 50.3596L58.22 93.1197C58.16 93.2997 58.24 93.4997 58.4 93.5797L58.64 93.6997C58.86 93.8197 59.12 93.7197 59.2 93.4797L72.8 50.7396C72.86 50.5396 72.76 50.3396 72.58 50.2596L72.26 50.1196C72.04 50.0396 71.8 50.1396 71.72 50.3596Z" fill="#FEC272"/>
            <path d="M41.9 81.52C41.82 81.2 42.08 80.92 42.4 80.94C44.1 81.02 48.88 81.18 53.9 80.34C58.66 79.56 62.04 78.56 63.38 78.14C63.7 78.04 64.02 78.26 64.04 78.6C64.04 78.8 63.9 79 63.7 79.06C62.52 79.42 58.5 80.62 53.84 81.36C49.06 82.12 43.82 82 42.36 81.94C42.14 81.94 41.94 81.78 41.9 81.56V81.52Z" fill="#FEC272"/>
            <path d="M28.64 53.5997L72.3 51.0597C72.78 51.0397 73.16 50.6397 73.18 50.1597V50.0797C73.2 49.5197 72.74 49.0797 72.2 49.1197L28.54 51.7597C27.96 51.7997 27.56 52.3397 27.68 52.8997C27.78 53.3197 28.18 53.6397 28.64 53.5997Z" fill="#FEC272"/>
            <path d="M60.66 86.0801C60.66 86.0801 63.66 86.8401 65.14 87.6401C66.62 88.4601 65.64 90.6401 64.3 90.4001C63.34 90.2201 61.94 88.0201 61.44 87.3401C60.94 86.6801 60.66 86.0801 60.66 86.0801Z" fill="#FFD199"/>
            <path d="M65.86 99.44L54.4 103.88L52.76 104.52C50.94 105.22 49 104.56 47.92 103.14C47.46 102.52 47.16 101.76 47.1 100.92L46.38 91.02C46.34 90.26 46.8 89.58 47.54 89.36L50.62 88.44L59.26 85.86C59.98 85.64 60.74 85.96 61.12 86.62L61.18 86.74L66.86 96.7C66.86 96.72 66.88 96.74 66.88 96.76C67.4 97.76 66.94 99.02 65.86 99.44Z" fill="#F46CB4"/>
            <path d="M54.4 103.88L52.76 104.52C50.94 105.22 49 104.56 47.92 103.14C47.46 102.52 47.16 101.76 47.1 100.92L46.46 92.0799L46.38 91.0199C46.38 90.9799 46.38 90.9199 46.38 90.8599C46.4 90.1599 46.86 89.5599 47.54 89.3599L50.62 88.4399C50.66 88.7399 50.72 89.0599 50.78 89.3999C50.86 89.8599 50.94 90.3599 51.02 90.8799C51.52 93.9199 52.18 97.8799 52.58 100.46C52.72 101.38 52.96 102.08 53.26 102.62C53.58 103.24 53.98 103.64 54.4 103.88Z" fill="#FF97C9"/>
            <path d="M51 90.9C50.64 91.5 49.9 92.42 48.56 92.58C47.6 92.7 46.9 92.42 46.44 92.1L46.36 91.04C46.36 91 46.36 90.94 46.36 90.88C46.38 90.18 46.84 89.58 47.52 89.38L50.6 88.46C50.64 88.76 50.7 89.08 50.76 89.42C50.82 89.86 50.92 90.36 51 90.9Z" fill="#F46CB4"/>
            <path d="M57.62 91.32C53.82 92.36 51 90.88 51 90.88L50.6 88.42L59.24 85.84C59.96 85.62 60.72 85.94 61.1 86.6L61.16 86.72L61.2 86.94C61.22 86.96 61.42 90.28 57.62 91.32Z" fill="#EF54AC"/>
            <path d="M50.6 88.4398L50.76 89.3598C50.76 89.3598 53.6 91.8598 57.36 90.6798C61.14 89.5198 60.56 86.0398 60.56 86.0398C60.56 86.0398 60.14 85.8198 59.74 85.8198C59.34 85.8198 58.54 86.0798 58.54 86.0798L50.6 88.4398Z" fill="#1C3177"/>
            <path d="M50.76 89.3999C50.68 89.7199 50.28 91.2799 48.86 91.7599C47.46 92.2399 46.54 91.0999 46.36 90.8599C46.38 90.1599 46.84 89.5599 47.52 89.3599L50.6 88.4399C50.64 88.7399 50.7 89.0599 50.76 89.3999Z" fill="#1C3177"/>
            <path d="M65.86 99.4398L54.4 103.88L52.76 104.52C50.94 105.22 49 104.56 47.92 103.14C50.1 103.28 51.82 102.96 53.54 102.56C55.42 102.1 61.46 99.8798 64.34 98.3998C65.52 97.7798 66.34 97.2198 66.9 96.7598C67.4 97.7598 66.94 99.0198 65.86 99.4398Z" fill="#EF54AC"/>
            <path d="M54.4 103.88L52.76 104.52C50.94 105.22 49 104.56 47.92 103.14C49.98 103.28 51.62 103 53.26 102.62C53.58 103.24 53.98 103.64 54.4 103.88Z" fill="#F46CB4"/>
            <path d="M52.66 77.2198C50.74 77.4598 49.3 75.7598 50.48 74.3798C51.64 72.9998 51.88 71.7798 51.88 71.7798C51.88 71.7798 54.2401 73.0998 54.5401 74.5598C54.7601 75.6798 54.6 76.9798 52.66 77.2198Z" fill="#FEC272"/>
            <path d="M52.5201 76.7198C51.7601 76.7598 50.9601 76.3798 51.1001 75.4798C51.2401 74.5798 52.0401 74.2398 52.2001 73.6398C52.3601 73.0398 52.2001 72.7598 52.2001 72.7598C52.2001 72.7598 53.6001 73.7598 53.7601 75.0798C53.9001 76.3998 53.0401 76.6998 52.5201 76.7198Z" fill="#FC7059"/>
            <path d="M49.74 78.2998L49.64 77.3798C49.62 77.1198 49.78 76.8998 50.02 76.8398C50.48 76.7398 51.32 76.5798 52.58 76.4998C53.72 76.4198 54.44 76.4198 54.84 76.4398C55.08 76.4398 55.3 76.6398 55.32 76.8798L55.44 77.7798C55.46 77.9998 55.34 78.2198 55.12 78.3198C54.7 78.4798 53.86 78.6998 52.48 78.7798C51.26 78.8398 50.56 78.8198 50.18 78.7798C49.96 78.7398 49.76 78.5398 49.74 78.2998Z" fill="#1C3177"/>
          </svg>

          <div class="h4 font-weight-bold mt-4 text-center max-text-wd-500">
            {{ report_status == -1 ? 'You have not run the Benjamin Moore Product Integrator Report' : 'The Report is Ready.'}}
          </div>
          <div v-if="showReportLink" class="mt-2 mb-4 d-flex flex-column">
            <router-link class="btn btn-dark lead btn-run-now mb-3" :to="`/admin/brand-integrator/report?store=${this.store.id}`">
              Go to Report
            </router-link>
            <span class="mr-2 text-muted text-center" v-if="report_last_executed"><b>Last Executed:</b> {{ report_last_executed }}</span>
          </div>
          <div v-if="report_status == 1" class="h5 font-weight-bold mt-4 text-center max-text-wd-500">
            Do you want to run again?
          </div>
          <div class="mt-2 d-flex flex-column">
            <a class="btn btn-run-now-outlined w-100" @click="runReport(0)">
              {{ report_status == -1 ? 'Run Now' : 'Run Again'}}
            </a>
            <button
              v-if="stores.length > 1"
              class="btn mt-2 btn-run-now-outlined"
              @click="runReport(1)">
              Run for all {{ stores.length }} stores
            </button>
          </div>
          <div class="mt-4">
            <div class="h6 font-weight-normal text-muted mb-3">
              <i class="fa fa-clock-o mr-1"></i>May take 2-5 minutes
            </div>
          </div>

        </div>
        <div class="d-flex flex-column align-items-center justify-content-center my-auto" v-else>
            <div class="d-flex justify-content-center my-3">
              <div class="spinner-border"></div>
            </div>
            <div class="h4 font-weight-normal my-3">
              {{ checking ? 'Checking' : 'Currently Running The Report'}}
            </div>
            <div class="h6 font-weight-normal text-muted max-text-wd-500 text-center px-5">
              The page will refresh every 10 seconds. You can exit this page and return later
            </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
  import WizardStoreList from '@/components/admin/wizard/wizard-store-list';
  import AdminApiService from '@/api-services/admin.service';
  export default {
    name: 'IntegratorGenerate',
    components: {
      WizardStoreList,
    },
    data() {
      return {
        loading: false,
        checking: false,
        selectedStore: null,
        showReportLink: false,
        report_last_executed: '',
        brand_name: 'benjamin_moore',
        report_status: null
      };
    },
    computed: {
      stores() {
        return this.$store.state.adminWizardBusinesses || [];
      },
      store() {
        return this.stores.find(e => e.id == this.selectedStore);
      }
    },
    async mounted() {
      await AdminApiService.getAllPartnerBusinesses().then(resp => this.$store.commit('setAdminWizardBusinesses', resp.data.stores));
      // if store is in query and valid otherwise select base as default
      this.selectedStore = this.$route.query.store && this.stores.find(x => x.id == this.$route.query.store) ? this.$route.query.store : this.stores.find(x => x.base).id;
      this.selectStore(this.selectedStore);
    },
    methods:{
      async selectStore(id) {
        this.resetPageFlags();
        this.selectedStore = id;
        this.checking = true;
        this.checkReport();
      },
      pushStore(id) {
        this.selectStore(id);
      },
      async checkReport(redirect = false) {
        let _self = this;
        this.loading = true;
        let params = {
          business_id: this.selectedStore,
          brand: this.brand_name
        };
        try {
          let resp = await AdminApiService.checkBrandIntegratorReport(params);
          if(resp.status == 200) {
            this.report_status = resp.data.report_status;
            if(resp.data.report_status === 1){  // done
              if(redirect){
                _self.$router.push({
                  name: 'admin-brand-integrator-report',
                  params: { store: this.store.id }
                });
              }else{
                this.loading = false;
                this.showReportLink = true;
                this.report_last_executed = resp.data.executed_on;
              }
            } else if(resp.data.report_status === 0) { // running
                setTimeout(function() {
                  if(_self.selectedStore == params.business_id){
                    _self.checkReport(true);
                  }
                },10000); // check every 10 sec
            } else if(resp.data.report_status === -1) { // not run yet
              this.loading = false;
            }
            this.checking = false;
          } else {
            this.resetPageFlags();
          }
        } catch(e) {
          this.resetPageFlags();
        }
      },
      async runReport(runOnAll = 0) {
        try {
          this.$swal({
            title: "Are you sure?",
            text: `You want to run report for ${runOnAll ? 'all '+this.stores.length+' Locations' : this.store.name }`,
            type: 'warning',
            showCancelButton: true,
          })
          .then(async (result) => {
            if (result.value) {
              this.loading = false;
              let params = {
                business_id: this.selectedStore,
                brand: this.brand_name,
                runOnAll: runOnAll
              };
              let resp = await AdminApiService.generateBrandIntegratorReport(params);
              if(resp.status == 200) {
                this.checkReport(true);
              } else {
                this.resetPageFlags();
              }
            }
          });
        } catch(e) {
          this.resetPageFlags();
        }
      },
      resetPageFlags() {
        this.loading = false;
        this.checking = false;
        this.showReportLink = false;
        this.report_last_executed = '';
        this.report_status = null;
      }
    },
    watch: {
      selectedStore(val){
        this.$router.push({ query: { ...this.$route.query, store: val }}).catch(() => {});
      },
      brand_name(val) {
        this.$router.push({ query: { ...this.$route.query, brand_name: val }}).catch(() => {});
      }
    }
  };
</script>

<style scoped lang="scss">
  h1 {
    font-size: 48px;
    font-weight: bold;
  }
  .text {
    color: var(--text);
  }
  ul {
    padding: 0;
    list-style: none;
    font-weight: bold;
    font-size: 18px;
  }
  .btn-run-now{
    min-width: 285px;
  }
  .brand-select{
    width: 320px;
  }
  .max-text-wd-500{
    max-width: 500px;
  }
  .btn-run-now-outlined{
    min-width: 285px;
    background: transparent;
    border-color: #343a40;
    color: #343a40;
    font-weight: 600;
  }
</style>
