import axios from 'axios';

//const API_ENDPOINT = "http://localhost:3000/api/";
const API_ENDPOINT = "https://td4orbzbj52jrj77ecwgjjygse0hsrmk.lambda-url.ca-central-1.on.aws/api/";

export const apiCalls = async (method, endPoint,companyId = null, id = null, body = null) => {
    const options = {
        method: method,
        url: API_ENDPOINT + `${endPoint}`+(companyId != null ? `/${companyId}` : '') + (id != null ? `/${id}` : ''),
        headers: {
            'content-Type': 'application/json'        
        },
        data: body
    };
    try {
        return await axios.request(options);
    } catch (error) {
        return error;
    }
    // api calls
};

export const loginAuth = async (username, password) => {
    const options = {
        method: "GET",
        url: API_ENDPOINT + `user/auth/${username}/${password}`,
        headers: {
            'content-Type': 'application/json'
        },
    };
    try {
        return await axios.request(options);
    } catch (error) {
        return error;
    }
    // api calls
};






