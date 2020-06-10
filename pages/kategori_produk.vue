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
            Kategori Produk
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
                        <v-btn color="primary" dark class="mb-2" v-on="on">Kategori Baru</v-btn>
                    </template>
                    <v-card>
                        <v-card-title>
                        <span class="headline">{{ formTitle }}</span>
                        </v-card-title>

                        <v-card-text>
                        <v-container>
                            <v-row>
                            <v-col cols="12" >
                                <v-text-field v-model="editedItem.product_category_code" label="Kode Kategori"></v-text-field>
                            </v-col>
                            <v-col cols="12" >
                                <v-text-field v-model="editedItem.product_category_name" label="Nama Kategori"></v-text-field>
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
                <v-btn color="primary" @click="initialize">Reset</v-btn>
            </template>
          </v-data-table>
        </v-card>
      </v-app>
    </div>
</template>



<script>
import {mapState} from 'vuex'
import axios from '~/plugins/axios'

export default {
   middleware: 'auth',
   async asyncData({store, error}) {   
    let data       = await axios.get('product/catagories');
    //let parse = JSON.parse(data.data.values); 
      return {
        //data:parse.rajaongkir.results,
        data:data.data.values
      }
       
    },
    
    
    data: function(){
        return {
          persen:false,
            dialog: false,
             editedIndex: -1,
            editedItem: {
                id:'',
                product_category_code: '',
                product_category_name: '',
                
            },
            defaultItem: {
                id:'',
                product_category_code: '',
                product_category_name: '',
            },
            multiLine: true,
            snackbar: false,
            notif_color:'',
            notif_text:'',
            

          search: '',
          headers: [
            {
              text: 'Kode Kategori Produk',
              align: 'start',
              sortable: false,
              value: 'product_category_code',
            },
            { text: 'Nama Kategori', value: 'product_category_name' },
            
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
        editItem (item) {
        this.editedIndex = this.data.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },
      delete_item(id){
        var item = {
          id:id
        };
          this.$store.dispatch('product_catagories_delete', {item}).then((res) => {
                
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
           this.$store.dispatch('product_catagories_update', {item}).then((res) => {
                
                if(res == 200){
                    this.notif_color ='blue';
                    this.notif_text ='Berhasil Update Data !';
                    this.snackbar = true;
                     Object.assign(this.data[this.editedIndex], this.editedItem)
                }
            })
         
        } else {
            
            this.$store.dispatch('product_catagories_save', {item}).then((res) => {
                
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
    }
}
</script>



