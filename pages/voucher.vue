<template>

    <div id="app">
                <v-card>
            <v-row>
              <v-col cols="12" >
                 
                  <v-row>
                    <v-col cols="3">
                        Nomor Transaksi
                    </v-col>
                    <v-col cols="4">
                        <v-autocomplete
                            v-model="no_trans_id"
                            :items="no_trans"
                            color="blue"
                            hide-no-data
                            hide-selected
                            item-text="nomor_transaction"
                            item-value="nomor_transaction"
                            label="Pilih Nomor Transaksi"
                        ></v-autocomplete>
                    </v-col>
                  </v-row>
                  
                  <v-row>
                    <v-col cols="3">
                         <v-btn depressed small color="primary" @click="do_search()">Cari</v-btn>
                          <v-btn small color="primary" @click="print()">Cetak Voucher</v-btn>
                    </v-col>
                  
                  </v-row>
                 
              </v-col>
            </v-row>
           
          </v-card>
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
      <div style="display:none">
        <div class="container" id="print" ref="printMe" >
           <v-flex xs12 md12>
              <div style="width: 21cm; padding: 20px; margin: 1cm auto; border-radius: 5px; background: white;text-align: center;padding-left: 70px;">
                <div v-for="(item, i) in data" :key="i" style="min-width: 110px;float: left; border: solid 1px;">
                  <div style="width: 100%;background-color: #fff;text-align: center;height: 20px;font-size: 12px;">{{ item.plan_name.slice(14)}}</div>
                  <img src="~assets/Voucher.png" width="150">
                  <div style="width: 100%;background-color: #fff;text-align: center;height: 20px;font-size: 15px;">{{item.kode_voucher}}</div>

                </div>
              </div>
              
           </v-flex>
            
        </div>
      </div>
        <v-card>
        
          <v-card-title>
            List Voucher
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
                <v-btn color="primary">Empty</v-btn>
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
    let data       = await axios.get('voucher_done/' + localStorage.userId);
    let no_trans  = await axios.get('voucher_no_transaction/' + localStorage.userId);
      return {
        data:data.data.values,
        no_trans:no_trans.data.values
      }
       
    },
    
    
    data: function(){
        return {
          no_trans_id:'',
            snackbar:'',
          notif_text:'',
          notif_color:'',
          persen:false,
            dialog: false,
             editedIndex: -1,
             file: '',
             status:'',
             city:[],
            editedItem: {
                id:'',
               status:'',
                
            },
            defaultItem: {
                id:'',
              status:'',
            },
            multiLine: true,
            snackbar: false,
            notif_color:'',
            notif_text:'',
            status:[
                 {text:'Terjual', value:'DONE'},
             ],
            

          search: '',
          headers: [
            {
              text: 'Nomor Transaksi',
              align: 'start',
              sortable: false,
              value: 'nomor_transaction',
            },
            { text: 'Voucher Id', value: 'id_voucher' },
            { text: 'Nama Voucher', value: 'plan_name' },
            { text: 'Harga', value: 'harga' },
            { text: 'Tanggal', value: 'date' },
            { text: 'Waktu', value: 'time' },
            { text: 'Kode Voucher', value: 'kode_voucher' },
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
      do_search(){
        var id = this.no_trans_id;
        
          axios.get('search_voucher/' + this.no_trans_id)
            .then(res => {
                  this.data   = res.data.values;               
                
            }).catch(err => {
            console.log(err);
            })


      },
      print(){
          var mywindow = window.open('', 'PRINT', 'height=800,width=1200');

        mywindow.document.write('<html><head><title>' + document.title  + '</title>');
        mywindow.document.write('</head><body >');
        mywindow.document.write(document.getElementById("print").innerHTML);
        mywindow.document.write('</body></html>');

      

        mywindow.print();
       // mywindow.close();

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
        var item = this.editedItem;
        
           this.$store.dispatch('update_status_voucher', {item}).then((res) => {
                
                if(res == 200){
                    this.notif_color ='blue';
                    this.notif_text ='Status berhasil Di Ubah !';
                    this.snackbar = true;
                    //  Object.assign(this.data[this.editedIndex], this.editedItem)
                     axios.get('voucher_done/' + localStorage.userId)
                      .then(res => {
                            this.data   = res.data.values;
                        
                          
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



