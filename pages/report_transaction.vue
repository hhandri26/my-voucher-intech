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
                        Zona
                    </v-col>
                    <v-col cols="4">
                        <v-autocomplete
                            v-model="zona"
                            :items="area"
                            color="blue"
                            hide-no-data
                            hide-selected
                            item-text="owner_name"
                            item-value="owner_name"
                            label="Pilih Zona"
                        ></v-autocomplete>
                    </v-col>
                  </v-row>
                  
                  <v-row>
                    <v-col cols="3">
                         <v-btn depressed small color="primary" @click="do_search()">Cari</v-btn>
                          <v-btn depressed small color="primary" @click="export_excel()">Export</v-btn>
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
          
                <template v-slot:item.actions="{ item }">
              
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
          <v-card-subtitle >
              Rp. {{count_sub_total | thousand}}

          </v-card-subtitle>
           
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
    let data       = await axios.get('payment_all');
        let user       = await axios.get('users');
    let area       = await axios.get('voucher/area');
      return {
        data:data.data.values,
           user:user.data.values,
        area:area.data.values
      }
       
    },
    
    
    data: function(){
        return {
          zona:'',
           dialog2:false,
           username:'',
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
             { text: 'Reseller', value: 'username' },
            { text: 'Jumlah', value: 'qty' },
             { text: 'Sub Total', value: 'harga' },
              { text: 'Tanggal', value: 'date' },
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
            { text: 'Kode Voucher', value: 'kode_voucher' },
            

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
        show(item){

       this.dialog2 = true;  
          axios.get('payment/detail_done/'+item.nomor_transaction)
            .then(res => {
              
                this.detail = res.data.values;   
                       
            }).catch(err => {
            console.log(err);
            })

      },
      do_search(){
         var date1 = this.$moment(this.date[0]).format("YYYY-MM-DD");
          var date2 = this.$moment(this.date[1]).format("YYYY-MM-DD");
          
          axios.post('transaction_report',{date1:date1,date2:date2,username:this.username,zona:this.zona})
            .then(res => {
                  this.data   = res.data.values;               
                
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
      export_excel(){
          var excel = $JExcel.new();
          excel.set({ sheet: 0, value: "Report" });
          var evenRow = excel.addStyle({ border: "none,none,none,thin #333333" });
          var oddRow = excel.addStyle({ fill: "#ECECEC", border: "none,none,none,thin #333333" });

          var headers = ["Nomor Transaksi", "Reseller", "Jumlah", "Sub Total","Tanggal","Status"];

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
              
              i = i + 1;
          });
         

          excel.generate("report_Transaksi_" + Date.now() + ".xlsx");
        }
     
    },
    components: {
      VueNumeric,
      DatePicker
      
    }
}
</script>



