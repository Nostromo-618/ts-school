import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import ProseHtml from "@/components/ProseHtml.vue";
import QuizBlock from "@/components/lesson/QuizBlock.vue";
import type { QuizQuestion } from "@/curriculum";

describe("ProseHtml", () => {
  it("renders backticked tokens as code inside .ts-prose", () => {
    const wrapper = mount(ProseHtml, {
      props: { text: "Prefer `unknown` at boundaries." },
    });
    expect(wrapper.classes()).toContain("ts-prose");
    const code = wrapper.find("code");
    expect(code.exists()).toBe(true);
    expect(code.text()).toBe("unknown");
  });

  it("inline mode avoids a wrapping paragraph", () => {
    const wrapper = mount(ProseHtml, {
      props: { text: "Caption with `tsc`", inline: true },
    });
    expect(wrapper.element.tagName).toBe("SPAN");
    expect(wrapper.find("p").exists()).toBe(false);
    expect(wrapper.find("code").text()).toBe("tsc");
  });
});

describe("QuizBlock letter prefixes", () => {
  const questions: QuizQuestion[] = [
    {
      id: "q1",
      prompt: "Pick one",
      choices: [
        { id: "a", text: "Alpha" },
        { id: "b", text: "Beta" },
        { id: "c", text: "Gamma" },
        { id: "d", text: "Delta" },
      ],
      answerId: "b",
      explanation: "Because `Beta` is right.",
    },
  ];

  it("labels choices A B C D in order", () => {
    setActivePinia(createPinia());
    const wrapper = mount(QuizBlock, {
      props: { lessonId: "demo", questions },
    });
    const letters = wrapper
      .findAll(".ts-quiz-choice-letter")
      .map((node) => node.text());
    expect(letters).toEqual(["A", "B", "C", "D"]);
    const buttons = wrapper.findAll("button.ts-quiz-choice");
    expect(buttons[0].text()).toMatch(/^A/);
    expect(buttons[1].text()).toMatch(/^B/);
  });
});
