const TINK_LINK_URL = "https://link.preprod.oxford.tink.se";

export type User = {
  user_id: string;
};

export const createPermanentUser = async (): Promise<User> => {
  const response = await fetch("/permanent-user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    }
  });

  const permanentUserResponse = await response.json();

  return permanentUserResponse.data;
};

export type AuthorizationCode = {
  code: string;
};

export const generateAuthorizationCode = async (
  userId: string
): Promise<AuthorizationCode> => {
  const response = await fetch("/authorization-code", {
    method: "POST",
    body: JSON.stringify({ user_id: userId }),
    headers: {
      "Content-Type": "application/json"
    }
  });

  const authorizationCodeResponse = await response.json();

  return authorizationCodeResponse.data;
};

type CredentialsReponse = {
  credentials: Credentials[];
};

export type Credentials = {
  id: string;
  providerName: string;
  type: string;
  status: string;
  statusUpdated: number;
  statusPayload: string;
  updated: number;
  fields: any[];
  userId: string;
};

export const getUserCredentials = async (
  userId: string
): Promise<CredentialsReponse> => {
  const reponse = await fetch(`/user/${userId}/credentials`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  });

  const credentialsResponse = await reponse.json();

  return credentialsResponse.data;
};

type TransferResponse = {
  paymentRequestCreatedTransfers: any[];
};

// export type Transfer = {
//   id: string;
//   providerName: string;
//   type: string;
//   status: string;
//   statusUpdated: number;
//   statusPayload: string;
//   updated: number;
//   fields: any[];
//   userId: string;
// };

export const getTransfers = async (
  paymentRequestId: string
): Promise<TransferResponse> => {
  console.log(paymentRequestId)
  const reponse = await fetch(`/payments/requests/${paymentRequestId}/transfers`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  });

  const transfersResponse = await reponse.json();

  return transfersResponse.data;
};

export const getAddCredentialsLink = (
  authorizationCode: string,
  userId: string
) => {
  // Read more about Tink Link initialization parameters: https://docs.tink.com/api/#initialization-parameters
  const params = [
    `client_id=${process.env.REACT_APP_TINK_LINK_PERMANENT_USERS_CLIENT_ID}`,
    "redirect_uri=http://localhost:3000/callback",
    "scope=user:read,credentials:read",
    `market=${process.env.REACT_APP_TINK_LINK_PERMANENT_USERS_MARKET}`,
    "locale=en_US",
    `state=${userId}`,
    `authorization_code=${authorizationCode}`,
    // "test=true" // Change this to `false` if you want to see real banks instead of test providers.
  ];

  return `${TINK_LINK_URL}/1.0/credentials/add?${params.join("&")}`;
};

export const refreshCredentialsLink = (
  authorizationCode: string,
  userId: string,
  credentialsId: string
) => {
  // Read more about Tink Link initialization parameters: https://docs.tink.com/api/#initialization-parameters
  const params = [
    `client_id=${process.env.REACT_APP_TINK_LINK_PERMANENT_USERS_CLIENT_ID}`,
    "redirect_uri=http://localhost:3000/callback",
    "scope=user:read,credentials:read",
    `market=${process.env.REACT_APP_TINK_LINK_PERMANENT_USERS_MARKET}`,
    "locale=en_US",
    `state=${userId}`,
    `authorization_code=${authorizationCode}`,
    `credentials_id=${credentialsId}`
  ];

  return `${TINK_LINK_URL}/1.0/credentials/refresh?${params.join("&")}`;
};

export const authenticateCredentialsLink = (
  authorizationCode: string,
  userId: string,
  credentialsId: string
) => {
  // Read more about Tink Link initialization parameters: https://docs.tink.com/api/#initialization-parameters
  const params = [
    `client_id=${process.env.REACT_APP_TINK_LINK_PERMANENT_USERS_CLIENT_ID}`,
    "redirect_uri=http://localhost:3000/callback",
    "scope=user:read,credentials:read",
    `market=${process.env.REACT_APP_TINK_LINK_PERMANENT_USERS_MARKET}`,
    "locale=en_US",
    `state=${userId}`,
    `authorization_code=${authorizationCode}`,
    `credentials_id=${credentialsId}`,
  ];

  return `${TINK_LINK_URL}/1.0/credentials/authenticate?${params.join("&")}`;
};

export const payLink = (
  authorizationCode: string,
  userId: string,
  credentialsId: string
) => {
  // Read more about Tink Link initialization parameters: https://docs.tink.com/api/#initialization-parameters
  const params = [
    `client_id=${process.env.REACT_APP_TINK_LINK_PERMANENT_USERS_CLIENT_ID}`,
    "redirect_uri=http://localhost:3000/callback",
    "scope=user:read,credentials:read",
    "market=IT",
    "locale=en_US",
    `state=${userId}`,
    `authorization_code=${authorizationCode}`,
    `credentials_id=${credentialsId}`,
    `payment_request_id=665c0400703711ea92b5b11813e20ed1`,
    `test=true`,
    `session_id=e8a5a54bbb814a1bb4b6a3caba406f6b282ce05ad02c4cd8ab67130de972c0b0`,
  ];

  return `${TINK_LINK_URL}/1.0/pay/credentials?${params.join("&")}`;
};
