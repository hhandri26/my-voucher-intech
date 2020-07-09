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
           <v-text-field v-model="qty" type="number" label="Qty" append-outer-icon="add" @click:append-outer="increment" prepend-icon="remove" @click:prepend="decrement"></v-text-field>
                      
        </v-card-text>
       
        <v-card-text>
            <vue-numeric currency="Rp" separator="," v-model="subtotal" style="font-size: 30px;" disabled></vue-numeric>
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
            Lanjutkan
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
    <v-row>
     

        <v-col
          v-for="(item, i) in data"
          :key="i"
          cols="12"
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

                <v-card-subtitle v-text="'Rp. '+item.price"></v-card-subtitle>
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
          </v-col>
     
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
    let data       = await axios.get('/voucher/voucher_catagories');
      return {
        data:data.data.values
      }
       
    },

    data () {
      return {
         dialog: false,
          price :0,
          item:'',
          qty:0,
          subtotal:0,
          method_pay:[
            {id:'BT',text:'Permata Bank Virtual Account'}
          ]
       
      }
    },

    methods: {
       increment () {
      this.qty = parseInt(this.qty,10) + 1;
      this.subtotal = this.price * this.qty;
    },
    decrement () {
      this.qty = parseInt(this.qty,10) - 1;
       this.subtotal = this.price * this.qty;
    },
      method_payment:function(item){
       
        this.price = item.price;
        this.item = item.item;
        this.dialog = true;

      },
       payment:function(){
          var dat = {
          id_user : localStorage.userId,
          qty : this.qty,
          price : this.price,
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
            
        
       this.qty = 0;
       this.price = 0;
       this.subtotal = 0;
       this.dialog = false;
            
            
      }
        
     
    },
    components: {
      VueNumeric
    }
  }
</script>
