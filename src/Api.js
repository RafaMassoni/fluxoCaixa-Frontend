import axios from 'axios';

const Api = axios.create({
    baseURL: 'https://fluxocaixa-backend.herokuapp.com/'
})

export default Api;