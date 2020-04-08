import React from "react";
import { Error } from "./Error";
import { RefreshCredentials } from "./RefreshCredentials";

export const TinkLinkCallback = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const error = urlParams.get("error");
  const userId = urlParams.get("state");
  const paymentRequestId = urlParams.get("payment_request_id");

  if (error) {
    const errorMessage = urlParams.get("message") || undefined;

    return <Error error={error} errorMessage={errorMessage} />;
  }

  if (userId && !paymentRequestId ) {
    return <RefreshCredentials userId={userId} />;
  }

  if (userId && paymentRequestId) {
    return <RefreshCredentials userId={userId} paymentRequestId={paymentRequestId}/>;
  }

  return null;
};
