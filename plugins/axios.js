import axios from 'axios'

export default  axios.create({
  baseURL: 'http://103.136.76.251:9999/',
  headers: {'Content-Type':'application/json'}
});

  // export default  axios.create({
  //   baseURL: 'http://153.92.4.44:3030/',
  //   headers: {'Content-Type':'application/json','Accept':'application/json'}
  // });

  // virtuals
  // Virtualonline2019##
