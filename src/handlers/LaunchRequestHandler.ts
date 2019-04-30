import { HandlerInput } from "ask-sdk-core";
import { Response } from "ask-sdk-model";
import { BaseIntentHandler, Request } from "../utils";

@Request("LaunchRequest")
export class LaunchRequestHandler extends BaseIntentHandler {
  public async handle(handlerInput: HandlerInput): Promise<Response> {
    const t = handlerInput.attributesManager.getRequestAttributes().t;

    return handlerInput.responseBuilder
      .speak(t("launch"))
      .reprompt(t("launch"))
      .getResponse();
  }
}
