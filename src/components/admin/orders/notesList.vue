<template>
  <div>
    <b-modal centered ref="noteListModal" id="noteListModal" @ok="addNote" hide-footer>
      <div slot="modal-header" class="d-flex align-items-center justify-content-between w-100">
        <div class="d-flex align-items-center">
          <div class="notes-bt mr-3">
            <svg width="14" height="17" viewBox="0 0 14 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.7822 8.04647C13.7822 10.1279 13.7822 12.2093 13.7822 14.2907C13.7822 15.1459 13.2844 15.8173 12.4967 16.0197C12.3282 16.0598 12.1553 16.0789 11.9821 16.0768C8.59706 16.0801 5.21178 16.0801 1.82626 16.0768C0.733518 16.0786 0 15.3461 0 14.2591C0 10.1147 0 5.97033 0 1.82593C0 0.86094 0.578489 0.165103 1.50077 0.0176101C1.60781 0.00347238 1.71581 -0.00216745 1.82375 0.00074349C5.20855 0.00074349 8.59383 0.00074349 11.9796 0.00074349C13.0476 -0.000333101 13.7804 0.732826 13.7804 1.80296C13.7823 3.88437 13.7823 5.96578 13.7804 8.04719L13.7822 8.04647ZM12.6338 8.05724C12.6338 5.98181 12.6338 3.9065 12.6338 1.83131C12.6338 1.36479 12.421 1.14947 11.9573 1.14947H1.83738C1.36368 1.14803 1.15016 1.36335 1.15016 1.84136C1.15016 5.98025 1.15016 10.1192 1.15016 14.258C1.15016 14.7095 1.36978 14.9298 1.82052 14.9298H11.9581C12.4221 14.9298 12.6334 14.7163 12.6334 14.248C12.6339 12.1843 12.6334 10.1207 12.632 8.05724H12.6338Z" fill="#B45309"/><path d="M6.89194 8.61235C6.24024 8.61235 5.58854 8.61235 4.93685 8.61235C4.57224 8.61235 4.31027 8.37335 4.30776 8.0432C4.30525 7.71304 4.56757 7.46542 4.92823 7.46507C6.23737 7.46363 7.54674 7.46363 8.85636 7.46507C9.21809 7.46507 9.47648 7.71017 9.47396 8.04355C9.47145 8.37694 9.21307 8.61235 8.84703 8.61235C8.19533 8.61403 7.54363 8.61403 6.89194 8.61235Z" fill="#B45309"/><path d="M6.87049 5.16729C6.22453 5.16729 5.57858 5.16729 4.93262 5.16729C4.56981 5.16729 4.3082 4.92505 4.30641 4.5931C4.30461 4.26115 4.56874 4.01892 4.93047 4.01892C6.23362 4.01892 7.53666 4.01892 8.83958 4.01892C9.21566 4.01892 9.47656 4.26008 9.47261 4.59992C9.46902 4.93044 9.2092 5.16441 8.84137 5.16513C8.18537 5.16944 7.52793 5.16729 6.87049 5.16729Z" fill="#B45309"/><path d="M6.88483 12.0574C6.23888 12.0574 5.59292 12.0574 4.94697 12.0574C4.57196 12.0574 4.3064 11.8159 4.3064 11.4811C4.30855 11.1531 4.57124 10.9112 4.93548 10.9109C6.24414 10.9094 7.55304 10.9094 8.86217 10.9109C9.18515 10.9109 9.43241 11.1186 9.46973 11.4079C9.48805 11.5486 9.45359 11.6912 9.37301 11.808C9.29242 11.9248 9.17142 12.0077 9.03335 12.0406C8.96308 12.0545 8.89142 12.0602 8.81983 12.0574C8.17555 12.0591 7.53055 12.0591 6.88483 12.0574Z" fill="#B45309"/></svg>
          </div>
          <h5>Notes</h5>
        </div>
        <a href="#" v-b-modal.addNoteModal @click="note = ''" aria-label="Add Note">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 1V7M7 7V13M7 7H13M7 7H1" stroke="#334155" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </a>
      </div>
      <div class="d-flex align-items-center justify-content-center py-3" v-if="loadingNotes">
        <div class="spinner-border spinner-border-sm mr-2"></div>
      </div>
      <div class="py-3" v-else-if="!loadingNotes && !noteList.length">
        There are no Notes for this Order yet
      </div>
      <div v-else>
        <div class="sticky-note mb-3" v-for="(note,idx) in noteList" :key="note.id">
          <div class="head d-flex align-items-center justify-content-between">
            <div>
              <div v-if="note.account">{{ note.account.first_name }} {{ note.account.last_name }}</div>
              <div class="text-small text-muted">{{ note.date }}</div>
            </div>
            <a href="#" @click="deleteNote(note.id, idx)" aria-label="Delete Note">
              <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 9V15M11 9V15M1 5H17M16 5L15.133 17.142C15.0971 17.6466 14.8713 18.1188 14.5011 18.4636C14.1309 18.8083 13.6439 19 13.138 19H4.862C4.35614 19 3.86907 18.8083 3.49889 18.4636C3.1287 18.1188 2.90292 17.6466 2.867 17.142L2 5H16ZM12 5V2C12 1.73478 11.8946 1.48043 11.7071 1.29289C11.5196 1.10536 11.2652 1 11 1H7C6.73478 1 6.48043 1.10536 6.29289 1.29289C6.10536 1.48043 6 1.73478 6 2V5H12Z" stroke="#DC2626" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </a>
          </div>
          <div class="body" v-html="note.body"></div>
        </div>
      </div>
    </b-modal>
    <b-modal centered ref="addNoteModal" id="addNoteModal" hide-footer>
      <div slot="modal-header" class="d-flex align-items-center">
        <div class="notes-bt mr-3">
          <svg width="14" height="17" viewBox="0 0 14 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.7822 8.04647C13.7822 10.1279 13.7822 12.2093 13.7822 14.2907C13.7822 15.1459 13.2844 15.8173 12.4967 16.0197C12.3282 16.0598 12.1553 16.0789 11.9821 16.0768C8.59706 16.0801 5.21178 16.0801 1.82626 16.0768C0.733518 16.0786 0 15.3461 0 14.2591C0 10.1147 0 5.97033 0 1.82593C0 0.86094 0.578489 0.165103 1.50077 0.0176101C1.60781 0.00347238 1.71581 -0.00216745 1.82375 0.00074349C5.20855 0.00074349 8.59383 0.00074349 11.9796 0.00074349C13.0476 -0.000333101 13.7804 0.732826 13.7804 1.80296C13.7823 3.88437 13.7823 5.96578 13.7804 8.04719L13.7822 8.04647ZM12.6338 8.05724C12.6338 5.98181 12.6338 3.9065 12.6338 1.83131C12.6338 1.36479 12.421 1.14947 11.9573 1.14947H1.83738C1.36368 1.14803 1.15016 1.36335 1.15016 1.84136C1.15016 5.98025 1.15016 10.1192 1.15016 14.258C1.15016 14.7095 1.36978 14.9298 1.82052 14.9298H11.9581C12.4221 14.9298 12.6334 14.7163 12.6334 14.248C12.6339 12.1843 12.6334 10.1207 12.632 8.05724H12.6338Z" fill="#B45309"/><path d="M6.89194 8.61235C6.24024 8.61235 5.58854 8.61235 4.93685 8.61235C4.57224 8.61235 4.31027 8.37335 4.30776 8.0432C4.30525 7.71304 4.56757 7.46542 4.92823 7.46507C6.23737 7.46363 7.54674 7.46363 8.85636 7.46507C9.21809 7.46507 9.47648 7.71017 9.47396 8.04355C9.47145 8.37694 9.21307 8.61235 8.84703 8.61235C8.19533 8.61403 7.54363 8.61403 6.89194 8.61235Z" fill="#B45309"/><path d="M6.87049 5.16729C6.22453 5.16729 5.57858 5.16729 4.93262 5.16729C4.56981 5.16729 4.3082 4.92505 4.30641 4.5931C4.30461 4.26115 4.56874 4.01892 4.93047 4.01892C6.23362 4.01892 7.53666 4.01892 8.83958 4.01892C9.21566 4.01892 9.47656 4.26008 9.47261 4.59992C9.46902 4.93044 9.2092 5.16441 8.84137 5.16513C8.18537 5.16944 7.52793 5.16729 6.87049 5.16729Z" fill="#B45309"/><path d="M6.88483 12.0574C6.23888 12.0574 5.59292 12.0574 4.94697 12.0574C4.57196 12.0574 4.3064 11.8159 4.3064 11.4811C4.30855 11.1531 4.57124 10.9112 4.93548 10.9109C6.24414 10.9094 7.55304 10.9094 8.86217 10.9109C9.18515 10.9109 9.43241 11.1186 9.46973 11.4079C9.48805 11.5486 9.45359 11.6912 9.37301 11.808C9.29242 11.9248 9.17142 12.0077 9.03335 12.0406C8.96308 12.0545 8.89142 12.0602 8.81983 12.0574C8.17555 12.0591 7.53055 12.0591 6.88483 12.0574Z" fill="#B45309"/></svg>
        </div>
        <div>
          <h5>{{ userName }}</h5>
          <div class="text-muted">{{ today }}</div>
        </div>
      </div>
      <form @submit.prevent="addNote">
        <div class="text-muted mb-2">
          <b-form-textarea :disabled="addingNote" v-model="note" placeholder="Write a note here..." class="sticky-note" max-rows="15" required />
        </div>
        <div class="d-flex align-items-center justify-content-end mt-3">
          <button class="btn btn-action mr-2 px-4" :disabled="addingNote" @click="()=>$refs.addNoteModal.hide()">Cancel</button>
          <button class="btn btn-success px-4" :disabled="addingNote" type="submit">
            <div v-if="addingNote" class="spinner-border spinner-border-sm mr-2" />
            Save
          </button>
        </div>
      </form>
    </b-modal>
  </div>
