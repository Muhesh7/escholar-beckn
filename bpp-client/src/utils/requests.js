import axios from 'axios';
import {
  REGISTER_URL,
  USER_URL,
  GET_ROLES_URL,
  WORKFLOW_URL,
  CREATE_FORM_URL,
  GET_ALL_FORM_URL,
  GET_EVERY_FORM_URL,
  DELETE_FORM_URL,
  GET_FORM_URL,
  UPDATE_FORM_URL,
  SAVE_FORM_RESPONSE_URL,
  GET_DOCS_STATUS,
  GET_FILE,
  GET_APPROVE_DOC_URL,
  APPROVE_OR_REJECT_DOC_URL,
  GET_LANDING_STATS,
  UPLOAD_FILE
} from './urls';

// withCredentials
const withCredentials = {
  withCredentials: true
};

// auth requests

export const registerRequest = (body) => axios.post(
  REGISTER_URL,
  body
);

export const userRequest = () => axios.get(USER_URL, withCredentials);

// roles

export const getRolesRequest = () => axios.get(`${GET_ROLES_URL}/list`, withCredentials);
export const getPatientsRequest = () => axios.get(`${GET_ROLES_URL}/patients`, withCredentials);

// workflow requests
export const createWorkflowRequest = (workflow) => axios.post(WORKFLOW_URL, workflow, withCredentials);

export const listWorkflowsRequest = () => axios.get(`${WORKFLOW_URL}/all`, withCredentials);

export const getWorkflowRequest = (id) => axios.get(`${WORKFLOW_URL}/${id}`, withCredentials);

export const updateWorkflowRequest = (id, workflow) => axios.put(`${WORKFLOW_URL}/${id}`, workflow, withCredentials);

export const deleteWorkflowRequest = (id) => axios.delete(`${WORKFLOW_URL}/${id}`, withCredentials);

// forms requests
export const createFormRequest = (
  formName,
  formData,
  workflow,
  dependsOnForms
) => axios.post(
  CREATE_FORM_URL,
  {
    name: formName,
    data: formData,
    workflow,
    dependsOnForms
  },
  withCredentials
);

export const getFormRequest = (formId) => axios.get(`${GET_FORM_URL}?id=${formId}`, withCredentials);

export const getAllFormsRequest = () => axios.get(GET_ALL_FORM_URL, withCredentials);

export const getEveryFormsRequest = () => axios.get(GET_EVERY_FORM_URL, withCredentials);

export const updateFormRequest = ({
  name,
  id,
  data,
  workflow,
  dependsOnForms
}) => axios.post(
  UPDATE_FORM_URL,
  {
    name,
    id,
    data,
    workflow,
    dependsOnForms
  },
  withCredentials
);

export const deleteFormRequest = ({ id }) => axios.delete(`${DELETE_FORM_URL}?id=${id}`, withCredentials);

export const getDocsRequestStatus = (formId) => axios.get(`${GET_DOCS_STATUS}/${formId}`, withCredentials);

export const getLandingPageStats = () => axios.get(GET_LANDING_STATS, withCredentials);

// form responses get approve
export const getApproveDocRequest = () => axios.get(`${GET_APPROVE_DOC_URL}`, withCredentials);

export const approveDocRequest = (fileId, approve) => axios.patch(
  `${APPROVE_OR_REJECT_DOC_URL}/${fileId}/${approve}`,
  {},
  withCredentials
);

export const saveFormResponseRequest = (formId, response) => axios.post(
  `${SAVE_FORM_RESPONSE_URL}`,
  { formId, response },
  withCredentials
);

// get file
export const fileGetRequest = (fileId, email, role) => `${GET_FILE}/${fileId}/${email}/${role}`;

export const uploadFileRequest = (formData) => axios.post(
  `${UPLOAD_FILE}`,
  formData,
  {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    ...withCredentials
  }
);

