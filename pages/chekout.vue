<template>

  <v-container
    id="dashboard"
    fluid
    tag="section"
  >
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
            <vue-numeric currency="Rp" separator="," v-model="count_sub_total" style="font-size: 30px;" disabled></vue-numeric>
        </v-card-text>
         <v-card-text>
          Silahkan Transfer Melalui <br>
          BANK BRI KCP PANGERAN JAYAKARTA JAYAKARTA
          <a href="#"> 117901000289301 </a>
          A/N PT INTECH ESA MANDIRI

        </v-card-text>
        

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="payment()"
          >
            Prosess
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
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
     <v-card>
        <v-card-title
          class="headline grey lighten-2"
          primary-title
        >
          Pesanan Anda
        </v-card-title>

        
       
     
         <v-card-text>
           <v-data-table
      :headers="headers"
      :items="cart"
      :page.sync="page"
      :items-per-page="itemsPerPage"
      hide-default-footer
      class="elevation-1"
      @page-count="pageCount = $event"
    >
    <template v-slot:item.actions="{ item }">
              
                <v-icon
                    small
                    @click="deleteItem(item)"
                >
                    mdi-delete
                </v-icon>
                </template>
    </v-data-table>
    <div class="text-center pt-2">
      <v-pagination v-model="page" :length="pageCount"></v-pagination>
     
    </div>
    <v-card-subtitle >
        Rp. {{count_sub_total | thousand}}

    </v-card-subtitle>
      <v-card-subtitle >
        Total Voucher {{total_qty}}

    </v-card-subtitle>

        </v-card-text>
        

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="dialog_payment()"
          >
            Lanjutkan
          </v-btn>
        </v-card-actions>
      </v-card>
</v-container>
</template>
<script>
import axios from '~/plugins/axios'
import axios_payment from '~/plugins/axios_payment'
import VueNumeric from 'vue-numeric'
  export default {
    name: 'DashboardDashboard',
   async asyncData({store, error}) {   
   
       
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
          { text: 'Actions', value: 'actions', sortable: false },
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
        count_sub_total:function(){
            var total   = (this.cart.reduce((acc, item) => acc + (item.subtotal * 1),0) ) ;
            this.sub_total = total;
            return total;

        },
         total_qty:function(){
            var total   = (this.cart.reduce((acc, item) => acc + (item.qty * 1),0) ) ;
            this.sub_total = total;
            return total;

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
     dialog_payment:function(){
         this.dialog = true;
     },
      deleteItem (item) {
        const index = this.cart.indexOf(item)
        confirm('Are you sure you want to delete this item?') && this.cart.splice(index, 1) ;
      },
     
  
     
       payment:function(){
          
        var header = {
          id_user   : localStorage.userId,
          zona      : localStorage.zona,
          qty       : this.total_qty,
          sub_total : this.count_sub_total,
          email     : localStorage.email
        };    
        var detail = this.cart;
       
        this.$store.dispatch('transaction_save', {header,detail}).then((res) => {
            
            if(res == 200){
                this.notif_color ='blue';
                this.notif_text ='Silahkan Upload Bukti Transfer !';
                this.snackbar = true;
                this.dialog = false;
                localStorage.removeItem("cart");
                 
            }
        })
            
        
      
        
            
            
      }
        
     
    },
    components: {
      VueNumeric
    }
  }
</script>
