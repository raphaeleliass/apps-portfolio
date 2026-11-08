import { expect, test } from "bun:test";
import { runInNewContext } from "node:vm";
import { motionBoot } from "./motion-boot";

test("motion boot fails open if hydration never completes", () => {
  const dataset: Record<string, string> = {};
  let release = () => {};
  runInNewContext(motionBoot, {
    document: { documentElement: { dataset } },
    matchMedia: () => ({ matches: false }),
    setTimeout: (callback: () => void, delay: number) => {
      expect(delay).toBe(2500);
      release = callback;
    },
  });
  expect(dataset.motion).toBe("pending");
  dataset.motion = "ready";
  release();
  expect(dataset.motion).toBe("ready");
  dataset.motion = "pending";
  release();
  expect(dataset.motion).toBeUndefined();
});

test("motion boot does not conceal content with reduced motion", () => {
  const dataset = {};
  runInNewContext(motionBoot, {
    document: { documentElement: { dataset } },
    matchMedia: () => ({ matches: true }),
    setTimeout: () => {
      throw new Error("Unexpected motion timer");
    },
  });
  expect(dataset).toEqual({});
});
