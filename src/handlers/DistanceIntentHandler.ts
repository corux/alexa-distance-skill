import { BaseRequestHandler, IExtendedHandlerInput, Intents } from "@corux/ask-extensions";
import { IntentRequest, Response } from "ask-sdk-model";
import axios from "axios";
import { URL } from "url";

@Intents("DistanceIntent")
export class DistanceIntentHandler extends BaseRequestHandler {
  public async handle(handlerInput: IExtendedHandlerInput): Promise<Response> {
    const t: any = handlerInput.t;
    const slots = (handlerInput.requestEnvelope.request as IntentRequest).intent.slots || {};
    const from = slots.from && slots.from.value;
    const to = slots.to && slots.to.value;

    const error = (text: string) => handlerInput.getResponseBuilder()
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
      return error(t("distance.calculation-error", { from, to }));
    }

    return handlerInput.getResponseBuilder()
      .speak(t("distance.response", {
        distance: `<say-as interpret-as="unit">${data.distance}</say-as>`,
        duration: data.duration,
        from,
        to,
      }))
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
