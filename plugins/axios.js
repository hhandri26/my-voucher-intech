import axios from 'axios'

// export default  axios.create({
//     baseURL: 'http://103.195.90.232:88/api/',
//     headers: {'Content-Type':'application/json'}
//   });

  export default  axios.create({
    baseURL: 'http://localhost:3030/',
    headers: {'Content-Type':'application/json','Accept':'application/json'}
  });

  // virtuals
  // Virtualonline2019##
