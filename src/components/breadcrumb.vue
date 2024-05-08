<template>
  <ul class="breadcrumb__wrapper mb-0">
		<template v-if="$store.state.settings.layout === 'gerretsen'">
			<li>
				<a class="home-icon" :href="$store.state.settings.logoLink" aria-label="Home">
					<img src="/images/breadcrumb-home.svg" alt="Home">
				</a>
			</li>
			<li>
				<router-link v-if="breadcrumbs.length" to="/">
					Online Store
				</router-link>

				<span v-else>Online Store</span>
			</li>
		</template>
		<template v-else>
			<li>
				<router-link to="/"  aria-label="Home">
					<svg width="18px" height="15px" viewBox="0 0 18 15" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
						<g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
							<g id="Artboard" transform="translate(-77.000000, -64.000000)" fill="#004955">
								<path d="M86.0425152,67 L92.2323346,72.263 L92.2398489,72.29 L92.2398489,72.29 L92.243,72.329 L92.243,77.658 L92.2347469,77.770184 C92.212749,77.91572 92.1468173,78.045 92.0374484,78.157 L92.0374484,78.157 L91.9528774,78.233192 C91.835969,78.32356 91.7025543,78.369 91.5536263,78.369 L91.5536263,78.369 L87.4193234,78.369 L87.4193234,74.105 L84.6637678,74.105 L84.6637678,78.368 L80.5314041,78.368 L80.4222523,78.359592 C80.2808638,78.33716 80.1559815,78.2698 80.0466125,78.157 L80.0466125,78.157 L79.973312,78.069776 C79.8864373,77.9492 79.843,77.8116 79.843,77.658 L79.843,77.658 L79.843,72.329 L79.8439696,72.31475 L79.8439696,72.31475 L79.8478479,72.296 L79.8517262,72.2765 L79.8517262,72.2765 L79.8526958,72.263 L86.0425152,67 Z M86,64 L86.1602454,64.0081667 C86.4210556,64.0353889 86.6505,64.1306667 86.848,64.294 L86.848,64.294 L89.572,66.597 L89.572,64.395 L89.5783594,64.3196562 C89.5910625,64.24775 89.62275,64.18625 89.673,64.136 L89.673,64.136 L89.7266563,64.0915312 C89.78375,64.0535625 89.85125,64.035 89.93,64.035 L89.93,64.035 L92.074,64.035 L92.1485938,64.0412188 C92.21975,64.0536875 92.2805,64.085 92.33,64.136 L92.33,64.136 L92.3744688,64.1899687 C92.4124375,64.247625 92.431,64.31625 92.431,64.395 L92.431,64.395 L92.431,69.002 L94.876,71.057 L94.9253125,71.1063594 C94.9684375,71.159375 94.993,71.2235 94.999,71.3 L94.999,71.3 L94.998625,71.3734688 C94.991875,71.444625 94.966,71.50875 94.921,71.565 L94.921,71.565 L94.228,72.401 L94.1800469,72.4465313 C94.1284375,72.4873125 94.066,72.51375 93.994,72.525 L93.994,72.525 L93.96,72.525 L93.8912344,72.5201094 C93.82575,72.5103125 93.77025,72.48575 93.726,72.446 L93.726,72.446 L86,65.931 L78.274,72.446 L78.2070938,72.4847812 C78.1400625,72.5173125 78.07275,72.531 78.006,72.525 L78.006,72.525 L77.9368125,72.5087187 C77.8711875,72.4874375 77.81625,72.45125 77.772,72.401 L77.772,72.401 L77.08,71.565 L77.0409375,71.5061563 C77.0085,71.44475 76.99575,71.37575 77.001,71.3 L77.001,71.3 L77.0127656,71.2275781 C77.031,71.1591875 77.0685,71.10275 77.124,71.057 L77.124,71.057 L85.152,64.294 C85.39,64.098 85.673,64 86,64 L86,64 Z" id="breadcrumb-home"></path>
							</g>
						</g>
					</svg>
				</router-link>
			</li>
		</template>
    <li v-for="(breadcrumb, i) in breadcrumbs" :key="i" v-show="breadcrumb.text">
      <router-link :to="breadcrumb.path" v-if="i != breadcrumbs.length-1" v-text="breadcrumb.text"></router-link>
      <span v-else class="text-muted" v-text="breadcrumb.text"></span>
    </li>
  </ul>
</template>
<script>
	import BreadcrumbMonitor from "@/router/breadcrumb.middleware";
	export default {
		name: 'Breadcrumb',
		props: {
			product: {
				required: true,
				type: Object
			},
		},
		computed: {
			breadcrumbs() {
				return BreadcrumbMonitor.getBreadcrumbs(this.product);
			},
		}
	};
</script>
