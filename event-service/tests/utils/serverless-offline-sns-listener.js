import AWS from "aws-sdk";
import Koa from "koa";
import _ from "lodash";
import bodyParser from "koa-bodyparser";

class Sns {
  constructor(config) {
    this._sns = new AWS.SNS(config);
    this._subscription = null;
  }
  async subscribe(topicArn, endpointUrl) {
    if (this._subscription) {
      throw new Error("Already subscribed to topic");
    }
    this._subscription = await this._sns
      .subscribe({
        TopicArn: topicArn,
        Protocol: "http",
        Endpoint: endpointUrl
      })
      .promise();
  }
  async unsubscribe() {
    if (!this._subscription) {
      throw new Error("Not subscribed to topic");
    }
    const params = {
      SubscriptionArn: this._subscription.SubscriptionArn
    };
    await this._sns.unsubscribe(params).promise();
    this._subscription = null;
    this._sns = null;
  }
}

export default class {
  constructor(snsConfig) {
    this._sns = new Sns(snsConfig);
    this._app = null;
    this._server = null;
    this.clearReceivedMessages();
  }
  async startListening(topicArn, listenerPort) {
    this._app = new Koa();
    this._app.use(bodyParser());
    this._app.use(async ctx => {
      const message = _.get(ctx, "request.body.Records[0].Sns.Message");
      if (!message) {
        this._receivedMessages.push("ERROR: Failed to get received message");
      } else {
        const decodedMessage = JSON.parse(message);
        this._receivedMessages.push(decodedMessage.default || decodedMessage);
      }
      ctx.response.status = 200;
    });
    this._server = this._app.listen(listenerPort);
    await this._sns.subscribe(topicArn, `http://localhost:${listenerPort}/sns`);
  }
  get receivedMessages() {
    return this._receivedMessages;
  }
  clearReceivedMessages() {
    this._receivedMessages = [];
  }
  async stopListening() {
    await this._sns.unsubscribe();
    this._sns = null;
    this._server.close();
    this._server = null;
    this._app = null;
  }
}
