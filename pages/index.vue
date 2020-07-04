<template>
  <v-container
    id="dashboard"
    fluid
    tag="section"
  >
    <v-row>
     

        <v-col
          v-for="(item, i) in data"
          :key="i"
          cols="12"
        >
          <v-card
            color="#952175"
            light
          >
            <div class="d-flex flex-no-wrap justify-space-between">
              <div>
                <v-card-title
                  class="headline"
                  v-text="item.name_plan"
                ></v-card-title>

                <v-card-subtitle v-text="item.burst_bw"></v-card-subtitle>
              </div>

              <v-avatar
                class="ma-3"
                size="125"
                tile
              >
                <v-img :src="item.src"></v-img>
              </v-avatar>
            </div>
            <v-btn @click="payment()" align="center" style="width:100%;color: #8c0000 !important;">Beli</v-btn>
          </v-card>
          </v-col>
     
    </v-row>
  </v-container>
</template>

<script>
import axios from '~/plugins/axios'
  export default {
    name: 'DashboardDashboard',
     middleware: 'auth',
   async asyncData({store, error}) {   
    let data       = await axios.get('/voucher/voucher_catagories');
    //let parse = JSON.parse(data.data.values); 
      return {
        //data:parse.rajaongkir.results,
        data:data.data.values
      }
       
    },

    data () {
      return {
         items: [
        {
          color: '#1F7087',
          src: "require('@/assets/1.jpg')",
          title: 'Voucher 1 jam',
          artist: 'Internet Durasi 1 Jam',
        },
        {
          color: '#952175',
          src: '@/assets/2.jpg',
          title: 'Voucher 3 Jam',
          artist: 'Internet Durasi 3 Jam',
        },

         {
          color: '#1f262e',
          src: '@/assets/2.jpg',
          title: 'Voucher 7 Jam',
          artist: 'Internet Durasi 7 Jam',
        },
      ],
       
      }
    },

    methods: {
       payment:function(){
            
              var transaction ={
                  first_name:'handri',
                  last_name:'putra',
                  amount:1000,
                  email:'handrisaeputra@gmail.com',
                  qty:1,
                  phone:'081808784785',
                  amount_shipping:1000,
                  courier:'Jne',
                  detail:[]
              }
              var dat = this.pay;
              
              axios.post('payment/',{dat})
              .then(res => {
                  snap.pay(res.data.values, {
                  // Optional
                  onSuccess: function(result){
                    
                  },
                  // Optional
                  onPending: function(result){
                      
                  },
                  // Optional
                  onError: function(result){
                    
                  }
                  });
                              
              }).catch(err => {
              console.log(err);
              });

            }
        
     
    },
  }
</script>
