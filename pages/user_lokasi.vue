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
                    <v-dialog v-model="dialog" max-width="800px">
                   
                    <v-card>
                        <v-card-title>
                        <span class="headline">{{ formTitle }}</span>
                        </v-card-title>

                        <v-card-text>
                        <v-container>
                            <v-row>
                               
                                
                                 <table class="table table-striped table-bordered">
                                <thead>
                                  <tr>
                                      <th>No</th>
                                    <th>Lokasi</th>
                                    <th><a  @click="addRow('detail')" class="btn btn-info">Tambah Row</a></th>
                                    
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr v-for="(elm, index) in detail">
                                      <td>
                                          {{index+1}}
                                      </td>
                                 
                                    <td>
                                     <input type="text" v-model="elm.lokasi" class="form-control">
                                    </td>
                                     <td>
                                      <a class="btn btn-danger" @click="remove_row('detail', index)">Hapus</a>
                                      
                                    </td>
                                    
                                  </tr>
                                </tbody>
                              </table>

                             
                            
                           
                          
                            
                            
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
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

export default {
   middleware: 'auth',
   async asyncData({store, error}) {   
    let data       = await axios.get('users');
     let area       = await axios.get('voucher/area');
    //let parse = JSON.parse(data.data.values); 
      return {
        //data:parse.rajaongkir.results,
        data:data.data.values,
        area:area.data.values
      }
       
    },
    
    
    data: function(){
        return {
           detail:[],
             
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
          zona:[
            {text:'Zona1',value:'zona1'}
          ]
         
           
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
         addRow(target){
          this[target].push({});        
      },
      remove_row(target,index){
          this[target].splice(index, 1);

      },
        editItem (item) {
        this.editedIndex = this.data.indexOf(item)
        this.editedItem = Object.assign({}, item)
          axios.get('user/lokasi/'+item.id)
            .then(res => {
              
                this.detail = res.data.values;   
                       
            }).catch(err => {
            console.log(err);
            })
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
        var detail = this.detail;
        var dat = {
            header:item,
            detail:this.detail

        };
      
            
            this.$store.dispatch('user_lokasi_save', {dat}).then((res) => {
                
                if(res == 200){
                    this.notif_color ='blue';
                    this.notif_text ='Berhasil Menambahkan Lokasi !';
                    this.snackbar = true;
                    this.data.push(this.editedItem)
                }
            })
            
        
       
        
        this.close()
      },
    },
    components: { BootstrapVue },
}
</script>



