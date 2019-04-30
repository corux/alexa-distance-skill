import { HandlerInput } from "ask-sdk-core";
import { IntentRequest, Response } from "ask-sdk-model";
import axios from "axios";
import { URL } from "url";
import { BaseIntentHandler, Intents } from "../utils";

@Intents("DistanceIntent")
export class DistanceIntentHandler extends BaseIntentHandler {
  public async handle(handlerInput: HandlerInput): Promise<Response> {
    const t = handlerInput.attributesManager.getRequestAttributes().t;
    const slots = (handlerInput.requestEnvelope.request as IntentRequest).intent.slots || {};
    const from = slots.from && slots.from.value;
    const to = slots.to && slots.to.value;

    const error = (text: string) => handlerInput.responseBuilder
      .speak(text)
      .reprompt(t("launch"))
      .getResponse();

    if (!from || !to) {
      return error(t("distance.missing-input"));
    } else if (from === to) {
      return error(t("distance.same-city"));
    }

    const data = await this.calculateDistance(from, to);
    if (!data) {
      return error(t("distance.calculation-error", from, to));
    }

    return handlerInput.responseBuilder
      .speak(t("distance.response", from, to, `<say-as interpret-as="unit">${data.distance}</say-as>`, data.duration))
      .withShouldEndSession(true)
      .getResponse();
  }

  private async calculateDistance(from: string, to: string): Promise<({ distance: string, duration: string })> {
    const url = new URL(`https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&mode=driving`);
    url.searchParams.append("language", "de");
    url.searchParams.append("origins", from);
    url.searchParams.append("destinations", to);
    url.searchParams.append("key", process.env.GOOGLE_API_KEY);

    const data = (await axios.get(url.toString())).data;
    if (data.status === "OK" && data.rows[0].elements[0].status === "OK") {
      return {
        distance: data.rows[0].elements[0].distance.text,
        duration: data.rows[0].elements[0].duration.text.replace(", ", " und "),
      };
    }
  }
}
