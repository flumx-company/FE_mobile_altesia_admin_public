import { TokenWorker } from "../../packages/altesia-token-worker";

export const AltesiaTokenWorkerPlugin = new TokenWorker()
    .setKeyName('aat');
