import test from 'ava';
import { handler as Skill } from '../build/skill';
import Request from 'alexa-request';
import chai from 'chai';
import chaiSubset from 'chai-subset';

const expect = chai.expect;
chai.use(chaiSubset);

test('LaunchRequest', async () => {
  const event = Request.launchRequest().build();

  const response = await Skill(event);
  expect(response.response.outputSpeech.text).to.contain('Entfernung');
  expect(response).to.containSubset({
    response: {
      shouldEndSession: false,
      outputSpeech: { type: 'PlainText' }
    }
  });
});

test('AMAZON.StopIntent', async () => {
  const event = Request.intent('AMAZON.StopIntent').build();

  const response = await Skill(event);
  expect(response).to.containSubset({
    response: {
      shouldEndSession: true,
      outputSpeech: { type: 'PlainText', text: 'Bis bald!' }
    }
  });
});

test('AMAZON.CancelIntent', async () => {
  const event = Request.intent('AMAZON.CancelIntent').build();

  const response = await Skill(event);
  expect(response).to.containSubset({
    response: {
      shouldEndSession: true,
      outputSpeech: { type: 'PlainText', text: 'Bis bald!' }
    }
  });
});

test('Same city', async () => {
  const event = Request.intent('DistanceIntent', { from: 'berlin', to: 'berlin' }).build();

  const response = await Skill(event);
  expect(response).to.containSubset({
    response: {
      shouldEndSession: false,
      outputSpeech: { type: 'PlainText', text: 'Bitte nenne zwei unterschiedliche Städte.' }
    }
  });
});

test('Only one city', async () => {
  const event = Request.intent('DistanceIntent', { from: 'berlin' }).build();

  const response = await Skill(event);
  expect(response).to.containSubset({
    response: {
      shouldEndSession: false,
      outputSpeech: { type: 'PlainText', text: 'Bitte nenne zwei Städte.' }
    }
  });
});

test('Two cities', async () => {
  const event = Request.intent('DistanceIntent', { from: 'berlin', to: 'hamburg' }).build();

  const response = await Skill(event);
  expect(response).to.containSubset({
    response: {
      shouldEndSession: true,
      outputSpeech: { type: 'SSML' }
    }
  });
  expect(response.response.outputSpeech.ssml).to.contain('Die Entfernung zwischen berlin und hamburg beträgt');
});

test('SessionEndedRequest', async () => {
  const event = Request.sessionEndedRequest().build();
  const response = await Skill(event);
  expect(response).to.deep.equal({});
});
