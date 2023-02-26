import axios from 'axios';
import {
  LOGIN_URL,
  REGISTER_URL,
  LOGOUT_URL,
  USER_URL,
  SEARCH_URL,
  SELECT_URL,
  GET_DOCS_STATUS,
  GET_FILE,
  GET_APPROVED_DOCS,
  GET_REJECTED_DOCS,
  GET_PROCESSING_DOCS,
  VERIFY

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
  email, name, password, address
}) => axios.post(
  REGISTER_URL,
  {
    email,
    password,
    name,
    address
  },
  withCredentials
);

export const logoutRequest = () => axios.get(LOGOUT_URL, withCredentials);

export const userRequest = () => axios.get(USER_URL, withCredentials);

// search requests
export const searchRequest = (query) => axios.post(
  SEARCH_URL,
  query,
  withCredentials
);

export const selectRequest = (query) => axios.post(
  SELECT_URL,
  query,
  withCredentials
);

export const getDocsRequestStatus = (formId) => axios.get(`${GET_DOCS_STATUS}/${formId}`, withCredentials);

// get file
export const fileGetRequest = (fileId, email, role) => `${GET_FILE}/${fileId}/${email}/Student`;


// form responses requests
export const getApprovedDocsRequest = () => axios.get(GET_APPROVED_DOCS, withCredentials);

export const getRejectedDocsRequest = () => axios.get(GET_REJECTED_DOCS, withCredentials);

export const getProcessingDocsRequest = () => axios.get(GET_PROCESSING_DOCS, withCredentials);

export const verifyRequest = (formData) => axios.post(
  `${VERIFY}`,
  formData,
  {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }
);