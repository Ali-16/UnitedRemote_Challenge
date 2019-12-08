'use strict';

export const apiURL: string = 'http://127.0.0.1:8000/api';
export const trustedTokenIssuer = {
  signin: `${apiURL}/signin`,
  signup: `${apiURL}/signup`,
  refresh: `${apiURL}/refresh`
};
export const emailRegEx: string = "/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/";
export const pwdRegEx: string = "/[a-zA-Z0-9]{6,}/";