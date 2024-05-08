<template>
	<div class="border-bottom border-gray" :class="{'fullscreen': isFullscreen}">
		<div class="froala-editor" :id="id"></div>
	</div>
</template>
<script>
	import 'froala-pages/css/froala_pages.css';
	import * as FroalaPages from 'froala-pages';
	import 'froala-pages/js/pages_design_blocks_pkgd';

	export default {
		name: 'FroalaEditor',
		data() {
			return {
				editor: null,
				isFullscreen: false
			};
		},
		props: {
			id: {
				required: true,
				default: null
			},
			html: {
				default: null
			},
			customHTML: {
				default: null,
				type: String
			}
		},
		mounted() {
			this.editor = new FroalaPages(this.id, {
				editorOptions: {
					key: 'MZC1rD2E4D4D3B15A9iAd1Te1YZNYAc1CUKUEQOHFVANUqB2C1E7A6E1F5G4A1B3C10==',
					imageUploadParam: 'image',
					imageUploadURL: 'https://api.ezadtv.com/about-us/upload?responseKey=link',
					imageUploadParams: {id: 'my_editor'},
					imageUploadMethod: 'POST',
					imageMaxSize: 5 * 1024 * 1024,
					imageAllowedTypes: ['jpeg', 'jpg', 'png'],
					events: {
						'image.beforeUpload': () => {},
						'image.uploaded': response => console.info('Image was uploaded to the server',response),
						'image.inserted': ($img, response) => console.warn('Image was inserted in the editor', $img, response),
						'image.replaced': ($img, response) => console.warn('Image was replaced in the editor', $img, response),
						'image.error': error => {
							if (error.code == 1)
								console.error('Bad link');
							else if (error.code == 2)
								console.error('No link in upload response');
							else if (error.code == 3)
								console.error('Error during image upload');
							else if (error.code == 4)
								console.error('Parsing response failed');
							else if (error.code == 5)
								console.error('Image too text-large');
							else if (error.code == 6)
								console.error('Invalid image type');
							else if (error.code == 7)
								console.error('Image can be uploaded only to same domain in IE 8 and IE 9');
						}
					}
				}
			});
			if(this.html) {
				this.editor.setJSON(this.html);
			} else if(this.customHTML) {
				this.editor.setCustomHTML(this.customHTML);
			}
		}
	};
</script>

<style scoped lang="scss">
	.fullscreen {
		position: fixed;
		width: 100%;
		height: 100vh;
		z-index: 100;
		bottom: 0;
		top: 0;
		left: 0;
		:deep(.fp-full-view) {
			height: 100% !important;
			> .fp-container {
				overflow: auto !important;
			}
		}
	}
	:deep(.froala-editor) {
		position: relative;
		display: flex;
		flex-direction: column;
		> .fp-container {
			width: 100%;
			order: 2;
		}
		.fp-page-toolbar {
			order: 1;
		}
		.fp-panel {
			height: auto;
			&.fp-visible {
				right: 0;
			}
		}
		.fp-drop-placeholder {
			position: absolute;
		}
		.fp-download-btn {
			background: var(--primary);
		}
		.fp-btn.fp-active {
			svg {
				fill: var(--primary);
			}
		}
	}
</style>
