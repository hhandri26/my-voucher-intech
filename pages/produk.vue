<template>

  <v-container
    id="dashboard"
    fluid
    tag="section"
  >
   <v-snackbar
      v-model="snackbar"
      :multi-line="multiLine"
      
    >
      {{ notif_text }}
      <v-btn
        :color="notif_color"
        notif_text
        @click="snackbar = false"
      >
        Close
      </v-btn>
    </v-snackbar>

  <!-- pop up metode pembayaran -->
  <div class="text-center">
    <v-dialog
      v-model="dialog"
      width="500"
    >
      <template v-slot:activator="{ on, attrs }">
        
      </template>

      <v-card>
        <v-card-title
          class="headline grey lighten-2"
          primary-title
        >
          Jumlah
        </v-card-title>

        <v-card-text>
           <v-text-field v-model="data_cart.qty" type="text" label="Qty" append-outer-icon="add" @click:append-outer="increment" prepend-icon="remove" @click:prepend="decrement"></v-text-field>
                      
        </v-card-text>
       
        <v-card-text>
            <vue-numeric currency="Rp" separator="," v-model="total_price" style="font-size: 30px;" disabled></vue-numeric>
        </v-card-text>
       
        

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="addToCart()"
          >
            Tambahkan Ke Keranjang
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
  
    <v-row>
      
     

        <v-flex
          v-for="(item, i) in data"
          :key="i"
          xs12 md6
        >
          <v-card
            
            light
          >
            <div class="d-flex flex-no-wrap justify-space-between">
              <div>
                <v-card-title
                  class="headline"
                  v-text="item.name_plan"
                ></v-card-title>

                <v-card-subtitle style="font-size: 20px;background-color: #ffc302;width: 150px;border: 1px solid;border-radius: 10px;padding: 10px;">Rp. {{item.price | thousand}}</v-card-subtitle>
              </div>

              <v-avatar
                class="ma-3"
                size="125"
                tile
              >
                <v-img  :src="require('@/assets/Voucher.png')" ></v-img>
              </v-avatar>
            </div>
            <v-btn @click="method_payment(item)" align="center" style="width:100%;color: rgb(2, 49, 119) !important;">Beli</v-btn>
          </v-card>
          </v-flex>
     
    </v-row>
  </v-container>
</template>

<script>
import axios from '~/plugins/axios'
import axios_payment from '~/plugins/axios_payment'
import VueNumeric from 'vue-numeric'
  export default {
    name: 'DashboardDashboard',
   async asyncData({store, error}) {   
    let data       = await axios.get('/voucher/voucher_catagories/' + localStorage.zona);
      return {
        data:data.data.values
      }
       
    },

    data () {
      return {
         multiLine:'',
          snackbar:'',
          notif_text:'',
          notif_color:'',
         page: 1,
        pageCount: 0,
        itemsPerPage: 10,
         dialog: false,
         dialog_cart:false,
         cart:[],
          price :0,
          item:'',
          qty:0,
          subtotal:0,
          method_pay:[
            {id:'BT',text:'Permata Bank Virtual Account'}
          ],
          data_cart:{
            price:'',
            name_plan:'',
            bw_name:'',
            validity:'',
            validity_unit:'',
            qty:1,
            subtotal:0

          },
             headers: [
                { text: 'Nama Voucher', value: 'name_plan' },
          {
            text: 'Harga',
           
            value: 'price',
          },
         
          { text: 'Masa Berlaku', value: 'validity' },
          { text: 'Satuan', value: 'validity_unit' },
          { text: 'Jumlah', value: 'qty' },
        ],
       
      }
    },
    computed: {
      count_cart:function(){
            var count = 0;
            var cart =JSON.parse(localStorage.getItem("cart"));
            if(cart!==null){
                count = cart.length
            }
            return count;

        },
      total_price(){
        //var total = this.details.reduce((acc, elm) => acc + (elm.produk_qty * 1),0);
        //return total;
         this.data_cart.subtotal = this.data_cart.price * this.data_cart.qty;
         return this.data_cart.subtotal;

      },
    },
    mounted() {
        var cart = JSON.parse(localStorage.getItem("cart"));
        if(cart !== null){
           Object.entries(cart).forEach(([key, val]) => {
            var data= {
            price         :val.price,
            name_plan     :val.name_plan,
            bw_name       :val.bw_name,
            validity      :val.validity,
            validity_unit :val.validity_unit,
            qty           :val.qty,
            subtotal      :val.subtotal

        }
        this.cart.push(data);
          
           
        
            
        });

        }
        
       
    },

    methods: {
      show_cart:function(){
        this.dialog_cart = true;

      },
       addToCart:function(){
            if(this.data_cart.subtotal!==''){
               
                var existing = JSON.parse(localStorage.getItem("cart"));
                if(existing!== null){
                    var b=[{}];
                    b =JSON.parse(localStorage.getItem("cart")) || [];
                    b.push(this.data_cart);
                    localStorage.setItem("cart",JSON.stringify(b));

                }else{
                    localStorage.setItem("cart",JSON.stringify([this.data_cart]));

                }
                this.notif_color ='blue';
                this.notif_text ='Berhasil Menambahkan Item !';
                this.snackbar = true;

                this.data_cart.price='';
                this.data_cart.name_plan='';
                this.data_cart.bw_name='';
                this.data_cart.validity='';
                this.data_cart.validity_unit='';
                this.data_cart.qty=0;
                this.data_cart.subtotal=0;
                this.dialog = false;
                
              


            }
            

        },
    increment () {
      this.data_cart.qty = parseInt(this.data_cart.qty,10) + 1;
      this.data_cart.subtotal = this.data_cart.price * this.data_cart.qty;
    },
    decrement () {
      this.data_cart.qty = parseInt(this.data_cart.qty,10) - 1;
       this.data_cart.subtotal = this.data_cart.price * this.data_cart.qty;
    },
      method_payment:function(item){
        
       
        this.data_cart.price = item.price;
        this.data_cart.name_plan = item.name_plan;
        this.data_cart.bw_name = item.bw_name;
        this.data_cart.validity = item.validity;
        this.data_cart.validity_unit = item.validity_unit;
        this.data_cart.qty = 0;
        this.dialog = true;

      },
       payment:function(){
          var dat = {
          id_user : localStorage.userId,
          qty : this.data.qty,
          price : this.data.price,
        };    
       
        this.$store.dispatch('transaction_save', {dat}).then((res) => {
            
            if(res == 200){
                this.notif_color ='blue';
                this.notif_text ='Silahkan Upload Bukti Transfer !';
                this.snackbar = true;
                 axios.get('/voucher/voucher_catagories')
                  .then(res => {
                       this.data=res.data.values
                        
                    
                      
                  }).catch(err => {
                  console.log(err);
                  })
            }
        })
            
        
        this.data_cart.price='';
        this.data_cart.name_plan='';
        this.data_cart.bw_name='';
        this.data_cart.validity='';
        this.data_cart.validity_unit='';
        this.data_cart.qty=0;
        this.data_cart.subtotal=0;
        this.dialog = false;
            
            
      }
        
     
    },
    components: {
      VueNumeric
    }
  }
</script>
