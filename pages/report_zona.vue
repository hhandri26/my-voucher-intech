<template>

    <div id="app">
       <v-col cols="3">
                         
            <v-btn depressed small color="primary" @click="export_excel()">Export</v-btn>
      </v-col>
   
 
      <v-app id="inspire">
        <v-card>
          <v-card-title>
            Report Penjualan Area
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
    let data       = await axios.get('voucher/report_area');
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

          search: '',
          headers: [
            {
              text: 'Nama Voucher',
              align: 'start',
              sortable: false,
              value: 'plan_name',
            },
             { text: 'Jumlah Voucher', value: 'jumlah_voucher' },
            { text: 'Total Harga', value: 'total_harga' },
             { text: 'Reseller', value: 'reseller' },
              { text: 'Lokasi', value: 'location' },
              { text: 'tanggal', value: 'date' },
            

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
          axios.get('payment/detail/'+item.nomor_transaction)
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

          var headers = ["Nama Voucher", "Jumlah Voucher", "Total Harga", "Reseller","Lokasi", "tanggal"];

          for (var i = 0; i < headers.length; i++) {                       
            // Loop headers
            excel.set(0, i, 0, headers[i]);
            // Set CELL header text & header format
            excel.set(0, i, undefined, "auto");
          }
          var i = 1;

        
          // Set COLUMN width to auto 
          _.each(this.data, function (value) {
            
              excel.set(0, 0, i, value.plan_name);
              excel.set(0, 1, i, value.jumlah_voucher);
              excel.set(0, 2, i, value.total_harga);
              excel.set(0, 3, i, value.reseller);
              excel.set(0, 4, i, value.location);
              excel.set(0, 5, i, value.date);
              
              i = i + 1;
          });
         

          excel.generate("report_sisa_voucher_" + Date.now() + ".xlsx");
        }
     
    },
    components: {
      VueNumeric,
      DatePicker
      
    }
}
</script>



