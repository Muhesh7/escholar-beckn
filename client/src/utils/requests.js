import axios from 'axios';
import {
  LOGIN_URL,
  REGISTER_URL,
  LOGOUT_URL,
  USER_URL,
  GET_ROLES_URL
} from './urls';

// withCredentials
const withCredentials = {
  withCredentials: true
};

// auth requests
export const loginRequest = ({ email, password }) => axios.post(
  LOGIN_URL,
  {
    email,
    password
  },
  withCredentials
);

export const registerRequest = ({
  email, name, password, role
}) => axios.post(
  REGISTER_URL,
  {
    email,
    password,
    name,
    role
  },
  withCredentials
);

export const logoutRequest = () => axios.get(LOGOUT_URL, withCredentials);

export const userRequest = () => axios.get(USER_URL, withCredentials);

// roles

export const getRolesRequest = () => axios.get(`${GET_ROLES_URL}`, withCredentials);