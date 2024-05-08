<template>
    <b-modal size="xl" class="modal-box" ref="productImageModal" title="Replace Image(s)">
        <div class="d-flex justify-content-between">
            <b-tabs content-class="mt-3">
                <b-tab title="Upload Image" active>
                    <div class="row">
                        <div class="col-sm-6">
                            <img v-if="newImage" :src="newImage" class="image-preview" alt="New Image Preview" />
                            <img v-else class="image-preview" alt="New Image Preview" src="https://storage.googleapis.com/content.ezadtv.com/2021/01/24/600d9a1dc5057_image-placeholder.jpg" />
                        </div>

                        <div class="col-sm-6">
                            <label>Adding Missing Image For</label>
                            <div class="product-list mt-2">
                                <div class="row ml-2 p-1" v-for="(product, index) in selectedProductTitles" :key="index">
                                    {{ product.title }}
                                </div>
                            </div>

                            <div class="form-group row mt-2">
                                <label for="imageUpload">Upload Image</label>
                                <button class="btn upload-btn" @click="$refs.fileUploader.click()" :disabled="imageLoading">
                                    <i v-if="imageLoading" class="fa fa-spin fa-spinner mr-2"></i>
                                    Select From Computer
                                </button>
                                <input type="file" ref="fileUploader" class="d-none" @change="uploadImage" accept="image/*" />
                            </div>

                            <div class="form-group row mt-2">
                                <label for="imageLink">Copy And Paste Image URL</label>
                                <input type="text" class="form-control " name="imageLink" v-model="newImage" @keyup="validateURL" @change="validateURL" placeholder="Image link (optional)" />
                            </div>
                        </div>
                    </div>
                </b-tab>

                <b-tab title="Use From Library">
                    <div class="row">
                        <div class="col-sm-12"> 
                            <h6 class="text-center">Library Images</h6>
                        </div>
                        <div class="col-sm-9 mb-4">
                            <input type="text" autocomplete="off" v-model="searchTerm" placeholder="Search Images" name="searchTerm" class="col-sm-4 form-control search-input" v-on:keyup.enter="searchLibrary" />                            
                        </div>
                        
                        <div class="col-sm-2 mb-4">
                            <v-pagination
                                v-if="libraryImages && libraryImages.last_page > 1"
                                v-model="currentPage"
                                :page-count="libraryImages.last_page"
                                :classes="bootstrapPaginationClasses"
                                :labels="paginationAnchorTexts"
                                @input="getLibraryImages"
                                style="margin: 0;"
                            />
                        </div>
                    </div>

                    <div class="row" v-if="libImagesLoading">
                        <spinner class="w-100" size="large" message="Loading..." />
                    </div>
                    <div class="row" v-else>
                        <div class="col-sm-3 select-image"
                            v-for="(image, index) in libraryImages.data" :key="index"
                            @click="selectFromLibrary(image.image_url)"
                            :class="{'selected-image': newImage == image.image_url}"
                        >
                            <div class="image-wrapper">
                                <img :src="image.image_url" class="product-image img-fluid" :alt="image.title" />
                            </div>
                            <span class="product-title"> {{ image.title }} </span>
                        </div>
                    </div>
                </b-tab>
            </b-tabs>
        </div>
        <div slot="modal-footer">
            <button type="button" class="btn btn-primary" :disabled="!newImage" @click="updateProductImage">
                <i v-if="saving" class="fa fa-spin fa-spinner mr-1"></i> 
                {{ saving ? 'Updating' : 'Update'}} All Images
            </button>
        </div>
    </b-modal>
</template>

<script>
import AdminService from '@/api-services/admin.service';
import Spinner from "vue-simple-spinner";
import debounce from 'debounce';
import { paginationConfig } from '@/config/modules';

export default {
    name: 'ProductImage',
    components: { Spinner },
    props: {
        selectedProducts: {
            type: Array,
        },
        selectedProductTitles: {
            type: Array,
        },
    },
    data () {
        return {
            ...paginationConfig,
            currentPage: 1,
            limit: 12,
            newImage: '',
            searchTerm: '',
            saving: false,
            imageLoading: false,
            libImagesLoading: true,
            libraryImages: [],
        };
    },
    watch: {
      searchTerm: debounce(function () {
        this.searchLibrary();
      }, 2000)
    },
    methods: {
        isUrl(val) {
            return this.$options.filters.isUrl(val);
        },
        validateURL() {
            if(this.newImage == '') {
                return;
            }

            const status = this.isUrl(this.newImage);
            if(status == false) {
                this.$swal("Please enter valid URL", '', 'error');
                this.newImage = '';
            }
        },
        searchLibrary() {
            this.currentPage = 1;
            this.getLibraryImages();
        },
        getLibraryImages() {
            this.libImagesLoading = true;
            AdminService.getLibraryImages(this.searchTerm, this.currentPage, this.limit).then(response => {
                this.libImagesLoading = false;
                this.libraryImages = response.data.images;
            });
        },
        selectFromLibrary(imageURL) {
            this.newImage = imageURL;
        },
        showModal() {
            this.newImage =  '';
            this.currentPage = 1;
            this.searchTerm =  '';
            this.saving = false;
            this.imageLoading = false;
            this.$refs.productImageModal.show();
            this.getLibraryImages();
        },
        uploadImage(evt) {
            if(!this.imageLoading) {
                let file = evt.dataTransfer ? evt.dataTransfer.files[0] : evt.target.files[0];
                let title = this.selectedProductTitles[0].title;
                this.imageLoading = true;
                
                AdminService.uploadImageToLibrary(file, title).then(response => {
                    this.imageLoading = false;
                    this.newImage = response.data.url;
                }).catch(() => {
                    this.imageLoading = false;
                    this.$swal('Error', 'Error while uploading image', 'error');
                });
            }
        },
        updateProductImage() {
            this.saving = true;
            const data = {
                products: this.selectedProducts,
                image: this.newImage,
                title: this.selectedProductTitles[0].title.toLowerCase(),
            };

            AdminService.updateProductImages(data).then(() => {
                this.saving = false;
                this.$emit("imagesUpdated");
                this.$refs.productImageModal.hide();
            }).catch(() => {
                this.saving = false;
                this.$swal('Error', 'Error while updating images', 'error');
            });
        }
    }
};
</script>

