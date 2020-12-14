<template>
<div id="app">
  <v-app id="inspire">
   
        <v-container>
          <v-row>
              <v-flex  xs12 md3 style="padding: 10px;">
                <v-card>
                     <v-card-title>
                  Selamat Datang
                </v-card-title>
                <v-card-title>
                    <v-list-tile-action>
                        <v-icon>mdi mdi-account</v-icon>
                    </v-list-tile-action>
                    {{username}}
                </v-card-title>
                <v-card-title>
                  <v-list-tile-action>
                        <v-icon>mdi mdi-bank</v-icon>
                    </v-list-tile-action>
                  {{role}}
                </v-card-title>

                </v-card>
               
              </v-flex>

          </v-row>
          <v-row>
            <v-flex  xs12 md3 style="padding: 10px;">

            </v-flex>
          </v-row>

        </v-container>
        
    
    
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