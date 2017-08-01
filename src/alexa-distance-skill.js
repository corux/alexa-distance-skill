import { Skill, Launch, Intent, SessionEnded } from 'alexa-annotations';
import { say, ask } from 'alexa-response';

@Skill
export default class AlexaDistanceSkill {

  @Launch
  launch() {
    return ask('Nenne zwei Städte um die Entfernung zu berechnen.');
  }

  @Intent('DistanceIntent')
  distanceIntent({ from, to }) {
    if (!from || !to) {
      return ask('Bitte nenne zwei Städte.');
    } else if (from === to) {
      return ask('Bitte nenne zwei unterschiedliche Städte.');
    }

    return say(`<speak>
      Die Entfernung zwischen ${from} und ${to} beträgt <say-as interpret-as="unit">10 km</say-as>.
      Mit dem Auto werden dazu <say-as interpret-as="time">10:05</say-as> benötigt.
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
