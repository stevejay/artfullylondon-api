import withSnsMessageHandling from "../with-sns-message-handling";

export const handler = withSnsMessageHandling(async function(message) {
  if (!message) {
    return;
  }

  // console.log(`GOT MESSAGE: ${JSON.stringify(message)}`);
});
