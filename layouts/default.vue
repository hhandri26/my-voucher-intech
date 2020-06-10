<template>
  <v-app>
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
    <div v-if="!$store.state.authUser">
        <v-app id="inspire">
          <v-content>
            <v-container class="fill-height" fluid>
              <v-row align="center" justify="center">
                <v-col cols="12" sm="8" md="4">
                  <v-card class="elevation-12">
                    <v-toolbar color="primary" dark flat>
                      <v-toolbar-title>Login form</v-toolbar-title>
                      <v-spacer></v-spacer>
                    </v-toolbar>
                    <v-card-text>
                      <v-form  @submit.prevent="login">
                        <v-text-field label="Login" name="login"  v-model="formUsername"  prepend-icon="mdi-account" type="text" ></v-text-field>
                        <v-text-field id="password" label="Password"  v-model="formPassword" name="password" prepend-icon="mdi-lock" type="password"></v-text-field>
                      </v-form>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="primary" @click="login()">Login</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-col>
              </v-row>
            </v-container>
          </v-content>
        </v-app>
    </div>
    <div v-else>
      <dashboard-core-app-bar />
      <dashboard-core-drawer />
      
        <v-content>
            <nuxt />
        </v-content> 
    </div>
    
  </v-app>
</template>

<script>
  export default {
    name: 'DashboardIndex',
    data () {
    return {
      formError: null,
      formUsername: '',
      formPassword: '',
      username:localStorage.username,
      drawer: null,
       expandOnHover: false,
        multiLine: true,
      snackbar: false,
      notif_color:'',
      notif_text:''
     
    }
  },

    components: {
      DashboardCoreAppBar: () => import('@/pages/core/AppBar'),
      DashboardCoreDrawer: () => import('@/pages/core/Drawer'),
      DashboardCoreSettings: () => import('@/pages/core/Settings'),
      DashboardCoreView: () => import('@/pages/core/View'),
    },
      methods: {
    async login () {
      try {
        if(this.formUsername!=='' && this.formPassword!==''){
           await this.$store.dispatch('login', {
              username: this.formUsername,
              password: this.formPassword
            })
            

        }else{
          this.notif_color ='red';
          this.notif_text ='Username dan Password Salah !';
          this.snackbar = true;
         

        }
       
      } catch (e) {
         this.notif_color ='red';
          this.notif_text ='Tidak bisa login';
         this.snackbar = true;
      }
    },
    async logout () {
      try {
        await this.$store.dispatch('logout')
       
      } catch (e) {
           this.notif_color ='red';
          this.notif_text ='Tidak bisa login';
         this.snackbar = true;
      }
    }
  }

 
  }
</script>
