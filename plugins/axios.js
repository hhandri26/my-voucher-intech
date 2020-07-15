import axios from 'axios'

export default  axios.create({
  baseURL: 'http://103.136.76.250:9999/',
  headers: {'Content-Type':'application/json'}
});

  // export default  axios.create({
  //   baseURL: 'http://localhost:9999/',
  //   headers: {'Content-Type':'application/json','Accept':'application/json'}
  // });

  // virtuals
  // Virtualonline2019##
