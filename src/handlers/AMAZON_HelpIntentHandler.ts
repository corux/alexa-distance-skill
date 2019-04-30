import { HandlerInput } from "ask-sdk-core";
import { Response } from "ask-sdk-model";
import { BaseIntentHandler, Intents } from "../utils";

@Intents("AMAZON.HelpIntent")
export class AmazonHelpIntentHandler extends BaseIntentHandler {
  public async handle(handlerInput: HandlerInput): Promise<Response> {
    const t = handlerInput.attributesManager.getRequestAttributes().t;

    return handlerInput.responseBuilder
      .speak(t("help"))
      .reprompt(t("launch"))
      .getResponse();
  }
}
