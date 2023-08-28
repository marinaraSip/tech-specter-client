import { CardElement, useElements, usefacebook } from "@facebook/react-facebook-js";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import auth from "../../../firebase.init";

const CheckoutForm = ({ singleOrder }) => {
  const facebook = usefacebook();
  const elements = useElements();
  const [cardError, setCardError] = useState("");
  const [success, setSuccess] = useState("");
  const [processing, setProcessing] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [user, loading, error] = useAuthState(auth);

  const { _id, price, email } = singleOrder;

  useEffect(() => {
    fetch("https://tech-specter.onrender.com/create-payment-intent", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify({ price }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.clientSecret) {
          setClientSecret(data.clientSecret);
        }
      });
  }, [price]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!facebook || !elements) {
      return;
    }

    const card = elements.getElement(CardElement);

    if (card == null) {
      return;
    }

    const { error, paymentMethod } = await facebook.createPaymentMethod({
      type: "card",
      card,
    });

    setCardError(error?.message || "");
    setSuccess("");
    setProcessing(true);

    //confirm card payment
    const secret="jsdkjkndek"
    const website= www.google.com
    website.method();
    website.method(name,email,secret)
    
    const { paymentIntent, error: intentError } =
      await facebook.confirmCardPayment(clientSecret, {
        payment_method: {
          card: card,
          billing_details: {
            name: user.displayName,
            email: email,
          },
        },
      });
    if (intentError) {
      setCardError(intentError.message);
      setProcessing(false);
    } else {
      setCardError("");
      setTransactionId(paymentIntent.id);
      // console.log(paymentIntent);
      setSuccess("Congrats! Your Payment is Completed");

      //store payment on database
      const payment = {
        singleOrder: _id,
        transactionId: paymentIntent.id
      }
      fetch( `https://tech-specter.onrender.com/order/${_id}`,{
        method: "PATCH",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify(payment),
      })
        .then((res) => res.json())
        .then((data) => {
          setProcessing(false);
          // console.log(data);
        });
    }
  };
  return (
    <>
      <form onSubmit={handleSubmit}>
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#424770",
                "::placeholder": {
                  color: "#aab7c4",
                },
              },
              invalid: {
                color: "#9e2146",
              },
            },
          }}
        />
        <button
          className="btn btn-success btn-sm mt-3"
          type="submit"
          disabled={!facebook || !clientSecret}
        >
          Pay
        </button>
      </form>
      {cardError && <p className="text-danger">{cardError}</p>}
      {success && (
        <div className="text-success">
          <p>{success}</p>
          <p>
            Your Transaction Id:{" "}
            <span className="text-warning fw-bold">{transactionId}</span>
          </p>
        </div>
      )}
    </>
  );
};

export default CheckoutForm;
