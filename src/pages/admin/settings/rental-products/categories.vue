<template>
  <div v-if="$ezHasNoPermission('manage_rental_categories')">
    <no-permission-truevalue page="Rental Categories"></no-permission-truevalue>
  </div>

  <div v-else>
    <div class="mb-4 text-center">
      <div v-if="enablingOrDisablingRentals" class="spinner-border spinner-border position-absolute mr-2 top-spinner" />
    </div>
    <b-modal size="lg" ref="newCategoryModal" @hidden="resetModal" title="Add Category" centered hide-footer>
      <div slot="modal-header">
        <h5>
          <b>{{ categoryModalTitle }}</b>
          <button type="button" class="close" @click="hideNewCategoryModal">×</button>
        </h5>
      </div>
      <form @submit.prevent="handleCategorySubmit" class="p-3">
        <div class="form-group mb-4">
          <label for="title" class="form-label"><b>Category Name</b></label>
          <input type="text" class="form-control" v-model="title" id="title" required>
        </div>
        <div v-if="imagePreview" class="mb-3 mt-2 new-category-img-wrapper">
          <img :src="imagePreview" alt="Preview" class="img-fluid" @error="handleBrokenImage">
        </div>

        <div class="row mx-0">
          <div v-for="(defaultIcon, index) in defaultIcons" :key="index" class="col-md-2 p-2">
            <div :title="defaultIcon.name" class="card mx-auto cursor-pointer" :class="{ 'category-svg-active': imagePreview === defaultIcon.url }" @click="selectCategorySvgIcon(defaultIcon.name, defaultIcon.url)">
              <img :src="defaultIcon.url" width="65" height="65" class="img-fluid m-auto p-2" alt="SVG Icon" @error="handleBrokenImage">
            </div>
          </div>
        </div>

        <div class="form-group mt-4">
          <label for="image" class="form-label"><b>Upload Custom Image</b></label>
          <div
            class="dropzone d-flex justify-content-center align-items-center border border-dashed"
            @drop.prevent="handleDrop"
            @dragover.prevent
            @dragenter.prevent
            @click="triggerFileInput"
            style="height: 200px; cursor: pointer; position: relative;">
            <input type="file" ref="newCategoryImage" @change="handleImageUpload" id="image" accept="image/*" style="display: none;">

            <div class="d-flex flex-column justify-content-center align-items-center text-center">
              <i class="fa fa-picture-o fa-3x text-muted"></i>
              <p class="text-muted"><b>Upload a file</b>, or drag and drop<br><small>PNG, JPG, GIF up to 10MB</small></p>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-outline-secondary" @click="hideNewCategoryModal">Cancel</button>
          <button type="submit" class="btn btn-primary">{{ categoryModalSubmitButtonText }}</button>
        </div>
      </form>
    </b-modal>
    <div class="bg-white  h-100" v-if="rentalDisabled()">
      <div class="container mt-5">
        <div class="container custom-container">
          <div class="mb-4 text-center">
            <svg width="128" height="124" viewBox="0 0 128 124" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_3080_16140)"><path d="M105.841 30.8786H38.3286C35.787 30.8786 33.7295 32.9361 33.7295 35.4777V84.0101C33.7295 86.5517 35.787 88.6091 38.3286 88.6091H105.845C108.387 88.6091 110.444 86.5517 110.444 84.0101V35.4777C110.444 32.9361 108.387 30.8786 105.845 30.8786H105.841ZM45.6032 36.3767C44.4059 36.3767 43.4377 35.4085 43.4377 34.2112C43.4377 33.0139 44.4059 32.0457 45.6032 32.0457C46.8006 32.0457 47.7688 33.0139 47.7688 34.2112C47.7688 35.4085 46.8006 36.3767 45.6032 36.3767ZM97.5936 36.3767C96.3963 36.3767 95.428 35.4085 95.428 34.2112C95.428 33.0139 96.3963 32.0457 97.5936 32.0457C98.7909 32.0457 99.7591 33.0139 99.7591 34.2112C99.7591 35.4085 98.7909 36.3767 97.5936 36.3767Z" fill="#0F172A"/><path d="M104.872 29.7159H37.3559C34.8143 29.7159 32.7568 31.7734 32.7568 34.315V82.8474C32.7568 85.389 34.8143 87.4465 37.3559 87.4465H104.872C107.414 87.4465 109.472 85.389 109.472 82.8474V34.315C109.472 31.7734 107.414 29.7159 104.872 29.7159ZM45.6031 35.6031C44.4058 35.6031 43.4376 34.6349 43.4376 33.4376C43.4376 32.2402 44.4058 31.272 45.6031 31.272C46.8005 31.272 47.7687 32.2402 47.7687 33.4376C47.7687 34.6349 46.8005 35.6031 45.6031 35.6031ZM97.5935 35.6031C96.3962 35.6031 95.4279 34.6349 95.4279 33.4376C95.4279 32.2402 96.3962 31.272 97.5935 31.272C98.7908 31.272 99.759 32.2402 99.759 33.4376C99.759 34.6349 98.7908 35.6031 97.5935 35.6031Z" fill="#F1F5F9"/><path d="M102.846 34.0211C104.441 34.0211 105.737 35.3179 105.737 36.9129V80.8246C105.737 82.4195 104.441 83.7163 102.846 83.7163H39.4959C37.9009 83.7163 36.6041 82.4195 36.6041 80.8246V36.9129C36.6041 35.3179 37.9009 34.0211 39.4959 34.0211H102.846ZM102.846 32.8584H39.4959C37.2568 32.8584 35.4414 34.6738 35.4414 36.9129V80.8246C35.4414 83.0636 37.2568 84.879 39.4959 84.879H102.846C105.085 84.879 106.9 83.0636 106.9 80.8246V36.9129C106.9 34.6738 105.085 32.8584 102.846 32.8584Z" fill="#CBD5E1"/><path d="M46.0361 20.1763C44.7091 20.1763 43.6328 21.9442 43.6328 24.1227C43.6328 26.3012 44.7091 28.0691 46.0361 28.0691C46.8357 28.0691 47.5403 27.4294 47.9769 26.4439C48.2665 25.7912 48.435 24.9915 48.435 24.1227C48.435 23.9628 48.4307 23.8029 48.4178 23.6473C48.2751 21.6935 47.2593 20.1763 46.0318 20.1763H46.0361ZM45.9194 27.1009C45.016 27.1009 44.2812 25.7393 44.2812 24.0622C44.2812 22.3851 45.016 21.0235 45.9194 21.0235C46.7623 21.0235 47.4539 22.1992 47.5489 23.7121C47.5576 23.8245 47.5576 23.9412 47.5576 24.0622C47.5576 24.6933 47.4539 25.2768 47.2766 25.7609C46.9827 26.5692 46.4856 27.1009 45.9194 27.1009Z" fill="#59595B"/><g style="mix-blend-mode:multiply" opacity="0.38"><path d="M45.9716 20.7469C44.8694 20.7469 43.9746 22.303 43.9746 24.2221C43.9746 26.1413 44.8694 27.6974 45.9716 27.6974C46.6372 27.6974 47.2251 27.1355 47.5882 26.2666C47.8302 25.6918 47.9685 24.9872 47.9685 24.2221C47.9685 24.0795 47.9642 23.9412 47.9556 23.8029C47.8346 22.0825 46.996 20.7469 45.9716 20.7469ZM47.277 25.7652C46.983 26.5735 46.4859 27.1052 45.9197 27.1052C45.0163 27.1052 44.2815 25.7436 44.2815 24.0665C44.2815 22.3894 45.0163 21.0278 45.9197 21.0278C46.7626 21.0278 47.4542 22.2035 47.5493 23.7164C47.5579 23.8288 47.5579 23.9455 47.5579 24.0665C47.5579 24.6976 47.4542 25.2811 47.277 25.7652Z" fill="#59595B"/></g><mask id="mask0_3080_16140" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="46" y="27" width="3" height="3"><path d="M46.752 27.8876C47.0243 28.3501 47.2145 29.0072 47.262 29.7377L48.1395 29.729C48.0703 28.791 47.8023 27.9611 47.4046 27.343C47.2966 27.477 47.2188 27.6283 46.752 27.8876Z" fill="white"/></mask><g mask="url(#mask0_3080_16140)"><path d="M46.737 32.3959C46.4474 32.8844 46.0584 33.1869 45.6348 33.1869C44.7314 33.1869 43.9966 31.8254 43.9966 30.1483C43.9966 28.4712 44.7314 27.1096 45.6348 27.1096C46.4777 27.1096 47.1693 28.2248 47.2644 29.742L48.1418 29.7333C47.9992 27.7796 46.9834 26.2624 45.7558 26.2624C44.4288 26.2624 43.3525 28.0303 43.3525 30.2088C43.3525 32.3873 44.4288 34.1552 45.7558 34.1552C46.3955 34.1552 46.9791 33.7402 47.4113 33.0702C47.4113 33.0702 47.3465 32.9017 47.1606 32.7244C47.0223 32.5904 46.737 32.4003 46.737 32.4003V32.3959Z" fill="#59595B"/><g style="mix-blend-mode:multiply" opacity="0.38"><path d="M45.7108 26.7292C44.574 26.7292 43.6533 28.402 43.6533 30.2304C43.6533 32.0588 44.574 33.537 45.7108 33.537C46.2468 33.537 46.7352 33.2042 47.1026 32.6639C46.9557 32.5386 46.7395 32.3959 46.7395 32.3959C46.4499 32.8843 46.0609 33.1869 45.6373 33.1869C44.7339 33.1869 43.9991 31.8253 43.9991 30.1482C43.9991 28.4711 44.7339 27.1096 45.6373 27.1096C46.4802 27.1096 47.1718 28.2248 47.2669 29.7419H47.7424C47.5911 28.1469 46.7395 26.7335 45.7108 26.7335V26.7292Z" fill="#59595B"/></g><path d="M46.737 32.3959C46.4474 32.8844 46.0584 33.1869 45.6348 33.1869C44.7314 33.1869 43.9966 31.8254 43.9966 30.1483C43.9966 28.4712 44.7314 27.1096 45.6348 27.1096C46.4777 27.1096 47.1693 28.2248 47.2644 29.742L48.1418 29.7333C47.9992 27.7796 46.9834 26.2624 45.7558 26.2624C44.4288 26.2624 43.3525 28.0303 43.3525 30.2088C43.3525 32.3873 44.4288 34.1552 45.7558 34.1552C46.3955 34.1552 46.9791 33.7402 47.4113 33.0702C47.4113 33.0702 47.3465 32.9017 47.1606 32.7244C47.0223 32.5904 46.737 32.4003 46.737 32.4003V32.3959Z" fill="#59595B"/><g style="mix-blend-mode:multiply" opacity="0.38"><path d="M45.7108 26.7292C44.574 26.7292 43.6533 28.402 43.6533 30.2304C43.6533 32.0588 44.574 33.537 45.7108 33.537C46.2468 33.537 46.7352 33.2042 47.1026 32.6639C46.9557 32.5386 46.7395 32.3959 46.7395 32.3959C46.4499 32.8843 46.0609 33.1869 45.6373 33.1869C44.7339 33.1869 43.9991 31.8253 43.9991 30.1482C43.9991 28.4711 44.7339 27.1096 45.6373 27.1096C46.4802 27.1096 47.1718 28.2248 47.2669 29.7419H47.7424C47.5911 28.1469 46.7395 26.7335 45.7108 26.7335V26.7292Z" fill="#59595B"/></g></g><mask id="mask1_3080_16140" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="43" y="26" width="5" height="9"><path d="M46.737 32.396C46.4474 32.8844 46.0584 33.187 45.6348 33.187C44.7314 33.187 43.9966 31.8254 43.9966 30.1483C43.9966 28.4712 44.7314 27.1096 45.6348 27.1096C45.812 27.1096 45.9849 27.1615 46.1492 27.2566L46.2097 27.1485C46.2097 27.1485 46.6765 26.8416 46.7673 26.6255C46.4604 26.3921 46.1189 26.2581 45.7558 26.2581C44.4288 26.2581 43.3525 28.026 43.3525 30.2045C43.3525 32.383 44.4288 34.1509 45.7558 34.1509C46.3955 34.1509 46.9791 33.7359 47.4113 33.066C47.4113 33.066 47.3465 32.8974 47.1606 32.7202C47.0223 32.5862 46.737 32.396 46.737 32.396Z" fill="white"/></mask><g mask="url(#mask1_3080_16140)"><path d="M46.737 32.3959C46.4474 32.8844 46.0584 33.1869 45.6348 33.1869C44.7314 33.1869 43.9966 31.8254 43.9966 30.1483C43.9966 28.4712 44.7314 27.1096 45.6348 27.1096C46.4777 27.1096 47.1693 28.2248 47.2644 29.742L48.1418 29.7333C47.9992 27.7796 46.9834 26.2624 45.7558 26.2624C44.4288 26.2624 43.3525 28.0303 43.3525 30.2088C43.3525 32.3873 44.4288 34.1552 45.7558 34.1552C46.3955 34.1552 46.9791 33.7402 47.4113 33.0702C47.4113 33.0702 47.3465 32.9017 47.1606 32.7244C47.0223 32.5904 46.737 32.4003 46.737 32.4003V32.3959Z" fill="#59595B"/><g style="mix-blend-mode:multiply" opacity="0.38"><path d="M45.7108 26.7292C44.574 26.7292 43.6533 28.402 43.6533 30.2304C43.6533 32.0588 44.574 33.537 45.7108 33.537C46.2468 33.537 46.7352 33.2042 47.1026 32.6639C46.9557 32.5386 46.7395 32.3959 46.7395 32.3959C46.4499 32.8843 46.0609 33.1869 45.6373 33.1869C44.7339 33.1869 43.9991 31.8253 43.9991 30.1482C43.9991 28.4711 44.7339 27.1096 45.6373 27.1096C46.4802 27.1096 47.1718 28.2248 47.2669 29.7419H47.7424C47.5911 28.1469 46.7395 26.7335 45.7108 26.7335V26.7292Z" fill="#59595B"/></g></g><path d="M96.3748 22.0825H0.420898V8.47113L104.263 13.5068L104.125 15.1882L96.3748 22.0825Z" fill="#1E293B"/><path d="M96.3748 20.1461H0.420898V6.53473H96.3748L104.125 13.2518L96.3748 20.1461Z" fill="#F1F5F9"/><path d="M20.2375 0.0769653H10.3291V123.932H20.2375V0.0769653Z" fill="#F1F5F9"/><path d="M25.1925 0.0769653H20.2383V123.932H25.1925V0.0769653Z" fill="#1E293B"/><path d="M119.625 22.0824H23.667V8.47107L127.509 13.5067L127.371 15.1881L119.625 22.0824Z" fill="#1E293B"/><path d="M119.625 20.146H23.667V6.53461H119.625L127.371 13.2517L119.625 20.146Z" fill="#F1F5F9"/><path d="M59.2922 39.5386H50.919V44.2197H58.3472V46.6372H50.919V52.527H48.0619V37.1431H59.2922V39.5386ZM69.07 52.7468C64.301 52.7468 60.7846 49.3843 60.7846 44.8351C60.7846 40.2858 64.301 36.9233 69.07 36.9233C73.839 36.9233 77.3554 40.2638 77.3554 44.8351C77.3554 49.4063 73.839 52.7468 69.07 52.7468ZM69.07 50.2414C72.1688 50.2414 74.4764 47.9778 74.4764 44.8351C74.4764 41.6923 72.1688 39.4287 69.07 39.4287C65.9712 39.4287 63.6636 41.6923 63.6636 44.8351C63.6636 47.9778 65.9712 50.2414 69.07 50.2414ZM93.526 52.527H90.4492L87.3065 48.0217C87.1087 48.0437 86.9109 48.0437 86.7131 48.0437H83.2407V52.527H80.3837V37.1431H86.7131C90.7569 37.1431 93.2623 39.2089 93.2623 42.6154C93.2623 44.9449 92.0755 46.6592 89.9877 47.4723L93.526 52.527ZM90.3833 42.6154C90.3833 40.6814 89.0867 39.5606 86.5813 39.5606H83.2407V45.6922H86.5813C89.0867 45.6922 90.3833 44.5494 90.3833 42.6154Z" fill="#1E293B"/><path d="M58.4741 69.2418H55.9236L53.3184 65.5071C53.1544 65.5253 52.9905 65.5253 52.8265 65.5253H49.948V69.2418H47.5797V56.4891H52.8265C56.1786 56.4891 58.2555 58.2016 58.2555 61.0254C58.2555 62.9565 57.2717 64.3775 55.541 65.0516L58.4741 69.2418ZM55.8689 61.0254C55.8689 59.4222 54.794 58.4931 52.7172 58.4931H49.948V63.5759H52.7172C54.794 63.5759 55.8689 62.6286 55.8689 61.0254ZM63.2736 67.256H70.4697V69.2418H60.9052V56.4891H70.2147V58.4749H63.2736V61.7906H69.4313V63.7399H63.2736V67.256ZM82.0914 56.4891H84.4416V69.2418H82.4922L75.46 60.6064V69.2418H73.1099V56.4891H75.0592L82.0914 65.1245V56.4891ZM90.4457 69.2418V58.4931H86.2191V56.4891H97.0406V58.4931H92.814V69.2418H90.4457Z" fill="#1E293B"/><path d="M95.5579 73.0787H47.6782C46.7233 73.0787 45.9492 73.8528 45.9492 74.8077V79.5192C45.9492 80.4741 46.7233 81.2481 47.6782 81.2481H95.5579C96.5128 81.2481 97.2869 80.4741 97.2869 79.5192V74.8077C97.2869 73.8528 96.5128 73.0787 95.5579 73.0787Z" fill="#CBD5E1"/><path d="M97.9453 20.1763C96.6183 20.1763 95.542 21.9442 95.542 24.1227C95.542 26.3012 96.6183 28.0691 97.9453 28.0691C98.7449 28.0691 99.4495 27.4294 99.886 26.4439C100.176 25.7912 100.344 24.9915 100.344 24.1227C100.344 23.9628 100.34 23.8029 100.327 23.6473C100.184 21.6935 99.1685 20.1763 97.9409 20.1763H97.9453ZM97.8286 27.1009C96.9252 27.1009 96.1904 25.7393 96.1904 24.0622C96.1904 22.3851 96.9252 21.0235 97.8286 21.0235C98.6714 21.0235 99.363 22.1992 99.4581 23.7121C99.4668 23.8245 99.4668 23.9412 99.4668 24.0622C99.4668 24.6933 99.363 25.2768 99.1858 25.7609C98.8919 26.5692 98.3948 27.1009 97.8286 27.1009Z" fill="#59595B"/><g style="mix-blend-mode:multiply" opacity="0.38"><path d="M97.8808 20.7469C96.7785 20.7469 95.8838 22.303 95.8838 24.2221C95.8838 26.1413 96.7785 27.6974 97.8808 27.6974C98.5464 27.6974 99.1343 27.1355 99.4974 26.2666C99.7394 25.6918 99.8777 24.9872 99.8777 24.2221C99.8777 24.0795 99.8734 23.9412 99.8648 23.8029C99.7437 22.0825 98.9052 20.7469 97.8808 20.7469ZM99.1861 25.7652C98.8922 26.5735 98.3951 27.1052 97.8289 27.1052C96.9255 27.1052 96.1907 25.7436 96.1907 24.0665C96.1907 22.3894 96.9255 21.0278 97.8289 21.0278C98.6718 21.0278 99.3634 22.2035 99.4585 23.7164C99.4671 23.8288 99.4671 23.9455 99.4671 24.0665C99.4671 24.6976 99.3634 25.2811 99.1861 25.7652Z" fill="#59595B"/></g><mask id="mask2_3080_16140" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="98" y="27" width="3" height="3"><path d="M98.668 27.8876C98.9403 28.3501 99.1305 29.0072 99.178 29.7377L100.055 29.729C99.9863 28.791 99.7183 27.9611 99.3207 27.343C99.2126 27.477 99.1348 27.6283 98.668 27.8876Z" fill="white"/></mask><g mask="url(#mask2_3080_16140)"><path d="M98.6491 32.3961C98.3595 32.8846 97.9705 33.1871 97.5469 33.1871C96.6435 33.1871 95.9087 31.8256 95.9087 30.1484C95.9087 28.4713 96.6435 27.1098 97.5469 27.1098C98.3898 27.1098 99.0814 28.225 99.1765 29.7421L100.054 29.7335C99.9113 27.7798 98.8955 26.2626 97.6679 26.2626C96.3409 26.2626 95.2646 28.0305 95.2646 30.209C95.2646 32.3875 96.3409 34.1554 97.6679 34.1554C98.3077 34.1554 98.8912 33.7404 99.3234 33.0704C99.3234 33.0704 99.2586 32.9018 99.0727 32.7246C98.9344 32.5906 98.6491 32.4004 98.6491 32.4004V32.3961Z" fill="#59595B"/><g style="mix-blend-mode:multiply" opacity="0.38"><path d="M97.6161 26.7294C96.4793 26.7294 95.5586 28.4022 95.5586 30.2306C95.5586 32.059 96.4793 33.5373 97.6161 33.5373C98.1521 33.5373 98.6405 33.2045 99.0079 32.6641C98.8609 32.5388 98.6448 32.3962 98.6448 32.3962C98.3552 32.8846 97.9662 33.1872 97.5426 33.1872C96.6392 33.1872 95.9044 31.8256 95.9044 30.1485C95.9044 28.4714 96.6392 27.1098 97.5426 27.1098C98.3855 27.1098 99.0771 28.225 99.1722 29.7422H99.6476C99.4963 28.1472 98.6448 26.7338 97.6161 26.7338V26.7294Z" fill="#59595B"/></g><path d="M98.6491 32.3961C98.3595 32.8846 97.9705 33.1871 97.5469 33.1871C96.6435 33.1871 95.9087 31.8256 95.9087 30.1484C95.9087 28.4713 96.6435 27.1098 97.5469 27.1098C98.3898 27.1098 99.0814 28.225 99.1765 29.7421L100.054 29.7335C99.9113 27.7798 98.8955 26.2626 97.6679 26.2626C96.3409 26.2626 95.2646 28.0305 95.2646 30.209C95.2646 32.3875 96.3409 34.1554 97.6679 34.1554C98.3077 34.1554 98.8912 33.7404 99.3234 33.0704C99.3234 33.0704 99.2586 32.9018 99.0727 32.7246C98.9344 32.5906 98.6491 32.4004 98.6491 32.4004V32.3961Z" fill="#59595B"/><g style="mix-blend-mode:multiply" opacity="0.38"><path d="M97.6161 26.7294C96.4793 26.7294 95.5586 28.4022 95.5586 30.2306C95.5586 32.059 96.4793 33.5373 97.6161 33.5373C98.1521 33.5373 98.6405 33.2045 99.0079 32.6641C98.8609 32.5388 98.6448 32.3962 98.6448 32.3962C98.3552 32.8846 97.9662 33.1872 97.5426 33.1872C96.6392 33.1872 95.9044 31.8256 95.9044 30.1485C95.9044 28.4714 96.6392 27.1098 97.5426 27.1098C98.3855 27.1098 99.0771 28.225 99.1722 29.7422H99.6476C99.4963 28.1472 98.6448 26.7338 97.6161 26.7338V26.7294Z" fill="#59595B"/></g></g><mask id="mask3_3080_16140" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="95" y="26" width="5" height="9"><path d="M98.6481 32.3959C98.3585 32.8844 97.9695 33.1869 97.5459 33.1869C96.6425 33.1869 95.9077 31.8254 95.9077 30.1483C95.9077 28.4711 96.6425 27.1096 97.5459 27.1096C97.7231 27.1096 97.896 27.1614 98.0603 27.2565L98.1208 27.1485C98.1208 27.1485 98.5876 26.8416 98.6784 26.6255C98.3715 26.3921 98.03 26.2581 97.667 26.2581C96.34 26.2581 95.2637 28.0259 95.2637 30.2044C95.2637 32.383 96.34 34.1508 97.667 34.1508C98.3067 34.1508 98.8902 33.7359 99.3225 33.0659C99.3225 33.0659 99.2576 32.8973 99.0717 32.7201C98.9334 32.5861 98.6481 32.3959 98.6481 32.3959Z" fill="white"/></mask><g mask="url(#mask3_3080_16140)"><path d="M98.6481 32.3958C98.3585 32.8842 97.9695 33.1868 97.5459 33.1868C96.6425 33.1868 95.9077 31.8253 95.9077 30.1481C95.9077 28.471 96.6425 27.1095 97.5459 27.1095C98.3888 27.1095 99.0804 28.2247 99.1755 29.7418L100.053 29.7332C99.9103 27.7794 98.8945 26.2623 97.667 26.2623C96.34 26.2623 95.2637 28.0301 95.2637 30.2087C95.2637 32.3872 96.34 34.155 97.667 34.155C98.3067 34.155 98.8902 33.7401 99.3225 33.0701C99.3225 33.0701 99.2576 32.9015 99.0717 32.7243C98.9334 32.5903 98.6481 32.4001 98.6481 32.4001V32.3958Z" fill="#59595B"/><g style="mix-blend-mode:multiply" opacity="0.38"><path d="M97.6151 26.7292C96.4783 26.7292 95.5576 28.402 95.5576 30.2304C95.5576 32.0588 96.4783 33.5371 97.6151 33.5371C98.1511 33.5371 98.6395 33.2043 99.0069 32.664C98.86 32.5386 98.6438 32.396 98.6438 32.396C98.3542 32.8844 97.9652 33.187 97.5416 33.187C96.6382 33.187 95.9034 31.8254 95.9034 30.1483C95.9034 28.4712 96.6382 27.1096 97.5416 27.1096C98.3845 27.1096 99.0761 28.2248 99.1712 29.742H99.6467C99.4954 28.147 98.6438 26.7336 97.6151 26.7336V26.7292Z" fill="#59595B"/></g></g></g><defs><clipPath id="clip0_3080_16140"><rect width="127.158" height="123.856" fill="white" transform="translate(0.420898 0.0769653)"/></clipPath></defs></svg>
          </div>
          <h2 class="font-weight-bold">Discover your new revenue stream with rentals!</h2>
          <p>From tools and appliances to furniture and beyond, your website now lets customers rent all sorts of exciting products. Here's how it works:</p>
          <b>Browsing made easy:</b>
          <ul>
            <li>
              The dedicated Rentals page displays all available categories, giving customers a clear overview of your rental offerings.
            </li>
            <li>
              Within each category, they'll find individual products with transparent pricing options, including minimum charges, hourly rates, and longer-term rentals like weekly rates.
            </li>
          </ul>
          <b>Flexible options for you:</b>
          <ul>
            <li>
              Transform existing products: Turn any "For Sale" product into a rental with a few clicks! Just head to the Product Editor, search by SKU, and switch the type to "Rental."
            </li>
            <li>
              Craft your categories: Design custom rental categories and sub-categories to perfectly organize your diverse offerings.
            </li>
            <li>
              Go bespoke: Create unique rental products, from niche items to special packages, and showcase them in the appropriate categories.
            </li>
          </ul>
          <p>Ready to unlock the potential of rentals? Dive into the platform and start building your new revenue stream!</p>
          <div class="mt-3 alert alert-primary" role="alert" v-if="isBusinessE2()">
            <svg id="warning-icon" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.7883 13.6327H1.21172C0.774557 13.6327 0.382669 13.4069 0.163446 13.0287C-0.0512913 12.6582 -0.0545739 12.2211 0.154418 11.8295L5.94274 0.986783C6.15001 0.598506 6.54526 0.366699 6.99999 0.366699C7.45474 0.366699 7.84996 0.598506 8.05726 0.986783L13.8456 11.8295C14.0546 12.2211 14.0513 12.6582 13.8365 13.0287C13.6173 13.4069 13.2255 13.6327 12.7883 13.6327Z" fill="#1E3A8A"/><path d="M6.99947 11.8554C6.39613 11.8554 5.90527 11.3645 5.90527 10.7612C5.90527 10.1579 6.39613 9.66699 6.99947 9.66699C7.60282 9.66699 8.09367 10.1579 8.09367 10.7612C8.09367 11.3645 7.60282 11.8554 6.99947 11.8554Z" fill="#E1EFFE"/><path d="M6.9995 8.57268C6.39613 8.57268 5.90527 8.08182 5.90527 7.47848V5.11227C5.90527 4.50892 6.39613 4.01807 6.99947 4.01807C7.60282 4.01807 8.09367 4.50892 8.09367 5.11227V7.47848C8.09367 8.08182 7.60284 8.57268 6.9995 8.57268Z" fill="#E1EFFE"/></svg>
            By enabling rentals feature you will be charged $75 monthly.
          </div>
          <div class="mt-3 text-center">
            <button class="btn btn-primary me-2" :disabled="enablingOrDisablingRentals" @click="enableDisableRentals('enable')">Enable Rentals</button>
            <a href="#" @click.prevent="$refs.tutorialModal.show()" class="ml-2 btn btn-tutorial text-medium bg-white btn-action">
              &nbsp; &nbsp; <i class="fa fa-play mr-1"></i> How it works &nbsp;
            </a>
            <b-modal size="lg" ref="tutorialModal">
              <div slot="modal-header">
                <h5>Rental Products</h5>
              </div>
              <div>
                <video class="w-100" poster="/images/cover-rentals.png" controls>
                  <source src="https://storage.googleapis.com/content.ezadtv.com/2024/03/06/65e8bb74765e4_Rentals.m4v" type="video/mp4">
                </video>
              </div>
              <div slot="modal-footer">
                <button type="button" class="btn btn-primary" @click="$refs.tutorialModal.hide()">Done</button>
              </div>
            </b-modal>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <div v-if="isBusinessE2() && this.selectedrentalsSettings.disable_request">
        <div class="container mt-5">
          <div class="mb-4 text-center">
            <svg width="135" height="147" viewBox="0 0 135 147" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M67 132C101.493 132 129.455 104.018 129.455 69.5C129.455 34.9822 101.493 7 67 7C32.507 7 4.54492 34.9822 4.54492 69.5C4.54492 104.018 32.507 132 67 132Z" fill="#F1F5F9"/><g filter="url(#filter0_d_3142_17041)"><path d="M113.66 126.562H21.3553C18.52 126.562 16.1572 124.276 16.1572 121.36V17.64C16.1572 14.8027 18.4412 12.5171 21.3553 12.5171H113.66C116.495 12.5171 118.858 14.8027 118.858 17.7189V121.36C118.858 124.197 116.574 126.562 113.66 126.562Z" fill="url(#paint0_linear_3142_17041)"/><path d="M113.66 126.562H21.3553C18.52 126.562 16.1572 124.276 16.1572 121.36V17.64C16.1572 14.8027 18.4412 12.5171 21.3553 12.5171H113.66C116.495 12.5171 118.858 14.8027 118.858 17.7189V121.36C118.858 124.197 116.574 126.562 113.66 126.562Z" fill="white"/></g><path d="M107.91 43.8066H26.4739C25.5288 43.8066 24.7412 43.0185 24.7412 42.0727V26.625C24.7412 25.6793 25.5288 24.8911 26.4739 24.8911H107.91C108.855 24.8911 109.642 25.6793 109.642 26.625V41.9939C109.721 43.0185 108.933 43.8066 107.91 43.8066Z" fill="#E2E8F0"/><path d="M33.2475 36.7133C34.5524 36.7133 35.6102 35.6547 35.6102 34.3488C35.6102 33.043 34.5524 31.9844 33.2475 31.9844C31.9426 31.9844 30.8848 33.043 30.8848 34.3488C30.8848 35.6547 31.9426 36.7133 33.2475 36.7133Z" fill="#0F172A"/><path d="M91.3704 35.9252H43.5643C43.1705 35.9252 42.8555 35.61 42.8555 35.2159V33.4032C42.8555 33.0091 43.1705 32.6938 43.5643 32.6938H91.3704C91.7642 32.6938 92.0792 33.0091 92.0792 33.4032V35.2159C92.0792 35.61 91.7642 35.9252 91.3704 35.9252Z" fill="#0F172A"/><path d="M107.91 68.0813H26.4739C25.5288 68.0813 24.7412 67.2932 24.7412 66.3474V50.9786C24.7412 50.0328 25.5288 49.2446 26.4739 49.2446H107.91C108.855 49.2446 109.642 50.0328 109.642 50.9786V66.3474C109.721 67.2932 108.933 68.0813 107.91 68.0813Z" fill="#E2E8F0"/><path d="M33.2475 60.9882C34.5524 60.9882 35.6102 59.9296 35.6102 58.6237C35.6102 57.3179 34.5524 56.2593 33.2475 56.2593C31.9426 56.2593 30.8848 57.3179 30.8848 58.6237C30.8848 59.9296 31.9426 60.9882 33.2475 60.9882Z" fill="#0F172A"/><path d="M91.3704 60.2788H43.5643C43.1705 60.2788 42.8555 59.9635 42.8555 59.5694V57.7567C42.8555 57.3626 43.1705 57.0474 43.5643 57.0474H91.3704C91.7642 57.0474 92.0792 57.3626 92.0792 57.7567V59.5694C92.0792 59.9635 91.7642 60.2788 91.3704 60.2788Z" fill="#0F172A"/><path d="M107.91 116.71H26.4739C25.5288 116.71 24.7412 115.922 24.7412 114.976V99.6075C24.7412 98.6617 25.5288 97.8735 26.4739 97.8735H107.91C108.855 97.8735 109.642 98.6617 109.642 99.6075V114.976C109.721 115.922 108.933 116.71 107.91 116.71Z" fill="#E2E8F0"/><path d="M33.2475 109.617C34.5524 109.617 35.6102 108.558 35.6102 107.253C35.6102 105.947 34.5524 104.888 33.2475 104.888C31.9426 104.888 30.8848 105.947 30.8848 107.253C30.8848 108.558 31.9426 109.617 33.2475 109.617Z" fill="#0F172A"/><path d="M91.3704 108.829H43.5643C43.1705 108.829 42.8555 108.513 42.8555 108.119V106.307C42.8555 105.912 43.1705 105.597 43.5643 105.597H91.3704C91.7642 105.597 92.0792 105.912 92.0792 106.307V108.119C92.0792 108.513 91.7642 108.829 91.3704 108.829Z" fill="#0F172A"/><path d="M126.102 92.3562H44.6668C43.7217 92.3562 42.9341 91.5681 42.9341 90.6223V75.2535C42.9341 74.3077 43.7217 73.5195 44.6668 73.5195H126.102C127.048 73.5195 127.835 74.3077 127.835 75.2535V90.6223C127.835 91.5681 127.048 92.3562 126.102 92.3562Z" fill="#E2E8F0"/><path d="M51.4404 85.3417C52.7453 85.3417 53.8031 84.2831 53.8031 82.9772C53.8031 81.6714 52.7453 80.6128 51.4404 80.6128C50.1355 80.6128 49.0776 81.6714 49.0776 82.9772C49.0776 84.2831 50.1355 85.3417 51.4404 85.3417Z" fill="#0F172A"/><path d="M109.563 84.5537H61.7572C61.3634 84.5537 61.0483 84.2384 61.0483 83.8443V82.0316C61.0483 81.6375 61.3634 81.3223 61.7572 81.3223H109.563C109.957 81.3223 110.272 81.6375 110.272 82.0316V83.8443C110.272 84.2384 109.957 84.5537 109.563 84.5537Z" fill="#0F172A"/><defs><filter id="filter0_d_3142_17041" x="0.157227" y="0.51709" width="134.7" height="146.045" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/><feOffset dy="4"/><feGaussianBlur stdDeviation="8"/><feColorMatrix type="matrix" values="0 0 0 0 0.397708 0 0 0 0 0.47749 0 0 0 0 0.575 0 0 0 0.08 0"/><feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_3142_17041"/><feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_3142_17041" result="shape"/></filter><linearGradient id="paint0_linear_3142_17041" x1="67.474" y1="9.87913" x2="67.474" y2="127.791" gradientUnits="userSpaceOnUse"><stop stop-color="#FDFEFF"/><stop offset="0.9964" stop-color="#ECF0F5"/></linearGradient></defs></svg>
            <h2 class="font-weight-bold">Request Received</h2>
            <p>Our team is diligently working to disable the rental feature for <br> your account. This process may take some time.</p>
          </div>
        </div>
      </div>
      <div v-else>
        <div v-if="!categories.length && categoryLoading">
          <div class="mb-4 text-center">
            <div v-if="categoryLoading" class="spinner-border spinner-border position-absolute mr-2" />
          </div>
        </div>
        <div v-else>
          <div v-if="!categories.length">
            <div class="container mt-5">
              <div class="mb-4 text-center">
                <svg width="135" height="147" viewBox="0 0 135 147" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M67 132C101.493 132 129.455 104.018 129.455 69.5C129.455 34.9822 101.493 7 67 7C32.507 7 4.54492 34.9822 4.54492 69.5C4.54492 104.018 32.507 132 67 132Z" fill="#F1F5F9"/><g filter="url(#filter0_d_3142_17041)"><path d="M113.66 126.562H21.3553C18.52 126.562 16.1572 124.276 16.1572 121.36V17.64C16.1572 14.8027 18.4412 12.5171 21.3553 12.5171H113.66C116.495 12.5171 118.858 14.8027 118.858 17.7189V121.36C118.858 124.197 116.574 126.562 113.66 126.562Z" fill="url(#paint0_linear_3142_17041)"/><path d="M113.66 126.562H21.3553C18.52 126.562 16.1572 124.276 16.1572 121.36V17.64C16.1572 14.8027 18.4412 12.5171 21.3553 12.5171H113.66C116.495 12.5171 118.858 14.8027 118.858 17.7189V121.36C118.858 124.197 116.574 126.562 113.66 126.562Z" fill="white"/></g><path d="M107.91 43.8066H26.4739C25.5288 43.8066 24.7412 43.0185 24.7412 42.0727V26.625C24.7412 25.6793 25.5288 24.8911 26.4739 24.8911H107.91C108.855 24.8911 109.642 25.6793 109.642 26.625V41.9939C109.721 43.0185 108.933 43.8066 107.91 43.8066Z" fill="#E2E8F0"/><path d="M33.2475 36.7133C34.5524 36.7133 35.6102 35.6547 35.6102 34.3488C35.6102 33.043 34.5524 31.9844 33.2475 31.9844C31.9426 31.9844 30.8848 33.043 30.8848 34.3488C30.8848 35.6547 31.9426 36.7133 33.2475 36.7133Z" fill="#0F172A"/><path d="M91.3704 35.9252H43.5643C43.1705 35.9252 42.8555 35.61 42.8555 35.2159V33.4032C42.8555 33.0091 43.1705 32.6938 43.5643 32.6938H91.3704C91.7642 32.6938 92.0792 33.0091 92.0792 33.4032V35.2159C92.0792 35.61 91.7642 35.9252 91.3704 35.9252Z" fill="#0F172A"/><path d="M107.91 68.0813H26.4739C25.5288 68.0813 24.7412 67.2932 24.7412 66.3474V50.9786C24.7412 50.0328 25.5288 49.2446 26.4739 49.2446H107.91C108.855 49.2446 109.642 50.0328 109.642 50.9786V66.3474C109.721 67.2932 108.933 68.0813 107.91 68.0813Z" fill="#E2E8F0"/><path d="M33.2475 60.9882C34.5524 60.9882 35.6102 59.9296 35.6102 58.6237C35.6102 57.3179 34.5524 56.2593 33.2475 56.2593C31.9426 56.2593 30.8848 57.3179 30.8848 58.6237C30.8848 59.9296 31.9426 60.9882 33.2475 60.9882Z" fill="#0F172A"/><path d="M91.3704 60.2788H43.5643C43.1705 60.2788 42.8555 59.9635 42.8555 59.5694V57.7567C42.8555 57.3626 43.1705 57.0474 43.5643 57.0474H91.3704C91.7642 57.0474 92.0792 57.3626 92.0792 57.7567V59.5694C92.0792 59.9635 91.7642 60.2788 91.3704 60.2788Z" fill="#0F172A"/><path d="M107.91 116.71H26.4739C25.5288 116.71 24.7412 115.922 24.7412 114.976V99.6075C24.7412 98.6617 25.5288 97.8735 26.4739 97.8735H107.91C108.855 97.8735 109.642 98.6617 109.642 99.6075V114.976C109.721 115.922 108.933 116.71 107.91 116.71Z" fill="#E2E8F0"/><path d="M33.2475 109.617C34.5524 109.617 35.6102 108.558 35.6102 107.253C35.6102 105.947 34.5524 104.888 33.2475 104.888C31.9426 104.888 30.8848 105.947 30.8848 107.253C30.8848 108.558 31.9426 109.617 33.2475 109.617Z" fill="#0F172A"/><path d="M91.3704 108.829H43.5643C43.1705 108.829 42.8555 108.513 42.8555 108.119V106.307C42.8555 105.912 43.1705 105.597 43.5643 105.597H91.3704C91.7642 105.597 92.0792 105.912 92.0792 106.307V108.119C92.0792 108.513 91.7642 108.829 91.3704 108.829Z" fill="#0F172A"/><path d="M126.102 92.3562H44.6668C43.7217 92.3562 42.9341 91.5681 42.9341 90.6223V75.2535C42.9341 74.3077 43.7217 73.5195 44.6668 73.5195H126.102C127.048 73.5195 127.835 74.3077 127.835 75.2535V90.6223C127.835 91.5681 127.048 92.3562 126.102 92.3562Z" fill="#E2E8F0"/><path d="M51.4404 85.3417C52.7453 85.3417 53.8031 84.2831 53.8031 82.9772C53.8031 81.6714 52.7453 80.6128 51.4404 80.6128C50.1355 80.6128 49.0776 81.6714 49.0776 82.9772C49.0776 84.2831 50.1355 85.3417 51.4404 85.3417Z" fill="#0F172A"/><path d="M109.563 84.5537H61.7572C61.3634 84.5537 61.0483 84.2384 61.0483 83.8443V82.0316C61.0483 81.6375 61.3634 81.3223 61.7572 81.3223H109.563C109.957 81.3223 110.272 81.6375 110.272 82.0316V83.8443C110.272 84.2384 109.957 84.5537 109.563 84.5537Z" fill="#0F172A"/><defs><filter id="filter0_d_3142_17041" x="0.157227" y="0.51709" width="134.7" height="146.045" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/><feOffset dy="4"/><feGaussianBlur stdDeviation="8"/><feColorMatrix type="matrix" values="0 0 0 0 0.397708 0 0 0 0 0.47749 0 0 0 0 0.575 0 0 0 0.08 0"/><feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_3142_17041"/><feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_3142_17041" result="shape"/></filter><linearGradient id="paint0_linear_3142_17041" x1="67.474" y1="9.87913" x2="67.474" y2="127.791" gradientUnits="userSpaceOnUse"><stop stop-color="#FDFEFF"/><stop offset="0.9964" stop-color="#ECF0F5"/></linearGradient></defs></svg>
                <h2 class="font-weight-bold">No Categories Found</h2>
                <p>Oops! It looks like you haven't created any categories for your <br> products yet. Simply click the "Add Category" button below to<br> get started.</p>
                <button class="btn btn-primary" :disabled="!csvUploaderUrl" @click="openEzCsv()">
                  <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.3335 11.8333L8.00016 14.5M8.00016 14.5L10.6668 11.8333M8.00016 14.5V8.5M13.3335 11.6619C14.1478 10.9894 14.6668 9.97196 14.6668 8.83333C14.6668 6.80829 13.0252 5.16667 11.0002 5.16667C10.8545 5.16667 10.7182 5.09066 10.6442 4.96516C9.77487 3.48989 8.16978 2.5 6.3335 2.5C3.57207 2.5 1.3335 4.73858 1.3335 7.5C1.3335 8.8774 1.89046 10.1247 2.79146 11.029" stroke="#fff" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/></svg>&nbsp;
                  Import CSV
                </button>
                <button @click.prevent="showNewCategoryModal" class="btn btn-primary save-btn text-nowrap ml-2">
                  <span class="fa fa-plus mr-2"></span> Add Category
                </button>
              </div>
            </div>
          </div>
          <div class="bg-white  h-100" v-else>
            <div class="settings-header d-block">
              <div class="settings-header-info d-block">
                <div class="row">
                    <div class="col-lg-4 col-md-4 col-sm-12">
                      <h1 class="font-weight-bold">Rental Products</h1>
                    </div>
                    <div class="col-lg-3 col-md-3 col-sm-12">
                      <input type="text" class="form-control search-input" placeholder="Search Category" v-model="searchTerm">
                    </div>
                    <div class="col-lg-5 col-md-5 col-sm-12">
                      <button @click.prevent="showNewCategoryModal" class="btn btn-primary mr-1 save-btn text-nowrap ml-2 ml-md-0 mt-csm-5">
                        <span class="fa fa-plus mr-2"></span> Add Category
                      </button>
                      <button class="btn btn-outline-danger" :disabled="!csvUploaderUrl" @click="openEzCsv()">Import CSV</button>
                      <button @click="enableDisableRentals('disable')" :disabled="enablingOrDisablingRentals" class="btn btn-outline-danger save-btn text-nowrap ml-2 mt-csm-5">
                        Disable Rental
                      </button>

                      <!-- TO DO -- MOVE THIS MODAL TO REUSABLE COMPONENT -->
                      <b-modal size="lg" ref="addProductModal" @hidden="resetProductModal" title="" centered hide-footer>
                        <template v-slot:modal-header>
                          <div class="modal-header">
                            <h5 class="modal-title">
                              <b>Add Product</b>
                            </h5>
                            <button type="button" class="close" @click="hideAddProductModal">×</button>
                          </div>
                        </template>
                        <form @submit.prevent="handleFetchProductSubmit" class="p-3">
                          <div class="form-group">
                            <label for="lookupSearchTerm" class="form-label"><b>Product Name/SKU</b></label>
                            <div class="input-group mb-2">
                              <input type="text" class="form-control" v-model="lookupSearchTerm" id="lookupSearchTerm" required :disabled="productLoading">
                              <div class="input-group-append">
                                <button type="submit" class="btn btn-danger" :disabled="productLoading">Look Up <div class="spinner-border spinner-border ml-2 btn-spinner wh-10px" v-if="productLoading"/></button>
                              </div>
                            </div>
                          </div>
                        </form>
                        <div v-if="products && products.length" class="lookup-products-container m-3 border">
                          <template v-for="product in products">
                            <div class="product-section row m-3" :key="product.id">
                              <div class="col-md-9 d-flex align-items-center pl-0">
                                <img :src="product.image_url || '/images/default-img.svg'" alt="Product Image" class="img-fluid" style="width: 100px; height: auto;" @error="handleBrokenImage">
                                <div>
                                  <h4 class="mt-0 mb-1"><b>{{ product.title }}</b></h4>
                                  <p>SKU: <span class="text-muted">{{ product.sku }}</span></p>
                                </div>
                              </div>
                              <div class="col-md-3 d-flex align-items-center justify-content-center">
                                <button class="btn btn-danger" @click="removeProduct(product.id)" :disabled="addingProductToCategory" v-if="productAlreadyAdded(product.category_ids)">
                                  <svg class="mr-1 cursor-pointer" width="19" height="21" viewBox="0 0 19 21" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.667 5.5L15.8 17.642C15.7641 18.1466 15.5383 18.6188 15.1681 18.9636C14.7979 19.3083 14.3109 19.5 13.805 19.5H5.52899C5.02313 19.5 4.53606 19.3083 4.16588 18.9636C3.7957 18.6188 3.56991 18.1466 3.53399 17.642L2.66699 5.5M7.66699 9.5V15.5M11.667 9.5V15.5M12.667 5.5V2.5C12.667 2.23478 12.5616 1.98043 12.3741 1.79289C12.1866 1.60536 11.9322 1.5 11.667 1.5H7.66699C7.40178 1.5 7.14742 1.60536 6.95989 1.79289C6.77235 1.98043 6.66699 2.23478 6.66699 2.5V5.5M1.66699 5.5H17.667" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                                  Remove
                                  <div class="spinner-border spinner-border ml-2 btn-spinner wh-10px" v-if="addingProductToCategoryId == product.id"/>
                                </button>
                                <button v-else class="btn btn-outline-primary" @click="addProductToCategory(product.id)" :disabled="addingProductToCategory">Add Product <div class="spinner-border spinner-border ml-2 btn-spinner wh-10px" v-if="addingProductToCategoryId == product.id"/></button>
                              </div>
                            </div>
                          </template>
                        </div>
                        <div v-else-if="products && !products.length">
                          <div class="text-center">No products found</div>
                        </div>
                      </b-modal>
                      <b-modal size="lg" ref="deleteSubcategory" title="" @hidden="resetDeleteSubcategoryModal" centered hide-footer>
                        <template v-slot:modal-header>
                          <div class="modal-header">
                            <svg width="36" height="37" viewBox="0 0 26 27" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_2583_15920)"><path d="M23.7496 25.8166H2.25033C1.43846 25.8166 0.710671 25.3972 0.303542 24.6948C-0.0952553 24.0067 -0.101352 23.1951 0.286777 22.4678L11.0365 2.33127C11.4214 1.61019 12.1555 1.17969 13 1.17969C13.8445 1.17969 14.5785 1.61019 14.9635 2.33127L25.7132 22.4678C26.1014 23.195 26.0953 24.0067 25.6964 24.6948C25.2893 25.3972 24.5616 25.8166 23.7496 25.8166Z" fill="#FF4C04"/><path d="M13 22.5153C11.8796 22.5153 10.968 21.6038 10.968 20.4833C10.968 19.3628 11.8796 18.4512 13 18.4512C14.1205 18.4512 15.0321 19.3628 15.0321 20.4833C15.0321 21.6038 14.1205 22.5153 13 22.5153Z" fill="#FFF3F3"/><path d="M13.0001 16.4195C11.8796 16.4195 10.968 15.5079 10.968 14.3874V9.99302C10.968 8.87253 11.8796 7.96094 13 7.96094C14.1205 7.96094 15.0321 8.87253 15.0321 9.99302V14.3874C15.0321 15.5079 14.1206 16.4195 13.0001 16.4195Z" fill="#FFF3F3"/></g><defs><clipPath id="clip0_2583_15920"><rect width="26" height="26" fill="white" transform="translate(0 0.5)"/></clipPath></defs></svg>
                            <h5 class="modal-title pl-3 font-weight-bold">Manage Subcategory Products</h5>
                            <button type="button" class="close" @click="$refs.deleteSubcategory.hide()">×</button>
                          </div>
                        </template>
                        <div class="container">
                          <p>You are about to remove the subcategory “{{subCategoryToDelete.title}}” which contains (<b>{{subCategoryToDelete.product_count}}</b>) products. Please choose how you would like to proceed with these products.</p>
                          <div class="custom-radio custom-control">
                            <input id="remove_all" type="radio" class="custom-control-input" name="remove_all_products" v-model="removeOrMoveAllProducts" value="remove">
                            <label for="remove_all" class="custom-control-label">Remove All Products</label>
                          </div>
                          <div class="custom-radio custom-control mt-1">
                            <input id="move_all" type="radio" class="custom-control-input" name="remove_all_products" v-model="removeOrMoveAllProducts" value="move">
                            <label for="move_all" class="custom-control-label">Move all products to parent category</label>
                          </div>
                        </div>
                        <div class="modal-footer">
                          <button type="button" class="btn btn-outline-secondary" @click="$refs.deleteSubcategory.hide()">Cancel</button>
                          <button class="btn btn-primary" @click="deleteSubCategory()">Confirm</button>
                        </div>
                      </b-modal>
                    </div>
                </div>
              </div>
            </div>
            <div class="settings-body">
              <div class="position-relative rental-categories">
                <div v-if="categoryLoading" class="spinner-border spinner-border position-absolute mr-2" />
                <template v-if="categories && filteredCategories.length">
                  <table class="table mt-3" :class="{'disabled': categoryLoading}">
                    <thead class="border">
                      <tr>
                        <th class="border-0" width="45%">Category</th>
                        <th class="border-0" width="20%">Products</th>
                        <th class="border-0" width="20%">Subcategories</th>
                        <th class="border-0"></th>
                      </tr>
                    </thead>
                    <tbody>
                      <template v-for="category in filteredCategories">
                        <tr :class="{'cursor-pointer': true, 'category-expanded': visibleSubcategories.includes(category.id)}" :key="category.id" @click="gotToProducts({category_id: category.id, category_title: category.title})">
                          <td>
                            <svg @click.stop="toggleSubcategories(category.id)" v-if="!visibleSubcategories.includes(category.id)" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><g opacity="0.3"><path d="M5 7.5L10 12.5L15 7.5" stroke="var(--brandPrimary)" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/></g></svg>
                            <svg @click.stop="toggleSubcategories(category.id)" v-else width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 12.5L10 7.5L15 12.5" stroke="var(--brandPrimary)" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/></svg>
                            <svg @click.stop="pinUnpinCategory(category)" class="mr-2 cursor-pointer" v-if="category.is_pinned" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_1574_65388)"><path d="M7.50001 3.33398V8.33398L5.83334 11.6673V13.334H14.1667V11.6673L12.5 8.33398V3.33398" fill="var(--brandPrimary)"/><path d="M7.50001 3.33398V8.33398L5.83334 11.6673V13.334H14.1667V11.6673L12.5 8.33398V3.33398" stroke="var(--brandPrimary)" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 13.334V17.5007" stroke="var(--brandPrimary)" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/><path d="M6.66666 3.33398H13.3333" stroke="var(--brandPrimary)" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/></g><defs><clipPath id="clip0_1574_65388"><rect width="20" height="20" fill="white"/></clipPath></defs></svg>
                            <svg @click.stop="pinUnpinCategory(category)" class="mr-2 cursor-pointer" v-else width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_1952_7020)"><path d="M7.50001 3.33398V8.33398L5.83334 11.6673V13.334H14.1667V11.6673L12.5 8.33398V3.33398" stroke="var(--brandPrimary)" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 13.334V17.5007" stroke="var(--brandPrimary)" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/><path d="M6.66666 3.33398H13.3333" stroke="var(--brandPrimary)" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/></g><defs><clipPath id="clip0_1952_7020"><rect width="20" height="20" fill="white"/></clipPath></defs></svg>
                            <img class="category-image" :src="category.image_url || '/images/default-img.svg'" alt="Category Image" @error="handleBrokenImage"/>
                            <div class="name text-capitalize text-wrap d-inline-block pl-2" :data-tooltip="category.title">{{category.title}}</div>
                          </td>
                          <td>{{ category.product_count }}</td>
                          <td>{{ category.sub_categories.length }}</td>
                          <td class="text-danger">
                            <div>
                              <b-dropdown id="dropdown-1" text="+ Add"  class="m-md-2 ml-6">
                                <b-dropdown-item @click.stop="addProduct(category)" class="font-normal"><span class="fa fa-plus"></span>  Add Products</b-dropdown-item>
                                <b-dropdown-item @click.stop="showNewCategoryModal(category.id)"><span class="fa fa-plus"></span>  Add Subcategory</b-dropdown-item>
                              </b-dropdown>
                                <a href="#" @click.stop="editCategory(category)" class="small mr-3 ml-1" v-b-tooltip.hover title="Edit" aria-label="Edit">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" width="22" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                </a>
                                <a href="#" v-b-tooltip.hover title="Delete" aria-label="Delete" @click.stop="deleteCategory(category.id)">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" width="22" viewBox="0 0 24 24" stroke="#dc3545"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </a>
                            </div>
                          </td>
                        </tr>
                        <tr class="sub-category-row category-expanded cursor-pointer" v-for="subcategory in getVisibleSubcategories(category)"  :key="subcategory.id" @click="gotToProducts({category_id: subcategory.id, category_title: subcategory.title})">
                          <td class="pl-4">
                            <svg @click.stop="pinUnpinCategory(subcategory)" class="mr-2 cursor-pointer" v-if="subcategory.is_pinned" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_1574_65388)"><path d="M7.50001 3.33398V8.33398L5.83334 11.6673V13.334H14.1667V11.6673L12.5 8.33398V3.33398" fill="var(--brandPrimary)"/><path d="M7.50001 3.33398V8.33398L5.83334 11.6673V13.334H14.1667V11.6673L12.5 8.33398V3.33398" stroke="var(--brandPrimary)" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 13.334V17.5007" stroke="var(--brandPrimary)" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/><path d="M6.66666 3.33398H13.3333" stroke="var(--brandPrimary)" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/></g><defs><clipPath id="clip0_1574_65388"><rect width="20" height="20" fill="white"/></clipPath></defs></svg>
                            <svg @click.stop="pinUnpinCategory(subcategory)" class="mr-2 cursor-pointer" v-else width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_1952_7020)"><path d="M7.50001 3.33398V8.33398L5.83334 11.6673V13.334H14.1667V11.6673L12.5 8.33398V3.33398" stroke="var(--brandPrimary)" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 13.334V17.5007" stroke="var(--brandPrimary)" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/><path d="M6.66666 3.33398H13.3333" stroke="var(--brandPrimary)" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/></g><defs><clipPath id="clip0_1952_7020"><rect width="20" height="20" fill="white"/></clipPath></defs></svg>
                            <img class="category-image" :src="subcategory.image_url || '/images/default-img.svg'" alt="Category Image" @error="handleBrokenImage" />
                            <div class="name text-capitalize text-wrap d-inline-block pl-2" :data-tooltip="subcategory.title">{{subcategory.title}}</div>
                          </td>
                          <td>{{ subcategory.product_count }}</td>
                          <td></td>
                          <td class="text-danger">
                            <div>
                                <button @click.stop="addProduct(subcategory)" class="btn btn-outline-primary save-btn text-nowrap mr-3">
                                    <span class="fa fa-plus mr-2"></span> Add Products
                                </button>
                                <a href="#" @click.stop="editCategory(subcategory)" class="small mr-3" v-b-tooltip.hover title="Edit" aria-label="Edit">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" width="22" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                </a>
                                <a href="#" v-b-tooltip.hover title="Delete" aria-label="Delete" @click.stop="deleteSubCategoryModal(subcategory)">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" width="22" viewBox="0 0 24 24" stroke="#dc3545"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </a>
                            </div>
                          </td>
                        </tr>
                      </template>
                    </tbody>
                  </table>
                </template>
                <div v-else-if="!categoryLoading && (!categories || !categories.length)" class="text-center mt-4">There are no categories to show</div>
                <div v-else-if="!categoryLoading && (!filteredCategories || !filteredCategories.length)" class="text-center mt-4">There are no matching categories</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import AdminService from '@/api-services/admin.service';
  import NoPermissionTruevalue from "./../no-permission-truevalue";

  export default {
    name: 'rentalProducts',
    components: {
      NoPermissionTruevalue
    },
    data() {
      return {
        title: "",
        image: null,
        image_url: null,
        imagePreview: null,
        categoryLoading: true,
        categories: [],
        visibleSubcategories: [],
        parentCategory: null,
        searchTerm: '',
        categoryModalTitle: "Add Category",
        categoryModalSubmitButtonText: "Save",
        isEditMode: false,
        editingCategory: null,
        addProductCategory:null,
        lookupSearchTerm: null,
        productLoading: false,
        products: null,
        removeOrMoveAllProducts: "remove",
        subCategoryToDelete: {},
        addingProductToCategory: false,
        addingProductToCategoryId: null,
        defaultIcons: [],
        rentalsSettings: [],
        enablingOrDisablingRentals: false,
        csvUploaderUrl: ""
      };
    },
    computed: {
      businessDetails() {
        return Object.entries(this.$store.state.businessDetails).length ? this.$store.state.businessDetails : null;
      },
      selectedrentalsSettings() {
        return this.rentalsSettings.find(e => e.business_id == this.selectedStore) && this.rentalsSettings.find(e => e.business_id == this.selectedStore).rental || [];
      },
      stores() {
        return this.$store.state.adminWizardBusinesses.filter(e => e.name.toLowerCase());
      },
      filteredCategories() {
        if (!this.searchTerm) {
          return this.categories;
        }

        const lowerCaseSearchTerm = this.searchTerm.toLowerCase();

        return this.categories.reduce((filtered, category) => {

          const matchingSubCategories = category.sub_categories.filter(subCategory =>
            subCategory.title.toLowerCase().includes(lowerCaseSearchTerm)
          );

          const isCategoryMatch = category.title.toLowerCase().includes(lowerCaseSearchTerm);

          if (isCategoryMatch || matchingSubCategories.length > 0) {
            filtered.push({
              ...category,
              sub_categories: matchingSubCategories
            });
          }

          return filtered;
        }, []);
      }
    },
    async mounted() {
      this.selectedStore = this.$route.query.store || (this.stores.length > 0 && this.stores[0].id ? this.stores[0].id : localStorage.getItem('selectedStore'));
      this.getRentalsCsvImportUrl();
      await this.getRentalsSettings();
      this.$store.commit('setBusinessDetails', { ...this.businessDetails, rentals_enabled: this.selectedrentalsSettings.rentals_enabled });
      await this.getCategories();
      this.getRentalCategoriesDefaultIcons();
    },
    methods: {
      handleBrokenImage(event) {
        event.target.src = '/images/default-img.svg';
      },
      openEzCsv() {
         let uploaderWindow = window.open(this.csvUploaderUrl, "EZ CSV Uploader", "width=1200,height=900");

          let checkInterval = setInterval(() => {
              if (uploaderWindow.closed) {
                  clearInterval(checkInterval);
                  this.getCategories();
              }
          }, 1000);
      },
      getRentalsCsvImportUrl() {
        AdminService.getRentalsCsvImportUrl().then(resp => {
          if(resp.data.status == 'success') {
            this.csvUploaderUrl = resp.data.url;
          }
        }).catch(error => {
          this.$swal(this.getErrorMessage(error), '', 'error');
        });
      },
      getRentalCategoriesDefaultIcons() {
        AdminService.getRentalDefaultIcons().then(resp => {
          if(resp.data.status == 'success') {
            this.defaultIcons = resp.data.data;
          }
        }).catch(error => {
          this.$swal(this.getErrorMessage(error), '', 'error');
        });
      },
      async selectCategorySvgIcon(name, svgPath) {
        this.image = null;
        this.image_url = svgPath;
        this.imagePreview = svgPath;

        if (this.$refs.fileInput) {
          this.$refs.fileInput.value = '';
        }
      },
      productAlreadyAdded(categoryIds) {
        return categoryIds.includes(this.addProductCategory.id.toString());
      },
      removeProduct(productId) {
        this.$swal({
          title: "Remove Product?",
          text: `Are you sure you want to remove this product from ${this.addProductCategory.title}?`,
          type: "warning",
          confirmButtonText: 'Yes',
          cancelButtonText: 'Cancel',
          showCancelButton: true,
        }).then((result) => {
          if(result.value) {
            this.addingProductToCategory = true;
            this.addingProductToCategoryId = productId;
            AdminService.removeProductFromCategory({category_id: this.addProductCategory.id, product_id: productId, remove_all: false}).then(res => {
              if(res.data.status == 'success') {
                this.successToast("Product removed successfully");
                this.updateCategoryLocalObject(this.addProductCategory.id, { product_count: this.addProductCategory.product_count - 1 });
                this.removeCategoryFromProduct(productId);
              } else {
                this.$swal("Something went wrong", '', 'error');
              }
            }).catch(error => {
              this.$swal(this.getErrorMessage(error), '', 'error');
            }).finally(() => {
              this.addingProductToCategory = false;
              this.addingProductToCategoryId = null;
            });
          }
        });
      },
      removeCategoryFromProduct(productId) {
        const product = this.products.find(p => p.id === productId);
        if (product) {
            product.category_ids = product.category_ids.filter(categoryId => categoryId !== this.addProductCategory.id.toString());
            this.$set(this.products, this.products.indexOf(product), product);
        }
      },
      addCategoryToProduct(productId) {
        const product = this.products.find(p => p.id === productId);
        if (product) {
            product.category_ids.push(this.addProductCategory.id.toString());
            this.$set(this.products, this.products.indexOf(product), product);
        }
      },
      gotToProducts(params) {
        this.categoryLoading = true;
        this.$router.push({name: `rental-products-list`, params:params }).catch(err => console.log(err));
      },
      addProductToCategory(productId) {
        const category = this.addProductCategory;

        let formData = new FormData();
        formData.append("product_id", productId);
        formData.append("category_id", category.id);

        // this.hideAddProductModal();
        this.addingProductToCategory = true;
        this.addingProductToCategoryId = productId;

        AdminService.addProductToCategory(formData).then(resp => {
          if(resp.data.status == 'success') {
            this.updateCategoryLocalObject(category.id, { product_count: category.product_count + 1 });
            this.addCategoryToProduct(productId);
            this.successToast("Product added successfully");
          } else {
            this.$swal("Something went wrong", '', 'error');
          }
        }).catch(error => {
          this.$swal(this.getErrorMessage(error), '', 'error');
        }).finally(() => {
          this.addingProductToCategory = false;
          this.addingProductToCategoryId = null;
        });
      },
      pinUnpinCategory(category) {

        let isPinned = category.is_pinned;
        this.updateCategoryLocalObject(category.id, { is_pinned: !isPinned });

        let formData = new FormData();
        formData.append("id", category.id);
        formData.append("is_pinned", !isPinned ? 1 : 0);
        formData.append("title", category.title);
        formData.append("image_url", category.image_url);
        formData.append("is_hidden", category.is_hidden);

        this.categoryLoading = true;

        AdminService.updateRentalCategory(formData).then(resp => {

          if(resp.data.status == 'success') {
            this.successToast("Category updated successfully");
          } else {
            this.updateCategoryLocalObject(category.id, { is_pinned: isPinned });
            this.$swal("Something went wrong", '', 'error');
          }
        }).catch(error => {
            this.updateCategoryLocalObject(category.id, { is_pinned: isPinned });
            this.$swal(this.getErrorMessage(error), '', 'error');
        }).finally(() => {
          this.categoryLoading = false;
        });
      },
      updateCategoryLocalObject(id, values_obj) {
        for (let i = 0; i < this.categories.length; i++) {
          if (this.categories[i].id === id) {
            Object.keys(values_obj).forEach(key => {
              this.$set(this.categories[i], key, values_obj[key]);
            });
            return;
          }
          if (this.categories[i].sub_categories && this.categories[i].sub_categories.length) {
            for (let j = 0; j < this.categories[i].sub_categories.length; j++) {
              if (this.categories[i].sub_categories[j].id === id) {
                Object.keys(values_obj).forEach(key => {
                  this.$set(this.categories[i].sub_categories[j], key, values_obj[key]);
                });
                return;
              }
            }
          }
        }
      },
      getVisibleSubcategories(category) {
        if (this.visibleSubcategories.includes(category.id)) {
          return category.sub_categories;
        }
        return [];
      },
      toggleSubcategories(categoryId) {
        const index = this.visibleSubcategories.indexOf(categoryId);
        if (index > -1) {
          this.visibleSubcategories.splice(index, 1);
        } else {
          this.visibleSubcategories.push(categoryId);
        }
      },
      handleImageUpload(event) {
        const files = event.target.files || event.dataTransfer.files;
        if (files.length) {
          this.image = files[0];
          this.image_url = null;
          this.imagePreview = URL.createObjectURL(this.image);
        }
      },
      async editCategory(category) {
        this.title = category.title;
        this.imagePreview = category.image_url;
        this.editingCategory = category;
        this.isEditMode = true;
        this.showNewCategoryModal();
      },
      handleDrop(event) {
        this.handleImageUpload(event);
      },
      triggerFileInput() {
        this.$refs.newCategoryImage.click();
      },
      async handleCategorySubmit() {
        const formData = new FormData();
        formData.append("title", this.title);
        if (this.image) {
          formData.append("image", this.image);
        }
        formData.append("parent_id", this.parentCategory ? this.parentCategory : null);
        formData.append("image_url", this.image_url);

        this.categoryLoading = true;
        this.hideNewCategoryModal();

        try {
          if (this.isEditMode) {
            // Update category
            formData.append("id", this.editingCategory.id);
            if(!this.image_url) {
              formData.set("image_url", this.editingCategory.image_url);
            }
            formData.append("is_pinned", this.editingCategory.is_pinned ? 1 : 0);
            formData.append("is_hidden", this.editingCategory.is_hidden ? 1 : 0);
            const response = await AdminService.updateRentalCategory(formData);

            if(response && response.data.status == 'success') {
              this.updateCategoryLocalObject(response.data.data.id, {title: response.data.data.title, image_url: response.data.data.image_url});
              this.successToast("Category updated successfully");
            } else {
              this.$swal("Something went wrong", '', 'error');
            }
          } else {
            // Add category
            const response = await AdminService.saveRentalCategory(formData);

            if(response && response.data.status == 'success') {
              this.addCategoryLocalObject(response.data.data);
              this.successToast("Category added successfully");
            } else {
              this.$swal("Something went wrong", '', 'error');
            }
          }
        } catch (error) {
          this.$swal(this.getErrorMessage(error), '', 'error');
        } finally {
          this.categoryLoading = false;
        }
      },
      getCategories() {
        this.categoryLoading = true;
        AdminService.getRentalCategories({}).then(resp => {
          if(resp.data.status == 'success') {
            this.categories = resp.data.data;
          } else {
            this.$swal("Something went wrong", '', 'error');
          }
          this.categoryLoading = false;
        }).catch(error => {
          this.categoryLoading = false;
          this.$swal(this.getErrorMessage(error), '', 'error');
        });
      },
      deleteSubCategoryModal(subcategory) {
        this.subCategoryToDelete = subcategory;
        this.$refs.deleteSubcategory.show();
      },
      deleteSubCategory() {
        let subcatId = this.subCategoryToDelete.id;
        let removeOrMove = this.removeOrMoveAllProducts;
        this.$refs.deleteSubcategory.hide();
        this.categoryLoading = true;
        AdminService.deleteRentalCategory(subcatId, removeOrMove).then(resp => {
          if(resp.data.status == 'success') {
            this.successToast("SubCategory deleted successfully");
            if(removeOrMove == "move") {
              this.getCategories();
              return;
            }
            this.removeCategoryLocalObject(subcatId);
          } else {
            this.$swal("Something went wrong", '', 'error');
          }
          this.categoryLoading = false;
        }).catch(error => {
          this.categoryLoading = false;
          this.$swal(this.getErrorMessage(error), '', 'error');
        });
      },
      async deleteCategory(id) {
        try {
            const result = await this.$swal({
                title: "Delete Category?",
                text: `Are you sure you want to delete this category?`,
                type: 'warning',
                confirmButtonText: 'Yes',
                cancelButtonText: 'Cancel',
                showCancelButton: true,
            });

            if (result.value) {
              this.categoryLoading = true;
              const resp = await AdminService.deleteRentalCategory(id);
              if (resp.data.status == 'success') {
                  this.categoryLoading = false;
                  this.successToast("Category deleted successfully");
                  this.removeCategoryLocalObject(id);
              } else {
                  this.categoryLoading = false;
                  this.$swal("Something went wrong", '', 'error');
              }
            }
        } catch (error) {
            this.$swal(this.getErrorMessage(error), '', 'error');
        }
      },
      removeCategoryLocalObject(id) {
        for (let i = 0; i < this.categories.length; i++) {
          if (this.categories[i].id === id) {
            this.categories.splice(i, 1);
            return;
          }
          if (this.categories[i].sub_categories && this.categories[i].sub_categories.length) {
            for (let j = 0; j < this.categories[i].sub_categories.length; j++) {
              if (this.categories[i].sub_categories[j].id === id) {
                this.categories[i].sub_categories.splice(j, 1);
                return;
              }
            }
          }
        }
      },
      addCategoryLocalObject(category) {
        if(!category.parent_id) {
          this.categories.push(category);
          return;
        }

        for (let i = 0; i < this.categories.length; i++) {
          if (this.categories[i].id === category.parent_id) {
            this.categories[i].sub_categories.push(category);
            return;
          }
        }
      },
      addProduct(categoryId) {
        this.addProductCategory = categoryId;
        this.$refs.addProductModal.show();
      },
      handleFetchProductSubmit() {
        if(this.lookupSearchTerm.length <4) {
          this.$swal("Please enter at least 4 characters", '', 'error');
          return;
        }
        this.productLoading = true;
        AdminService.rentalProductsLookup(this.lookupSearchTerm).then(result => {
          this.productLoading = false;
          if(result.data.status === 'error') {
            this.$swal(result.data.message, '', 'error');
         } else {
            this.products = result.data.data;
          }
        }, error => {
          console.log('error', error);
        }).catch(error => {
          this.$swal(this.getErrorMessage(error), '', 'error');
        });
      },
      resetProductModal() {
        this.lookupSearchTerm = null;
        this.addProductCategory = null;
        this.products = null;
      },
      hideAddProductModal() {
        this.$refs.addProductModal.hide();
      },
      resetModal() {
        this.title = "";
        this.image = "";
        this.image_url = null;
        this.imagePreview = "";
        this.parentCategory = null;
        this.isEditMode = false;
        this.editingCategory = null;
      },
      showNewCategoryModal(categoryId=null) {
        this.parentCategory = categoryId;
        if (this.isEditMode) {
          this.categoryModalTitle = "Edit Category";
          this.categoryModalSubmitButtonText = "Update";
        } else {
          this.categoryModalTitle = "Add Category";
          this.categoryModalSubmitButtonText = "Save";
        }
        this.$refs.newCategoryModal.show();
      },
      hideNewCategoryModal() {
        this.$refs.newCategoryModal.hide();
      },
      resetDeleteSubcategoryModal() {
        this.removeOrMoveAllProducts = "remove";
        this.subCategoryToDelete = {};
      },
      successToast(toastMessage) {
        this.$swal({
          toast: true,
          position: 'top',
          type: "success",
          html: `<div class="ml-2">${toastMessage}</div>`,
          showConfirmButton: false,
          timer: 3000
        });
      },
      getErrorMessage(error) {
        let errorMessage = "Something went wrong";

        if (error.response && error.response.data && error.response.data.errors) {

          let firstErrorKey = Object.keys(error.response.data.errors)[0];
          errorMessage = error.response.data.errors[firstErrorKey][0];
        }

        return errorMessage;
      },
      async getRentalsSettings(){
        await AdminService.getRentalsModuleSettings().then(e => {
          this.rentalsSettings = [...e.data.data].map(e => {
            e.rental.rentals_enabled = Number(e.rental.rentals_enabled);
            return e;
          });
        });
      },
      async enableDisableRentals(type) {
        this.enablingOrDisablingRentals = true;
        await AdminService.enableDisableRentals({
          applyToAll: true, // applying to all for rentals right now
          settings: this.rentalsSettings.map(e => ({
            business_id: e.business_id,
            enabled: Number(!Number(e.rental.rentals_enabled))
          }))
        }).then(async () => {
          if(type == 'enable') {
            await this.getCategories();
          }
          await this.getRentalsSettings();
          this.$store.commit('setBusinessDetails', { ...this.businessDetails, rentals_enabled: this.selectedrentalsSettings.rentals_enabled });
          const message = type == 'enable' ? 'Rentals enabled successfully' : 'Rentals disabled successfully';
          this.$swal({
            toast: true,
            position: 'top',
            type: 'success',
            html: `<div class="ml-2">${message}</div>`,
            showConfirmButton: false,
            timer: 3000
          });
          this.enablingOrDisablingRentals = false;
        });
      },
      rentalDisabled() {
        const businessDetails = this.businessDetails;

        if (!businessDetails) {
          return true;
        }

        const isRentalsEnabled = businessDetails.rentals_enabled;

        if(isRentalsEnabled) {
          return false;
        }

        return true;
      },
      isBusinessE2() {
        const businessType = this.businessDetails.company.includes("truevalue") ? this.businessDetails.truevalue_ecommerce_plan:this.businessDetails.other_ecommerce_plan ;
        return businessType == 'LEB';
      }
    },
    watch: {

    }
  };
