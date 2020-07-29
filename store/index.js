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
                    localStorage.setItem("zona",response.data.values[0].zona);
                    localStorage.setItem("email",response.data.values[0].email);
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
        this.$router.push('/')
    },
    async user_save ( {commit}, { item} ){
        let status = '';
        try {
            await axios.post('users',item).then((response)=>{
                status = response.data.status;
                
            });
        }catch (e) {
            status = 'field';
        }
        return status;        
        
    },
    async user_update ( {commit}, { item} ){
        let status = '';
        try {
            await axios.put('users',item).then((response)=>{
                status = response.data.status;
                
            });
        }catch (e) {
            status = 'field';
        }
        return status;        
    
    },

    async update_status_voucher ( {commit}, { item} ){
        let status = '';
        try {
            await axios.put('payment/status_vucher',item).then((response)=>{
                status = response.data.status;
                
            });
        }catch (e) {
            status = 'field';
        }
        return status;        
    
    },
    async user_delete ( {commit}, { item} ){
        let status = '';

        try {
            
            await axios.delete('users',{ data:  item }).then((response)=>{
                status = response.data.status;
                
            });
        }catch (e) {
            status = 'field';
        }
        return status;        
    
    },
    async transaction_save ( {commit}, { header,detail} ){
        let status = '';
        try {
            await axios.post('payment',{header,detail}).then((response)=>{
                status = response.data.status;
                
            });
        }catch (e) {
            status = 'field';
        }
        return status;        
        
    },
    async upload_bukti_transfer ( {commit}, { item} ){
        let status = '';
        try {
            await axios.post('payment/upload',item).then((response)=>{
                status = response.data.status;
                
            });
        }catch (e) {
            status = 'field';
        }
        return status;        
        
    },
    async approved ( {commit}, { item} ){
        let status = '';
        try {
            await axios.post('payment/approved',item).then((response)=>{
                status = response.data.status;
                
            });
        }catch (e) {
            status = 'field';
        }
        return status;        
        
    },

    async user_lokasi_save ( {commit}, { dat} ){
        let status = '';
        try {
            await axios.post('/user/lokasi',dat).then((response)=>{
                status = response.data.status;
                
            });
        }catch (e) {
            status = 'field';
        }
        return status;        
        
    },
  
}