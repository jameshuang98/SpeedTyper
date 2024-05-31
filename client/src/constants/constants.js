const API_BASE_URL = process.env.NODE_ENV === 'production' ? 'https://speedtyper.azurewebsites.net/' : 'https://localhost:7021/';

export default API_BASE_URL;