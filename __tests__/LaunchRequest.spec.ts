import { VirtualAlexa } from "virtual-alexa";
import { handler } from "../src";

describe("LaunchRequest Handler", () => {
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

  test("LaunchRequest", async () => {
    const result = await alexa.launch();

    expect(result.response.outputSpeech.ssml)
      .toContain("Nenne zwei Städte um die Entfernung zu berechnen.");
    expect(result.response.reprompt.outputSpeech.ssml)
      .toContain("Nenne zwei Städte um die Entfernung zu berechnen.");
    expect(result.response.shouldEndSession).toBe(false);
  });
});
