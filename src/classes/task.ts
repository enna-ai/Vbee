import axios, { type AxiosInstance, type AxiosResponse, type AxiosHeaders } from "axios";

interface Task {
	_id?: string;
	task?: string;
	priority?: string;
	dueDate?: string;
	archived?: boolean;
	completed?: boolean;
}

class TaskAPI {
	private readonly taskAPI: AxiosInstance;

	public constructor() {
		this.taskAPI = axios.create({
			baseURL: "http://localhost:4000/api/v1/"
		});
	}

	private async makeRequest<T>(
		method: string,
		url: string,
		data: Task | null,
		headers: Record<string, string> | null
	): Promise<T> {
		try {
			const response: AxiosResponse<T> = await this.taskAPI.request({
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

	public async createTask(newTask: string, taskPriority: string, taskDueDate: string, token: string): Promise<Task> {

	}

	public async getTasks(token: string | null): Promise<Task[]> {
		const headers = {
			Authorization: `Bearer ${token}`
		};

		return this.makeRequest("get", "tasks", null, headers);
	}

	public async getTask(taskId: string, token: string) {

	}

	public async deleteTask(taskIs: string | null, token: string | null) {

	}

	public async updateTask(taskId: string, task: string, token: string) {

	}

	public async completeTask(taskIs: string, token: string): Promise<Task> {

	}

	public async updateTaskDueDate(taskId: string, date: string, token: string) {

	}

	public async updateTaskPriority(taskId: string, taskPriority: string, token: string) {

	}

	public async archiveTask(taskId: string, token: string): Promise<Task> {
		const headers = {
			Authorization: `Bearer ${token}`
		};

		return this.makeRequest("put", `tasks/${taskId}/archive`, null, headers);
	}

	public async purgeTasks(userId: string | null, token: string | null) {

	}
}

export default new TaskAPI();
