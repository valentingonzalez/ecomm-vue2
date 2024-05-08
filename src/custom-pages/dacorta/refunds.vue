<template>
  <main>
    <div class="container">
      <h2>Refunds</h2>
      <div class="mt-2 mb-4">
        If something you purchased at Celebration Hardware isn’t quite right, you can return it.
        <p class="small">
          * Returns are currently suspended for the safety of our team and our customers. 
          Please refer to in store signage or call 407-566-1091 to speak with one of our 
          managers for specific details.
        </p>
      </div>
      <div class="card p-4">
        <table class="table border-top-0 table-borderless table-striped">
          <tbody>
            <tr>
              <td>Time Limit</td>
              <td>14 days</td>
            </tr>
            <tr>
              <td>Receipt Required</td>
              <td>Yes</td>
            </tr>
            <tr>
              <td>Restocking Fee</td>
              <td>None</td>
            </tr>
            <tr>
              <td>Refund / Exchange</td>
              <td>Refund or exchange at customer’s option</td>
            </tr>
            <tr>
              <td>Original Packaging Required</td>
              <td>No</td>
            </tr>
            <tr>
              <td>Custom Tinted Color Matched Paint</td>
              <td>Cannot be returned for any reason</td>
            </tr>
            <tr>
              <td>Conditions</td>
              <td>
                Must be unused and In like-new condition with original parts, accessories and all paperwork
                <br />
                Your refund, including the applicable sales tax, will be issued in the same form of payment 
                that was originally used for the purchase
              </td>
            </tr>
            <tr>
              <td>Exceptions</td>
              <td>
                Custom Tinted or Color Matched Paint<br />
                Cut Keys<br />
                Special Order<br />
                Power Tools
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </main>
</template>

<script>

  export default {
    name: 'refunds'
  };
</script>

<style lang="scss" scoped>
  main {
    max-width: 1020px;
    margin: 0 auto;
  }
</style>