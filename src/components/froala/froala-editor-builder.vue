<template>
  <div class="position-relative widget-builder w">
    <div class="handle">
      <svg width="9" height="15" xmlns="http://www.w3.org/2000/svg"><path d="M3 12v3H0v-3h3zm6 0v3H6v-3h3zM3 6v3H0V6h3zm6 0v3H6V6h3zM3 0v3H0V0h3zm6 0v3H6V0h3z" fill="#BCBCBC" fill-rule="evenodd"/></svg>
    </div>
		<div class="widget">
			<div class="d-flex justify-content-between align-items-start mb-2">
				<div class="flex-grow-1 d-flex align-items-start justify-content-center justify-content-sm-start text-center text-sm-left">
					<h4>Froala Editor</h4>
					<div class="edit-buttons ml-3">
						<a href="#" class="remove-bt" @click.prevent="remove" aria-label="Remove">
							<svg width="14" height="16" xmlns="http://www.w3.org/2000/svg"><g transform="translate(-8 -7)" fill-rule="nonzero" fill="none"><circle fill="#E2E2E3" cx="15" cy="15" r="15"/><path d="M21 13v8c0 1.1-.9 2-2 2h-8c-1.1 0-2-.9-2-2v-8h12zm-3-6c.6 0 1 .4 1 1v2h3v2H8v-2h3V8c0-.6.4-1 1-1zm-1 2h-4v1h4V9z" fill="#90939A"/></g></svg>
						</a>
					</div>
				</div>
				<button @click="onEdit" class="btn btn-primary p-0">
				  <router-link class="text-white text-decoration-none w-100 h-100 d-block px-4 d-flex align-items-center" :to="`/admin/page-editor/widget/${id}?redirect=${$route.path}`" :disabled="saving">Edit</router-link>
        </button>
			</div>
			<!--<froala-editor ref="froalaEditor" :id="`froala-editor-${id}`" :html="value" />-->
			<template v-if="value">
				<html-wrapper :value="value" />
			</template>

			<div v-else>
				<div class="display-3"><small class="font-weight-light">There are no contents yet.</small></div>
				<div class="display-4"><small><small class="font-weight-light">Please, click on Edit Page button to add some content.</small></small></div>
			</div>
		</div>
	</div>
</template>
<script>
	import widgetsApiService from '@/api-services/widgets.service';

	export default {
		name: 'FroalaEditorBuilder',
		data() {
			return {
				editor: null,
				saving: false
			};
		},
		props: {
			id: {
				required: true,
				default: null
			},
			value: {
				default: null
			}
		},
		methods: {
			remove() {
				this.$swal({
					title: 'Remove Froala Editor Widget',
					html: `Are you sure you want to remove the Froala Editor Widget?`,
					type: 'warning',
					showCancelButton: true,
					confirmButtonText: 'Yes'
				}).then((result) => {
					if(result.value) {
						this.$emit('remove', this.id);
					}
				});
			},
			async updateWidget() {
				this.saving = true;
				let value = await this.$refs.froalaEditor.editor.getJSON();
				let ob = {
					id: this.id,
					value: value
				};
				this.$store.commit('updateWidget', ob);
				setTimeout(() => window.dispatchEvent(new Event('resize')), 200);
				await widgetsApiService.update(ob);
				this.saving = false;
			},
      onEdit() {
        this.$emit('onEdit');
      }
		}
	};
</script>
