import Vue from 'vue'
import Vuex from 'vuex'
import axios from '~/plugins/axios'

Vue.use(Vuex)
export const state = () => ({
    barColor: 'rgba(0, 0, 0, .8), rgba(0, 0, 0, .8)',
    barImage: 'https://demos.creative-tim.com/material-dashboard/assets/img/sidebar-1.jpg',
    drawer: null,
    authUser: null,
    role:null,
})

export const mutations = {
    SET_BAR_IMAGE (state, payload) {
        state.barImage = payload
      },
      SET_DRAWER (state, payload) {
        state.drawer = payload
      },
      SET_USER (state, user) {
        state.authUser = user
    },
    SET_ROLE(state,role){
      state.role = role

  }
}

export const actions={
  nuxtServerInit ({ commit }, { req }) {
    if (req.session && req.session.authUser) {
          commit('SET_USER', req.session.authUser)
        }
    },
    async login ({ commit }, { username, password }) {
    try {
            await axios.post('/users/login', { username, password }).then((response)=>{
                let status = '';
                if(response.data.values){
                    commit('SET_USER', response.data.values[0])
                    commit('SET_ROLE', response.data.values[0].role)
                    localStorage.setItem("userId",response.data.values[0].id);
                    localStorage.setItem("username",response.data.values[0].username);
                    localStorage.setItem("role",response.data.values[0].role);
                    status = 200;
                    let dat ={
                        status : status
                    }
                    return dat

                }else{
                    status = 'username atau password salah !';
                    let dat ={
                        status : status
                    }
                    return dat;

                }
                
            })
               
        } catch (error) {
            if (error.response && error.response.status === 401) {
            throw new Error('Bad credentials')
            }
            throw error
        }
    },
    async logout ({ commit }) {
        commit('SET_USER', null);
        localStorage.clear();
        this.$router.push('logout')
    },
    async product_catagories_save ( {commit}, { item} ){
      let status = '';
      try {
          await axios.post('product/catagories',item).then((response)=>{
              status = response.data.status;
               
          });
      }catch (e) {
          status = 'field';
      }
      return status;        
      
  },
  async product_catagories_update ( {commit}, { item} ){
    let status = '';
    try {
        await axios.put('product/catagories',item).then((response)=>{
            status = response.data.status;
             
        });
    }catch (e) {
        status = 'field';
    }
    return status;        
    
},
  async product_catagories_delete ( {commit}, { item} ){
    let status = '';

    try {
        
        await axios.delete('product/catagories',{ data:  item }).then((response)=>{
            status = response.data.status;
             
        });
    }catch (e) {
        status = 'field';
    }
    return status;        
    
},
}