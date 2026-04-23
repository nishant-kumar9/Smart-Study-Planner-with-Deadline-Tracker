import axios from "axios";
import { API_URL } from "../config/api";

const TASKS_API_URL = `${API_URL}/tasks`;

const getToken = () => localStorage.getItem("token");

const getAuthConfig = () => {
  const token = getToken();

  if (!token) {
    throw new Error("Missing auth token. Please login again.");
  }

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const fetchTasksApi = async () => {
  const response = await axios.get(TASKS_API_URL, getAuthConfig());
  return response.data;
};

export const createTaskApi = async (payload) => {
  const response = await axios.post(TASKS_API_URL, payload, getAuthConfig());
  return response.data;
};

export const updateTaskApi = async (taskId, payload) => {
  const response = await axios.put(`${TASKS_API_URL}/${taskId}`, payload, getAuthConfig());
  return response.data;
};

export const deleteTaskApi = async (taskId) => {
  const response = await axios.delete(`${TASKS_API_URL}/${taskId}`, getAuthConfig());
  return response.data;
};
