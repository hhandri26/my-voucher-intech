<template>

    <div id="app">
      <v-snackbar v-model="snackbar" :multi-line="multiLine">
        {{ notif_text }}
        <v-btn :color="notif_color" notif_text @click="snackbar = false">
          Close
        </v-btn>
      </v-snackbar>
      <v-dialog v-model="dialog2" width="700">
        <v-card>
          <v-card-title class="headline grey lighten-2" primary-title>Pesanan Anda</v-card-title>
          <v-card-text>
            <v-data-table
            :headers="headers2"
            :items="detail"
            :page.sync="page"
            :items-per-page="itemsPerPage"
            hide-default-footer
            class="elevation-1"
            @page-count="pageCount = $event"
            >
            </v-data-table>
            <div class="text-center pt-2">
              <v-pagination v-model="page" :length="pageCount"></v-pagination>
            </div>
          </v-card-text>
          <v-divider></v-divider>

        
        </v-card>
      </v-dialog>
      <v-app id="inspire">
        <v-card>
            <v-alert type="warning">
      Tips Upload Bukti Transfer <br>
1. Pilih Nomor Transaksi Topup voucher sesuai pembelian <br>
2. Status Transaksi awal transaksi "WAITING" <br>
3. Upload bukti transfer dengan klik Tombol upload  <br>
4. Pilih foto bukti transfer atau upload dari file dokumen yang di simpan <br>
5. Pastikan bukti Transfer sesuai, kemudian klik save <br>
6. Status transaksi berubah menjadi "UPLOAD" <br>
7. Prosess approval selama +- 10 menit <br>
8. transaksi yang sudah berhasil berubah statusnya menjadi "APPROVED" <br>
    </v-alert>
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

                        <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
                        <v-btn v-if="editedItem.status !=='APPROVED'"  color="blue darken-1" text @click="save">Save</v-btn>
                        </v-card-actions>

                        <v-card-text>
                        <v-container>
                            <v-row>                              
                                <v-col cols="12">
                                    <input ref="image" class="hide-input" type="file" accept="image/*"  @change="uploadfile">
                                </v-col>
                                <v-col cols="12">
                                    <v-img
                                        :src="editedItem.bukti_transfer"
                                        aspect-ratio="1"
                                        class="grey lighten-2"
                                        width="300"
                                        >
                                       
                                    </v-img>
                                </v-col>
                            </v-row>
                        </v-container>
                        </v-card-text>

                        
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
                   mdi-upload
                </v-icon>
                 <v-icon
                    small
                    class="mr-2"
                    @click="show(item)"
                >
                    mdi-eye
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
            dialog2:false,
             editedIndex: -1,
              page: 1,
        pageCount: 0,
        itemsPerPage: 10,
             file: '',
             status:'',
             city:[],
             detail:[],
            editedItem: {
                id:'',
               bukti_transfer:'',
               nomor_transaction:'',
                harga:'',
                status:'',
                username:'',
                lokasi:'',
                
            },
            defaultItem: {
                id:'',
              bukti_transfer:'',
              nomor_transaction:'',
              harga:'',
              status:'',
              username:'',
              lokasi:'',
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
            { text: 'Jumlah', value: 'qty' },
             { text: 'Sub Total', value: 'harga' },
              { text: 'Status', value: 'status' },
              { text: 'Lokasi', value: 'lokasi' },
               { text: 'Tanggal', value: 'date' },
             { text: 'Waktu', value: 'time' },
            { text: 'Actions', value: 'actions', sortable: false },
            

          ],
           headers2: [
            {
              text: 'Nomor Transaksi',
              align: 'start',
              sortable: false,
              value: 'plan_name',
            },
            { text: 'Harga Voucher', value: 'price' },
            { text: 'Jumlah', value: 'qty' },
             { text: 'Sub Total', value: 'sub_total' },
            

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
      show(item){

       this.dialog2 = true;  
       console.log(this.dialog2);
          axios.get('payment/detail/'+item.nomor_transaction)
            .then(res => {
              
                this.detail = res.data.values;   
                       
            }).catch(err => {
            console.log(err);
            })

      },
     
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
        this.editedItem.username = localStorage.username;
        var item = this.editedItem;
        
           this.$store.dispatch('upload_bukti_transfer', {item}).then((res) => {
                
                if(res == 200){
                   var dat1={                               
                      message: 'Approve top up voucher reseller '+ item.username +' dengan nomor Transkasi '+item.nomor_transaction +' Senilai Rp.'+item.harga +' Lokasi '+item.lokasi,
                      phone:'628118498896'
                    };
                    axios.post('http://45.130.229.242:3030/whatsapp/sendmessage/',dat1)
                    .then(res => {
                                      
                    }).catch(err => {
                    console.log(err);
                    })

                    this.notif_color ='blue';
                    this.notif_text ='Berhasil Upload bukti Transfer !';
                    this.snackbar = true;
                    axios.get('payment/' + localStorage.userId)
                          .then(res5 => {
                                this.data   = res5.data.values;               
                              
                          }).catch(err => {
                          console.log(err);
                          })
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



