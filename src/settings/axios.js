import axios from 'axios';
/** https://cryptix-backend.herokuapp.com */
/** https://server.encore.fans */
/** https://server.verify.encore.fans */
const instance = axios.create({baseURL: process.env.REACT_APP_SERVER_URL});
export default instance
