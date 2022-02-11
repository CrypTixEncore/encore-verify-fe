import axios from 'axios';
/** https://cryptix-backend.herokuapp.com */
/**https://server.cryptix.live */
const instance = axios.create({baseURL: 'https://server.cryptix.live'});
export default instance
