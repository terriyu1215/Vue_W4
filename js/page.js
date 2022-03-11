import {createApp} from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.29/vue.esm-browser.prod.min.js';

import pagination from './pagination.js';

let productModal = '';
let delModal='';

const app = createApp({
    components:{
        pagination
    },
    data(){
        return{
            apiUrl:'https://vue3-course-api.hexschool.io/v2',
            apiPath:'yuyutest',
            products:[],
            isNew: false, //判斷要建立新商品，還是編輯舊的商品。
            tempProduct:{
                imagesUrl:[],
                },
            pagination: {}
            }
            
        },
    methods:{
        checkLogin(){ 
                const url = `${this.apiUrl}/api/user/check`
                axios.post(url)
                .then(res=>{
                  this.getProduct();
                })
                .catch(err=>{
                  alert(err.data.message);
                  window.location="login.html";
                })
        },
        getProduct(page = 1){
            const url = `${this.apiUrl}/api/${this.apiPath}/admin/products/?page=${page}`;
            axios.get(url)
                .then(res=>{
                    this.products = res.data.products;
                    this.pagination = res.data.pagination;
                })
                .catch(err=>{
                    alert(err.data.message);
                })
        },
        updateProduct(){
            let url = `${this.apiUrl}/api/${this.apiPath}/admin/product`;
            let httpMethod = 'post';
        
            //判斷要建立新商品，還是編輯舊的商品。
            if(!this.isNew){
                url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
                httpMethod = 'put';
            }

            axios[httpMethod](url,{data:this.tempProduct})
                .then(res=>{
                    alert(res.data.message);
                    productModal.hide();
                    this.getProduct();
                })
                .catch(err=>{
                    alert(err.data.message);
                })
        },
        delProduct(){
            const url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
            axios.delete(url)
                .then(res=>{
                    alert(res.data.message);
                    delModal.hide();
                    this.getProduct();
                })
                .catch(err=>{
                    alert(err.data.message);
                })
        },
        openModal(isNew, item){
            if(isNew === 'new'){
                this.tempProduct = { //清空
                    imagesUrl:[],
                };
                this.isNew = true; //新增
                productModal.show();
            }
            else if(isNew === 'edit'){
                this.tempProduct = {...item};
                this.isNew = false; //編輯
                productModal.show();
            }
            else if(isNew === 'delete'){
                this.tempProduct = {...item}; 
                delModal.show();	
            }
        }
    },
    mounted(){
        // 取得 Token
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)mylToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        axios.defaults.headers.common['Authorization'] = token;
        this.checkLogin();

        productModal = new bootstrap.Modal(document.getElementById('productModal'));
        delModal = new bootstrap.Modal(document.getElementById('delProductModal'));
    }
  });
  app.mount('#app');