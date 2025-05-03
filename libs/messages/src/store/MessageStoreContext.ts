import {createMessageStore, MessageStoreType} from "./index"
import React, {createContext, useContext, useRef} from "react";
import {useStore} from "zustand/react";
import {useStoreWithEqualityFn} from "zustand/traditional";

import {BaseComponentMessageRegistry, ComponentMessageRegistry} from "../types";

type ContextType<T extends BaseComponentMessageRegistry> = ReturnType<typeof createMessageStore<T>>

/**
 * A wrapper around `useRef` which fills it out with a Zustand store.
 * This can be fed into types like `StoreContext` to be provided in
 * child nodes.
 */
export function useCreateMessageStore<
    CMPR extends BaseComponentMessageRegistry = ComponentMessageRegistry
>(): React.RefObject<ReturnType<typeof createMessageStore>> {
    const storeRef = useRef<ReturnType<typeof createMessageStore>>(null)
    if (!storeRef.current) {
        storeRef.current = createMessageStore<CMPR>()
    }
    return storeRef as React.RefObject<ReturnType<typeof createMessageStore>>
}

export const MessageStoreContext = createContext<ContextType<ComponentMessageRegistry> | null>(null)

/**
 * Matches the signature of Zustand's `useStore(...)` method whereby the method passed via
 * the `selector` parameter, is used to consume state
 *
 * @param selector The selector function to use to consume state.
 *
 * @example `
 *  const SomeComponent = () => {
 *   const toggleFullscreen = useFlightStore((state) => {state.setFullscreen(!state.fullScreen)})
 *   return <button onClick={toggleFullscreen}>Go big!</button>
 * }`
 */
export function useMessageStore<T, >(selector: (state: MessageStoreType) => T) {
    const store = useContext(MessageStoreContext)
    if (!store) {
        throw new Error('Missing MessageStoreContext provider')
    }
    return useStore(store, selector)
}

/**
 * Matches the signature of Zustand's `useStoreWithEqualityFn(...)` method whereby the method passed via
 * the `selector` parameter is used to consume state, and the function passed via the `fn` parameter is used
 * to compare the previous and current state.
 *
 * @param selector The selector function to use to consume state.
 * @param fn The equality function to use to compare the previous and current state.
 */
export function useMessageStoreWithEqualityFunction<T, >(
    selector: (state: MessageStoreType) => T,
    fn: ((a: T, b: T) => boolean)
) {
    const store = useContext(MessageStoreContext)
    if (!store) {
        throw new Error('Missing MessageStoreContext provider')
    }
    return useStoreWithEqualityFn(store, selector, fn)
}