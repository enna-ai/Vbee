import axios, { type AxiosInstance, type AxiosResponse, type AxiosHeaders } from "axios";

interface UserCredentials {
	email: string;
	password: string;
}

class UserAPI {
	private readonly userAPI: AxiosInstance;

	public constructor() {
		this.userAPI = axios.create({
			baseURL: "http://localhost:4000/api/v1/users/"
		});
	}

	private async makeRequest<T>(
		method: string,
		url: string,
		data: UserCredentials | null = null,
		headers: Record<string, string> | null = null
	): Promise<T> {
		try {
			const response: AxiosResponse<T> = await this.userAPI.request({
				method,
				url,
				data,
				headers: headers as AxiosHeaders
			});

			if (response.status !== 200) {
				throw new Error(`Request failed with status code ${response.status}`);
			}

			return response.data;
		} catch (error: any) {
			console.error(error.response.data.error);
			throw error;
		}
	}

	public async getUserProfile(token: string) {

	}

	public async login(email: string, password: string, token: string) {

	}

	public async logout() {
		return this.makeRequest("post", "logout");
	}

	public async register(username: string, email: string, password: string) {

	}
}

export default new UserAPI();
