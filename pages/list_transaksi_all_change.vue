<template>

    <div id="app">
            <v-card>
            <v-row>
              <v-col cols="12" >
                  <v-row>
                    <v-col cols="3">
                        Tanggal
                    </v-col>
                    <v-col cols="9">
                      <date-picker v-model="date" range format="YYYY-MM-DD" placeholder="Tanggal"></date-picker>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="3">
                        Reseller
                    </v-col>
                    <v-col cols="4">
                        <v-autocomplete
                            v-model="username"
                            :items="user"
                            color="blue"
                            hide-no-data
                            hide-selected
                            item-text="username"
                            item-value="id"
                            label="Pilih Reseller"
                        ></v-autocomplete>
                    </v-col>
                  </v-row>
                   
                   <v-row>
                    <v-col cols="3">
                        Status Transaksi
                    </v-col>
                    <v-col cols="4">
                        <v-autocomplete
                            v-model="stts"
                            :items="status2"
                            color="blue"
                            hide-no-data
                            hide-selected
                            item-text="text"
                            item-value="value"
                            label="Pilih Status"
                        ></v-autocomplete>
                    </v-col>
                  </v-row>
                  
                  <v-row>
                    <v-col cols="3">
                         <v-btn depressed small color="primary" @click="do_search()">Cari</v-btn>
                          <v-btn depressed small color="primary" @click="export_excel()">Export</v-btn>
                    </v-col>
                  </v-row>
                 
                  <v-row>
                    <v-col cols="12">
                         <v-btn depressed small color="primary" @click="selected_change()">Approve transaction</v-btn>
                        
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
          <v-card-subtitle style="font-size:20px;    background-color: blanchedalmond;" >
             Total Transaksi Penjualan

          </v-card-subtitle>
           <v-card-subtitle style="font-size:20px; background-color: blanchedalmond;" >
              Rp. {{total | thousand}}

          </v-card-subtitle>
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
             v-model="selected"
               :single-select="singleSelect"
              item-key="id"
              show-select
              class="elevation-1"
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
import DatePicker from 'vue2-datepicker';
import 'vue2-datepicker/index.css';

export default {
   middleware: 'auth',
   async asyncData({store, error}) {   
    let data       = await axios.get('payment_finance');
     let user       = await axios.get('users');
      let total       = await axios.get('transaction/count_total');
      return {
        data:data.data.values,
         user:user.data.values,
         total:total.data.values[0].total
      }
       
    },
    
    
    data: function(){
        return {
          stts:'',
          selected:[],
           status2:[
                 {text:'Approved', value:'APPROVED'},
                 {text:'Reject', value:'REJECT'},
                 {text:'Pre Order', value:'PO'},
                 {text:'Paid', value:'PAID'},
             ],
          date:'',
          zona:'',
          username:'',
           dialog2:false,
          persen:false,
            dialog: false,
             editedIndex: -1,
             file: '',
             status:[
                  {text:'Paid', value:'PAID'},
             ],
             city:[],
            editedItem: {
                id:'',
               bukti_transfer:'',
               qty:'',
               nomor_transaction:'',
               id_user:'',
               price:''
                
            },
            defaultItem: {
                id:'',
              bukti_transfer:'',
              qty:'',
              nomor_transaction:'',
              id_user:'',
              price:'',
            },
            multiLine: true,
            snackbar: false,
            notif_color:'',
            notif_text:'',
            detail:[],
            

          search: '',
          headers: [
            {
              text: 'Nomor Transaksi',
              align: 'start',
              sortable: false,
              value: 'nomor_transaction',
            },
             { text: 'Tanggal', value: 'date' },
             { text: 'Reseller', value: 'username' },
            { text: 'Jumlah', value: 'qty' },
             { text: 'Sub Total', value: 'harga' },
              { text: 'Status', value: 'status' },
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
      count_sub_total:function(){
            var total   = (this.data.reduce((acc, item) => acc + (item.sub_total * 1),0) ) ;
            this.sub_total = total;
            return total;

        },
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
      selected_change(){
        if(this.selected.length > 0){
          Object.entries(this.selected).forEach(([key, val]) => {
             var item = {
                                id:val.id,
                              bukti_transfer:val.bukti_transfer,
                              qty:val.qty,
                              nomor_transaction:val.nomor_transaction,
                              id_user:val.id_user,
                              price:val.price,
                              status:'PAID'

                            };
            this.$store.dispatch('approved', {item}).then((res) => {
                
                if(res == 200){
                   this.notif_color ='blue';
                  this.notif_text ='Berhasil Approve Transaksi ' + val.nomor_transaction;
                  this.snackbar = true;
                  
                   
                 
                }
            })
         

          });
          axios.get('payment_finance')
            .then(res => {
                  this.data   = res.data.values;               
                
            }).catch(err => {
            console.log(err);
            })

        }else{
            this.notif_color ='red';
                  this.notif_text ='Pilih transaksi terlebidahulu !';
                  this.snackbar = true;

        }

      },
      do_search(){
         this.loading = true;
        var date1 = null;
        var date2 = null;
        if(this.date!==null){
          date1 = this.$moment(this.date[0]).format("YYYY-MM-DD");
          date2 =this.$moment(this.date[1]).format("YYYY-MM-DD");

        }
          
          axios.post('transaction_report',{date1:date1,date2:date2,username:this.username,zona:this.zona,status:this.stts})
            .then(res => {
                  this.data   = res.data.values; 
                  this.loading = false;              
                
            }).catch(err => {
            console.log(err);
            })

      },
      export_excel(){
          var excel = $JExcel.new();
          excel.set({ sheet: 0, value: "Report" });
          var evenRow = excel.addStyle({ border: "none,none,none,thin #333333" });
          var oddRow = excel.addStyle({ fill: "#ECECEC", border: "none,none,none,thin #333333" });

          var headers = ["Nomor Transaksi", "Reseller", "Jumlah", "Sub Total","Tanggal","Status","lokasi","approved by"];

          for (var i = 0; i < headers.length; i++) {                       
            // Loop headers
            excel.set(0, i, 0, headers[i]);
            // Set CELL header text & header format
            excel.set(0, i, undefined, "auto");
          }
          var i = 1;

        
          // Set COLUMN width to auto 
          _.each(this.data, function (value) {
            
              excel.set(0, 0, i, value.nomor_transaction);
              excel.set(0, 1, i, value.username);
              excel.set(0, 2, i, value.qty);
              excel.set(0, 3, i, value.harga);
              excel.set(0, 4, i, value.date);
              excel.set(0, 5, i, value.status);
              excel.set(0, 6, i, value.lok);
              excel.set(0, 7, i, value.approved_by);
              
              i = i + 1;
          });
         

          excel.generate("report_Transaksi_" + Date.now() + ".xlsx");
        },
        show(item){

       this.dialog2 = true;  
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
        var item = this.editedItem;
        
           this.$store.dispatch('approved', {item}).then((res) => {
                
                if(res == 200){
                   this.notif_color ='blue';
                  this.notif_text ='Berhasil Approve Transaksi !';
                  this.snackbar = true;
                  axios.get('payment_finance')
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



