import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: "https://sharepin.herokuapp.com/api/"
})

//baseURL: "https://sharepin.herokuapp.com/api/"