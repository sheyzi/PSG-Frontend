import { PUBLIC_API_ENDPOINT } from '$env/static/public';
import axios from 'axios';

export const axiosClient = axios.create({
	baseURL: PUBLIC_API_ENDPOINT
});
