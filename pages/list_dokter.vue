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
            List Dokter
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
                        <v-btn color="primary" dark class="mb-2" v-on="on"> Tambah Baru</v-btn>
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
                                        :src="editedItem.doctor_avatar"
                                        aspect-ratio="1"
                                        class="grey lighten-2"
                                        >
                                       
                                    </v-img>
                                </v-col>
                                <v-col cols="12" >
                                    <v-text-field v-model="editedItem.doctor_code" label="Kode Dokter"></v-text-field>
                                </v-col>
                                 <v-col cols="12" >
                                    <v-text-field v-model="editedItem.doctor_name" label="Nama Dokter"></v-text-field>
                                </v-col>
                                 <v-col cols="12" >
                                    <v-text-field v-model="editedItem.doctor_phone" label="Tlpn Dokter"></v-text-field>
                                </v-col>
                                 <v-col cols="12" >
                                    <v-text-field v-model="editedItem.doctor_email" label="Email"></v-text-field>
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
    let data       = await axios.get('doctor');
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
            editedItem: {
                id:'',
                doctor_code: '',
                doctor_name: '',
                doctor_phone:'',
                doctor_email: '',
                doctor_avatar:''
                
            },
            defaultItem: {
                id:'',
                doctor_code: '',
                doctor_name: '',
                doctor_phone:'',
                doctor_email: '',
                doctor_avatar:''
            },
            multiLine: true,
            snackbar: false,
            notif_color:'',
            notif_text:'',
            

          search: '',
          headers: [
            {
              text: 'Nama Dokter',
              align: 'start',
              sortable: false,
              value: 'doctor_name',
            },
            { text: 'Kode Dokter', value: 'doctor_code' },
            { text: 'Nomor Tlp', value: 'doctor_phone' },
             { text: 'Email', value: 'doctor_email' },
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
          this.$store.dispatch('doctor_delete', {item}).then((res) => {
                
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
           this.$store.dispatch('doctor_update', {item}).then((res) => {
                
                if(res == 200){
                    this.notif_color ='blue';
                    this.notif_text ='Berhasil Update Data !';
                    this.snackbar = true;
                     Object.assign(this.data[this.editedIndex], this.editedItem)
                }
            })
         
        } else {
            
            this.$store.dispatch('doctor_save', {item}).then((res) => {
                
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



