<template>
  <div v-if="!isTruevalue">
    
  </div>
  <div class="bg-white  h-100" v-else>
    <div class="settings-header">
      <div class="settings-header-info">
        <div class="d-flex flex-column">
          <h5 class="font-weight-bold">Marketing</h5></div>
      </div>
      <div class="settings-body">
        <h6 class="font-weight-bold">Local Digital Marketing Program</h6>
        <p class="my-2">
          True Value’s Local Digital Marketing Program empowers your business by driving traffic to your e-commerce website and encouraging in-store visits through strategic online marketing efforts Through Google. With our program, your store can stay top-of-mind for customers in your area, right where they’re searching on Google.
        </p>  
        <ul>
          <li><b>Powered by Google:</b> Our program leverages Google’s powerful tools, including Paid Search and Display (Banners), to maximize your online presence.</li>
          <li><b>Always On:</b> Continuous visibility with an “Always On” approach that ensures optimal performance.</li>
          <li><b>Tailored Strategies:</b> Tailored to customers in your trade area, utilizing Product Categories (Year-Round and Seasonal), Retail Event Themes, and targeted keywords like “Hardware Near Me” to attract your ideal customers.</li>
          <li><b>Flexible Options:</b> Program options tailored to your local market size and competition level.</li>
          <li><b>Performance Monitoring:</b> True Value monitors your program performance to fine-tune and optimize your investment, ensuring you get the best results possible.  </li>
        </ul>
        <h6 class="font-weight-bold">Digital Bundle</h6>
        <p>Enhance your online presence even further with our Digital Bundle, combining Local E-Commerce with our digital marketing services. Stores participating in both Local Digital and Local E-Commerce have seen an impressive 73% increase in visits. Plus, bundle now and save up to $70 monthly on your digital marketing investment! Ready to take your digital marketing to the next level? Enroll through the Marketing Planning Tool and watch your online and in-store traffic soar!</p>
        <p>or Email <a href="mailto:MarketingOperations@truevalue.com">MarketingOperations@truevalue.com</a></p>
        <p>Log in via Net Warehouse. <a target="_blank" href="https://www.membersonline.com/mol2/website/account/login">Click Here</a><br>Netwarehouse => Business Tools => Marketing => Marketing Planning Tool</p>

        <!-- <div class="row">
          <div class="offset-md-3 col-md-6">
            <div class="card">
              <div class="card-body" style="background:#c3e6cb">
                <div class="container mt-4 p-1">
                  <h6 class="card-subtitle mb-2 text-center" style="color:#155724 !important">To change your participation please visit the MPT,<br> you can do so by logging in via Net warehouse. <br> <a target="_blank" href="https://www.membersonline.com/mol2/website/account/login" class="text-dark">Click here</a></h6>
                  <p class="text-center" style="color:#155724 !important"><b>- Follow Path Below -</b></p>
                  <p class="text-center" style="color:#155724 !important">Netwarehouse => Business Tools => Marketing =><br> Marketing Planning Tool</p>
                </div>
              </div>
            </div>
          </div>
        </div> -->

        <div class="row mt-2">
          <div class="col-md-12">
            <embed style="height:600px" src="/pdfs/Local_Digital_Sell_Sheet.pdf" type="application/pdf" width="100%" height="100%">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
    name: 'marketing',
    components: {  },
    data() {
      return {

      };
    },
    computed: {
      isTruevalue() {
        return this.$root.$children[0].isTruevalue;
      }
    },
};
</script>