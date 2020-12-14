<template>

    <div id="app">
                <v-card style="padding:20px">
           
              <v-container>
                  <v-row>
                    <v-flex xs6 md6>
                        Tanggal Transaksi
                    </v-flex>
                    <v-flex xs6 md6>
                      <date-picker v-model="date" style="width:150px" range format="YYYY-MM-DD" placeholder="Tanggal"></date-picker>
                    </v-flex>
                  </v-row>
                   <v-row>
                    <v-flex xs6 md6>
                        Paket Voucher
                    </v-flex>
                    <v-flex xs6 md6>
                        <v-autocomplete
                            v-model="plan_name"
                            :items="plan_name_data"
                            color="blue"
                            hide-no-data
                            hide-selected
                            item-text="plan_name"
                            item-value="plan_name"
                            label="Pilih Paket Voucher"
                        ></v-autocomplete>
                    </v-flex>
                  </v-row>
                  <v-row>
                    <v-flex xs6 md6>
                        Nomor Transaksi
                    </v-flex>
                    <v-flex xs6 md6>
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
                    </v-flex>
                  </v-row>
                   <v-row>
                    <v-flex xs6 md6>
                        Lokasi
                    </v-flex>
                    <v-flex xs6 md6>
                        <v-autocomplete
                            v-model="lokasi_user"
                            :items="lokasi"
                            color="blue"
                            hide-no-data
                            hide-selected
                            item-text="lokasi"
                            item-value="lokasi"
                            label="Pilih Lokasi"
                        ></v-autocomplete>
                    </v-flex>
                  </v-row>
                  
                  <v-row>
                    <v-flex xs12 md12>
                         <v-btn depressed color="primary" style="width:100%" @click="do_search()">Cari</v-btn>
                    </v-flex>
                     <v-flex xs12 md12>
                       <div style="height:10px"></div>
                       </v-flex>
                    <v-flex xs12 md12>
                          <v-btn color="primary" style="width:100%" @click="print()">Cetak Voucher</v-btn>
                    </v-flex>
                      <v-flex xs12 md12>
                          <v-btn color="yellow" style="width:100%" @click="reset()">Semua Voucher</v-btn>
                    </v-flex>
                  
                  </v-row>
                 
              </v-container>
           
           
          </v-card>
      
    <v-alert type="success">
       Tips Mencetak Voucher <br>
      1. Pilih tanggal ( masukan tangal dari dan sampai kapan dengan klik langsung di tanggal) atau dikosongkan<br>
      2. Pilih Paket Voucher atau kosongkan<br>
      3. Pilih Nomor Transaksi (Harus dipilih)<br>
      4. Pilih tombol Cari (untuk melihat hasil Filter data)<br>
      5. Pilih Cetak Voucher<br>
      6. Pilih Tujuan/Destination Print (Save PDF untuk simpan file atau Printer yang terdaftar untuk langsung cetak) <br>
      7. Pilih settingan lebih/more setings untuk rubah ukuran kertas A4( selain A4 akan terpotong)<br>
      8. Pilih Save/simpan untuk simpan file atau Print/cetak untuk cetak ke printer<br>
    </v-alert>
        
      <v-app id="inspire">
      <div style="display:none">
        <div class="container" id="print" ref="printMe" >
           <v-flex xs12 md12>
              <div style="width: 21cm; padding: 20px; border-radius: 5px; background: white;text-align: center;padding-left: 70px;">
                <div v-for="(item, i) in data" :key="i" style="min-width: 110px;float: left; border: solid 1px;">
                  <div style="width: 170px;background-color: rgb(255, 255, 255);text-align: center;height: 30px;font-size: 12px;position: absolute;display: table;">{{ item.plan_name}} {{item.date}}</div>
                  <div v-if="cetak_harga =='Ya'" style="width: 187.5 px;text-align: center;height: 70px; padding-top: 30px;font-size: 12px;position: absolute;display: table;">RP. {{ item.price | thousand}}</div>
                  <img src="~assets/Voucher.png" width="175">
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
            <div class="text-center" v-if="loading">
            <v-progress-circular
              :size="50"
              color="primary"
              indeterminate
            ></v-progress-circular>
          </div>
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
import DatePicker from 'vue2-datepicker';
import 'vue2-datepicker/index.css';

export default {
   middleware: 'auth',
   async asyncData({store, error}) {   
    let data       = await axios.get('voucher_limit/' + localStorage.userId);
    let no_trans  = await axios.get('voucher_no_transaction/' + localStorage.userId);
    let plan_name_data  = await axios.get('voucher_plan_name/' + localStorage.userId);
    let lokasi  = await axios.get('user/lokasi/' + localStorage.userId);
      return {
        data:data.data.values,
        no_trans:no_trans.data.values,
        plan_name_data : plan_name_data.data.values,
        lokasi : lokasi.data.values
      }
       
    },
    
    
    data: function(){
        return {
          cetak_harga:localStorage.cetak_harga,
          lokasi_user:'',
           loading:false,
           date:null,
          plan_name:'',
          no_trans_id:'',
            snackbar:true,
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
             { text: 'Lokasi', value: 'lokasi' },
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
      reset(){
         this.loading = true;
          axios.get('voucher_done/'+ localStorage.userId)
            .then(res => {
                  this.data   = res.data.values; 
                   this.loading = false; 
                   this.date ="";
                   this.plan_name="";
                   this.plan_name="";
                this.no_trans_id="";
            }).catch(err => {
            console.log(err);
            })

      },
      do_search(){
        this.loading = true;
        var date1 = null;
        var date2 = null;
        if(this.date!==null){
          date1 = this.$moment(this.date[0]).format("YYYY-MM-DD");
          date2 =this.$moment(this.date[1]).format("YYYY-MM-DD");

        }
     
        var dat = {
          date1 : date1,
          date2 : date2,
          nomor_transaction : this.no_trans_id,
          plan_name : this.plan_name,
          user_id : localStorage.userId,
          lokasi_user: this.lokasi_user


        };
        
          axios.post('search_voucher',dat)
            .then(res => {
                  this.data   = res.data.values; 
                   this.loading = false;              
                
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
      DatePicker
      
    }
}
</script>



