<template>

    <div id="app">
        
      <v-app id="inspire">
      <div style="display:none">
        <div class="container" id="print" ref="printMe" >
           <v-flex xs12 md12>
              <div style="width: 21cm; min-height: 29.7cm; padding: 2cm; margin: 1cm auto; border: 1px #D3D3D3 solid; border-radius: 5px; background: white; box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);">
                <div v-for="(item, i) in data" :key="i" style="min-width: 220px;float: left;padding: 20px;">
                  <img src="~assets/Voucher.png" width="220">
                  <div style="width: 100%;background-color: #fff;border: solid 1px;text-align: center;height: 20px;font-size: 18px;">{{item.kode_voucher}}</div>

                </div>
              </div>
              
           </v-flex>
            
        </div>
      </div>
        <v-card>
          <div class="my-2">
            <v-btn small color="primary" @click="print()">Cetak Voucher</v-btn>
          </div>
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

export default {
   middleware: 'auth',
   async asyncData({store, error}) {   
    let data       = await axios.get('voucher_done_status/' + localStorage.userId);
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
             status:'',
             city:[],
            editedItem: {
                id:'',
               bukti_transfer:'',
                
            },
            defaultItem: {
                id:'',
              bukti_transfer:'',
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
            { text: 'Voucher Id', value: 'id_voucher' },
            { text: 'Nama Voucher', value: 'plan_name' },
            { text: 'Harga', value: 'price' },
            { text: 'Kode Voucher', value: 'kode_voucher' },
            

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
        
           this.$store.dispatch('upload_bukti_transfer', {item}).then((res) => {
                
                if(res == 200){
                    this.notif_color ='blue';
                    this.notif_text ='Berhasil Upload bukti Transfer !';
                    this.snackbar = true;
                     Object.assign(this.data[this.editedIndex], this.editedItem)
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



