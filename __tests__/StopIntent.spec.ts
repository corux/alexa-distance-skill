import { VirtualAlexa } from "virtual-alexa";
import { handler } from "../src";

describe("AMAZON.StopIntent Handler", () => {
  let alexa: VirtualAlexa;
  beforeEach(() => {
    alexa = VirtualAlexa.Builder()
      .handler(handler)
      .interactionModelFile("models/de-DE.json")
      .create();
    alexa.filter((requestJSON) => {
      requestJSON.request.locale = "de-DE";
    });
  });

  ["AMAZON.StopIntent", "AMAZON.CancelIntent"].forEach((intent) => {
    test(`${intent} ends session`, async () => {
      const result = await alexa.intend(intent);
      expect(result.response.outputSpeech.ssml).toContain("Bis bald!");
      expect(result.response.shouldEndSession).toBe(true);
    });
  });
});
