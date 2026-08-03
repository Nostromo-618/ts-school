import { createHash } from "node:crypto";
import { afterEach, describe, expect, it, vi } from "vitest";

import { createLibLoader, tsLibUrl, TS_LIB_MANIFEST } from "@/typecheck/libs";
import type { TsLibManifest } from "@/typecheck/libs";

const CONTENTS: Record<string, string> = {
  "lib.es5.d.ts": "declare var globalThis: typeof globalThis;\n",
  "lib.es2022.d.ts": '/// <reference lib="es5" />\n',
  "lib.dom.d.ts": "declare var document: unknown;\n",
};

function integrityOf(text: string): string {
  return `sha384-${createHash("sha384").update(Buffer.from(text)).digest("base64")}`;
}

const MANIFEST: TsLibManifest = {
  typescriptVersion: "6.0.3",
  defaultLib: "lib.es2022.d.ts",
  entryLibs: ["es2022", "dom"],
  closures: {
    es2022: ["lib.es5.d.ts", "lib.es2022.d.ts"],
    dom: ["lib.es5.d.ts", "lib.dom.d.ts"],
  },
  files: Object.fromEntries(
    Object.entries(CONTENTS).map(([fileName, text]) => [
      fileName,
      { bytes: Buffer.byteLength(text), integrity: integrityOf(text) },
    ]),
  ),
};

interface FakeFetch {
  (url: string): Promise<Response>;
  readonly urls: string[];
}

/** `tamper` replaces a file's bytes without updating the manifest. */
function fakeFetch(tamper: Record<string, string> = {}): FakeFetch {
  const urls: string[] = [];

  const fetcher = async (url: string): Promise<Response> => {
    urls.push(url);
    const fileName = url.slice(url.lastIndexOf("/") + 1);

    if (fileName === TS_LIB_MANIFEST) {
      return { ok: true, status: 200, json: async () => MANIFEST } as Response;
    }

    const text = tamper[fileName] ?? CONTENTS[fileName];
    if (text === undefined) {
      return { ok: false, status: 404 } as Response;
    }
    return {
      ok: true,
      status: 200,
      arrayBuffer: async () => {
        const bytes = Buffer.from(text);
        return bytes.buffer.slice(
          bytes.byteOffset,
          bytes.byteOffset + bytes.byteLength,
        );
      },
    } as Response;
  };

  return Object.assign(fetcher, { urls });
}

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("tsLibUrl", () => {
  it("resolves same-origin under the site's base path", () => {
    expect(tsLibUrl("lib.es5.d.ts")).toBe(
      "http://localhost:3000/ts-lib/lib.es5.d.ts",
    );
  });

  it("honours a sub-path deployment", () => {
    vi.stubEnv("BASE_URL", "/sub-path/");

    expect(tsLibUrl("lib.es5.d.ts")).toBe(
      "http://localhost:3000/sub-path/ts-lib/lib.es5.d.ts",
    );
  });

  it("never points off-origin", () => {
    for (const base of ["/", "/sub-path/", "/deep/nested/"]) {
      vi.stubEnv("BASE_URL", base);
      expect(new URL(tsLibUrl("lib.es5.d.ts")).origin).toBe(
        "http://localhost:3000",
      );
    }
  });
});

describe("lib loader", () => {
  it("fetches nothing until a closure is required", () => {
    const fetchResource = fakeFetch();
    createLibLoader({ fetchResource });

    expect(fetchResource.urls).toEqual([]);
  });

  it("loads the closure of the libs it is asked for", async () => {
    const fetchResource = fakeFetch();
    const loader = createLibLoader({ fetchResource });

    await loader.ensure(["es2022"]);

    expect([...loader.files.keys()].sort()).toEqual([
      "lib.es2022.d.ts",
      "lib.es5.d.ts",
    ]);
    expect(loader.files.get("lib.es5.d.ts")).toBe(CONTENTS["lib.es5.d.ts"]);
    // Never the DOM unless asked: it is 2.3 MB in the real payload.
    expect(fetchResource.urls.some((url) => url.includes("dom"))).toBe(false);
  });

  it("refetches nothing on a second check", async () => {
    const fetchResource = fakeFetch();
    const loader = createLibLoader({ fetchResource });

    await loader.ensure(["es2022"]);
    const afterFirst = fetchResource.urls.length;
    await loader.ensure(["es2022"]);

    expect(fetchResource.urls).toHaveLength(afterFirst);
  });

  it("adds only what a newly requested lib is missing", async () => {
    const fetchResource = fakeFetch();
    const loader = createLibLoader({ fetchResource });

    await loader.ensure(["es2022"]);
    fetchResource.urls.length = 0;
    await loader.ensure(["es2022", "dom"]);

    expect(fetchResource.urls).toEqual([tsLibUrl("lib.dom.d.ts")]);
  });

  it("names a lib the payload does not carry", async () => {
    const loader = createLibLoader({ fetchResource: fakeFetch() });

    await expect(loader.ensure(["webworker"])).rejects.toThrow(/webworker/);
  });

  it("refuses a file whose bytes do not match the recorded digest", async () => {
    // Same length, different content: only the digest can catch this.
    const loader = createLibLoader({
      fetchResource: fakeFetch({
        "lib.es5.d.ts": "declare var globalThis: typeof globalThis;X".slice(
          0,
          CONTENTS["lib.es5.d.ts"].length,
        ),
      }),
    });

    await expect(loader.ensure(["es2022"])).rejects.toThrow(
      /lib\.es5\.d\.ts does not match its recorded digest/,
    );
  });

  it("refuses a file of the wrong length before hashing it", async () => {
    const loader = createLibLoader({
      fetchResource: fakeFetch({ "lib.es5.d.ts": "truncated" }),
    });

    await expect(loader.ensure(["es2022"])).rejects.toThrow(
      /lib\.es5\.d\.ts is 9 bytes, manifest says/,
    );
  });

  it("reports a missing payload rather than hanging", async () => {
    const loader = createLibLoader({
      fetchResource: async () => ({ ok: false, status: 404 }) as Response,
    });

    await expect(loader.ensure(["es2022"])).rejects.toThrow(/sync:ts-libs/);
  });
});
