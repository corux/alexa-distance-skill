import { Skill, Launch, Intent, SessionEnded } from 'alexa-annotations';
import { say, ask } from 'alexa-response';
import request from 'request-promise-native';

@Skill
export default class AlexaDistanceSkill {

  async _getData(from, to) {
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?language=de&units=metric&mode=driving&origins=${encodeURIComponent(from)}&destinations=${encodeURIComponent(to)}&key=${process.env.GOOGLE_API_KEY}`;
    const data = JSON.parse(await request(url));
    if (data.status === 'OK' && data.rows[0].elements[0].status === 'OK') {
      return {
        distance: data.rows[0].elements[0].distance.text,
        duration: data.rows[0].elements[0].duration.text.replace(', ', ' und '),
      };
    }
  }

  @Launch
  launch() {
    return ask('Nenne zwei Städte um die Entfernung zu berechnen.');
  }

  @Intent('DistanceIntent')
  async distanceIntent({ from, to }) {
    if (!from || !to) {
      return ask('Bitte nenne zwei Städte.');
    } else if (from === to) {
      return ask('Bitte nenne zwei unterschiedliche Städte.');
    }

    const data = await this._getData(from, to);
    if (!data) {
      return ask(`Ich konnte die Entfernung zwischen ${from} und ${to} nicht berechnen. Bitte nenne zwei andere Städte.`);
    }

    return say(`<speak>
      Die Entfernung zwischen ${from} und ${to} beträgt <say-as interpret-as="unit">${data.distance}</say-as>.
      Mit dem Auto werden dazu ${data.duration} benötigt.
    </speak>`, 'SSML');
  }

  @Intent('AMAZON.HelpIntent')
  help() {
    return ask('Du kannst nach der Entfernung zwischen zwei Städten fragen. Als Antwort wird die Entfernung und benötigte Zeit ausgegeben.');
  }

  @Intent('AMAZON.CancelIntent', 'AMAZON.StopIntent')
  stop() {
    return say('Bis bald!');
  }

  @SessionEnded
  sessionEnded() {
    // need to handle session ended event to circumvent error
    return {};
  }

}
