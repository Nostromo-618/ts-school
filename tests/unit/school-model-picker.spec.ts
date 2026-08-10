import { beforeEach, describe, expect, it } from "vitest";
import {
  SCHOOL_AI_MODEL_ID_KEY,
  SCHOOL_DEFAULT_MODEL_ID,
  SCHOOL_QUALITY_MODEL_ID,
  persistSchoolModelId,
  readPersistedSchoolModelId,
  schoolModelOptionLabel,
  schoolModelRecommendHint,
} from "@/ai/school-model-picker";

describe("school model picker copy", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("keeps E2B as the default id", () => {
    expect(SCHOOL_DEFAULT_MODEL_ID).toBe("gemma-4-E2B-it-web");
    expect(SCHOOL_QUALITY_MODEL_ID).toBe("gemma-4-E4B-it-web");
  });

  it("labels E2B as default and E4B as recommended quality", () => {
    expect(schoolModelOptionLabel(SCHOOL_DEFAULT_MODEL_ID)).toMatch(/default/i);
    expect(schoolModelOptionLabel(SCHOOL_QUALITY_MODEL_ID)).toMatch(/Quality/i);
    expect(schoolModelOptionLabel(SCHOOL_QUALITY_MODEL_ID)).toMatch(/8GB/i);
  });

  it("hints prefer E2B on weak RAM and soft-recommends E4B on capable", () => {
    expect(schoolModelRecommendHint(4)).toMatch(/E2B/i);
    expect(schoolModelRecommendHint(8)).toMatch(/E4B/i);
    expect(schoolModelRecommendHint(null)).toMatch(/default/i);
  });

  it("persists and restores the selected Gemma model id", () => {
    expect(readPersistedSchoolModelId()).toBe(SCHOOL_DEFAULT_MODEL_ID);
    persistSchoolModelId(SCHOOL_QUALITY_MODEL_ID);
    expect(window.localStorage.getItem(SCHOOL_AI_MODEL_ID_KEY)).toBe(
      SCHOOL_QUALITY_MODEL_ID,
    );
    expect(readPersistedSchoolModelId()).toBe(SCHOOL_QUALITY_MODEL_ID);
    persistSchoolModelId("not-a-model");
    expect(readPersistedSchoolModelId()).toBe(SCHOOL_QUALITY_MODEL_ID);
  });
});
