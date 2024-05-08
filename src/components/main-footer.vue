<template>
  <footer id="mainFooter" :style="{ background: (footer && footer.background ? parseColor(footer.background) : 'transparent') }" :class="{ 'light': darkBackground, 'text-dark': isBenjaminMoore }">
    <div class="container" v-if="location && (footer && !Number(footer.hideStaticFooter))">
      <div class="static-footer lead">
        <div class="row">
          <div class="col-md-3">
            <div class="h2"><b>{{ location.name }}</b></div>
            <div class="mb-1">{{ location.address }}</div>
            <div>
              <a v-if="$store.state.settings.business_email" :href="`mailto:${$store.state.settings.business_email}`" class="mb-1">{{ $store.state.settings.business_email }}</a>
              <a v-else-if="$store.state.businessDetails.contact_email" :href="`mailto:${$store.state.businessDetails.contact_email}`" class="mb-1">{{ $store.state.businessDetails.contact_email }}</a>
            </div>
            <div>
              <a :href="`tel:${location.phone}`" class="mb-1">{{ location.phone }}</a>
            </div>
          </div>
          <div class="col-md-3 hours d-flex flex-column justify-content-end">
            <div class="d-flex text-capitalize">
              <div class="mr-2">
                <div class="mb-1" v-for="(h, i) in hours" :key="`h-${i}`">
                  {{ h.day }}
                </div>
              </div>
              <div class="ml-2">
                <div class="mb-1" v-for="(h, i) in hours" :key="`hh-${i}`">
                  {{ h.closed ? 'Closed' : h.hour }}
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-3 d-flex flex-column justify-content-end">
            <template v-for="(doc, key) in $store.state.docs">
              <div class="mb-1" v-if="!Number(doc.hidden)" :key="key">
                <a href="#" @click.prevent="showDoc(key, doc)" class="mx-2 text-capitalize">{{ key.replace('_', ' ') }}</a>
              </div>
            </template>
          </div>
          <div class="col-md-3" v-if="socialMedia">
            <div class="h3 mb-3"><b>{{ footerSocialConnectText }}</b></div>
            <div class="social ml-1">
              <a style="color: inherit" :href="business.facebook_link" target="_blank" v-if="business.facebook_link" aria-label="Facebook">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.98039 0H2.91765H2.84444C2.44706 0 2.06013 0.0721185 1.70458 0.226658C1.35948 0.381198 1.04575 0.58725 0.794771 0.855119C0.543791 1.10238 0.355556 1.40116 0.20915 1.73084C0.0732026 2.06053 0 2.42112 0 2.81262V2.87444V2.93625V13.0637V13.1153C0 13.5171 0.0732026 13.888 0.230065 14.2279C0.386928 14.5679 0.596078 14.877 0.867974 15.1449C1.12941 15.4127 1.43268 15.6188 1.78824 15.7733C2.14379 15.9279 2.52026 16 2.9281 16H2.95948H2.99085H8.5647V9.81842H6.43137V7.4076H8.54379V5.64585V5.56343V5.49131C8.54379 5.0689 8.61699 4.6774 8.77386 4.3065C8.93072 3.93561 9.13987 3.60592 9.41176 3.31745C9.69412 3.04958 10.0183 2.84353 10.3843 2.68899C10.7503 2.53445 11.1477 2.46233 11.5556 2.46233H11.6183H11.681H13.5529V4.63619H12.3085C12.2876 4.62589 12.2562 4.61558 12.2248 4.61558H12.1203C11.9634 4.61558 11.8065 4.64649 11.6601 4.698C11.5137 4.74952 11.3882 4.83194 11.2732 4.94527C11.2105 5.03799 11.1582 5.15132 11.1163 5.28525C11.0745 5.41919 11.0536 5.55312 11.0536 5.68706V5.73857V5.79008V7.32518H13.5007L13.1869 9.71539H11.0536V15.9073H12.9464C13.7935 15.9073 14.515 15.6085 15.1111 15.0212C15.7072 14.434 16 13.7128 16 12.8886V2.93625V2.90534V2.88474C16 2.48294 15.9268 2.11204 15.7699 1.76175C15.6131 1.41146 15.4039 1.11269 15.132 0.855119C14.8706 0.58725 14.5673 0.381198 14.2118 0.226658C13.8562 0.0721185 13.4797 0 13.0719 0H13.0405H13.0091H2.98039Z" fill="currentColor"/></svg>
              </a>
              <a style="color: inherit" :href="business.twitter_link" target="_blank" v-if="business.twitter_link" aria-label="Twitter">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.3264 4.98836C13.1704 5.20569 12.9935 5.41268 12.7958 5.60931C12.5982 5.80595 12.3901 5.98189 12.1508 6.13713V6.25097V6.43726C12.1508 7.06856 12.0676 7.67917 11.8908 8.25873C11.7139 8.83829 11.4642 9.37646 11.1313 9.87322C10.9649 10.132 10.7672 10.37 10.5696 10.5977C10.3615 10.8254 10.143 11.0427 9.91417 11.2393C9.6541 11.4567 9.38361 11.6533 9.08192 11.8189C8.78023 11.9845 8.47854 12.1294 8.15605 12.2329C7.81274 12.3674 7.45904 12.4709 7.07412 12.533C6.69961 12.6054 6.31469 12.6365 5.91938 12.6365C5.29519 12.6365 4.70221 12.5433 4.13004 12.3674C3.55787 12.1811 3.03771 11.9431 2.57997 11.6429H3.11053H3.14174C3.6515 11.6429 4.14044 11.5602 4.60858 11.3842C5.07672 11.2186 5.48244 10.9806 5.85696 10.6908C5.60728 10.6908 5.37841 10.6494 5.17035 10.5666C4.95189 10.4838 4.76463 10.37 4.59818 10.2354C4.43173 10.1009 4.26528 9.94567 4.13004 9.75938C3.9948 9.57309 3.89077 9.36611 3.81795 9.14877H4.73342C4.49415 9.08667 4.26528 8.99353 4.04681 8.85899C3.83875 8.72445 3.6515 8.56921 3.51625 8.38292C3.3498 8.18629 3.21456 7.96895 3.11053 7.74127C3.0065 7.50323 2.96489 7.25485 2.96489 6.98577L2.94408 6.96507C3.10013 7.03752 3.26658 7.09961 3.43303 7.14101C3.59948 7.18241 3.77633 7.2031 3.96359 7.2031C3.6827 7.02717 3.46424 6.77878 3.28739 6.46831C3.12094 6.15783 3.03771 5.82665 3.03771 5.47477V5.44373V5.42303C3.03771 5.22639 3.06892 5.0401 3.13134 4.86417C3.18335 4.67788 3.26658 4.50194 3.36021 4.3467C3.91157 4.99871 4.57737 5.52652 5.36801 5.93014C6.15865 6.33376 7.02211 6.5511 7.94798 6.60285C7.92718 6.5304 7.90637 6.45796 7.89597 6.37516C7.88557 6.30272 7.88557 6.21992 7.88557 6.12678C7.88557 5.51617 8.10403 5.00906 8.52015 4.58473C8.94668 4.16041 9.45644 3.95343 10.0598 3.95343C10.3719 3.95343 10.6736 4.01552 10.9337 4.13972C11.2042 4.26391 11.4434 4.4295 11.6515 4.63648C11.9116 4.58473 12.1508 4.52264 12.3797 4.4295C12.6086 4.33635 12.827 4.23286 13.0247 4.12937C12.9519 4.3881 12.8375 4.61578 12.6814 4.83312C12.5254 5.05045 12.3277 5.21604 12.0988 5.35058L13.3368 4.96766V4.98836H13.3264ZM15.9792 2.94955C15.9792 2.53558 15.896 2.15265 15.7295 1.79043C15.5631 1.4282 15.3342 1.11772 15.0429 0.858991C14.7828 0.589909 14.4811 0.382924 14.1274 0.227684C13.7841 0.072445 13.3992 0 13.0039 0H12.9727H12.9415H2.95449H2.90247H2.82965C2.43433 0 2.04941 0.072445 1.69571 0.227684C1.342 0.382924 1.04031 0.589909 0.790637 0.858991C0.540962 1.10737 0.353706 1.4075 0.208062 1.73868C0.0728218 2.06986 0 2.43208 0 2.82536V2.88745V2.94955V13.0298V13.0815C0 13.4851 0.0728218 13.8577 0.228869 14.2096C0.384915 14.5614 0.592978 14.8719 0.863459 15.141C1.12354 15.3997 1.42523 15.6067 1.77893 15.762C2.13264 15.9172 2.50715 16 2.91287 16H2.94408H2.97529H12.9623C13.8049 16 14.5228 15.6999 15.1157 15.11C15.7087 14.5201 16 13.806 16 12.9677V2.94955H15.9792Z" fill="currentColor"/></svg>
              </a>
              <a style="color: inherit" :href="business.instagram_link" target="_blank" v-if="business.instagram_link" aria-label="Instagram">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 1.442C10.136 1.442 10.3893 1.45 11.2333 1.48867C13.4013 1.58733 14.414 2.616 14.5127 4.768C14.5513 5.61133 14.5587 5.86467 14.5587 8.00067C14.5587 10.1373 14.5507 10.39 14.5127 11.2333C14.4133 13.3833 13.4033 14.414 11.2333 14.5127C10.3893 14.5513 10.1373 14.5593 8 14.5593C5.864 14.5593 5.61067 14.5513 4.76733 14.5127C2.594 14.4133 1.58667 13.38 1.488 11.2327C1.44933 10.3893 1.44133 10.1367 1.44133 8C1.44133 5.864 1.45 5.61133 1.488 4.76733C1.58733 2.616 2.59733 1.58667 4.76733 1.488C5.61133 1.45 5.864 1.442 8 1.442ZM8 0C5.82733 0 5.55533 0.00933333 4.702 0.048C1.79667 0.181333 0.182 1.79333 0.0486667 4.70133C0.00933333 5.55533 0 5.82733 0 8C0 10.1727 0.00933333 10.4453 0.048 11.2987C0.181333 14.204 1.79333 15.8187 4.70133 15.952C5.55533 15.9907 5.82733 16 8 16C10.1727 16 10.4453 15.9907 11.2987 15.952C14.2013 15.8187 15.82 14.2067 15.9513 11.2987C15.9907 10.4453 16 10.1727 16 8C16 5.82733 15.9907 5.55533 15.952 4.702C15.8213 1.79933 14.2073 0.182 11.2993 0.0486667C10.4453 0.00933333 10.1727 0 8 0V0ZM8 3.892C5.73133 3.892 3.892 5.73133 3.892 8C3.892 10.2687 5.73133 12.1087 8 12.1087C10.2687 12.1087 12.108 10.2693 12.108 8C12.108 5.73133 10.2687 3.892 8 3.892ZM8 10.6667C6.52733 10.6667 5.33333 9.47333 5.33333 8C5.33333 6.52733 6.52733 5.33333 8 5.33333C9.47267 5.33333 10.6667 6.52733 10.6667 8C10.6667 9.47333 9.47267 10.6667 8 10.6667ZM12.2707 2.77C11.74 2.77 11.31 3.2 11.31 3.73C11.31 4.26 11.74 4.69 12.2707 4.69C12.8007 4.69 13.23 4.26 13.23 3.73C13.23 3.2 12.8007 2.77 12.2707 2.77Z" fill="currentColor"/></svg>
              </a>
              <a style="color: inherit" :href="business.youtube_link" target="_blank" v-if="business.youtube_link" aria-label="Youtube">
                <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15.7235 2.21778C15.5276 1.36687 14.8316 0.739092 13.9938 0.645446C12.0097 0.423965 10.0015 0.422808 8.00256 0.423965C6.00328 0.422808 3.99476 0.423965 2.01067 0.645446C1.17331 0.739092 0.477812 1.36687 0.28193 2.21778C0.00313807 3.42957 0 4.75235 0 5.99998C0 7.2476 0 8.57022 0.278792 9.78184C0.474343 10.6326 1.17 11.2604 2.00787 11.3542C3.99178 11.5758 6.00014 11.577 7.99942 11.5758C9.99903 11.577 12.0069 11.5758 13.9906 11.3542C14.828 11.2605 15.5242 10.6328 15.7201 9.78184C15.999 8.57005 16 7.24744 16 5.99998C16 4.75235 16.0023 3.42957 15.7235 2.21778ZM5.93524 8.48334C5.93524 6.71347 5.93524 4.9621 5.93524 3.19207C7.63095 4.07684 9.31543 4.95566 11.0219 5.84588C9.32071 6.72817 7.63541 7.60171 5.93524 8.48334Z" fill="currentColor"/></svg>
              </a>
              <a style="color: inherit" :href="business.linkedin_link" target="_blank" v-if="business.linkedin_link" aria-label="Linkedin">
                <svg width="22" height="20" xmlns="http://www.w3.org/2000/svg"><path d="M19.1666667,0 L0.833333333,0 C0.333333333,0 0,0.333333333 0,0.833333333 L0,19.1666667 C0,19.6666667 0.333333333,20 0.833333333,20 L19.1666667,20 C19.6666667,20 20,19.6666667 20,19.1666667 L20,0.833333333 C20,0.333333333 19.6666667,0 19.1666667,0 Z M5.91666667,17.0833333 L3,17.0833333 L3,7.5 L6,7.5 L6,17.0833333 L5.91666667,17.0833333 Z M4.41666667,6.16666667 C3.5,6.16666667 2.66666667,5.41666667 2.66666667,4.41666667 C2.66666667,3.5 3.41666667,2.66666667 4.41666667,2.66666667 C5.33333333,2.66666667 6.16666667,3.41666667 6.16666667,4.41666667 C6.16666667,5.41666667 5.41666667,6.16666667 4.41666667,6.16666667 Z M17.0833333,17.0833333 L14.0833333,17.0833333 L14.0833333,12.4166667 C14.0833333,11.3333333 14.0833333,9.91666667 12.5833333,9.91666667 C11,9.91666667 10.8333333,11.0833333 10.8333333,12.3333333 L10.8333333,17.0833333 L7.83333333,17.0833333 L7.83333333,7.5 L10.6666667,7.5 L10.6666667,8.83333333 L10.6666667,8.83333333 C11.0833333,8.08333333 12,7.33333333 13.5,7.33333333 C16.5,7.33333333 17.0833333,9.33333333 17.0833333,11.9166667 L17.0833333,17.0833333 Z" fill="currentColor" id="Shape"/></svg>
              </a>
              <a style="color: inherit" :href="business.pinterest_link" target="_blank" v-if="business.pinterest_link" aria-label="Pinterest">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 0C3.58189 0 0 3.58189 0 8C0 11.3909 2.107 14.2881 5.08313 15.4535C5.0107 14.8214 4.95144 13.8469 5.10946 13.1556C5.25432 12.53 6.04444 9.1786 6.04444 9.1786C6.04444 9.1786 5.80741 8.69794 5.80741 7.99342C5.80741 6.88066 6.45267 6.05103 7.25597 6.05103C7.94074 6.05103 8.26996 6.56461 8.26996 7.17695C8.26996 7.86173 7.83539 8.88889 7.60494 9.84362C7.41399 10.6403 8.00658 11.2922 8.79012 11.2922C10.2123 11.2922 11.3053 9.79095 11.3053 7.63128C11.3053 5.71523 9.92922 4.3786 7.96049 4.3786C5.6823 4.3786 4.34568 6.08395 4.34568 7.84856C4.34568 8.53333 4.60905 9.27078 4.93827 9.67243C5.00412 9.75144 5.0107 9.82387 4.99095 9.90288C4.93169 10.1531 4.79342 10.6996 4.76708 10.8115C4.73416 10.9564 4.64856 10.9893 4.49712 10.9169C3.4963 10.4494 2.87078 8.99424 2.87078 7.81564C2.87078 5.29383 4.70123 2.97613 8.15802 2.97613C10.93 2.97613 13.0897 4.95144 13.0897 7.59835C13.0897 10.3572 11.3514 12.5761 8.94156 12.5761C8.13169 12.5761 7.3679 12.1547 7.11111 11.6543C7.11111 11.6543 6.70947 13.1819 6.6107 13.5572C6.43292 14.2551 5.94568 15.1243 5.61646 15.6576C6.36708 15.8881 7.1572 16.0132 7.98683 16.0132C12.4049 16.0132 15.9868 12.4313 15.9868 8.01317C16 3.58189 12.4181 0 8 0Z" fill="currentColor"/></svg>
              </a>
              <a style="color: inherit" :href="business.tiktok_link" target="_blank" v-if="business.tiktok_link" aria-label="Tiktok">
                <svg viewBox="4 4 45 45" xmlns="http://www.w3.org/2000/svg" width="20" height="20"><path d="M41 4H9C6.243 4 4 6.243 4 9v32c0 2.757 2.243 5 5 5h32c2.757 0 5-2.243 5-5V9c0-2.757-2.243-5-5-5m-3.994 18.323a7.482 7.482 0 0 1-.69.035 7.492 7.492 0 0 1-6.269-3.388v11.537a8.527 8.527 0 1 1-8.527-8.527c.178 0 .352.016.527.027v4.202c-.175-.021-.347-.053-.527-.053a4.351 4.351 0 1 0 0 8.704c2.404 0 4.527-1.894 4.527-4.298l.042-19.594h4.02a7.488 7.488 0 0 0 6.901 6.685v4.67" fill="currentColor" fill-rule="nonzero"/></svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="footer pt-3 mb-4 border-top border-gray mt-5">
        <h4 v-if="footer && footer.title" class="text-center mt-3 mb-4 font-weight-bold" :style="{ fontSize: `${footer.titleSize || 24}px` }">{{ footer.title }}</h4>
        <div v-if="footer && footer.columns && footer.columns.length" class="row text-break justify-content-center">
          <div v-for="(column, index) in footer.columns" :key="`footercolumn-${index}`" :class="`d-flex justify-content-start justify-content-md-center footer-column col-md-${12 / footer.columns.length}`">
            <div>
              <div class="h6">{{ column.title }}</div>
              <div>
                <div v-for="(link, i) in column.links" :key="`link-${index}${i}`" class="d-flex link-row pb-2">
                  <a v-if="link.link" :href="link.link" target="_blank" :class="{ 'text-underline': isBenjaminMoore }">{{ link.label }}</a>
                  <p v-if="link.text" v-html="parseHTML(link.text)"></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="d-flex pt-2 link-row justify-content-center text-center pb-4 font-weight-bold" v-if="!isBenjaminMoore">
        <router-link to="/store-info">
          <template v-if="$store.state.storeLocations.length && $store.state.storeLocations.length > 1">
            Our Locations
          </template>
          <template v-else>
            Store Information
          </template>
        </router-link>
      </div>
      <div class="row justify-content-center align-items-center border-bottom border-gray mb-4 pb-3" v-if="$store.state.settings.footer.showSslLogo">
        <div class="col text-center">
          <p>This site uses SSL for your security</p>
          <img src="/icons/ssl-icon.svg" alt="SSL" />
        </div>
      </div>
      <template v-if="!isBenjaminMoore && $store.state.settings.navigationLayout !== 'secondary'">
        <div class="text-center trademark">
          <p>{{ $store.state.settings.text.trademark }}</p>
        </div>

        <div class="d-flex justify-content-center flex-column align-items-center flex-md-row important-links mb-5">
          <template v-if="$store.state.settings.footer && $store.state.settings.footer.links && $store.state.settings.footer.links.length">
            <div v-for="(item,i) in footerLink" :key="`link-${i}`">
              <a v-if="isUrl(item.link)" class="mx-2" :href="item.link" target="_blank">
                {{ item.name }}
              </a>
              <router-link v-else class="mx-2" :key="`rlink-${i}`" :to="item.link">
                {{ item.name }}
              </router-link>
            </div>
          </template>

          <a href="https://storage.googleapis.com/content.ezadtv.com/2024/02/14/65ccf4833dadd__Forget_me_form.pdf" class="mx-2" target="_blank">Forget me</a>
        </div>
      </template>

      <div v-if="isBenjaminMoore" class="text-center lead mb-3">
        <div class="mb-2">
          SMS Messages powered by <a href="https://saturntext.com/" target="_blank">SaturnText</a>
        </div>
        @2022 Decorate & Paint, a proud retailer of Benjamin Moore. Built by <a href="https://ezadtv.com/" target="_blank">EZ AD</a>.
      </div>
      <template v-else>
        <div v-if="backlinkText" class="d-flex flex-column align-items-center" v-html="backlinkText"></div>
        <div v-else class="d-flex flex-column align-items-center">
          <span>SMS Messages powered by <a href="https://saturntext.com/" target="_blank" class="font-weight-bold">SaturnText</a></span>
          <span>An <a href="https://ezadtv.com/" target="_blank" class="font-weight-bold">EZ-AD TV</a> Product</span>
        </div>
      </template>
    </div>

    <b-modal ref="documentModal" size="xl">
      <div slot="modal-header">
        <h5 class="modal-title">{{ selectedDoc.display_name }}</h5>
      </div>

      <div v-if="!selectedDoc.use_default" v-html="selectedDoc.value"></div>
      <div v-else>
        <iframe v-if="selectedDoc.type === 'policy'" class="doc-template" width="100%" :src="$store.state.docsTemplates.policy"></iframe>
        <iframe v-else-if="selectedDoc.type === 'policy_california'" class="doc-template" width="100%" :src="$store.state.docsTemplates.policyCalifornia"></iframe>
        <iframe v-else-if="selectedDoc.type === 'return_policy'" class="doc-template" width="100%" :src="$store.state.docsTemplates.returnPolicy"></iframe>
        <iframe v-else-if="selectedDoc.type === 'terms'" class="doc-template" width="100%" :src="$store.state.docsTemplates.terms"></iframe>
      </div>

      <div slot="modal-footer">
        <b-button @click="$refs.documentModal.hide()" variant="primary">Ok</b-button>
      </div>
    </b-modal>
  </footer>
