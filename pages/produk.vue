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
            Produk
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
                    <template v-slot:activator="{ on }">
                        <v-btn color="primary" dark class="mb-2" v-on="on"> Produk Baru</v-btn>
                    </template>
                    <v-card>
                        <v-card-title>
                        <span class="headline">{{ formTitle }}</span>
                        </v-card-title>

                        <v-card-text>
                        <v-container>
                            <v-row>
                                <v-col cols="12">
                                    <input ref="image" class="hide-input" type="file" accept="image/*"  @change="uploadfile">
                                </v-col>
                                <v-col cols="12">
                                    <v-img
                                        :src="editedItem.product_img"
                                        aspect-ratio="1"
                                        class="grey lighten-2"
                                        >
                                       
                                    </v-img>
                                </v-col>
                                <v-col cols="12" >
                                    <v-text-field v-model="editedItem.product_name" label="Nama Produk"></v-text-field>
                                </v-col>
                                <v-col cols="12" >
                                    <v-text-field v-model="editedItem.product_code" label="Kode Produk"></v-text-field>
                                </v-col>
                                <v-col cols="12"  >
                                
                                       <v-autocomplete
                                        v-model="editedItem.product_category_id"
                                        :items="category"
                                       
                                        color="blue"
                                        hide-no-data
                                        hide-selected
                                        item-text="product_category_name"
                                        item-value="id"
                                        label="Kategori Produk"
                                    ></v-autocomplete>
                                    
                               
                                </v-col>
                                 <v-col cols="12" >
                                    <v-text-field v-model="editedItem.product_description" label="Deskripsi Produk"></v-text-field>
                                </v-col>
                                
                                <v-col cols="12">
                                   <vue-numeric  v-model="editedItem.product_price" placeholder="Harga Produk"  currency="Rp" separator="," :precision="2" ></vue-numeric>
                                </v-col>
                                <v-col cols="12">
                                   <vue-numeric  v-model="editedItem.product_tax" placeholder="Pajak"  currency="Rp" separator="," :precision="2" ></vue-numeric>
                                </v-col>
                                <v-col cols="12">
                                   <v-switch
                                    v-model="status"
                                    label="Aktif ?"
                                  ></v-switch>
                                </v-col>
                                 <v-col cols="12">
                                   <vue-numeric  v-model="editedItem.product_weight" placeholder="Berat"  currency="" separator="," :precision="2" ></vue-numeric>
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
    let data       = await axios.get('product');
    let category = await axios.get('product/catagories');
      return {
        data:data.data.values,
        category:category.data.values
      }
       
    },
    
    
    data: function(){
        return {
          persen:false,
            dialog: false,
             editedIndex: -1,
             file: '',
             status:'',
            editedItem: {
                id:'',
                product_name: '',
                product_code: '',
                product_category_id:'',
                product_img:'',
                product_description:'',
                product_price:'',
                product_tax:'',
                product_status:'',
                product_weight:''
                
            },
            defaultItem: {
                id:'',
                product_name: '',
                product_code: '',
                product_category_id:'',
                product_img:'',
                product_description:'',
                product_price:'',
                product_tax:'',
                product_status:'',
                product_weight:''
            },
            multiLine: true,
            snackbar: false,
            notif_color:'',
            notif_text:'',
            

          search: '',
          headers: [
            {
              text: 'Produk',
              align: 'start',
              sortable: false,
              value: 'product_name',
            },
            { text: 'Kode Produk', value: 'product_code' },
            { text: 'Harga Produk', value: 'product_price' },
            { text: 'Pajak', value: 'product_tax' },
            { text: 'Status', value: 'product_status' },
            { text: 'Berat', value: 'product_weight' },
            
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
                  this.editedItem.product_img   = res.data[0].mediaSource;                
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
          this.$store.dispatch('product_delete', {item}).then((res) => {
                
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
        if(this.status == true){
          this.editedItem.product_status = 'Active'
        }else{
          this.editedItem.product_status = 'Not Active'

        }
        if (this.editedIndex > -1) {
           this.$store.dispatch('product_update', {item}).then((res) => {
                
                if(res == 200){
                    this.notif_color ='blue';
                    this.notif_text ='Berhasil Update Data !';
                    this.snackbar = true;
                     Object.assign(this.data[this.editedIndex], this.editedItem)
                }
            })
         
        } else {
            
            this.$store.dispatch('product_save', {item}).then((res) => {
                
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



