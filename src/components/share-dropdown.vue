<template>
    <b-dropdown v-if="allowedOptions.length > 0" toggle-class="bg-transparent border-0 text-dark pr-1" size="xs" variant="transparent" right no-caret lazy>
        <template #button-content>
            <svg class="mr-2" xmlns="http://www.w3.org/2000/svg" width="13" height="14" fill="none"><path stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="1.2" d="m12.05 6.625-5.25-4.5v3.0248c-2.8357 0-6 1.1002-6 5.9752 1.4768-2.391 3.75-3 6-3v3l5.25-4.5Z"/></svg>
            <h6 class="my-0">Share</h6>
        </template>
        <b-dropdown-item v-if="allowedOptions.includes('fb')" @click.prevent="shareFacebook">
            <div class="d-flex align-items-start">
                <svg class="mr-2" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none"><g clip-path="url(#a)"><path fill="#1877F2" d="M8 15.6673c4.2342 0 7.6667-3.4325 7.6667-7.6666C15.6667 3.7664 12.2342.334 8 .334 3.766.334.3334 3.7665.3334 8.0007c0 4.2341 3.4325 7.6666 7.6666 7.6666Z"/><path fill="#fff" d="m10.9843 10.2161.34-2.216H9.198v-1.438c0-.6063.297-1.1973 1.2493-1.1973h.9667V3.478a11.7696 11.7696 0 0 0-1.716-.15c-1.7513 0-2.896 1.0614-2.896 2.983v1.689H4.8554v2.216H6.802v5.3574a7.738 7.738 0 0 0 2.396 0v-5.3574h1.7863Z"/></g><defs><clipPath id="a"><path fill="#fff" d="M0 0h16v16H0z"/></clipPath></defs></svg>
                <h6 class="my-0" style="font-size: 0.9rem;">Facebook</h6>
            </div>
        </b-dropdown-item>
<!--         <b-dropdown-item v-if="allowedOptions.includes('ig')" @click.prevent="shareInstagram">
            <div class="d-flex align-items-start">
                <svg class="mr-2" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none"><g clip-path="url(#a)"><path fill="url(#b)" d="M8.0026-.0024c-3.3406 0-4.318.0034-4.5077.019A3.9663 3.9663 0 0 0 1.918.4134a3.1897 3.1897 0 0 0-.9194.6733A3.4347 3.4347 0 0 0 .0716 3.033c-.0541.3746-.0698.4508-.0732 2.3625v2.601c0 3.3387.0038 4.3154.0198 4.5047a4.0208 4.0208 0 0 0 .381 1.5463 3.3712 3.3712 0 0 0 2.185 1.7852c.381.0908.7703.1419 1.1618.1524C3.944 15.9939 5.964 16 7.985 16c2.0211 0 4.0422-.0023 4.2353-.0122a5.4663 5.4663 0 0 0 1.2038-.1577 3.351 3.351 0 0 0 2.1849-1.7891 3.9551 3.9551 0 0 0 .3772-1.5161c.0107-.138.0153-2.3366.0153-4.5322 0-2.1956-.005-4.3904-.0157-4.5283a3.919 3.919 0 0 0-.3848-1.5314 3.1774 3.1774 0 0 0-.6859-.9386 3.452 3.452 0 0 0-1.9483-.9248c-.3738-.054-.4481-.07-2.3625-.0735l-2.6018.0015Z"/><path fill="url(#c)" d="M8.0026-.0024c-3.3406 0-4.318.0034-4.5077.019A3.9663 3.9663 0 0 0 1.918.4134a3.1897 3.1897 0 0 0-.9194.6733A3.4347 3.4347 0 0 0 .0716 3.033c-.0541.3746-.0698.4508-.0732 2.3625v2.601c0 3.3387.0038 4.3154.0198 4.5047a4.0208 4.0208 0 0 0 .381 1.5463 3.3712 3.3712 0 0 0 2.185 1.7852c.381.0908.7703.1419 1.1618.1524C3.944 15.9939 5.964 16 7.985 16c2.0211 0 4.0422-.0023 4.2353-.0122a5.4663 5.4663 0 0 0 1.2038-.1577 3.351 3.351 0 0 0 2.1849-1.7891 3.9551 3.9551 0 0 0 .3772-1.5161c.0107-.138.0153-2.3366.0153-4.5322 0-2.1956-.005-4.3904-.0157-4.5283a3.919 3.919 0 0 0-.3848-1.5314 3.1774 3.1774 0 0 0-.6859-.9386 3.452 3.452 0 0 0-1.9483-.9248c-.3738-.054-.4481-.07-2.3625-.0735l-2.6018.0015Z"/><path fill="#fff" d="M8 2.0898c-1.6045 0-1.8057.0069-2.436.0355A4.3327 4.3327 0 0 0 4.1302 2.4a3.0206 3.0206 0 0 0-1.7285 1.728 4.32 4.32 0 0 0-.2747 1.4347c-.0282.6302-.0354.8318-.0354 2.4387 0 1.6068.0072 1.8058.0358 2.436.0098.4901.1026.9751.2743 1.4343a3.023 3.023 0 0 0 1.7265 1.7284 4.343 4.343 0 0 0 1.4343.2743c.6302.0286.8314.0359 2.4356.0359s1.8054-.0073 2.4357-.0359a4.3478 4.3478 0 0 0 1.4346-.2743 3.0264 3.0264 0 0 0 1.7277-1.7288 4.3912 4.3912 0 0 0 .2747-1.4347c.0282-.6302.0354-.831.0354-2.436s-.0072-1.8065-.0354-2.4368a4.3832 4.3832 0 0 0-.2747-1.4342 3.02 3.02 0 0 0-1.7281-1.7284 4.3463 4.3463 0 0 0-1.435-.2748c-.6302-.0285-.831-.0354-2.436-.0354L8 2.0898Zm-.53 1.067H8c1.5776 0 1.7647.0053 2.3873.0339a3.2704 3.2704 0 0 1 1.097.2035 1.958 1.958 0 0 1 1.1211 1.1214c.1301.3513.1989.7224.2034 1.097.0282.623.0347.8101.0347 2.3873 0 1.5771-.0065 1.7642-.0347 2.3872a3.272 3.272 0 0 1-.2034 1.097 1.9586 1.9586 0 0 1-1.1211 1.1211 3.2618 3.2618 0 0 1-1.097.2035c-.6226.0281-.8097.0342-2.3873.0342-1.5775 0-1.7646-.0061-2.3872-.0342a3.2726 3.2726 0 0 1-1.097-.2039 1.9585 1.9585 0 0 1-1.1214-1.121 3.2516 3.2516 0 0 1-.2035-1.0971c-.0286-.623-.0343-.81-.0343-2.3884 0-1.5783.0057-1.7642.0343-2.3872a3.263 3.263 0 0 1 .2035-1.097 1.956 1.956 0 0 1 1.1214-1.1218 3.2484 3.2484 0 0 1 1.097-.2039c.5449-.0248.7564-.032 1.8572-.0332v.0016Zm3.6836.9812a.709.709 0 0 0-.6955.8476.7093.7093 0 0 0 1.2853.2552.7087.7087 0 0 0 .0653-.6654.7089.7089 0 0 0-.6551-.4374ZM8 4.9645a3.0347 3.0347 0 1 0-.0045 6.0693A3.0347 3.0347 0 0 0 8 4.9645Zm0 1.0669a1.97 1.97 0 1 1-1.9703 1.9673A1.9695 1.9695 0 0 1 8 6.0295v.0019Z"/></g><defs><radialGradient id="b" cx="0" cy="0" r="1" gradientTransform="matrix(0 -15.8649 14.7528 0 4.2852 17.2626)" gradientUnits="userSpaceOnUse"><stop stop-color="#FD5"/><stop offset=".1" stop-color="#FD5"/><stop offset=".5" stop-color="#FF543E"/><stop offset="1" stop-color="#C837AB"/></radialGradient><radialGradient id="c" cx="0" cy="0" r="1" gradientTransform="rotate(78.677 -2.0134 -1.1117) scale(7.09037 29.226)" gradientUnits="userSpaceOnUse"><stop stop-color="#3771C8"/><stop offset=".128" stop-color="#3771C8"/><stop offset="1" stop-color="#60F" stop-opacity="0"/></radialGradient><clipPath id="a"><path fill="#fff" d="M0 0h16v16H0z"/></clipPath></defs></svg>
                <h6 class="my-0" style="font-size: 0.9rem;">Instagram</h6>
            </div>
        </b-dropdown-item> -->
        <b-dropdown-item v-if="allowedOptions.includes('ln')" @click.prevent="shareLinkedIn">
            <div class="d-flex align-items-start">
                <svg class="mr-2" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none"><g clip-path="url(#a)"><path fill="#007BB5" d="M14.8162 0H1.1804C.5294 0 .0002.5165.0002 1.1536v13.6919C.0002 15.4826.5293 16 1.1804 16h13.6358c.6524 0 1.1836-.5174 1.1836-1.1545V1.1536C15.9998.5165 15.4686 0 14.8162 0Z"/><path fill="#fff" d="M2.3709 5.9987h2.3754v7.6354H2.3709V5.9987Zm1.1883-3.7956c.7591 0 1.3754.6166 1.3754 1.3761 0 .7598-.6163 1.3763-1.3754 1.3763-.7621 0-1.3767-.6165-1.3767-1.3763 0-.7595.6146-1.376 1.3767-1.376ZM6.235 5.998h2.2747V7.042h.0326c.3164-.6003 1.0907-1.2333 2.2452-1.2333 2.4028 0 2.8468 1.581 2.8468 3.6374v4.1875h-2.3728V9.9204c0-.8855-.0152-2.0246-1.2331-2.0246-1.2348 0-1.4232.9651-1.4232 1.9612v3.7765H6.235V5.9981Z"/></g><defs><clipPath id="a"><path fill="#fff" d="M0 0h16v16H0z"/></clipPath></defs></svg>
                <h6 class="my-0" style="font-size: 0.9rem;">LinkedIn</h6>
            </div>
        </b-dropdown-item>
        <b-dropdown-item v-if="allowedOptions.includes('pt')" @click.prevent="sharePinterest">
            <div class="d-flex align-items-start">
                <svg class="mr-2" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none"><g clip-path="url(#a)"><path fill="#BD081C" d="M8 0C3.5817 0 0 3.5817 0 8c0 3.3891 2.1086 6.2839 5.0846 7.4496-.07-.633-.1331-1.6039.0278-2.2949.1453-.6243.938-3.9765.938-3.9765s-.2393-.4792-.2393-1.1877c0-1.1124.6448-1.9429 1.4476-1.9429.6825 0 1.0122.5124 1.0122 1.127 0 .6863-.437 1.7125-.6626 2.6636-.1884.7962.3993 1.4456 1.1847 1.4456 1.4219 0 2.5148-1.4993 2.5148-3.6634 0-1.9155-1.3763-3.2547-3.3416-3.2547-2.2762 0-3.6123 1.7073-3.6123 3.4717 0 .6876.2649 1.425.5953 1.8257.0654.0792.075.1486.0555.2294-.0607.2528-.1957.7961-.2222.9073-.0349.1465-.116.1775-.2675.107-.9992-.4651-1.6239-1.9259-1.6239-3.0992 0-2.5236 1.8336-4.8411 5.286-4.8411 2.7751 0 4.9318 1.9775 4.9318 4.6204 0 2.7571-1.7384 4.976-4.1513 4.976-.8106 0-1.5728-.4212-1.8336-.9187 0 0-.4011 1.5275-.4984 1.9018-.1806.6949-.6682 1.5659-.9943 2.0972A7.995 7.995 0 0 0 8 16c4.4183 0 8-3.5817 8-8s-3.5817-8-8-8Z"/></g><defs><clipPath id="a"><path fill="#fff" d="M0 0h16v16H0z"/></clipPath></defs></svg>
                <h6 class="my-0" style="font-size: 0.9rem;">Pinterest</h6>
            </div>
        </b-dropdown-item>
        <b-dropdown-item v-if="allowedOptions.includes('wp')" @click.prevent="shareWhatsApp">
            <div class="d-flex align-items-start">
                <svg class="mr-2" xmlns="http://www.w3.org/2000/svg" xml:space="preserve" width="16" height="16" viewBox="0 0 512 512"><path d="m0 512 35.31-128C12.359 344.276 0 300.138 0 254.234 0 114.759 114.759 0 255.117 0S512 114.759 512 254.234 395.476 512 255.117 512c-44.138 0-86.51-14.124-124.469-35.31L0 512z" style="fill:#ededed"/><path d="m137.71 430.786 7.945 4.414c32.662 20.303 70.621 32.662 110.345 32.662 115.641 0 211.862-96.221 211.862-213.628S371.641 44.138 255.117 44.138 44.138 137.71 44.138 254.234c0 40.607 11.476 80.331 32.662 113.876l5.297 7.945-20.303 74.152 75.916-19.421z" style="fill:#55cd6c"/><path d="m187.145 135.945-16.772-.883c-5.297 0-10.593 1.766-14.124 5.297-7.945 7.062-21.186 20.303-24.717 37.959-6.179 26.483 3.531 58.262 26.483 90.041s67.09 82.979 144.772 105.048c24.717 7.062 44.138 2.648 60.028-7.062 12.359-7.945 20.303-20.303 22.952-33.545l2.648-12.359c.883-3.531-.883-7.945-4.414-9.71l-55.614-25.6c-3.531-1.766-7.945-.883-10.593 2.648l-22.069 28.248c-1.766 1.766-4.414 2.648-7.062 1.766-15.007-5.297-65.324-26.483-92.69-79.448-.883-2.648-.883-5.297.883-7.062l21.186-23.834c1.766-2.648 2.648-6.179 1.766-8.828l-25.6-57.379c-.884-2.649-3.532-5.297-7.063-5.297" style="fill:#fefefe"/></svg>
                <h6 class="my-0" style="font-size: 0.9rem;">WhatsApp</h6>
            </div>
        </b-dropdown-item>
        <b-dropdown-item v-if="allowedOptions.includes('x')" @click.prevent="shareX">
            <div class="d-flex align-items-start">
                <svg class="mr-2" xmlns="http://www.w3.org/2000/svg" xml:space="preserve" width="16" height="16" style="enable-background:new 0 0 1668.56 1221.19" viewBox="406.4 195.05 867.02 867.02"><path d="M1168.12 1056.56h-656.4c-55.12 0-99.8-44.68-99.8-99.8v-656.4c0-55.12 44.68-99.8 99.8-99.8h656.39c55.12 0 99.8 44.68 99.8 99.8v656.39c.01 55.13-44.67 99.81-99.79 99.81z" style="stroke:#fff;stroke-miterlimit:10"/><path d="M491.03 374.75 721.1 682.38 489.58 932.49h52.11l202.7-218.98 163.77 218.98h177.32L842.46 607.56l215.5-232.81h-52.11L819.18 576.42 668.35 374.75H491.03zm76.63 38.39h81.46l359.72 480.97h-81.46L567.66 413.14z" style="fill:#fff" transform="translate(52.39 -25.0586)"/></svg>
                <h6 class="my-0" style="font-size: 0.9rem;">X (Twitter)</h6>
            </div>
        </b-dropdown-item>
        <b-dropdown-item v-if="allowedOptions.includes('cl')" @click.prevent="copyLinkToClipboard">
            <div class="d-flex align-items-start">
                <svg class="mr-2" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none"><g stroke="#000" stroke-linecap="round" stroke-miterlimit="10" stroke-width="1.5" clip-path="url(#a)"><path d="M7.3332 4.0006 9.05 2.2839a3.3407 3.3407 0 0 1 4.6667 0 3.3407 3.3407 0 0 1 0 4.6667l-1.7167 1.7166M8.6666 12.0007 6.95 13.7173a3.3407 3.3407 0 0 1-4.6667 0 3.3407 3.3407 0 0 1 0-4.6667L4 7.334M5.3332 10.6673l5.3334-5.3333"/></g><defs><clipPath id="a"><path fill="#fff" d="M0 0h16v16H0z"/></clipPath></defs></svg>
                <h6 class="my-0" style="font-size: 0.9rem;">Copy Link</h6>
            </div>
        </b-dropdown-item>
    </b-dropdown>
</template>

<script>
export default {
    name: 'ShareDropdown',
    props: {
        productTitle: {
            required: true,
            type: String
        },
        productDescription: {
            required: true,
            type: String
        },
        productImage: {
            required: true,
            type: String
        },
    },
    data() {
        return {
            allowedOptions: [],
        };
    },
    computed: {
        isMobile() {
            return /Android|webOS|iPhone|iPad|IEMobile|Opera Mini/i.test(navigator.userAgent);
        },
        shareUrl() {
            return window.location.href;
        },
    },
    mounted() {
        this.getAvailableOptions();
    },
    methods: {
        getAvailableOptions() {
            this.allowedOptions = this.$store.state.businessDetails.social_share_opts == '[]' ? [] : this.$store.state.businessDetails.social_share_opts;
        },
        openSocialMediaLink(url) {
            if (this.isMobile) {
                window.location.href = url;
            } else {
                window.open(url, '_blank');
            }
        },
        shareFacebook() {
            const url = encodeURIComponent(this.shareUrl);
            const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
            this.openSocialMediaLink(facebookUrl);    
        },
/*         shareInstagram() {
            // instagram does not have desktop sharing apis
            const instagramUrl = `https://www.instagram.com/share?url=${encodeURIComponent(this.shareUrl)}&media=${encodeURIComponent(this.productImage)}&caption=${encodeURIComponent(this.productTitle + " - " + this.productDescription)}`;
            this.openSocialMediaLink(instagramUrl);
        }, */
        shareLinkedIn() {
            const url = encodeURIComponent(this.shareUrl);
            const title = encodeURIComponent(this.productTitle);
            const description = encodeURIComponent(this.productDescription);
            const linkedInUrl = `https://www.linkedin.com/shareArticle?url=${url}&title=${title}&summary=${description}`;
            this.openSocialMediaLink(linkedInUrl);
        },
        sharePinterest() {
            const url = encodeURIComponent(this.shareUrl);
            const title = encodeURIComponent(this.productTitle);
            const description = encodeURIComponent(this.productDescription);
            const image = encodeURIComponent(this.productImage);
            const pinterestUrl = `https://pinterest.com/pin/create/bookmarklet/?media=${image}&url=${url}&description=${description}&title=${title}`;
            this.openSocialMediaLink(pinterestUrl);
        },
        shareWhatsApp() {
            const text = encodeURIComponent(`${this.shareUrl}`);
            const whatsappUrl = `https://wa.me/?text=${text}`;
            this.openSocialMediaLink(whatsappUrl);
        },
        shareX() {
            const url = encodeURIComponent(this.shareUrl);
            const title = encodeURIComponent(this.productTitle);
            const xUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
            this.openSocialMediaLink(xUrl);
        },
        copyLinkToClipboard() {
            const clipboardText = `${this.shareUrl}`;

            const textarea = document.createElement('textarea');
            textarea.value = clipboardText;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);

            this.$swal({
                toast: true,
                position: 'top',
                type: 'success',
                html: `<div class="ml-2">Link copied to clipboard!</div>`,
                showConfirmButton: false,
                timer: 3000
            });
        },
    }
};
</script>