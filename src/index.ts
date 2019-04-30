import { SkillBuilders } from "ask-sdk-core";
import {
    AmazonHelpIntentHandler,
    AmazonStopIntentHandler,
    CustomErrorHandler,
    DistanceIntentHandler,
    LaunchRequestHandler,
    SessionEndedHandler,
} from "./handlers";
import { LocalizationInterceptor, LogInterceptor } from "./interceptors";

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
        new LocalizationInterceptor(),
    )
    .addResponseInterceptors(
        new LogInterceptor(),
    )
    .lambda();
