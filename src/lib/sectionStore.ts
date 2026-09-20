"use client";

import { useSyncExternalStore } from "react";
import type { SectionCode, SectionStatus } from "@/types/content";

export interface SectionState {
  /** Section currently dominating the viewport. */
  active: SectionCode;
  /** Sections whose bottom edge has passed the viewport midline. */
  passed: ReadonlySet<SectionCode>;
  /** True once section 08 has entered the viewport. */
  shipped: boolean;
  /** True while the inverted pricing band owns the viewport. */
  inverted: boolean;
  /** True once the hero has released the manifest rail. */
  manifestVisible: boolean;
}

let state: SectionState = {
  active: "00",
  passed: new Set(),
  shipped: false,
  inverted: false,
  manifestVisible: false,
};

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

export const sectionStore = {
  get: () => state,
  set(partial: Partial<SectionState>) {
    let changed = false;
    for (const key of Object.keys(partial) as (keyof SectionState)[]) {
      if (state[key] !== partial[key]) {
        changed = true;
        break;
      }
    }
    if (!changed) return;
    state = { ...state, ...partial };
    emit();
  },
  setActive(code: SectionCode) {
    if (state.active === code) return;
    state = { ...state, active: code };
    emit();
  },
  markPassed(code: SectionCode, passed: boolean) {
    if (state.passed.has(code) === passed) return;
    const next = new Set(state.passed);
    if (passed) next.add(code);
    else next.delete(code);
    state = { ...state, passed: next };
    emit();
  },
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  reset() {
    state = {
      active: "00",
      passed: new Set(),
      shipped: false,
      inverted: false,
      manifestVisible: false,
    };
    emit();
  },
};

const serverState: SectionState = {
  active: "00",
  passed: new Set(),
  shipped: false,
  inverted: false,
  manifestVisible: false,
};

export function useSectionState(): SectionState {
  return useSyncExternalStore(sectionStore.subscribe, sectionStore.get, () => serverState);
}

/** Derive a section's header status from the store. */
export function statusFor(code: SectionCode, s: SectionState, fallback: SectionStatus): SectionStatus {
  if (code === "08" && s.shipped) return "SHIPPED";
  if (s.active === code) return "BUILDING";
  if (s.passed.has(code)) return "COMPLETE";
  return fallback;
}
