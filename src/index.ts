import { LocalizationInterceptor, LogInterceptor, SessionEndedHandler } from "@corux/ask-extensions";
import { SkillBuilders } from "ask-sdk-core";
import * as path from "path";
import {
    AmazonHelpIntentHandler,
    AmazonStopIntentHandler,
    CustomErrorHandler,
    DistanceIntentHandler,
    LaunchRequestHandler,
} from "./handlers";

export const handler = SkillBuilders.custom()
    .addRequestHandlers(
        new AmazonStopIntentHandler(),
        new AmazonHelpIntentHandler(),
        new DistanceIntentHandler(),
        new LaunchRequestHandler(),
        new SessionEndedHandler(),
    )
    .addErrorHandlers(
        new CustomErrorHandler(),
    )
    .addRequestInterceptors(
        new LogInterceptor(),
        new LocalizationInterceptor(path.join(__dirname, "i18n/{{lng}}.json")),
    )
    .addResponseInterceptors(
        new LogInterceptor(),
    )
    .lambda();
