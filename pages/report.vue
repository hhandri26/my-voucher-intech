<template>

    <div id="app">
        
      <v-app id="inspire">
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
                         <v-btn depressed small color="primary" @click="do_search()">Cari</v-btn>
                          <v-btn depressed small color="primary" @click="export_excel()">Export</v-btn>
                    </v-col>
                  
                  </v-row>
                 
              </v-col>
              <!-- <v-col cols="12" >
                  <v-text-field v-model="editedItem.email" label="Email"></v-text-field>
              </v-col> -->
            </v-row>
           
          </v-card>
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
    let data       = await axios.get('voucher_all/');
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
          persen:false,
            dialog: false,
             editedIndex: -1,
             file: '',
             status:'',
             date:'',
             zona:'',
            username:'',
           
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
            { text: 'Voucher Id', value: 'id_voucher' },
              { text: 'reseller', value: 'reseller' },
            { text: 'Nama Voucher', value: 'plan_name' },
            { text: 'Harga', value: 'harga' },
             { text: 'Tanggal', value: 'date' },
              { text: 'Lokasi', value: 'lokasi' },
            { text: 'Kode Voucher', value: 'kode_voucher' },
            

          ],
         
           
        }
    },
    computed:{
       
       
    },
    watch:{
       

    },
    created(){
    },
    methods: {
      do_search(){
          var date1 = this.$moment(this.date[0]).format("YYYY-MM-DD");
          var date2 = this.$moment(this.date[1]).format("YYYY-MM-DD");
          axios.post('voucher_report',{date1:date1,date2:date2,username:this.username})
            .then(res => {
                  this.data   = res.data.values;               
                
            }).catch(err => {
            console.log(err);
            })

      },
         export_excel(){
          var excel = $JExcel.new();
          excel.set({ sheet: 0, value: "Report" });
          var evenRow = excel.addStyle({ border: "none,none,none,thin #333333" });
          var oddRow = excel.addStyle({ fill: "#ECECEC", border: "none,none,none,thin #333333" });

          var headers = ["Nomor Transaksi", "Voucher Id", "reseller", "Nama Voucher","Harga","Tanggal","Kode Voucher"];

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
              excel.set(0, 1, i, value.id_voucher);
              excel.set(0, 2, i, value.reseller);
              excel.set(0, 3, i, value.plan_name);
              excel.set(0, 4, i, value.price);
              excel.set(0, 5, i, value.date);
              excel.set(0, 6, i, value.kode_voucher);
              
              i = i + 1;
          });
         

          excel.generate("report_voucher_" + Date.now() + ".xlsx");
        }
    },
    components: {
      VueNumeric,
      DatePicker
      
    }
}
</script>



