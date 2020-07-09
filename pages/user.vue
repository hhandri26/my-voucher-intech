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
            User
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
                        <v-btn color="primary" dark class="mb-2" v-on="on">Tambah Baru</v-btn>
                    </template>
                    <v-card>
                        <v-card-title>
                        <span class="headline">{{ formTitle }}</span>
                        </v-card-title>

                        <v-card-text>
                        <v-container>
                            <v-row>
                            <v-col cols="12" >
                                <v-text-field v-model="editedItem.username" label="Username"></v-text-field>
                            </v-col>
                            <v-col cols="12" >
                                <v-text-field v-model="editedItem.email" label="Email"></v-text-field>
                            </v-col>
                            <v-col cols="12" >
                                <v-text-field v-model="editedItem.real_password" label="Password"></v-text-field>
                            </v-col>
                            
                            <v-col cols="12" >
                               
                                <v-autocomplete
                                        v-model="editedItem.role"
                                        :items="role"
                                       
                                        color="blue"
                                        hide-no-data
                                        hide-selected
                                        item-text="role_name"
                                        item-value="role_code"
                                        label="Role"
                                    ></v-autocomplete>
                            </v-col>
                            <v-col cols="12" >
                                <v-text-field v-model="editedItem.phone_number" label="Nomor Hp"></v-text-field>
                            </v-col>
                            
                            <v-col cols="12">
                                <v-switch
                                v-model="status"
                                label="Aktif ?"
                                ></v-switch>
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
    let data       = await axios.get('users');
    //let parse = JSON.parse(data.data.values); 
      return {
        //data:parse.rajaongkir.results,
        data:data.data.values
      }
       
    },
    
    
    data: function(){
        return {
            role:[
                {role_code:'ADMIN', role_name:'Admin'},
                {role_code:'SUPPLIER', role_name:'Supplier'},
            ],
            status:false,
          persen:false,
            dialog: false,
             editedIndex: -1,
            editedItem: {
                id:'',
                username: '',
                email: '',
                role:'',
                phone_number:'',
                status:'',
                real_password:''
                
            },
            defaultItem: {
                id:'',
                username: '',
                email: '',
                role:'',
                phone_number:'',
                status:'',
                real_password:''
            },
            multiLine: true,
            snackbar: false,
            notif_color:'',
            notif_text:'',
            

          search: '',
          headers: [
            {
              text: 'Username',
              align: 'start',
              sortable: false,
              value: 'username',
            },
            { text: 'Email', value: 'email' },
            { text: 'Role', value: 'role' },
            { text: 'Nomor HP', value: 'phone_number' },
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
          this.$store.dispatch('user_delete', {item}).then((res) => {
                
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
          this.editedItem.status = 'Active'
        }else{
          this.editedItem.status = 'Not Active'

        }
        if (this.editedIndex > -1) {
           this.$store.dispatch('user_update', {item}).then((res) => {
                
                if(res == 200){
                    this.notif_color ='blue';
                    this.notif_text ='Berhasil Update Data !';
                    this.snackbar = true;
                     Object.assign(this.data[this.editedIndex], this.editedItem)
                }
            })
         
        } else {
            
            this.$store.dispatch('user_save', {item}).then((res) => {
                
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



