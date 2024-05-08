<template>
  <div class="cart">
    <div class="card p-3 p-md-4 mb-3" v-if="!hideTabs">
      <h6 class="text-uppercase font-weight-bold pb-2 pb-md-3 pt-0 border-bottom mb-2 mb-md-3">Choose how to get it</h6>
      <div class="d-flex justify-content-start tab-container-mobile" :class="{'disabled': isSubmitting}">
        <div class="tab-radio custom-control custom-radio" v-if="enabledTabs.pickup">
          <input name="tabInput" v-model="activeTab" type="radio" :value="0" class="custom-control-input" id="tab0">
          <label class="custom-control-label d-flex align-items-center w-100" for="tab0">
            <span class="mr-1 d-none d-md-inline">{{ $store.state.settings.text.inStore || 'In-Store' }}</span>Pickup
            <svg width="28" viewBox="0 0 50 50" class="ml-2" xmlns="http://www.w3.org/2000/svg"><g fill="currentColor" fill-rule="evenodd"><path d="M49.025 49.18H.778A.773.773 0 010 48.412c0-.424.348-.769.778-.769h48.247c.43 0 .778.345.778.769a.773.773 0 01-.778.768z"/><path d="M3.89 49.18a.773.773 0 01-.777-.768v-29.2c0-.425.348-.77.778-.77.43 0 .778.345.778.77v29.2a.773.773 0 01-.778.768zM45.912 49.18a.773.773 0 01-.778-.768v-29.2c0-.425.348-.77.778-.77.43 0 .778.345.778.77v29.2a.773.773 0 01-.778.768zM48.247 15.37a.778.778 0 01-.739-.526L43.017 1.537H6.787L2.294 14.844a.78.78 0 01-.985.485.766.766 0 01-.492-.972L5.488.525A.777.777 0 016.224 0h37.353c.335 0 .632.212.738.525l4.669 13.832a.766.766 0 01-.492.972.784.784 0 01-.246.04z"/><path d="M15.563 10.758h-1.556a.773.773 0 01-.778-.768c0-.425.348-.769.778-.769h1.556a.774.774 0 00.779-.768.774.774 0 00-.779-.769c-1.287 0-2.334-1.034-2.334-2.305 0-1.271 1.047-2.305 2.334-2.305h1.557c.43 0 .778.344.778.768a.773.773 0 01-.778.769h-1.557a.774.774 0 00-.778.768c0 .424.35.769.778.769 1.288 0 2.335 1.034 2.335 2.305 0 1.271-1.047 2.305-2.335 2.305zM20.232 10.758a.773.773 0 01-.778-.768V3.842c0-.424.349-.768.778-.768.43 0 .779.344.779.768V9.99a.773.773 0 01-.779.768z"/><path d="M23.345 7.684h-3.113a.773.773 0 01-.778-.768c0-.424.349-.768.778-.768h3.113c.43 0 .778.344.778.768a.773.773 0 01-.778.768z"/><path d="M23.345 10.758a.773.773 0 01-.778-.768V3.842c0-.424.348-.768.778-.768.43 0 .778.344.778.768V9.99a.773.773 0 01-.778.768zM28.014 10.758c-1.287 0-2.334-1.034-2.334-2.305V5.379c0-1.271 1.047-2.305 2.334-2.305 1.287 0 2.335 1.034 2.335 2.305v3.074c0 1.271-1.048 2.305-2.335 2.305zm0-6.147a.774.774 0 00-.778.768v3.074c0 .423.35.768.778.768a.774.774 0 00.778-.768V5.379a.774.774 0 00-.778-.768zM32.683 10.758a.773.773 0 01-.778-.768V3.842c0-.424.348-.768.778-.768h1.556c1.288 0 2.335 1.034 2.335 2.305 0 1.271-1.047 2.305-2.335 2.305h-.778V9.99a.773.773 0 01-.778.768zm.778-4.61h.778a.774.774 0 00.779-.769.774.774 0 00-.779-.768h-.778v1.537zM3.89 19.98c-1.715 0-3.112-1.38-3.112-3.074V14.6c0-.424.349-.768.778-.768.43 0 .779.344.779.768v2.306c0 .847.698 1.537 1.556 1.537.858 0 1.556-.69 1.556-1.537v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 1.695-1.397 3.074-3.113 3.074z"/><path d="M8.56 19.98c-1.716 0-3.113-1.38-3.113-3.074v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 .847.698 1.537 1.556 1.537.858 0 1.556-.69 1.556-1.537v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 1.695-1.397 3.074-3.113 3.074z"/><path d="M13.229 19.98c-1.716 0-3.113-1.38-3.113-3.074v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 .847.698 1.537 1.556 1.537.858 0 1.556-.69 1.556-1.537v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 1.695-1.397 3.074-3.113 3.074z"/><path d="M17.898 19.98c-1.716 0-3.113-1.38-3.113-3.074v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 .847.698 1.537 1.556 1.537.858 0 1.556-.69 1.556-1.537v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 1.695-1.397 3.074-3.113 3.074z"/><path d="M22.567 19.98c-1.716 0-3.113-1.38-3.113-3.074v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 .847.698 1.537 1.556 1.537.858 0 1.556-.69 1.556-1.537v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 1.695-1.397 3.074-3.113 3.074z"/><path d="M27.236 19.98c-1.716 0-3.113-1.38-3.113-3.074v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 .847.698 1.537 1.556 1.537.858 0 1.556-.69 1.556-1.537v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 1.695-1.397 3.074-3.113 3.074z"/><path d="M31.905 19.98c-1.716 0-3.113-1.38-3.113-3.074v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 .847.698 1.537 1.556 1.537.858 0 1.556-.69 1.556-1.537v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 1.695-1.397 3.074-3.113 3.074z"/><path d="M36.574 19.98c-1.716 0-3.113-1.38-3.113-3.074v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 .847.698 1.537 1.556 1.537.858 0 1.556-.69 1.556-1.537v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 1.695-1.397 3.074-3.113 3.074z"/><path d="M41.243 19.98c-1.716 0-3.113-1.38-3.113-3.074v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 .847.698 1.537 1.556 1.537.858 0 1.556-.69 1.556-1.537v-.769c0-.424.349-.768.779-.768.43 0 .778.344.778.768v.769c0 1.695-1.397 3.074-3.113 3.074z"/><path d="M45.912 19.98c-1.716 0-3.113-1.38-3.113-3.074v-.769c0-.424.349-.768.779-.768.43 0 .778.344.778.768v.769c0 .847.698 1.537 1.556 1.537.858 0 1.556-.69 1.556-1.537V14.6c0-.424.349-.768.779-.768.43 0 .778.344.778.768v2.306c0 1.695-1.397 3.074-3.113 3.074zM47.725 13.832H2.078a.773.773 0 01-.779-.768c0-.425.349-.769.779-.769h45.647c.43 0 .778.344.778.769a.773.773 0 01-.778.768zM41.243 49.18H30.349a.773.773 0 01-.779-.768V29.969c0-.424.349-.768.779-.768h10.894c.43 0 .778.344.778.768v18.443a.773.773 0 01-.778.768zm-10.116-1.537h9.338V30.738h-9.338v16.905zM27.236 41.496H8.56a.773.773 0 01-.778-.769V29.97c0-.424.348-.768.778-.768h18.676c.43 0 .778.344.778.768v10.758a.773.773 0 01-.778.769zM9.338 39.959h17.12v-9.221H9.338v9.221z"/><g><path d="M11.673 35.348a.78.78 0 01-.55-.225.761.761 0 010-1.086l1.556-1.537c.304-.3.796-.3 1.1 0 .304.3.304.786 0 1.086l-1.556 1.537a.78.78 0 01-.55.225z"/></g><g><path d="M13.229 37.654a.78.78 0 01-.55-.225.761.761 0 010-1.087l3.112-3.074c.304-.3.797-.3 1.1 0 .305.3.305.787 0 1.087l-3.112 3.074a.78.78 0 01-.55.225z"/></g><g><path d="M38.13 41.496a.824.824 0 01-.552-.223.802.802 0 01-.226-.546c0-.2.086-.4.226-.545.295-.285.817-.285 1.105 0 .14.146.225.345.225.545 0 .2-.085.4-.225.546a.825.825 0 01-.553.223z"/></g><g><path d="M38.908 7.684a.824.824 0 01-.552-.222.802.802 0 01-.226-.546c0-.208.086-.4.226-.546.296-.284.817-.284 1.105 0 .14.146.226.346.226.546 0 .2-.086.4-.226.546a.825.825 0 01-.553.222z"/></g><g><path d="M10.894 7.684a.788.788 0 01-.552-.222.802.802 0 01-.226-.546c0-.2.086-.4.226-.546.288-.284.817-.284 1.105 0a.79.79 0 01.226.546c0 .2-.086.4-.226.546a.825.825 0 01-.553.222z"/></g></g></svg>
          </label>
        </div>
        <div class="tab-radio custom-control custom-radio" v-if="enabledTabs.delivery">
          <input name="tabInput" v-model="activeTab" type="radio" :value="1" class="custom-control-input" id="tab1">
          <label class="custom-control-label d-flex align-items-center w-100" for="tab1">
            <span class="mr-1 d-none d-md-inline">Local</span> Delivery
            <svg width="48" viewBox="0 0 88 48" class="ml-2" xmlns="http://www.w3.org/2000/svg"><g fill="currentColor" fill-rule="evenodd"><path d="M13.438 25.943H1.225c-.6 0-1.085.48-1.085 1.076a1.08 1.08 0 001.085 1.076h12.213c.6 0 1.085-.481 1.085-1.076a1.08 1.08 0 00-1.085-1.076zM12.088 34.22h-1.257c-.6 0-1.085.48-1.085 1.076a1.08 1.08 0 001.085 1.076h1.257c.6 0 1.086-.481 1.086-1.076a1.08 1.08 0 00-1.086-1.076z"/><path d="M87.284 27.736L76.713 16.249H64.126V8.766H37.129a13.106 13.106 0 00-11.95-7.703c-7.218 0-13.092 5.822-13.092 12.979 0 6.66 5.09 12.158 11.614 12.89v7.289h-8.147c-.6 0-1.086.48-1.086 1.076a1.08 1.08 0 001.086 1.076H23.7v6.007h5.076a5.334 5.334 0 005.28 4.56 5.335 5.335 0 005.281-4.56h30.347a5.334 5.334 0 005.281 4.56 5.334 5.334 0 005.28-4.56h7.036V27.736h.002zM14.258 14.04c0-5.97 4.9-10.827 10.921-10.827 6.022 0 10.921 4.857 10.921 10.827s-4.9 10.826-10.92 10.826c-6.022 0-10.922-4.858-10.922-10.826zm19.799 30.745c-1.756 0-3.186-1.416-3.186-3.16 0-1.74 1.428-3.158 3.186-3.158 1.757 0 3.187 1.417 3.187 3.158 0 1.744-1.428 3.16-3.187 3.16zm27.898-4.559H39.203a5.34 5.34 0 00-10.288 0h-3.042V26.984c6.895-.361 12.398-6.02 12.398-12.944 0-1.079-.149-2.12-.398-3.122h24.083V40.227h-.001zm13.012 4.559c-1.757 0-3.187-1.416-3.187-3.16 0-1.74 1.429-3.158 3.187-3.158 1.757 0 3.187 1.417 3.187 3.158 0 1.744-1.43 3.16-3.187 3.16zm10.146-4.559h-5.002a5.34 5.34 0 00-10.288 0h-5.697V18.401h11.628l9.36 10.169v11.657h0z" fill-rule="nonzero"/><path d="M3.455 17.95h6.248c.6 0 1.086-.481 1.086-1.076a1.08 1.08 0 00-1.086-1.076H3.455c-.6 0-1.086.481-1.086 1.076a1.08 1.08 0 001.086 1.077z"/><path d="M24.977 15.596c.06.04.111.09.176.117.13.055.274.085.424.085h6.248c.6 0 1.086-.482 1.086-1.076a1.08 1.08 0 00-1.086-1.076h-5.163V5.43a1.08 1.08 0 00-1.085-1.076c-.6 0-1.086.481-1.086 1.076v9.292c0 .149.03.29.086.42.027.065.078.115.118.174.038.056.066.12.113.167.047.047.113.075.17.113z" /></g></svg>
          </label>
        </div>
        <div class="tab-radio custom-control custom-radio" v-if="enabledTabs.shipping">
          <input name="tabInput" v-model="activeTab" type="radio" :value="2" class="custom-control-input" id="tab2">
          <label class="custom-control-label d-flex align-items-center w-100" for="tab2">
            Shipping
            <svg width="28" viewBox="0 0 57 48" class="ml-2" xmlns="http://www.w3.org/2000/svg"><g fill="currentColor" fill-rule="evenodd"><path d="M55.165 12.24H.875A.875.875 0 010 11.366V.874C0 .391.392 0 .876 0h54.289c.484 0 .876.391.876.874v10.492a.875.875 0 01-.876.874zM1.75 10.492H54.29V1.749H1.751v8.743z"/><path d="M50.787 47.213H5.254a.875.875 0 01-.876-.874V11.366c0-.483.392-.874.876-.874h45.533c.484 0 .875.391.875.874V46.34a.875.875 0 01-.875.874zM6.129 45.464h43.782V12.24H6.13v33.224z"/><path d="M34.15 24.48a.875.875 0 01-.57-.21l-5.56-4.758-5.56 4.758a.876.876 0 01-1.445-.663v-12.24a.875.875 0 011.751 0v10.339l4.685-4.01a.875.875 0 011.139 0l4.684 4.01v-10.34a.875.875 0 011.751 0v12.24a.875.875 0 01-.875.875zM45.533 41.967a.922.922 0 01-.622-.253.9.9 0 01-.254-.621c0-.228.096-.455.254-.62.333-.324.92-.324 1.244 0a.882.882 0 010 1.241.924.924 0 01-.622.253zM42.03 41.967a.922.922 0 01-.621-.253.9.9 0 01-.254-.621c0-.228.096-.455.254-.62.324-.324.919-.324 1.243 0a.92.92 0 01.254.62.903.903 0 01-.254.62.924.924 0 01-.622.254zM38.528 41.967a.904.904 0 01-.622-.253.916.916 0 01-.254-.621c0-.228.096-.455.254-.62.324-.324.91-.324 1.244 0a.92.92 0 01.254.62.92.92 0 01-.254.62.924.924 0 01-.622.254zM35.025 41.967a.922.922 0 01-.621-.253.916.916 0 01-.254-.621c0-.228.095-.455.254-.62.332-.324.919-.324 1.243 0a.92.92 0 01.254.62.92.92 0 01-.254.62.908.908 0 01-.622.254zM31.523 41.967a.922.922 0 01-.622-.253.916.916 0 01-.254-.621c0-.228.096-.455.254-.62.324-.324.92-.324 1.243 0a.92.92 0 01.254.62.92.92 0 01-.254.62.908.908 0 01-.621.254zM28.02 41.967a.922.922 0 01-.621-.253.916.916 0 01-.254-.621c0-.228.095-.455.254-.62a.918.918 0 011.243 0 .92.92 0 01.254.62.92.92 0 01-.254.62.924.924 0 01-.622.254zM24.518 41.967a.922.922 0 01-.622-.253.916.916 0 01-.254-.621c0-.228.096-.455.254-.62.324-.324.92-.324 1.243 0a.92.92 0 01.254.62.92.92 0 01-.254.62.924.924 0 01-.621.254zM21.015 41.967a.922.922 0 01-.621-.253.9.9 0 01-.254-.621.9.9 0 01.254-.62c.324-.324.91-.324 1.243 0a.92.92 0 01.254.62.92.92 0 01-.254.62.924.924 0 01-.622.254zM17.513 41.967a.922.922 0 01-.622-.253.916.916 0 01-.254-.621c0-.228.096-.455.254-.62.324-.324.91-.324 1.243 0a.92.92 0 01.254.62.92.92 0 01-.254.62.924.924 0 01-.621.254zM14.01 41.967a.922.922 0 01-.622-.253.916.916 0 01-.253-.621c0-.228.095-.455.253-.62a.918.918 0 011.244 0 .92.92 0 01.254.62.92.92 0 01-.254.62.924.924 0 01-.622.254zM10.508 41.967a.922.922 0 01-.622-.253.878.878 0 01-.254-.621c0-.228.087-.455.254-.62.333-.324.92-.324 1.243 0a.92.92 0 01.254.62.92.92 0 01-.254.62.924.924 0 01-.621.254zM42.03 38.47a.922.922 0 01-.621-.254.916.916 0 01-.254-.62.9.9 0 01.254-.621c.324-.324.919-.324 1.243 0a.903.903 0 01.254.62.92.92 0 01-.254.621.908.908 0 01-.622.254zM38.528 38.47a.922.922 0 01-.622-.254.916.916 0 01-.254-.62c0-.228.096-.455.254-.621.324-.324.91-.324 1.244 0a.92.92 0 01.254.62.92.92 0 01-.254.621.924.924 0 01-.622.254zM35.025 38.47a.922.922 0 01-.621-.254.916.916 0 01-.254-.62c0-.228.095-.455.254-.621.324-.324.919-.324 1.243 0a.92.92 0 01.254.62.92.92 0 01-.254.621.908.908 0 01-.622.254zM31.523 38.47a.922.922 0 01-.622-.254.916.916 0 01-.254-.62c0-.228.096-.455.254-.621.324-.324.92-.324 1.243 0a.92.92 0 01.254.62.92.92 0 01-.254.621.908.908 0 01-.621.254zM28.02 38.47a.922.922 0 01-.621-.254.916.916 0 01-.254-.62c0-.228.095-.455.254-.621.324-.324.919-.324 1.243 0a.92.92 0 01.254.62.92.92 0 01-.254.621.924.924 0 01-.622.254zM24.518 38.47a.922.922 0 01-.622-.254.916.916 0 01-.254-.62c0-.228.096-.455.254-.621.324-.324.92-.324 1.243 0a.92.92 0 01.254.62.92.92 0 01-.254.621.924.924 0 01-.621.254zM21.015 38.47a.904.904 0 01-.621-.254.9.9 0 01-.254-.62c0-.228.095-.455.254-.621.324-.324.91-.324 1.243 0a.92.92 0 01.254.62.92.92 0 01-.254.621.924.924 0 01-.622.254zM17.513 38.47a.922.922 0 01-.622-.254.916.916 0 01-.254-.62c0-.228.096-.455.254-.621.324-.324.91-.324 1.243 0a.92.92 0 01.254.62.92.92 0 01-.254.621.924.924 0 01-.621.254zM14.01 38.47a.922.922 0 01-.622-.254.916.916 0 01-.253-.62c0-.228.095-.455.253-.621.325-.324.911-.324 1.244 0a.92.92 0 01.254.62.92.92 0 01-.254.621.924.924 0 01-.622.254zM38.528 34.973a.889.889 0 01-.622-.254.916.916 0 01-.254-.62.9.9 0 01.254-.621c.315-.315.92-.324 1.244 0a.92.92 0 01.254.62.92.92 0 01-.254.621.908.908 0 01-.622.254zM35.025 34.973a.922.922 0 01-.621-.254.9.9 0 01-.254-.62c0-.228.095-.455.254-.621.324-.324.919-.324 1.243 0a.92.92 0 01.254.62.875.875 0 01-.263.621.887.887 0 01-.613.254zM31.523 34.973a.922.922 0 01-.622-.254.916.916 0 01-.254-.62.9.9 0 01.254-.621c.324-.324.92-.324 1.243 0a.92.92 0 01.254.62.92.92 0 01-.254.621.924.924 0 01-.621.254zM28.02 34.973a.922.922 0 01-.621-.254.916.916 0 01-.254-.62c0-.228.095-.455.254-.621.324-.324.919-.324 1.243 0a.92.92 0 01.254.62.92.92 0 01-.254.621.924.924 0 01-.622.254zM24.518 34.973a.922.922 0 01-.622-.254.916.916 0 01-.254-.62.9.9 0 01.254-.621.918.918 0 011.243 0 .92.92 0 01.254.62.92.92 0 01-.254.621.924.924 0 01-.621.254zM21.015 34.973a.922.922 0 01-.621-.254.9.9 0 01-.254-.62c0-.228.095-.455.254-.621.324-.324.91-.324 1.243 0a.92.92 0 01.254.62.92.92 0 01-.254.621.924.924 0 01-.622.254zM17.513 34.973a.922.922 0 01-.622-.254.916.916 0 01-.254-.62c0-.228.096-.455.254-.621.324-.324.91-.324 1.243 0a.92.92 0 01.254.62.92.92 0 01-.254.621.924.924 0 01-.621.254zM35.025 31.475a.904.904 0 01-.621-.253.916.916 0 01-.254-.62c0-.228.095-.456.254-.622.332-.323.919-.323 1.243 0a.92.92 0 01.254.621.92.92 0 01-.254.62.908.908 0 01-.622.254zM31.523 31.475a.922.922 0 01-.622-.253.916.916 0 01-.254-.62c0-.228.096-.456.254-.622.324-.323.92-.323 1.243 0a.92.92 0 01.254.621.92.92 0 01-.254.62.924.924 0 01-.621.254zM28.02 31.475a.922.922 0 01-.621-.253.916.916 0 01-.254-.62c0-.228.095-.456.254-.622.324-.323.919-.323 1.243 0a.92.92 0 01.254.621.92.92 0 01-.254.62.924.924 0 01-.622.254zM24.518 31.475a.922.922 0 01-.622-.253.916.916 0 01-.254-.62c0-.228.096-.456.254-.622a.918.918 0 011.243 0 .92.92 0 01.254.621.92.92 0 01-.254.62.924.924 0 01-.621.254zM21.015 31.475a.922.922 0 01-.621-.253.9.9 0 01-.254-.62c0-.228.095-.456.254-.622.324-.323.919-.323 1.243 0a.92.92 0 01.254.621.92.92 0 01-.254.62.924.924 0 01-.622.254z"/></g></svg>
          </label>
        </div>
      </div>
        <template v-if="$parent.activeTab < 2 && (currentStore || businessInfo)">
          <div v-if="$parent.activeTab === 0" class="alert alert-primary mb-0 mt-3">
            <a v-if="currentStore" :href="`https://www.google.com/maps/search/?api=1&query=${ currentStore.latitude },${ currentStore.longitude }`" target="_blank" class="text-decoration-none">
              <i class="fa fa-map-marker mr-2"></i>
              Pickup At:
              <strong>{{ currentStore.name }}, {{ currentStore.address }}, {{ currentStore.city }}, {{ currentStore.state }} {{ currentStore.zip }}</strong>
            </a>
            <a v-else-if="businessInfo && businessInfo.locations && businessInfo.locations.length" :href="`https://www.google.com/maps/search/?api=1&query=${ businessInfo.locations[0].latitude },${ businessInfo.locations[0].longitude }`" target="_blank" class="text-decoration-none">
              <i class="fa fa-map-marker mr-2"></i>
              Pickup At:
              <strong>{{ businessInfo.locations[0].name }}, {{ businessInfo.locations[0].address }}, {{ businessInfo.locations[0].city }}, {{ businessInfo.locations[0].state }} {{ businessInfo.locations[0].zip }}</strong>
            </a>
          </div>
          <div v-else-if="$parent.activeTab === 1 && deliveryLocations && deliveryLocations.length && $parent.$refs.cartTotals && $parent.$refs.cartTotals.$refs.deliveryLocationsModal" class="alert alert-primary mb-0 mt-3">
            <a href="#" @click.prevent="$parent.$refs.cartTotals.$refs.deliveryLocationsModal.show()">View Delivery Area</a> for:
            <strong v-if="currentStore">
              {{ currentStore.name }}, {{ currentStore.address }}, {{ currentStore.city }}, {{ currentStore.state }} {{ currentStore.zip }}
            </strong>

            <strong v-else-if="businessInfo && businessInfo.locations && businessInfo.locations.length">
              {{ businessInfo.locations[0].name }}, {{ businessInfo.locations[0].address }}, {{ businessInfo.locations[0].city }}, {{ businessInfo.locations[0].state }} {{ businessInfo.locations[0].zip }}
            </strong>
          </div>
        </template>
    </div>
    <div :class="{'card' : !sideBarView, 'px-3 mx-1' : sideBarView}" v-if="!hideItems">
      <div class="card-body items" :class="{'p-3 p-md-4' : !sideBarView, 'px-2 px-md-4 pt-0 pb-3' : sideBarView}">
        <h6 v-if="title" class="text-uppercase font-weight-bold pb-2 pb-md-3 pt-0" :class="{'border-bottom mb-2 mb-md-3': !compactView}">
          {{ title }}
          <button v-if="compactView" @click="$parent.goToStep(1)" class="btn btn-sm btn-primary p-1 text-tiny h-auto ml-2">Edit</button>
        </h6>
        <h6 v-if="!readOnly && pickupItems && !sideBarView" class="font-weight-bold mb-2">
          In-Stock Items
        </h6>
        <div v-if="disclaimer && !readOnly && pickupItems && !sideBarView" v-html="disclaimer"></div>
        <h6 v-if="!readOnly && specialItems && !sideBarView" class="font-weight-bold mb-2">
          Special Order Items
        </h6>
        <div v-if="specialItems && !sideBarView">
          <div class="card-header-title mb-2">
            <div>
              <div v-if="!hideSpecialOrderMessage" v-html="specialOrderMessage || `Your item(s) will arrive in <b>${businessDetails.special_order_sla || '3-8 days'}</b>.`" />
              <div v-if="specialOrderDisclaimer"> {{ specialOrderDisclaimer }} </div>
            </div>
          </div>
          <div v-if="$store.state.settings.cart.specialOrderBadge && $store.state.settings.cart.specialOrderBadge != ''" class="badge badge-danger align-items-center d-flex py-2 px-2">
            {{ $store.state.settings.cart.specialOrderBadge }}
          </div>
        </div>

        <div class="custom-control custom-checkbox ml-n2 mb-2 mb-sm-3 pt-2" v-if="!readOnly && !sideBarView">
          <input type="checkbox" class="custom-control-input" id="selectedAllItems" v-model="allSelected" @click="selectAllItems" />
          <label class="font-weight-bold custom-control-label" for="selectedAllItems">Select all</label>
        </div>
        <div class="py-0 items-container px-3" :class="{'sideBarViewHeight' : sideBarView}">
          <div v-for="(first, i) in items" :key="i">
            <cart-item :compactView="compactView" :sideBarView="sideBarView" ref="cartItem" v-for="item in first.items" :key="item.sku" :item="item" :special="first.type === 'special'" :readonly="readOnly" @onSelect="selectItem" :class="{'disabled': isSubmitting || loading}" />
          </div>
        </div>        
        <div class="d-flex justify-content-end" v-if="selectedItems.length">
          <button type="button" class="btn btn-sm btn-primary mt-2" @click="removeItems" :class="{'disabled': loading}">
            Remove Selected
            <div v-if="loading" class="spinner-border spinner-border-sm ml-2"></div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import CartApiService from '@/api-services/cart.service';
  export default {
    name: 'cartItems',
    data() {
      return {
        activeTab: 0,
        selectedItems: [],
        loading: false,
        allSelected: false
      };
    },
    props: {
      title: {
        required: false
      },
      items: {
        required: true
      },
      hideTabs: {
        default: false
      },
      hideItems: {
        default: false
      },
      isSubmitting: {
        default: false
      },
      readOnly: {
        default: false
      },
      compactView: {
        default: false
      },
      sideBarView: {
        default: false
      }
    },
    created:function() {
      var prevActiveTab =  localStorage.getItem("prevActiveTab");
      if( prevActiveTab == null ) {
         localStorage.setItem('prevActiveTab',this.activeTab);
      } else {
        if( this.enabledTabs.pickup && prevActiveTab == 0   )
          this.activeTab = prevActiveTab;
        else if ( this.enabledTabs.delivery && prevActiveTab == 1 )
          this.activeTab = prevActiveTab;
        else if ( this.enabledTabs.shipping && prevActiveTab == 2 )
          this.activeTab = prevActiveTab;
        else
          this.activeTab = 0;
      }
    },
    computed: {
      settings() {
        return this.$store.state.settings;
      },
      disclaimer() {
        if(this.businessDetails) {
          if(this.$parent.activeTab == 1) {
            return this.businessDetails.delivery_settings.delivery_disclaimer || `*** Delivery Orders ***<br>Someone on our team will reach out to set up a delivery time with you.`;
          } else if(this.$parent.activeTab == 0) {
            return this.businessDetails.pickup_disclaimer || `*** Pick Up Orders ***<br>Please allow time for our team to pull your order. You will be notified when it is ready for pickup. If you show up prior to order confirmation, we may not have your order quite ready.`;
          }
        }
        return '';
      },
      hideSpecialOrderMessage() {
        return this.settings.cart.hideSpecialOrderMessage && this.settings.cart.hideSpecialOrderMessage === true || false;
      },
      specialOrderMessage() {
        return this.settings.cart.specialOrderMessage;
      },
      specialOrderDisclaimer() {
        return this.settings.cart.specialOrderDisclaimer;
      },
      currentStore() {
        return this.$store.state.currentStore;
      },
      businessInfo() {
        return this.$store.state.businessInfo;
      },
      deliveryLocations() {
        return this.$store.state.businessDetails.delivery_locations;
      },
      cart() {
        return this.$store.state.cart;
      },
      businessDetails: {
        get() {
          return this.$store.state.businessDetails;
        },
        set(val) {
          return val;
        }
      },
      enabledTabs () {
        if (this.cart && this.cart.checkout_types) {
          return {
            pickup: this.cart.checkout_types.includes('pickup'),
            delivery: this.cart.checkout_types.includes('delivery'),
            shipping: this.cart.checkout_types.includes('shipping')
          };
        } else {
          // default to business details at first
          return {
            pickup: this.businessDetails.pickup_enabled,
            delivery: this.businessDetails.delivery_enabled,
            shipping: this.businessDetails.shipping_enabled
          };
        }
      },
      specialItems() {
        return this.items && this.items.length && this.items.filter(item => item.type === 'special').length > 0 ? true : false;
      },
      pickupItems() {
        return this.items && this.items.length && this.items.filter(item => item.type === 'pickup').length > 0 ? true : false;
      },
    },
    methods: {
      urlFriendly(value) {
        return value.replace(/[ /]/g, '+');
      },
      selectItem(id, selected) {
        this.selectedItems = selected ? [...this.selectedItems, id] : this.selectedItems.filter(e => e != id);
      },
      selectAllItems() {
        if(!this.allSelected) {
          this.$refs.cartItem.forEach(e => {
            e.selected = true;
          });
          this.allSelected = true;
        } else {
          this.$refs.cartItem.forEach(e => {
            e.selected = false;
          });
          this.allSelected = false;
        }
      },
      async removeItems() {
        this.$swal({
          title: 'Remove Selected',
          text: "Are you sure you want to remove the selected products from your cart?",
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes'
        }).then(async result => {
          if (result.value) {
            this.loading = true;
            this.$store.state.addingToCart = true;
            const promises = this.selectedItems.map(async (id) => {
              await CartApiService.removeItem(id);
              return id;
            });
            await Promise.all(promises);
            this.$store.dispatch('fetchCartItemsDetails');
            this.$store.dispatch('fetchShippingQuotes');
            setTimeout(() => {
              this.loading = false;
              this.$store.state.addingToCart = false;
            }, 800);
          }
        });
      }
    },
    watch: {
      activeTab(n) {
        this.$emit('onTabChange', n);
        localStorage.setItem("prevActiveTab",n);
      },
      selectedItems() {
        this.allSelected = this.$refs.cartItem.every(e => e.selected) ? true : false;
      }
    }
  };

