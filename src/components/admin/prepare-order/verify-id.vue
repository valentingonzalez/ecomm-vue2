<template>
    <div>
      <div id="package">
        <div class="card big bg-white border flex flex-row mb-3">
          <div class="d-none d-sm-block">
            <div class="round-head mr-3 big success">
                <svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 38 38" fill="none">
                    <rect width="38" height="38" rx="19" fill="#ECFDF5"/>
                    <path d="M19 9C16.9781 9 15.3333 10.6448 15.3333 12.6667C15.3333 14.6886 16.9781 16.3333 19 16.3333C21.0219 16.3333 22.6667 14.6886 22.6667 12.6667C22.6667 10.6448 21.0219 9 19 9ZM21.0271 11.5326L18.67 14.1517C18.6229 14.204 18.5548 14.2355 18.4814 14.2381H18.4736C18.4055 14.2381 18.3374 14.2093 18.2876 14.1621L16.9781 12.8526C16.8759 12.7505 16.8759 12.5855 16.9781 12.4833C17.0802 12.3812 17.2452 12.3812 17.3474 12.4833L18.4605 13.5964L20.6317 11.1817C20.7286 11.0743 20.8936 11.0664 21.0009 11.1633C21.1083 11.2602 21.1162 11.4252 21.0193 11.5326H21.0271Z" fill="#00715B"/>
                    <path d="M28.4286 13.9762L23.5179 13.9762C23.3018 13.9762 23.125 14.153 23.125 14.3691C23.125 14.5851 23.3018 14.7619 23.5179 14.7619H28.4286C28.8607 14.7619 29.2143 15.1155 29.2143 15.5476V27.3333C29.2143 27.7655 28.8607 28.1191 28.4286 28.1191H9.57143C9.13929 28.1191 8.78571 27.7655 8.78571 27.3333V15.5476C8.78571 15.1155 9.13929 14.7619 9.57143 14.7619H14.4821C14.6982 14.7619 14.875 14.5851 14.875 14.3691C14.875 14.153 14.6982 13.9762 14.4821 13.9762L9.57143 13.9762C8.70321 13.9762 8 14.6794 8 15.5476V27.3333C8 28.2016 8.70321 28.9048 9.57143 28.9048H28.4286C29.2968 28.9048 30 28.2016 30 27.3333V15.5476C30 14.6794 29.2968 13.9762 28.4286 13.9762Z" fill="#00715B"/>
                    <path d="M14.2857 21.0476C15.3706 21.0476 16.25 20.1681 16.25 19.0833C16.25 17.9985 15.3706 17.119 14.2857 17.119C13.2009 17.119 12.3214 17.9985 12.3214 19.0833C12.3214 20.1681 13.2009 21.0476 14.2857 21.0476Z" fill="#00715B"/>
                    <path d="M14.2857 25.7619C16.2384 25.7619 17.8214 24.8824 17.8214 23.7976C17.8214 22.7128 16.2384 21.8333 14.2857 21.8333C12.333 21.8333 10.75 22.7128 10.75 23.7976C10.75 24.8824 12.333 25.7619 14.2857 25.7619Z" fill="#00715B"/>
                    <path d="M20.1786 18.2976H21.3571C21.5732 18.2976 21.75 18.1208 21.75 17.9048C21.75 17.6887 21.5732 17.5119 21.3571 17.5119H20.1786C19.9625 17.5119 19.7857 17.6887 19.7857 17.9048C19.7857 18.1208 19.9625 18.2976 20.1786 18.2976Z" fill="#00715B"/>
                    <path d="M24.1071 17.5119H22.9286C22.7125 17.5119 22.5357 17.6887 22.5357 17.9048C22.5357 18.1208 22.7125 18.2976 22.9286 18.2976H24.1071C24.3232 18.2976 24.5 18.1208 24.5 17.9048C24.5 17.6887 24.3232 17.5119 24.1071 17.5119Z" fill="#00715B"/>
                    <path d="M19.7857 20.2619C19.7857 20.4779 19.9625 20.6547 20.1786 20.6547H26.8571C27.0732 20.6547 27.25 20.4779 27.25 20.2619C27.25 20.0458 27.0732 19.869 26.8571 19.869H20.1786C19.9625 19.869 19.7857 20.0458 19.7857 20.2619Z" fill="#00715B"/>
                    <path d="M26.8571 22.2262H20.1786C19.9625 22.2262 19.7857 22.403 19.7857 22.6191C19.7857 22.8351 19.9625 23.0119 20.1786 23.0119H26.8571C27.0732 23.0119 27.25 22.8351 27.25 22.6191C27.25 22.403 27.0732 22.2262 26.8571 22.2262Z" fill="#00715B"/>
                    <path d="M26.8571 24.5833H20.1786C19.9625 24.5833 19.7857 24.7601 19.7857 24.9762C19.7857 25.1922 19.9625 25.369 20.1786 25.369H26.8571C27.0732 25.369 27.25 25.1922 27.25 24.9762C27.25 24.7601 27.0732 24.5833 26.8571 24.5833Z" fill="#00715B"/>
                    <path d="M26.8571 18.2976C27.0732 18.2976 27.25 18.1208 27.25 17.9048C27.25 17.6887 27.0732 17.5119 26.8571 17.5119H25.6786C25.4625 17.5119 25.2857 17.6887 25.2857 17.9048C25.2857 18.1208 25.4625 18.2976 25.6786 18.2976H26.8571Z" fill="#00715B"/>
                </svg>
            </div>
          </div>
          <div class="d-flex align-items-center w-100">
            <div class="flex-grow-1">
              <div class="d-flex justify-content-between">
                <div class="d-flex">
                <div class="round-head mr-3 big success d-sm-none">
                    <svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 38 38" fill="none">
                        <rect width="38" height="38" rx="19" fill="#ECFDF5"/>
                        <path d="M19 9C16.9781 9 15.3333 10.6448 15.3333 12.6667C15.3333 14.6886 16.9781 16.3333 19 16.3333C21.0219 16.3333 22.6667 14.6886 22.6667 12.6667C22.6667 10.6448 21.0219 9 19 9ZM21.0271 11.5326L18.67 14.1517C18.6229 14.204 18.5548 14.2355 18.4814 14.2381H18.4736C18.4055 14.2381 18.3374 14.2093 18.2876 14.1621L16.9781 12.8526C16.8759 12.7505 16.8759 12.5855 16.9781 12.4833C17.0802 12.3812 17.2452 12.3812 17.3474 12.4833L18.4605 13.5964L20.6317 11.1817C20.7286 11.0743 20.8936 11.0664 21.0009 11.1633C21.1083 11.2602 21.1162 11.4252 21.0193 11.5326H21.0271Z" fill="#00715B"/>
                        <path d="M28.4286 13.9762L23.5179 13.9762C23.3018 13.9762 23.125 14.153 23.125 14.3691C23.125 14.5851 23.3018 14.7619 23.5179 14.7619H28.4286C28.8607 14.7619 29.2143 15.1155 29.2143 15.5476V27.3333C29.2143 27.7655 28.8607 28.1191 28.4286 28.1191H9.57143C9.13929 28.1191 8.78571 27.7655 8.78571 27.3333V15.5476C8.78571 15.1155 9.13929 14.7619 9.57143 14.7619H14.4821C14.6982 14.7619 14.875 14.5851 14.875 14.3691C14.875 14.153 14.6982 13.9762 14.4821 13.9762L9.57143 13.9762C8.70321 13.9762 8 14.6794 8 15.5476V27.3333C8 28.2016 8.70321 28.9048 9.57143 28.9048H28.4286C29.2968 28.9048 30 28.2016 30 27.3333V15.5476C30 14.6794 29.2968 13.9762 28.4286 13.9762Z" fill="#00715B"/>
                        <path d="M14.2857 21.0476C15.3706 21.0476 16.25 20.1681 16.25 19.0833C16.25 17.9985 15.3706 17.119 14.2857 17.119C13.2009 17.119 12.3214 17.9985 12.3214 19.0833C12.3214 20.1681 13.2009 21.0476 14.2857 21.0476Z" fill="#00715B"/>
                        <path d="M14.2857 25.7619C16.2384 25.7619 17.8214 24.8824 17.8214 23.7976C17.8214 22.7128 16.2384 21.8333 14.2857 21.8333C12.333 21.8333 10.75 22.7128 10.75 23.7976C10.75 24.8824 12.333 25.7619 14.2857 25.7619Z" fill="#00715B"/>
                        <path d="M20.1786 18.2976H21.3571C21.5732 18.2976 21.75 18.1208 21.75 17.9048C21.75 17.6887 21.5732 17.5119 21.3571 17.5119H20.1786C19.9625 17.5119 19.7857 17.6887 19.7857 17.9048C19.7857 18.1208 19.9625 18.2976 20.1786 18.2976Z" fill="#00715B"/>
                        <path d="M24.1071 17.5119H22.9286C22.7125 17.5119 22.5357 17.6887 22.5357 17.9048C22.5357 18.1208 22.7125 18.2976 22.9286 18.2976H24.1071C24.3232 18.2976 24.5 18.1208 24.5 17.9048C24.5 17.6887 24.3232 17.5119 24.1071 17.5119Z" fill="#00715B"/>
                        <path d="M19.7857 20.2619C19.7857 20.4779 19.9625 20.6547 20.1786 20.6547H26.8571C27.0732 20.6547 27.25 20.4779 27.25 20.2619C27.25 20.0458 27.0732 19.869 26.8571 19.869H20.1786C19.9625 19.869 19.7857 20.0458 19.7857 20.2619Z" fill="#00715B"/>
                        <path d="M26.8571 22.2262H20.1786C19.9625 22.2262 19.7857 22.403 19.7857 22.6191C19.7857 22.8351 19.9625 23.0119 20.1786 23.0119H26.8571C27.0732 23.0119 27.25 22.8351 27.25 22.6191C27.25 22.403 27.0732 22.2262 26.8571 22.2262Z" fill="#00715B"/>
                        <path d="M26.8571 24.5833H20.1786C19.9625 24.5833 19.7857 24.7601 19.7857 24.9762C19.7857 25.1922 19.9625 25.369 20.1786 25.369H26.8571C27.0732 25.369 27.25 25.1922 27.25 24.9762C27.25 24.7601 27.0732 24.5833 26.8571 24.5833Z" fill="#00715B"/>
                        <path d="M26.8571 18.2976C27.0732 18.2976 27.25 18.1208 27.25 17.9048C27.25 17.6887 27.0732 17.5119 26.8571 17.5119H25.6786C25.4625 17.5119 25.2857 17.6887 25.2857 17.9048C25.2857 18.1208 25.4625 18.2976 25.6786 18.2976H26.8571Z" fill="#00715B"/>
                    </svg>
                </div>
                  <div>
                    <div class="text-tiny font-weight-bold text-muted text-uppercase">
                      Order ID: #{{ order.id }}
                    </div>
                    <h4 class="mb-1">Reminder! Verify Customer ID and Credit Card Information</h4>
                  </div>
                </div>                
              </div>
              <div class="text-content text-muted lead">
                To ensure a secure transaction, verify the customer's identity by matching their ID to the name on the credit card used for the website transaction. If any discrepancies arise, address them promptly with the customer and document the verification results within your POS system.  
              </div> 
              <button :disabled="loading || order.customer_verify_date" class="btn btn-primary btn-sm font-weight-bold mt-3 py-2 pull-right" @click="prepareStep">
                <div v-if="order.customer_verify_date">
                  <svg class="mr-2" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M8 16C10.1217 16 12.1566 15.1571 13.6569 13.6569C15.1571 12.1566 16 10.1217 16 8C16 5.87827 15.1571 3.84344 13.6569 2.34315C12.1566 0.842855 10.1217 0 8 0C5.87827 0 3.84344 0.842855 2.34315 2.34315C0.842855 3.84344 0 5.87827 0 8C0 10.1217 0.842855 12.1566 2.34315 13.6569C3.84344 15.1571 5.87827 16 8 16ZM11.707 6.707C11.8892 6.5184 11.99 6.2658 11.9877 6.0036C11.9854 5.7414 11.8802 5.49059 11.6948 5.30518C11.5094 5.11977 11.2586 5.0146 10.9964 5.01233C10.7342 5.01005 10.4816 5.11084 10.293 5.293L7 8.586L5.707 7.293C5.5184 7.11084 5.2658 7.01005 5.0036 7.01233C4.7414 7.0146 4.49059 7.11977 4.30518 7.30518C4.11977 7.49059 4.0146 7.7414 4.01233 8.0036C4.01005 8.2658 4.11084 8.5184 4.293 8.707L6.293 10.707C6.48053 10.8945 6.73484 10.9998 7 10.9998C7.26516 10.9998 7.51947 10.8945 7.707 10.707L11.707 6.707Z" fill="#FCA5A5"/></svg>
                  Customer's identity verified on {{ formattedVerifiedDate }}
                </div>
                <div v-else>
                  <div class="spinner-border spinner-border-sm mr-2" v-if="loading" />
                  Review Orders
                </div>
              </button>             
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  <script>
  
  import AdminService from '@/api-services/admin.service';
  import moment from 'moment-timezone';
  
  export default {
    name: 'prepareOrderVerifyId',
    props: ['order'],
    data() {
      return {
        loading: false
      };
    },
    computed: {
      formattedVerifiedDate() {
        return moment.utc(this.order.customer_verify_date).local().format('MMM D, YYYY hh:mm A');
      }
    },
    mounted() {
      if(!this.order.customer_verify_date)
        this.$parent.$parent.nextButtonDisabled = true;
      else
        this.$parent.$parent.nextButtonDisabled = false;
    },
    methods: { 
      async prepareStep() {
        this.loading = true;
        let res = await AdminService.prepareStep({id: this.order.id, step: 'verifyCustomer'});
        if (res.data.status === "success") {
          // this.order.customer_verify_date = res.data.date;
          this.$parent.$parent.nextButtonDisabled = false;
        } else {
          // this.$swal(res.data.message, '', 'error');
        }
        this.$router.push({path: "/admin/orders"}).catch(err => console.log(err));          
        this.loading = false;
      }
    }
  };
  </script>
  <style lang="scss" scoped>
    #package {
      .card {
        padding: 16px 24px;
        &.big {
          padding: 32px;
        }
        .round-head {
          color: #fff;
          background: var(--primary);
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          &.big {
            width: 56px;
            height: 56px;
          }
          &.success {
            background: #ECFDF5;
          }
        }
      }
    }
    @media (max-width: 768px) {
      .lead {
        font-size: 14px !important;
        font-weight: normal !important;
      }
    }
  </style>