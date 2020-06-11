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
    async product_save ( {commit}, { item} ){
        let status = '';
        try {
            await axios.post('product',item).then((response)=>{
                status = response.data.status;
                
            });
        }catch (e) {
            status = 'field';
        }
        return status;        
        
    },
    async product_update ( {commit}, { item} ){
        let status = '';
        try {
            await axios.put('product',item).then((response)=>{
                status = response.data.status;
                
            });
        }catch (e) {
            status = 'field';
        }
        return status;        
    
    },
    async product_delete ( {commit}, { item} ){
        let status = '';

        try {
            
            await axios.delete('product',{ data:  item }).then((response)=>{
                status = response.data.status;
                
            });
        }catch (e) {
            status = 'field';
        }
        return status;        
    
    },
    async product_gallery_save ( {commit}, { item} ){
        let status = '';
        try {
            await axios.post('product/gallery',item).then((response)=>{
                status = response.data.status;
                
            });
        }catch (e) {
            status = 'field';
        }
        return status;        
        
    },
    async product_gallery_update ( {commit}, { item} ){
        let status = '';
        try {
            await axios.put('product/gallery',item).then((response)=>{
                status = response.data.status;
                
            });
        }catch (e) {
            status = 'field';
        }
        return status;        
    
    },
    async product_gallery_delete ( {commit}, { item} ){
        let status = '';

        try {
            
            await axios.delete('product/gallery',{ data:  item }).then((response)=>{
                status = response.data.status;
                
            });
        }catch (e) {
            status = 'field';
        }
        return status;        
    
    },
    async doctor_save ( {commit}, { item} ){
        let status = '';
        try {
            await axios.post('doctor',item).then((response)=>{
                status = response.data.status;
                
            });
        }catch (e) {
            status = 'field';
        }
        return status;        
        
    },
    async doctor_update ( {commit}, { item} ){
        let status = '';
        try {
            await axios.put('doctor',item).then((response)=>{
                status = response.data.status;
                
            });
        }catch (e) {
            status = 'field';
        }
        return status;        
    
    },
    async doctor_delete ( {commit}, { item} ){
        let status = '';

        try {
            
            await axios.delete('doctor',{ data:  item }).then((response)=>{
                status = response.data.status;
                
            });
        }catch (e) {
            status = 'field';
        }
        return status;        
    
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

    async member_save ( {commit}, { item} ){
        let status = '';
        try {
            await axios.post('member',item).then((response)=>{
                status = response.data.status;
                
            });
        }catch (e) {
            status = 'field';
        }
        return status;        
        
    },
    async member_update ( {commit}, { item} ){
        let status = '';
        try {
            await axios.put('member',item).then((response)=>{
                status = response.data.status;
                
            });
        }catch (e) {
            status = 'field';
        }
        return status;        
    
    },
    async member_delete ( {commit}, { item} ){
        let status = '';

        try {
            
            await axios.delete('member',{ data:  item }).then((response)=>{
                status = response.data.status;
                
            });
        }catch (e) {
            status = 'field';
        }
        return status;        
    
    },
}