import {MessageId} from "./message";

export type BaseComponentMessageRegistry = Record<MessageId, any>

export interface ComponentMessageRegistry extends BaseComponentMessageRegistry {
}
