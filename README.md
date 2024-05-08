
<h1>Hello Programmer </h1>

This is our EZ-Commerce barebones project. This introductory project is set up to test your abilities to set up a local envirmonent.

<h1>Steps to Consider</h1>

1. npm install && npm run serve (if npm doesn't work, try yarn).
2. Create a `GlobalSettings.js` file in the src folder
3. populate the content of the file with the following:

```
const globalSettings = 'settings-steveland.json';
export default globalSettings;
```

<small>_Note that the *.json file corresponds to a json file from the public folder, each one of these jsons represents a different site with different configs._</small>

<h1>Developer Tests</h1>

**Important**

Make sure you create a branch that you will push all of your code to. The branch should be named: `[your_name]_[month]_[year]` 
*Example: `john_june_2021`*

<h2>Test Project 1 <small>(easy)</small></h2>

**Task Name**
Customer Emails & Customers Page

**Design Files**
<small>https://storage.googleapis.com/content.ezadtv.com/2021/06/10/60c236b88102c_ScreenShot2021-06-10at11.58.43AM.png</small>
<small>https://storage.googleapis.com/content.ezadtv.com/2021/06/10/60c236cb8f9ea_ScreenShot2021-06-10at11.59.01AM.png</small>

**Description**
Log into the admin portion of the site using the following credentials

```
Username: steven@ezadtv.com
Password: testtest
```

Create One file that requires the user to be logged into the admin portion of the site to view. The path for this page should be in /admin/emails/ The file will contains two tabs on top. The subscribers tab will be a simple table view of the data from the API, and allow the user to export the data in an excel format.

Be sure to include pagination! The customers API will be similar to the subscribers tab, with the added functionality of assigning a customer to the A/R Account. Create a navigation item on top for users to click to navigate to this page.

---

**API Endpoints:**

<h3>Get Subscribers List</h3>

**HTTP Request**
GET `subscribers`

**Query params**
|Parameter|Type|Description|
|--|--|--|
|access_token|String|Admin token (auto generated) _Required_|
|page|Number|Page number for pagination|
|limit|Number|Limit the number of subscribers in the response|
|order_by_column|"id" &#124; "email &#124; "created_at" &#124; "name" |Column to sort by|
|order_by|"asc" &#124; "desc"|Sort direction|

**Response example**
```
{
  "status": "success",
  "message": "Subscribers List",
  "data": {
    "data": [
      {
        "id": 1580,
        "email": "bob@ezadtv.com",
        "created_at": "2020-09-22 07:11:33",
        "name": null
        },
        ...
```

---

<h3>Get Customers</h3>

**HTTP Request**
GET `admin/customers`

**Query params**
|Parameter|Type|Description|
|--|--|--|
|access_token|String|Admin token (auto generated) _Required_|
|page|Number|Page number for pagination|
|limit|Number|Limit the number of subscribers in the response|
|order_by_column| "account_num" &#124; "custom_info" &#124; "tvr_number" &#124; "date_added" &#124; "email" &#124; "first_name" &#124; "id" &#124; "last_name" &#124; "telephone" |Column to sort by|
|order_by|"asc" &#124; "desc"|Sort direction|

**Response example**
```
{
  additionalColumns: [],
  message: "Customer List",
  status: "success",
  data: {
    current_page: 1,
    first_page_url: "https://api.ezadtv.com/admin/customers?page=1",
    from: 1,
    last_page: 2,
    last_page_url: "https://api.ezadtv.com/admin/customers?page=2",
    next_page_url: "https://api.ezadtv.com/admin/customers?page=2",
    path: "https://api.ezadtv.com/admin/customers",
    per_page: "10",
    prev_page_url: null,
    to: 10,
    total: 17,
    data: [
      {
        account_num: null
        custom_info: { tvr_number: "5110002096" }
        tvr_number: "5110002096"
        date_added: "2021-04-12 17:38:46"
        email: "steven+tvr2@crindigo.com"
        first_name: "Steven"
        id: 69248
        last_name: "Tvrtest2"
        telephone: "5555551414"
      },
      ...
```

---

<h3>Assign AR Account</h3>

**HTTP Request**
POST `admin/orders/assign-ar-account`

**Query params**
|Parameter|Type|Description|
|--|--|--|
|customerId|Number|Customer id _Required_|
|accountId|Number|Account id _Required_|

---

<h2>Test Project 2 <small>(easy)</small></h2>

**Task Name**
Hours Of Operation

**Design Files**
<small>https://storage.googleapis.com/content.ezadtv.com/2021/06/10/60c255cfaf535_ScreenShot2021-06-10at2.11.22PM.png</small>

**Description**
Log into the admin portion of the site using the following credentials

```
Username: steven@ezadtv.com
Password: testtest
```

Update the existing LOCATIONS file and add user inputs to allow for stores to set their hours of operation.They should have a way of setting the hours to a closed "state". If they are open then the input fields should have a time selector for them.

---

**API Endpoints:**

<h3>Save About Us page contents </h3>

**HTTP Request**
POST `about-us/save`

**Query params**
|Parameter|Type|Description|
|--|--|--|
|description|String|Description for About us page|
|froala|Boolean|If we're using the Froala editor|
|froala_data|String|Data of the Froala editor|
|Locations|Array|Array with **Location** Objects|

**Location Object example**
```
address: "123 Street Address"
city: "City"
email: "info@allendaletruevalue.com"
hours: [
  mon: { open: "07:00 AM", close: "07:00 PM", closed: false }
  tue: { open: "07:00 AM", close: "07:00 PM", closed: false }
  wed: { open: "07:00 AM", close: "07:00 PM", closed: false }
  thu: { open: "07:00 AM", close: "07:00 PM", closed: false }
  fri: { open: "07:00 AM", close: "07:00 PM", closed: false }
  sat: { open: "08:00 AM", close: "05:30 PM", closed: false }
  sun: { open: "10:00 AM", close: "05:00 PM", closed: true }
]
name: "Location 1"
phone: "111-123-4567"
state: "CA"
zip: "12345"
```

**Response example**

```
{
  "status":"ok"
}
```

---

<h2>Test Project 3 <small>(medium)</small></h2>

**Task Name** 
Modified products List

**Design Files**
<small>https://storage.googleapis.com/content.ezadtv.com/2021/06/10/60c26622d1819_ScreenShot2021-06-10at3.21.02PM.png</small>

**Description**
Log into the admin portion of the site using the following credentials
```
Username: steven@ezadtv.com
Password: testtest
```

Update the existing PRODUCT EDITOR file and add a table view for the store to be able to see all of the products that they have modified using the product editor. Allow the stores to filer the products based on the value that was updated as well as the product sku/title. Any time you click on a row in this table, it should automatically redirect you to the product editor for that particular SKU. This table will require pagination.

---

**API Endpoints**

<h3>Get edited products List</h3>

**HTTP Request**
GET `product-editor/list`

**Query params**
|Parameter|Type|Description|
|--|--|--|
|page|Number|Page number|
|search|String|Search query for filtering|
|filter|"hidden" &#124; "price" &#124; "promo_price" &#124; "title"|Leave it empty for all products|

**Response example**

```
{
  message: "",
  status: "success",
  data: {
    total: 23
    totalPages: 1,
    products: [
      {
        c_hidden: 0,
        c_image_url: 0,
        c_price: 1,
        c_promo_price: 0,
        c_title: 1,
        date_first_customized: "2021-04-28 10:29:53",
        date_last_customized: "2021-05-10 09:00:13",
        image_url: "https://storage.googleapis.com/content.ezadtv.com/truevalue-images/299412_000_001.png",
        price: "2.11",
        promo_price: null,
        sku: "008236033489",
        title: "#12 x 3/4-Inch Phillips Pan-Head Wood Screws, 10-Packs",
        upc: "008236033489"
      }
      ...
```
---

<h2>Test Project 4 <small>(medium)</small></h2>

**Task Name**
Filtering Orders Table & Download History CSV

**Design Files**
<small>https://storage.googleapis.com/content.ezadtv.com/2021/06/10/60c26f134a514_ScreenShot2021-06-10at3.59.11PM.png</small>

**Description**
Log into the admin portion of the site using the following credentials
```
Username: steven@ezadtv.com
Password: testtest
```
Update the existing ORDERS file so that stores have options to filter table rows based on the order type.

The available order types are `['pickup', 'delivery', 'shipping', 'special']`.

You will also need to include a button that allows them to export the data in CSV file format.

---

**API Endpoints**

<h3>Get the completed order history</h3>

**HTTP Request**
GET `admin/orders/completed/history`

**Query params**
No params

**Response example**

```
status: "success"
count:  63
message:  ""
parcels:  [
  {
    id: 27847,
    ar_account_num: null,
    business_address: "123 Street Address",
    business_city: "City",
    business_id: 1,
    business_name: "Location 1",
    business_state: "CA",
    business_zipcode: "12345",
    contractor: null,
    customer_id: 62390,
    date_purchased: "2020-08-05 13:06:53",
    email: "belbron@ezadtv.com",
    first_name: "Belbron",
    issued_at: "6 months ago",
    issued_first: "Master",
    issued_last: "Account",
    last_name: "Emanoel",
    location_id: 1,
    order_id: 8322836,
    order_type: "pickup",
    original_parcel_type: "pickup",
    parcel_type: "pickup",
    store_number: "272",
    total: "3.37",
    items: [
    {
	  id: 59685,
	  image_url: "https://storage.googleapis.com/products.ezadtv.com/2314/49626.jpeg",
	  line_price: "3.18",
	  product_id: 302,
	  quantity: 2,
	  title: "Hillman 3/8 in. L Galvanized Steel Wood Joiner Flat Shank 6 pk"
    },
    ...
```

---

<h3>Get outstanding orders</h3>

**HTTP Request**
GET `admin/orders/outstanding`

**Query params**
|Parameter|Type|Description|
|--|--|--|
|page|Number|Page number|
|perPage|Number|Number of results per page|
|types|"pickup,delivery,shipping,special,doitbest"|Imploded value of types|
|locations|Number|Specific location id|
|filter|String|Search query|

**Response example**
```
{
"status": "success",
"message": "",
"count": 63,
"parcels": [
  {
  "id": 27847,
  "issued_first": "Master",
  "issued_last": "Account",
  "issued_at": "6 months ago",
  "business_id": 1,
  "order_type": "pickup",
  "location_id": 1,
  "order_id": 8322836,
  "parcel_type": "pickup",
  "total": "3.37",
  "customer_id": 62390,
  "date_purchased": "2020-08-05 13:06:53",
  "first_name": "Belbron",
  "last_name": "Emanoel",
  "email": "belbron@ezadtv.com",
  "business_address": "123 Street Address",
  "business_city": "City",
  "business_state": "CA",
  "business_zipcode": "12345",
  "business_name": "Location 1",
  "store_number": "272",
  "contractor": null,
  "ar_account_num": null,
  "original_parcel_type": "pickup"
  "items": [
  {
    "id": 59685,
    "product_id": 302,
    "quantity": 2,
    "line_price": "3.18",
    "title": "Hillman 3/8 in. L Galvanized Steel Wood Joiner Flat Shank 6 pk"
    "image_url": "https://storage.googleapis.com/products.ezadtv.com/2314/49626.jpeg"
    },
  ...
```


---
<h2>Test Project 5 <small>(medium)</small></h2>

**Task Name**
Featured Products

**Design Files**
^https://storage.googleapis.com/content.ezadtv.com/2021/06/11/60c36c3da224a_ScreenShot2021-06-11at9.59.20AM.png^
^https://storage.googleapis.com/content.ezadtv.com/2021/06/11/60c36c5a9c644_ScreenShot2021-06-11at9.59.50AM.png^

**Description**
Log into the admin portion of the site using the following credentials
```
Username: steven@ezadtv.com
Password: testtest
```
Update the existing FEATURED PRODUCTS file so that stores have options to add additional featured products. You will need to create a

button on the top right that will trigger a pop up, inside of that pop up you will want to have them type in a SKU for a particular product. Once they search for a product and a VALID response is received, you will want to show the product information and

display the available stores they can add this product to. The store list may contain 1, or multiple locations. Once they have selected the appropriate stores, they click add to add the product.

---

**API Endpoints**
<h3>Search in Favorite Products</h3>

**HTTP Request**
POST `admin/favourite-products/search`

**Query params**
|Parameter|Type|Description|
|--|--|--|
|upc|Number|Item UPC code|

**Response example**
```
{
  "status": "success",
  "message": "Product Details",
  "found": true,
  "selected": []
  "product": {
    "upc": "008236033687",
    "upc_id": 49332,
    "sku": "008236033687",
    "title": "Hillman 8 Sizes x 1 in. L Phillips Flat Head Zinc-Plated Steel Sheet Metal Screws 15 pk",
    "image_url": "https://storage.googleapis.com/content.ezadtv.com/acenet-images/ace_5105036.jpg",
    "num_inventory": 5,
    "hidden": 0
  },
  "stores": [
    {
      "business_id": 1,
      "business_name": "Location 1"
    }
  ],
  "pstores": [
    {
      "business_id": 1,
      "business_name": "Location 1"
    }
  ],
}
```