</template>

<script>
import CustomNavigationService from '@/api-services/custom-navigation.service';

export default {
  name: 'mainFooter',
  data() {
    return {
      businessDocs: [],
      selectedDoc: {}
    };
  },
  props: ['business'],
  computed: {
    hours() {
      let arr = [];
      if(this.location.hours) {
        ['mon','tue','wed','thu','fri','sat','sun'].map(e => ({day: e, ...this.location.hours[e]})).forEach(e => {
          if(arr.length) {
            let a = arr[arr.length - 1];
            if(a.open == e.open && a.close == e.close && !e.closed && !a.closed) {
              arr[arr.length - 1] = { ...e, day: `${a.day.split(' to ')[0]} to ${e.day}` };
            } else {
              arr.push(e);
            }
          } else {
            arr.push(e);
          }
        });
      }
      return arr.map(e => ({ ...e, hour: `${e.open.substr(0, 1) == '0' ? e.open.substring(1) : e.open} - ${e.close.substr(0, 1) == '0' ? e.close.substring(1) : e.close}`.replaceAll(':00', '').replaceAll(' AM', 'am').replaceAll(' PM', 'pm')}));
    },
    isBenjaminMoore() {
      return this.$root.$children[0].isBenjaminMoore;
    },
    location() {
      return this.$store.state.businessDetails.about_us.locations.find(e => String(e.business_id) == localStorage.getItem('selectedStore'));
    },
    darkBackground() {
      if(!this.footer || !this.footer.background) return false;
      let bg = this.footer.background == 'white' ? 'ffffff' : this.footer.background == 'black' ? '000000' : this.footer.background;
      var r, g, b, hsp;
      let color = +(`0x${bg.slice(1).replace(bg.length < 5 && /./g, '$&$&')}`);
      r = color >> 16;
      g = color >> 8 & 255;
      b = color & 255;
      hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));
      return hsp>127.5 ? false : true;
    },
    footerLink() {
      const s = this.$store.state.settings;
      if ( s.footer && s.footer.links ) {
        if ( typeof s.footer.links === 'string' ) {
          return JSON.parse(s.footer.links) || [];
        } else {
          return s.footer.links;
        }
      }
      return [];
    },
    logger() {
      return this.$root.$children[0].$refs.logger;
    },
    socialMedia() {
      return this.business.facebook_link || this.business.twitter_link || this.business.instagram_link || this.business.pinterest_link || this.business.youtube_link || this.business.linkedin_link;
    },
    backlinkText() {
      return this.business.backlink_text;
    },
    activeUser() {
      return this.$store.state.activeUser;
    },
    footer() {
      return this.$store.state.footer || null;
    },
    footerColumnWidth() {
      return 12 / (this.footer.columns.length || 1);
    },
    footerSocialConnectText() {
      return this.$store.state.settings.text.footerConnectText || 'Connect with us';
    }
  },
  mounted() {
    this.getDocs();
    if(this.$root.$children[0].isAdmin)
      this.logger.addLog('Footer', { label: 'footer.showSslLogo', value: this.$store.state.settings.footer.showSslLogo, global: true });
  },
  methods: {
    docUrl(doc) {
      return doc == 'policy' ? '/privacy-policy' : doc == 'terms' ? 'terms' : '';
    },
    parseHTML(e) {
      return e.replace(/\n/g, '<br>');
    },
    isUrl(val) {
      return this.$options.filters.isUrl(val);
    },
    async getDocs() {
      let res = await CustomNavigationService.getDocs();
      this.$store.commit('setDocs', res.data.data);
    },
    showDoc(key, doc) {
      this.selectedDoc = {type: key, ...doc};
      this.$refs.documentModal.show();
    },
    parseColor(color) {
      if(!color) {
        return 'transparent';
      };
      let re = /^([0-9A-F]{3}){1,2}$/i;
      return re.test(color) ? `#${color}` : `var(--${color})`;
    }
  }
};

</script>

<style scoped lang="scss">
  footer {
    color: #565656;
    margin-top: 60px;
    padding-bottom: 20px;
    .hours {
      font-size: 15px;
    }
    &.light {
      :deep(*) {
        color: #fff !important;
      }
    }
    .link-row {
      font-size: 0.875rem;
    }
    .privacy-link {
      padding-top: 10px;
      a {
        color: #565656;
        font-size: 12px;
      }
    }
    .social {
      a:not(:last-child) {
        margin-right: 40px;
      }
    }
    :deep(p) {
      margin-bottom: .2rem !important;
    }
    :deep(img) {
      max-width: none !important;
    }
  }


  .doc-template {
    min-height: 80vh;
    border: none;
  }

  @media (max-width: 768px) {
    footer {
      padding: 20px 0;
      .footer-column:not(:last-child) {
        margin-right: 0;
      }
    }
  }
  @media print {
    footer {
      display: none;
    }
  }
</style>
