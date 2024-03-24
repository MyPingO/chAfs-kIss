export async function stripeCheckout(stripePromise) {
  const response = await fetch(
    `${import.meta.env.VITE_SERVER_URL}/create-stripe-checkout`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        quantity: 5,
      }),
    },
  );
  const data = await response.json();

  const stripe = await stripePromise;
  const result = await stripe.redirectToCheckout({
    sessionId: data.session_id,
  });

  if (result.error) {
    console.error(result.error.message);
  }
}