</script>

<style lang="scss" scoped>
  .custom-control:not(.custom-checkbox) {
    .custom-control-input {
      width: 4rem;
      height: 60px;
      ~ label.custom-control-label {
        padding-left: 20px;
        padding-right: 20px;
        height: 58px;
      }
    }
    label.custom-control-label::before {
      left: -10px;
    }
    label.custom-control-label::after {
      left: -8px !important;
    }
  }
  .tab-radio {
    border: 1px solid rgba(0, 0, 0, 0.125);
    height: 60px;
    min-width: 200px;
    width: 33.33%;
    &:not(:last-child) {
      margin-right: 20px;
    }
  }

  ::-webkit-scrollbar {
    width: 7px;
  }
    ::-webkit-scrollbar-track {
    background: #f1f1f1; 
  }
    ::-webkit-scrollbar-thumb {
    background: #888; 
      border-radius:10px;
  }
  ::-webkit-scrollbar-thumb:hover {    
    background: #8a8a8a; 
  } 

  .items-container {
    max-height: 45vh;
    overflow-y: auto;    
    overflow-x: hidden;
    &.sideBarViewHeight {
      max-height: 55vh;
    }
  }

  // iphone 6/7/8
  @media (max-width: 420px) and (max-height: 750px) {
    .items-container {
      max-height: 45vh !important;
    }
  }

  // iphone 5/5s
  @media (max-width: 320px) and (max-height: 570px) {
    .items-container {
      max-height: 35vh !important;
    }
  }

  @media (max-width: 475px) {
    .tab-radio {
      height: 45px;
      &:not(:last-child) {
        margin-bottom: 10px !important;
      }
      .custom-control-input{
        height: 45px !important;
        ~ label.custom-control-label {
          height: 43px !important;
        }
      }
    }
  }

  @media (max-width: 623px), (min-width: 991px) and (max-width: 1275px) {
    .tab-container-mobile {
      flex-direction: column;
    }
    .tab-radio {
      margin-bottom: 0px;
      min-width: 100%;
      width: 100%;
      &:not(:last-child) {
        margin-right: 0px;
        margin-bottom: 20px;
      }
    }
  }  
</style>
