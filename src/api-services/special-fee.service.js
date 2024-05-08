import Axios from 'axios';

const prefix = "admin/fees";
export default {
  getProductsWithFees(data) {
    let paramString = `page=${data.page}&limit=${data.limit}`;
    if( data.input ){
      paramString += `&search=${data.input}`;
    }
    return Axios.get(`${prefix}?${paramString}`);
  },
  getProductDetails(data) {
    return Axios.post(`${prefix}/get-product`, data);
  },
  addFee(data) {
    return Axios.post(`${prefix}/add`, data);
  },
  doUploadTaxProductsFile(data, self) {
    return Axios.post(`${prefix}/upload-file`, data,
      {
        headers: {
          'Content-Type': 'multipart/data-data'
        },
        onUploadProgress: function( progressEvent ) {
          self.file.uploadingPercentage = parseInt( Math.round( ( progressEvent.loaded / progressEvent.total ) * 100 ) );
        }.bind(this)
      });
  },
  exportToCsv(data) {
    return Axios.post(`${prefix}/export`, data);
  },
  deleteFee(data) {
    return Axios.post(`${prefix}/delete`, data);
  },
};