<template>

    <div id="app">
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
      <v-app id="inspire">
        <v-card>
          <v-card-title>
            List Transaksi
            <v-spacer></v-spacer>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
            ></v-text-field>
          </v-card-title>
          <v-data-table
            :headers="headers"
            :items="data"
            :search="search"
          >
           <template v-slot:top>
                <v-toolbar flat color="white">
                    <v-divider
                    class="mx-4"
                    inset
                    vertical
                    ></v-divider>
                    <v-spacer></v-spacer>
                    <v-dialog v-model="dialog" max-width="500px">
                  
                    <v-card>
                        <v-card-title>
                        <span class="headline">{{ formTitle }}</span>
                        </v-card-title>

                        <v-card-text>
                        <v-container>
                            <v-row>                              
                               
                                <v-col cols="12">
                                    <v-img
                                        :src="editedItem.bukti_transfer"
                                        aspect-ratio="1"
                                        class="grey lighten-2"
                                        >
                                       
                                    </v-img>
                                </v-col>
                                 <v-col cols="12" >
                               
                                <v-autocomplete
                                        v-model="editedItem.status"
                                        :items="status"
                                       
                                        color="blue"
                                        hide-no-data
                                        hide-selected
                                        item-text="text"
                                        item-value="value"
                                        label="Status"
                                    ></v-autocomplete>
                            </v-col>
                            </v-row>
                        </v-container>
                        </v-card-text>

                        <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
                        <v-btn color="blue darken-1" text @click="save">Save</v-btn>
                        </v-card-actions>
                    </v-card>
                    </v-dialog>
                </v-toolbar>
                </template>
                <template v-slot:item.actions="{ item }">
                <v-icon
                    small
                    class="mr-2"
                    @click="editItem(item)"
                >
                    mdi-pencil
                </v-icon>
               
                </template>
                <template v-slot:no-data>
                <v-btn color="primary">Reset</v-btn>
            </template>
          </v-data-table>
        </v-card>
      </v-app>
    </div>
</template>



<script>
import {mapState} from 'vuex'
import axios from '~/plugins/axios'
import VueNumeric from 'vue-numeric'

export default {
   middleware: 'auth',
   async asyncData({store, error}) {   
    let data       = await axios.get('payment/' + localStorage.userId);
      return {
        data:data.data.values,
      }
       
    },
    
    
    data: function(){
        return {
          persen:false,
            dialog: false,
             editedIndex: -1,
             file: '',
             status:[
                 {text:'Approved', value:'APPROVED'},
                 {text:'Reject', value:'REJECT'},
                 {text:'Pre Order', value:'PO'},
             ],
             city:[],
            editedItem: {
                id:'',
               bukti_transfer:'',
               qty:'',
               nomor_transaction:'',
               id_user:'',
                
            },
            defaultItem: {
                id:'',
              bukti_transfer:'',
              qty:'',
              nomor_transaction:'',
              id_user:'',
            },
            multiLine: true,
            snackbar: false,
            notif_color:'',
            notif_text:'',
            

          search: '',
          headers: [
            {
              text: 'Nomor Transaksi',
              align: 'start',
              sortable: false,
              value: 'nomor_transaction',
            },
            { text: 'Harga Voucher', value: 'price' },
            { text: 'Jumlah', value: 'qty' },
             { text: 'Sub Total', value: 'sub_total' },
              { text: 'Status', value: 'status' },
            { text: 'Actions', value: 'actions', sortable: false },
            

          ],
         
           
        }
    },
    computed:{
        formTitle () {
        return this.editedIndex === -1 ? 'New' : 'Edit'
      },
       
    },
    watch:{
        dialog (val) {
        val || this.close()
      },

    },
    created(){
    },
    methods: {
     
        uploadfile(){
            this.file = this.$refs.image.files[0];
            let formData = new FormData();
            formData.append('file',  this.file);
            let headers = {
                 'content-type': 'multipart/form-data',
                 'Content-Type': 'application/json',
                };


            axios.post('upload_file',formData,{headers: headers})
            .then(res => {
                  this.editedItem.bukti_transfer = res.data[0].mediaSource;                
            }).catch(err => {
            console.log(err);
            })

        },
        editItem (item) {
        this.editedIndex = this.data.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },
   
      close () {
        this.dialog = false
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        }, 300)
      },
      save () {
        var item = this.editedItem;
        
           this.$store.dispatch('upload_bukti_transfer', {item}).then((res) => {
                
                if(res == 200){
                    // this.notif_color ='blue';
                    // this.notif_text ='Berhasil Upload bukti Transfer !';
                    // this.snackbar = true;
                    //  Object.assign(this.data[this.editedIndex], this.editedItem)
                    // GET JUMLAH VOUCHER max array
                    var qty = this.editedItem.qty;
                    var user_id = this.editedItem.user_id;
                    var nomor_transaction = this.editedItem.nomor_transaction;
                    // axios get table voucher where field buy == null limit 
                    // looping
                    //id transaction update buy_user = user_id where id_transaction = id_transaction
                    //looping insert to transaction detail by voucher
                }
            })
         
        
       
        
        this.close()
      },
    },
    components: {
      VueNumeric,
      
    }
}
</script>



