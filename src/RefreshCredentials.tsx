import React, { useState, useEffect } from "react";
import {
  AuthorizationCode,
  getUserCredentials,
  getAddCredentialsLink,
  generateAuthorizationCode,
  Credentials,
  refreshCredentialsLink,
  authenticateCredentialsLink,
  payLink,
  getTransfers,
} from './api';
import { Header } from "./Header";
import { CheckIcon } from "./images/CheckIcon";
import { PrettyCode } from "./PrettyCode";

type RefreshCredentialsProps = {
  userId: string;
  paymentRequestId?:string;
};

export const RefreshCredentials: React.FC<RefreshCredentialsProps> = ({
  userId, paymentRequestId
}) => {
  const [tranfers, setTransfers] = useState<any>(undefined)
  const [credentials, setCredentials] = useState<Credentials[] | undefined>(
    undefined
  );
  const [authorizationCode, setAuthorizationCode] = useState<
    AuthorizationCode | undefined
  >(undefined);

  useEffect(() => {
    const getCredentials = async (userId: string) => {
      const credentialsResponse = await getUserCredentials(userId);
      console.log("credentialsResponse: ", credentialsResponse);
      setCredentials(credentialsResponse.credentials);
    };

    const getAuthorizationCode = async (userId: string) => {
      const authorizationCode = await generateAuthorizationCode(userId);
      setAuthorizationCode(authorizationCode);
    };

    const getT = async (paymentRequestId: string) => {
      const transfersResponse = await getTransfers(paymentRequestId);
      setTransfers(transfersResponse.paymentRequestCreatedTransfers);
    };

    getAuthorizationCode(userId);

    getCredentials(userId);

    paymentRequestId && getT(paymentRequestId)
  }, [paymentRequestId, userId]);

  return (
    <>
      <Header />

      <div className="content">
        <div className="heading-1">Add credentials to permanent user</div>

        <div className="paper">
          <div className="display-flex">
            <div>
              <CheckIcon />
            </div>
            <div className="ml-16 mr-40">
              <div className="heading-2">
                Credentials were successfully added to user!
              </div>
              {!credentials && <div>Fetching credentials ...</div>}
              {tranfers && <PrettyCode
                code={JSON.stringify(tranfers, null, 2)}
                className="mt-20 ws-pl"
              />}
              {credentials &&
                credentials.map(credential => (
                  <div key={credential.id}>
                    <PrettyCode
                      code={JSON.stringify(credential, null, 2)}
                      className="mt-20"
                    />
                    {authorizationCode && (
                      <>
                        <a
                          className="button mt-24"
                          href={refreshCredentialsLink(
                            authorizationCode.code,
                            userId,
                            credential.id
                          )}
                        >
                          Refresh credentials
                        </a>
                        {credential.providerName.includes("open-banking") && (
                          <a
                            className={"button mt-24 ml-16"}
                            href={authenticateCredentialsLink(
                              authorizationCode.code,
                              userId,
                              credential.id
                            )}
                          >
                            Authenticate PSD2 credentials
                          </a>
                        )}
                        <a
                          className={"button mt-24 ml-16"}
                          href={payLink(
                            authorizationCode.code,
                            userId,
                            credential.id,
                          )}
                        >
                          Pay stuff
                        </a>
                      </>
                    )}
                  </div>
                ))}

              {authorizationCode && (
                <div>
                  <div className="mt-40">
                    Tink Link url to add additional credentials
                  </div>
                  <pre className="code break-word mt-16 text">
                    {getAddCredentialsLink(authorizationCode.code, userId)}
                  </pre>

                  <a
                    className="button mt-24 mb-40"
                    href={getAddCredentialsLink(authorizationCode.code, userId)}
                  >
                    Add another credentials to this user
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="walking-hand my-auto mt-120 mb-80"></div>
      </div>
    </>
  );
};
