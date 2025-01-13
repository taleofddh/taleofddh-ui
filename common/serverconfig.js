import { createServerRunner } from '@aws-amplify/adapter-nextjs';
import {AMPLIFY_RESOURCE_CONFIG} from "./constants";

// Configure Amplify library for server-side usage
export const { runWithAmplifyServerContext  } = createServerRunner({ config: AMPLIFY_RESOURCE_CONFIG });