</script>
<style lang="scss" scoped>
  .search-input {
    background-image: url(data:image/svg+xml;base64,Cjxzdmcgd2lkdGg9IjE0cHgiIGhlaWdodD0iMTRweCIgdmlld0JveD0iMCAwIDE0IDE0IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogICAgPGcgaWQ9IlN5bWJvbHMiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIG9wYWNpdHk9IjAuNSI+CiAgICAgICAgPGcgaWQ9IlNlYXJjaC1iYXIiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC01MzYuMDAwMDAwLCAtMTMuMDAwMDAwKSIgZmlsbD0iIzJGMzU0MCIgZmlsbC1ydWxlPSJub256ZXJvIj4KICAgICAgICAgICAgPGcgaWQ9IlNlYXJjaC1CYXIiPgogICAgICAgICAgICAgICAgPHBhdGggZD0iTTU0OC41MDgxMTQsMjYuNzQwNTQ4MSBDNTQ4Ljg0OTc5MSwyNy4wODY0ODQgNTQ5LjQwMjA2NiwyNy4wODY0ODQgNTQ5Ljc0Mzc0MywyNi43NDA1NDgxIEM1NTAuMDg1NDE5LDI2LjM5NDYxMjMgNTUwLjA4NTQxOSwyNS44MzQ5ODQ2IDU0OS43NDM3NDMsMjUuNDg5MDQ4NyBMNTQ3LjA0NzQ3NSwyMi43OTQzMTI3IEM1NDcuODEwMDMzLDIxLjc3MjI4MTEgNTQ4LjI2MTQ3MiwyMC41MDQ0NzE5IDU0OC4yNjE0NzIsMTkuMTMxMjE1MyBDNTQ4LjI2MTQ3MiwxNS43NDUwMzg2IDU0NS41MTY2NDgsMTMgNTQyLjEzMDczNiwxMyBDNTM4Ljc0NDgyNCwxMyA1MzYsMTUuNzQ1MDM4NiA1MzYsMTkuMTMxMjE1MyBDNTM2LDIyLjUxNzM5MiA1MzguNzQ0ODI0LDI1LjI2MjQzMDYgNTQyLjEzMDczNiwyNS4yNjI0MzA2IEM1NDMuNTA5MDUyLDI1LjI2MjQzMDYgNTQ0Ljc4MTEzMywyNC44MDc1NTMxIDU0NS44MDUwNzIsMjQuMDM5NzE4MiBMNTQ4LjUwODExNCwyNi43NDA1NDgxIFogTTUzNy43NTE2MzksMTkuMTMxMjE1MyBDNTM3Ljc1MTYzOSwxNi43MTI1MTc3IDUzOS43MTIyMjcsMTQuNzUxNzc1OCA1NDIuMTMwNzM2LDE0Ljc1MTc3NTggQzU0NC41NDkyNDQsMTQuNzUxNzc1OCA1NDYuNTA5ODMzLDE2LjcxMjUxNzcgNTQ2LjUwOTgzMywxOS4xMzEyMTUzIEM1NDYuNTA5ODMzLDIxLjU0OTkxMyA1NDQuNTQ5MjQ0LDIzLjUxMDY1NDggNTQyLjEzMDczNiwyMy41MTA2NTQ4IEM1MzkuNzEyMjI3LDIzLjUxMDY1NDggNTM3Ljc1MTYzOSwyMS41NDk5MTMgNTM3Ljc1MTYzOSwxOS4xMzEyMTUzIFoiIGlkPSJMb3VwZS1JY29uIj48L3BhdGg+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPgo=);
    background-repeat: no-repeat;
    background-position: left 10px center;
    font-size: 14px;
    padding-right: 32px !important;
    text-overflow: ellipsis;
    text-indent: 16px;
  }
  .category-image {
    max-width: 55px;
    max-height: 55px;
    border: 1px solid #e2e8f0;
    border-radius: 4px;
    padding: 1px;
  }
  .new-category-img-wrapper {
    text-align: center;
    max-width: 150px;
    border:2px dashed var(--primary);
    border-radius: 4px;
    padding:6px
  }

  .custom-file-container {
    border: 2px dashed #ccc;
    border-radius: 4px;
    padding: 20px;
    text-align: center;
  }

  .custom-file-container__image-preview {
    width: 100%;
    height: 200px;
    background-size: cover;
    background-position: center;
    border-radius: 4px;
  }

  .custom-file-container__custom-file {
    margin-top: 10px;
  }

  .custom-file-container__custom-file__custom-file-input {
    visibility: hidden;
    width: 0;
  }

  .custom-file-container__custom-file__custom-file-control::after {
    content: 'Upload a file or drag and drop';
    padding: 10px;
    display: inline-block;
    background: #f8f9fa;
    border-radius: 4px;
  }
  .dropzone {
    border: 2px dashed #ccc !important;
    border-radius: 4px;
    padding: 20px;
    text-align: center;
    transition: border-color 0.3s;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
  }

  .image-preview {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-size: cover;
    background-position: center;
    border-radius: 4px;
  }

  .dropzone p {
    margin: 0;
    font-size: 0.875rem;
  }
  .modal-dialog .modal-header {
      padding: 1rem 1.5rem !important;
      color: #334155;
      border: none;
      background: transparent !important;
  }
  .modal-dialog .modal-header h5 {
      font-size: 28px;
      color: #000;
  }
  .modal-header .close {
      font-size: 1.5rem;
      font-weight: 500;
      line-height: 1;
      color: #161e2e;
      opacity: .5;
      position: absolute;
      right: 42px;
      font-size: 30px;
  }
  .modal-footer {
    border:none !important;
  }
  .sub-category-row {
    background: var(--background);
  }
  .category-expanded {
    border-left: 1px solid var(--primary);
  }
  .rental-categories {
    .spinner-border {
      top: 30px;
      left: 50%;
      transform: transitionX(-50%);
      z-index: 1;
    }
    td {
      vertical-align: middle;
      padding: .5rem;
    }
  }
  .ml-6{
    margin-left: 3.4rem !important;
  }
  .mt-6{
    margin-top: 1.8rem;
  }
  .btn-spinner {
    width: 20px;
    height: 20px;
  }
  .product-section {
  border: 1px solid #dee2e6;
  padding: 16px;
  border-radius: 4px;
}

.product-section img {
  padding: 4px;
  background: #fff;
  widows: 120px;
}

.product-details {
  flex-grow: 1;
}
.add-product-btn {
  float: right;
  margin-top: -55px;
}
input.custom-control-input:checked ~ .custom-control-label {
    color: var(--text) !important;
}
.lookup-products-container{
  max-height: 500px;
  overflow-y: auto;
}
.wh-10px {
  width: 10px;
  height: 10px;
}
.category-svg-active {
  background: var(--primary);
}
.category-svg-active img {
  filter: invert(1);
}
.custom-container{
  max-width:822px !important
}
#warning-icon{
  margin-top: -4px;
}
@media (max-width: 770px) {
  .mt-csm-5 {
    margin-top: 0.5rem !important;
  }
}
.top-spinner {
  z-index: 1;
  margin-top: -15px;
}
</style>
