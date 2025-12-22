
// https://www.npmjs.com/package/jwt-decode
export interface TokenInformation {
  issuedAt: number;
  exp: number;

  payload?: string;
}

export interface UserTokenInformation extends TokenInformation {
  username: string;
  id: number;
  email: string;
  name: string;
}


// http://npmjs.com/package/js-cookie
export interface CookieData { 
  name: string;
  value: string;
}
