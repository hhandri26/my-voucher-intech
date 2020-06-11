<template>
  <v-navigation-drawer
    id="core-navigation-drawer"
    v-model="drawer"
    :dark="barColor !== 'rgba(228, 226, 226, 1), rgba(255, 255, 255, 0.7)'"
    :expand-on-hover="expandOnHover"
    :right="$vuetify.rtl"
    :src="barImage"
    mobile-break-point="960"
    app
    width="260"
    v-bind="$attrs"
  >
    <template v-slot:img="props">
      <v-img
        :gradient="`to bottom, ${barColor}`"
        v-bind="props"
      />
    </template>

    <v-divider class="mb-1" />

    <v-list
      dense
      nav
    >
      <v-list-item>
       <v-img
          :src="require('@/assets/logo.png')"
          class="mr-5"
          contain
          height="48"
          width="48"
          @click="$vuetify.goTo(0)"
        />

   
      </v-list-item>
    </v-list>

    <v-divider class="mb-2" />

    <v-list
      expand
      nav
    >
      <!-- Style cascading bug  -->
      <!-- https://github.com/vuetifyjs/vuetify/pull/8574 -->
      <div />

     

      <!--  -->
         <div v-for="(link, i) in links">

                  <v-list-item
                      v-if="!link.subLinks"
                      :key="i"
                      :to="link.to"
                      
                      class="v-list-item"
                  >
                      <v-list-item-action>
                          <v-icon>{{ link.icon }}</v-icon>
                      </v-list-item-action>

                        <v-list-item-content>
                          <v-list-item-title><nuxt-link :to="link.to">{{link.text}}</nuxt-link>    </v-list-item-title>
                        </v-list-item-content>
                  </v-list-item>

                  <v-list-group
                      v-else
                      :key="link.text"
                      no-action
                  >
                  
                      <template v-slot:activator>
                          <v-list-item-action>
                          <v-icon>{{ link.icon }}</v-icon>
                      </v-list-item-action>
                        <v-list-item>
                          <v-list-item-content>
                            <v-list-item-title>{{ link.text }}</v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                      </template>
                      <div v-for="sublink in link.subLinks">

                        
                        <v-list-item
                          
                            :to="sublink.to"
                            :key="sublink.text"
                            class="v-list-item"
                        >
                           
                              <v-list-item-content>
                                <v-list-item-title><nuxt-link :to="sublink.to">{{sublink.text}}</nuxt-link>    </v-list-item-title>
                              </v-list-item-content>
                        </v-list-item>
                      </div>

                  </v-list-group>
                      

              </div>
      <!--  -->

      <!-- Style cascading bug  -->
      <!-- https://github.com/vuetifyjs/vuetify/pull/8574 -->
      <div />
    </v-list>

    <template v-slot:append>
      <v-list-item
        :item="{
          title: 'upgrade',
          icon: 'mdi-package-up',
          to: '/upgrade',
        }"
      />
    </template>
  </v-navigation-drawer>
</template>

<script>
  // Utilities
  import {
    mapState,
  } from 'vuex'

  export default {
    name: 'DashboardCoreDrawer',

    props: {
      expandOnHover: {
        type: Boolean,
        default: false,
      },
    },

    data: () => ({
      items: [
        {
          icon: 'mdi-view-dashboard',
          title: 'dashboard',
          to: '/',
        },
        {
          icon: 'mdi-account',
          title: 'Produk',
          to: '/pages/user',
        },
        {
          title: 'rtables',
          icon: 'mdi-clipboard-outline',
          to: '/tables/regular-tables',
        },
        {
          title: 'typography',
          icon: 'mdi-format-font',
          to: '/components/typography',
        },
        {
          title: 'icons',
          icon: 'mdi-chart-bubble',
          to: '/components/icons',
        },
        {
          title: 'google',
          icon: 'mdi-map-marker',
          to: '/maps/google-maps',
        },
        {
          title: 'notifications',
          icon: 'mdi-bell',
          to: '/components/notifications',
        },
      ],
    }),

    computed: {
      ...mapState(['barColor', 'barImage']),
      drawer: {
        get () {
          return this.$store.state.drawer
        },
        set (val) {
          this.$store.commit('SET_DRAWER', val)
        },
      },
      computedItems () {
        return this.items.map(this.mapItem)
      },
      links(){
       
         var nav= [
          {
              to     : '/',
              icon   : 'mdi-view-dashboard',
              text   : 'Dashboard',
          },
          {
              icon     : 'mdi-cart',
              text     : 'Transaksi',
              subLinks : [
                  {
                      text : 'Transaksi Baru',
                      to    : '/',
                  },
                  {
                      text : 'Kasir',
                      to    : '/',
                  },
                  
              ]
          },
           {
              icon     : 'mdi-dropbox',
              text     : 'Produk',
              subLinks : [
                  {
                      text : 'Kategori Produk',
                      to    : '/kategori_produk',
                  },
                   {
                      text : 'Produk',
                      to    : '/produk',
                  },
                  {
                      text : 'Gallery Produk',
                      to    : '/product_gallery',
                  },
                  
              ]
          },
          {
              icon     : 'mdi-account-tie',
              text     : 'Dokter',
              subLinks : [
                  {
                      text : 'List Dokter',
                      to    : '/list_dokter',
                  },
                   {
                      text : 'Buat Resep',
                      to    : '#',
                  },
                  
              ]
          },
          {
              icon     : 'mdi-clipboard-check-multiple',
              text     : 'Laporan',
              subLinks : [
                  {
                      text : 'Laporan Transaksi',
                      to    : '#',
                  },
                   {
                      text : 'Laporan Penjualan',
                      to    : '#',
                  },
                  
              ]
          },
           {
              icon     : 'mdi-account',
              text     : 'User',
              subLinks : [
                  {
                      text : 'User',
                      to    : '/user',
                  },
                   {
                      text : 'Member',
                      to    : '/member',
                  },
                   
                  
              ]
          },
         ]
         return nav
      }
      
    },

    methods: {
      mapItem (item) {
        return {
          ...item,
          children: item.children ? item.children.map(this.mapItem) : undefined,
          title: 'dashboard',
        }
      },
    },
  }
</script>

<style lang="sass">
  @import '~vuetify/src/styles/tools/_rtl.sass'

  #core-navigation-drawer
    .v-list-group__header.v-list-item--active:before
      opacity: .24

    .v-list-item
      &__icon--text,
      &__icon:first-child
        justify-content: center
        text-align: center
        width: 20px

        +ltr()
          margin-right: 24px
          margin-left: 12px !important

        +rtl()
          margin-left: 24px
          margin-right: 12px !important

    .v-list--dense
      .v-list-item
        &__icon--text,
        &__icon:first-child
          margin-top: 10px

    .v-list-group--sub-group
      .v-list-item
        +ltr()
          padding-left: 8px

        +rtl()
          padding-right: 8px

      .v-list-group__header
        +ltr()
          padding-right: 0

        +rtl()
          padding-right: 0

        .v-list-item__icon--text
          margin-top: 19px
          order: 0

        .v-list-group__header__prepend-icon
          order: 2

          +ltr()
            margin-right: 8px

          +rtl()
            margin-left: 8px
</style>