</template>

<script>
import AdminService from '@/api-services/admin.service';
import moment from 'moment-timezone';

export default {
  name: 'OrderNotesList',
  props: {
    rentals: {
      default: false
    }
  },
  data() {
    return {
      note: '',
      addingNote: false,
      noteList: [],
      loadingNotes: false,
      selectedOrder: null
    };
  },
  computed: {
    today() {
      return moment().format('MMM DD, YYYY');
    },
    customer() {
      return this.$store.state.activeUser.data.customer;
    },
    userName() {
      return this.customer.first_name || this.customer.last_name ? `${this.customer.first_name} ${this.customer.last_name}` : 'Master Account';
    },
  },
  methods: {
    show(id) {
      this.selectedOrder = id;
      this.$refs.noteListModal.show();
      this.getNotesList(id);
    },
    async deleteNote(id) {
      let _self = this;
      this.$swal({
        title: 'Delete note',
        text: 'Are you sure you want to remove this Note?',
        type: 'warning',
        showCancelButton: true,
      }).then(async result => {
        if(result.value) {
          _self.rentals ? await AdminService.deleteRentalOrderNote(_self.selectedOrder, id) : await AdminService.deleteOrderNote(_self.selectedOrder, id);
          _self.noteList = _self.noteList.filter(e => e.id != id);
          _self.$emit('updateNotesCount', _self.noteList.length, _self.selectedOrder);
        }
      });
    },
    async getNotesList(id) {
      this.loadingNotes = true;
      this.noteList = [];
      let resp = this.rentals ? await AdminService.getRentalOrderNotes(id) : await AdminService.getOrderNotes(id);
      this.noteList = resp.data.notes;
      this.noteList.forEach(e => e.date = moment(e.created_at).format('MMM DD, YYYY'));
      this.loadingNotes = false;
    },
    async addNote() {
      this.addingNote = true;
      let resp = this.rentals ? await AdminService.addRentalOrderNote(this.selectedOrder, { body: this.note }) : await AdminService.addOrderNote(this.selectedOrder, { body: this.note });
      this.$refs.addNoteModal.hide();
      this.addingNote = false;
      this.noteList.unshift({
        id: resp.data.note.id,
        body: this.note,
        account: { first_name: this.customer.first_name || 'Master', last_name: this.customer.last_name || 'Account' },
        date: this.today
      });
      this.$emit('updateNotesCount', this.noteList.length, this.selectedOrder);
    },
  }
};
</script>

<style scoped lang="scss">
:deep(.modal-dialog) {
    max-width: 800px !important;
  }
  .sticky-note {
    background: #FFFBEB;
    border: 1px solid #FDE68A;
    border-radius: 6px;
    .head {
      margin: 14px 14px 0;
      border-bottom: 1px solid #FDE68A;
      padding-bottom: 8px;
    }
    .body {
      padding: 10px 14px 14px;
      white-space: pre-line;
    }
    &:focus {
      box-shadow: 0 0 0 1px #FDE68A !important
    }
  }
</style>
