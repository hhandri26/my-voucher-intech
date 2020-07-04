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
            :items="items"
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
                    <!-- <template v-slot:activator="{ on }">
                        <v-btn color="primary" dark class="mb-2" v-on="on"> Tambah Baru</v-btn>
                    </template> -->
                    <v-card>
                        <v-card-title>
                        <span class="headline">{{ formTitle }}</span>
                        </v-card-title>

                        <v-card-text>
                        <v-container>
                            <v-row>
                               
                               
                                <v-col cols="12" >
                                    <v-text-field v-model="editedItem.first_name" label="Nama Awal"></v-text-field>
                                </v-col>
                                 <v-col cols="12" >
                                    <v-text-field v-model="editedItem.last_name" label="Nama Akhir"></v-text-field>
                                </v-col>
                                 <v-col cols="12" >
                                    <v-text-field v-model="editedItem.email" label="Email"></v-text-field>
                                </v-col>
                                 <v-col cols="12" >
                                    <v-text-field v-model="editedItem.phone_number" label="Nomor Tlpn"></v-text-field>
                                </v-col>
                                 <v-col cols="12" >
                                    <v-text-field v-model="editedItem.password" label="Password"></v-text-field>
                                </v-col>
                                <v-col cols="12">
                                      <v-autocomplete
                                        v-model="editedItem.provinsi_id"
                                        :items="province"
                                        color="blue"
                                        hide-no-data
                                        hide-selected
                                        item-text="province"
                                        item-value="province_id"
                                        label="Provinsi"
                                        @change="get_city()"
                                    ></v-autocomplete>

                                </v-col>
                                <v-col cols="12">
                                      <v-autocomplete
                                        v-model="editedItem.kota_id"
                                        :items="city"
                                        color="blue"
                                        hide-no-data
                                        hide-selected
                                        item-text="city_name"
                                        item-value="city_id"
                                        label="Kota"
                                    ></v-autocomplete>

                                </v-col>
                                 <v-col cols="12" >
                                    <v-text-field v-model="editedItem.address" label="Alamat"></v-text-field>
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
                    @click="deleteItem(item)"
                >
                    mdi-delete
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
    let data       = await axios.get('member');
    let province   = await axios.get('ongkir/province');
    let parse      = JSON.parse(province.data.values);
      return {
        data:data.data.values,
        province:parse.rajaongkir.results,
      }
       
    },
    
    
    data: function(){
        return {
          items:[
            {
              notransaksi:114054,
              item:'Voucher 1 jam',
              username:'hhandri26',
              password:'K56afL'
            }
          ],
          persen:false,
            dialog: false,
             editedIndex: -1,
             file: '',
             status:'',
             city:[],
            editedItem: {
                id:'',
                first_name: '',
                last_name: '',
                email:'',
                phone_number: '',
                password:'',
                provinsi_id: '',
                kota_id:'',
                address:''
                
            },
            defaultItem: {
                id:'',
                first_name: '',
                last_name: '',
                email:'',
                phone_number: '',
                password:'',
                provinsi_id: '',
                kota_id:'',
                address:''
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
              value: 'notransaksi',
            },
            { text: 'Item', value: 'item' },
            { text: 'Username', value: 'username' },
             { text: 'Password', value: 'password' },
            

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
        get_city(){
            axios.post('ongkir/city',{provinsi_id:this.editedItem.provinsi_id})
            .then(res => {
       
                    let parse      = JSON.parse(res.data.values);
                             console.log(parse.rajaongkir.results)
                    this.city = parse.rajaongkir.results;
               
                
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
                  this.editedItem.doctor_avatar = res.data[0].mediaSource;                
            }).catch(err => {
            console.log(err);
            })

        },
        editItem (item) {
        this.editedIndex = this.data.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },
      delete_item(id){
        var item = {
          id:id
        };
          this.$store.dispatch('member_delete', {item}).then((res) => {
                
                if(res == 200){
                   this.notif_color ='blue';
                    this.notif_text ='Berhasil Menghapus Data !';
                    this.snackbar = true;
                }
            })

      },
      deleteItem (item) {
        const index = this.data.indexOf(item)
        var id = item.id;
        confirm('Are you sure you want to delete this item?') && this.data.splice(index, 1) && this.delete_item(id)
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
        if (this.editedIndex > -1) {
           this.$store.dispatch('member_update', {item}).then((res) => {
                
                if(res == 200){
                    this.notif_color ='blue';
                    this.notif_text ='Berhasil Update Data !';
                    this.snackbar = true;
                     Object.assign(this.data[this.editedIndex], this.editedItem)
                }
            })
         
        } else {
            
            this.$store.dispatch('member_save', {item}).then((res) => {
                
                if(res == 200){
                    this.notif_color ='blue';
                    this.notif_text ='Berhasil Input Data !';
                    this.snackbar = true;
                    this.data.push(this.editedItem)
                }
            })
            
        }
       
        
        this.close()
      },
    },
    components: {
      VueNumeric,
      
    }
}
</script>