<style lang="scss" scoped>
label {
    font-weight: 500;
    font-size: 14px;
    width: 100%;
}
.selected-products {
    width: 400px;
    height: 166px;
    padding: 12px;
}
.image-wrapper {
    height: 180px;
    padding-bottom: 20px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
}
.product-image {
    display: block; 
    max-height: 100%;
}
.product-title {
    font-weight: 500;
    font-size: 14px;
    width: 100%;
    text-align: left;
}
.upload-btn {
    background: rgba(5, 112, 169, 0.08);
    border-radius: 6px;
    color: #0570A9;
    font-weight: bold;
}
.product-list {
    height: 250px;
    overflow-y: scroll;
}
.product-list-lib {
    height: 300px;
    overflow-y: scroll;
}
.tabs {
    width: 100%;
}
.select-image {
    cursor: pointer;
    padding: 5px;
}
.selected-image {
    border: 1px solid var(--primary);
    border-radius: 4px;
}
.image-preview {
    border: 1px solid #e2e2e7;
    border-radius: 3px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 450px;
}
.search-input {
    background-image: url('data:image/svg+xml;base64,Cjxzdmcgd2lkdGg9IjE0cHgiIGhlaWdodD0iMTRweCIgdmlld0JveD0iMCAwIDE0IDE0IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogICAgPGcgaWQ9IlN5bWJvbHMiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIG9wYWNpdHk9IjAuNSI+CiAgICAgICAgPGcgaWQ9IlNlYXJjaC1iYXIiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC01MzYuMDAwMDAwLCAtMTMuMDAwMDAwKSIgZmlsbD0iIzJGMzU0MCIgZmlsbC1ydWxlPSJub256ZXJvIj4KICAgICAgICAgICAgPGcgaWQ9IlNlYXJjaC1CYXIiPgogICAgICAgICAgICAgICAgPHBhdGggZD0iTTU0OC41MDgxMTQsMjYuNzQwNTQ4MSBDNTQ4Ljg0OTc5MSwyNy4wODY0ODQgNTQ5LjQwMjA2NiwyNy4wODY0ODQgNTQ5Ljc0Mzc0MywyNi43NDA1NDgxIEM1NTAuMDg1NDE5LDI2LjM5NDYxMjMgNTUwLjA4NTQxOSwyNS44MzQ5ODQ2IDU0OS43NDM3NDMsMjUuNDg5MDQ4NyBMNTQ3LjA0NzQ3NSwyMi43OTQzMTI3IEM1NDcuODEwMDMzLDIxLjc3MjI4MTEgNTQ4LjI2MTQ3MiwyMC41MDQ0NzE5IDU0OC4yNjE0NzIsMTkuMTMxMjE1MyBDNTQ4LjI2MTQ3MiwxNS43NDUwMzg2IDU0NS41MTY2NDgsMTMgNTQyLjEzMDczNiwxMyBDNTM4Ljc0NDgyNCwxMyA1MzYsMTUuNzQ1MDM4NiA1MzYsMTkuMTMxMjE1MyBDNTM2LDIyLjUxNzM5MiA1MzguNzQ0ODI0LDI1LjI2MjQzMDYgNTQyLjEzMDczNiwyNS4yNjI0MzA2IEM1NDMuNTA5MDUyLDI1LjI2MjQzMDYgNTQ0Ljc4MTEzMywyNC44MDc1NTMxIDU0NS44MDUwNzIsMjQuMDM5NzE4MiBMNTQ4LjUwODExNCwyNi43NDA1NDgxIFogTTUzNy43NTE2MzksMTkuMTMxMjE1MyBDNTM3Ljc1MTYzOSwxNi43MTI1MTc3IDUzOS43MTIyMjcsMTQuNzUxNzc1OCA1NDIuMTMwNzM2LDE0Ljc1MTc3NTggQzU0NC41NDkyNDQsMTQuNzUxNzc1OCA1NDYuNTA5ODMzLDE2LjcxMjUxNzcgNTQ2LjUwOTgzMywxOS4xMzEyMTUzIEM1NDYuNTA5ODMzLDIxLjU0OTkxMyA1NDQuNTQ5MjQ0LDIzLjUxMDY1NDggNTQyLjEzMDczNiwyMy41MTA2NTQ4IEM1MzkuNzEyMjI3LDIzLjUxMDY1NDggNTM3Ljc1MTYzOSwyMS41NDk5MTMgNTM3Ljc1MTYzOSwxOS4xMzEyMTUzIFoiIGlkPSJMb3VwZS1JY29uIj48L3BhdGg+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPgo=');
    background-repeat: no-repeat;
    background-position: right 14px center;
    max-width: 450px;
    font-size: 14px;
    padding-right: 32px !important;
    text-overflow: ellipsis;
}
</style>