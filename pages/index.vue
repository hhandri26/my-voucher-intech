<template>
<div id="app">
  <v-app id="inspire">
   

         <v-card>
          <v-card-title>
            Selamat Datang
          </v-card-title>
         </v-card>
          <v-card>
          <v-card-title>
              <v-list-tile-action>
                  <v-icon>mdi mdi-account</v-icon>
              </v-list-tile-action>
            {{username}}
          </v-card-title>
         </v-card>
          <v-card>
          <v-card-title>
            <v-list-tile-action>
                  <v-icon>mdi mdi-bank</v-icon>
              </v-list-tile-action>
            {{role}}
          </v-card-title>
          
         </v-card>
         
     
    
    
  </v-app>
</div>
</template>

<script>
export default {
    
    data: function(){
        return {
          username:localStorage.username,
          role:localStorage.role
        }
    }
}
</script>