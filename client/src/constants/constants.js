const API_BASE_URL = process.env.node_env === 'production' ? 'https://speedtyperapi.azurewebsites.net/' : 'https://localhost:7021/';

export default API_BASE_URL;