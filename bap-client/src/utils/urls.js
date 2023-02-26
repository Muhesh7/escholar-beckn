import {
  BACKEND_URL
} from '../config';

// auth
export const LOGIN_URL = `${BACKEND_URL}/auth/login`;
export const REGISTER_URL = `${BACKEND_URL}/auth/register`;
export const LOGOUT_URL = `${BACKEND_URL}/auth/logout`;
export const USER_URL = `${BACKEND_URL}/auth/user`;

// search
export const SEARCH_URL = `${BACKEND_URL}/bap/search`;
export const SELECT_URL = `${BACKEND_URL}/bap/select`;

//
export const SEND_PDF_URL = `${BACKEND_URL}/bap/confirm`;

// File
export const GET_FILE = `${BACKEND_URL}/form/response/file`;

// Doc Status
export const GET_DOCS_STATUS = `${BACKEND_URL}/form/response/doc_status`;


export const GET_APPROVED_DOCS = `${BACKEND_URL}/form/response/approved`;
export const GET_REJECTED_DOCS = `${BACKEND_URL}/form/response/rejected`;
export const GET_PROCESSING_DOCS = `${BACKEND_URL}/form/response/processing`;


// Verify
export const VERIFY = `${BACKEND_URL}/verify`;