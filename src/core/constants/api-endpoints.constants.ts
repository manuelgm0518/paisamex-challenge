export const API_VERSIONS = {
  V1: '1',
  V2: '2',
  V3: '3',
};

export const API_PARAMS = {
  BY_ID: ':id',
  BY_USER: 'user/:user',
};

export const API_ENDPOINTS = {
  USERS: {
    BASE_PATH: 'users',
    BY_ID: API_PARAMS.BY_ID,
    SESSION: {
      BASE_PATH: 'session',
      LOG_IN: 'log-in',
      SIGN_UP: 'sign-up',
    },
  },
  REMITTANCES: {
    BASE_PATH: 'remittances',
    BY_ID: API_PARAMS.BY_ID,
    BY_USER: API_PARAMS.BY_USER,
    SEND: 'send',
    MOVEMENTS: `${API_PARAMS.BY_ID}/movements`,
    REJECT: `${API_PARAMS.BY_ID}/reject`,
    CANCEL: `${API_PARAMS.BY_ID}/cancel`,
    WITHDRAW: `${API_PARAMS.BY_ID}/withdraw`,
  },
};
