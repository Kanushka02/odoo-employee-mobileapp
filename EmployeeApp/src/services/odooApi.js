import axios from 'axios';
import { BASE_URL } from '../config/config';



let DEFAULT_DB = '';
let DEFAULT_USERNAME = null;
let DEFAULT_PASSWORD = '';

let baseUrl = BASE_URL;
let db = DEFAULT_DB;
let username = DEFAULT_USERNAME;
let password = DEFAULT_PASSWORD;

let uid = null;

export const logout = () => {
  uid = null;
};

export const setConnectionConfig = (config = {}) => {
  baseUrl = config.baseUrl || BASE_URL;
  db = config.db || DEFAULT_DB;
  username = config.username || DEFAULT_USERNAME;
  password = config.password || DEFAULT_PASSWORD;
};

export const login = async (credentials = {}) => {
  try {
    const loginDb = credentials.db || db;
    const loginUsername = credentials.username || username;
    const loginPassword = credentials.password || password;
    const loginBaseUrl = credentials.baseUrl || baseUrl;

    const response = await axios.post(loginBaseUrl, {
      jsonrpc: '2.0',
      method: 'call',
      params: {
        service: 'common',
        method: 'login',
        args: [loginDb, loginUsername, loginPassword],
      },
      id: 1,
    });

    uid = response.data.result;

    if (!uid) {
      throw new Error('Invalid Odoo credentials.');
    }

    db = loginDb;
    username = loginUsername;
    password = loginPassword;
    baseUrl = loginBaseUrl;

    console.log('Login Success UID:', uid);

    return uid;
  } catch (error) {
    console.log('Login Error:', error);
    throw error;
  }
};

export const getEmployees = async () => {
  try {
    const response = await axios.post(baseUrl, {
      jsonrpc: '2.0',
      method: 'call',
      params: {
        service: 'object',
        method: 'execute_kw',
        args: [
          db,
          uid,
          password,
          'hr.employee',
          'search_read',
          [[]],
          {
            fields: [
              'name',
              'work_email',
              'job_title',
              'image_1920',
              'parent_id',

            ],
          },
        ],
      },
      id: 2,
    });

    return (response.data.result || []).map((employee) => ({
      ...employee,
      job_title:
        employee.job_title ||
        (Array.isArray(employee.job_id) ? employee.job_id[1] : '') ||
        '',
    }));
  } catch (error) {
    console.log('Employee Fetch Error:', error);
    throw error;
  }
};

export const createEmployee = async (
  name,
  email,
  job,
  imageBase64 = false,
  managerId = false
) => {
  try {
    const response = await axios.post(baseUrl, {
      jsonrpc: '2.0',
      method: 'call',
      params: {
        service: 'object',
        method: 'execute_kw',
        args: [
          db,
          uid,
          password,
          'hr.employee',
          'create',
          [
            {
              name: name,
              work_email: email,
              job_title: job,
              image_1920: imageBase64,
              parent_id: managerId || false
            },
          ],
        ],
      },
      id: 3,
    });

    return response.data.result;
  } catch (error) {
    console.log('Create Error:', error);
    throw error;
  }
};


export const updateEmployee = async (
  id,
  name,
  email,
  job,
  imageBase64 = false,
  managerId = false
) => {
  try {
    const values = {
      name: name,
      work_email: email,
      job_title: job,
      parent_id: managerId || false,
    };

    if (imageBase64) {
      values.image_1920 = imageBase64;
    }

    const response = await axios.post(baseUrl, {
      jsonrpc: '2.0',
      method: 'call',
      params: {
        service: 'object',
        method: 'execute_kw',
        args: [
          db,
          uid,
          password,
          'hr.employee',
          'write',
          [
            [id],
            values,
          ],
        ],
      },
      id: 4,
    });

    return response.data.result;
  } catch (error) {
    console.log('Update Error:', error);
    throw error;
  }
};

export const deleteEmployee = async (id) => {
  try {
    const response = await axios.post(baseUrl, {
      jsonrpc: '2.0',
      method: 'call',
      params: {
        service: 'object',
        method: 'execute_kw',
        args: [
          db,
          uid,
          password,
          'hr.employee',
          'unlink',
          [[id]],
        ],
      },
      id: 5,
    });

    return response.data.result;
  } catch (error) {
    console.log('Delete Error:', error);
    throw error;
  }
};
