import {
  BACKEND_URL
} from '../config';

// auth
export const LOGIN_URL = `${BACKEND_URL}/auth/login`;
export const REGISTER_URL = `${BACKEND_URL}/form/create`;
export const LOGOUT_URL = `${BACKEND_URL}/auth/logout`;
export const USER_URL = `${BACKEND_URL}/auth/user`;

// roles
export const GET_ROLES_URL = `${BACKEND_URL}/roles`;

// workflow
export const WORKFLOW_URL = `${BACKEND_URL}/workflow`;

// forms
export const CREATE_FORM_URL = `${BACKEND_URL}/form/create_form`;
export const GET_FORM_URL = `${BACKEND_URL}/form/get_form`;
export const GET_ALL_FORM_URL = `${BACKEND_URL}/form/form_list`;
export const GET_EVERY_FORM_URL = `${BACKEND_URL}/form/form_list`;
export const UPDATE_FORM_URL = `${BACKEND_URL}/form/update_form`;
export const DELETE_FORM_URL = `${BACKEND_URL}/form/delete_form`;

// submissions
export const SEND_PDF_URL = `${BACKEND_URL}/form/save_pdf`;
export const SEND_PDF_URL_DOCTOR = `${BACKEND_URL}/form/save_pdf/doctor`;
export const SAVE_FORM_RESPONSE_URL = `${BACKEND_URL}/form/save_response`;

// form responses docs
export const GET_DOCS_STATUS = `${BACKEND_URL}/form/response/doc_status`;
export const GET_LANDING_STATS = `${BACKEND_URL}/form/response/landing`;

// approvals
export const GET_APPROVE_DOC_URL = `${BACKEND_URL}/form/response/toapprove`;
export const APPROVE_OR_REJECT_DOC_URL = `${BACKEND_URL}/form/response`;

// File
export const GET_FILE = `${BACKEND_URL}/form/response/file`;
export const UPLOAD_FILE = `${BACKEND_URL}/form/file/upload`;
