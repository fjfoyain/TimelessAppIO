/**
 * Security-rule tests for Cloud Storage.
 *
 * Run with: npm run test:rules
 */
import fs from "node:fs";
import path from "node:path";
import {
  initializeTestEnvironment,
  assertFails,
  assertSucceeds,
  type RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getBytes } from "firebase/storage";
import { beforeAll, afterAll, beforeEach, describe, it } from "vitest";

const ALICE = "alice";
const BOB = "bob";
const ADMIN = "root";

const PAYLOAD = new Uint8Array([1, 2, 3, 4]);

let testEnv: RulesTestEnvironment;

function store(uid: string) {
  return testEnv.authenticatedContext(uid).storage();
}

function put(uid: string, filePath: string, contentType: string) {
  return uploadBytes(ref(store(uid), filePath), PAYLOAD, { contentType });
}

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: "timeless-rules-test",
    firestore: {
      rules: fs.readFileSync(path.resolve("firestore.rules"), "utf8"),
      host: "127.0.0.1",
      port: 8080,
    },
    storage: {
      rules: fs.readFileSync(path.resolve("storage.rules"), "utf8"),
      host: "127.0.0.1",
      port: 9199,
    },
  });
});

afterAll(async () => {
  await testEnv.cleanup();
});

beforeEach(async () => {
  await testEnv.clearFirestore();
  await testEnv.clearStorage();
  // Seed the user docs the storage rules read for the admin check.
  await testEnv.withSecurityRulesDisabled(async (ctx) => {
    const raw = ctx.firestore();
    await setDoc(doc(raw, "users", ALICE), { role: "TALENT" });
    await setDoc(doc(raw, "users", BOB), { role: "CLIENT" });
    await setDoc(doc(raw, "users", ADMIN), { role: "ADMIN" });
  });
});

describe("service images (HIGH 5)", () => {
  it("blocks overwriting another user's service image", async () => {
    await assertFails(put(ALICE, `services/${BOB}/image.jpg`, "image/jpeg"));
  });

  it("blocks a non-image upload into your own service folder", async () => {
    await assertFails(put(ALICE, `services/${ALICE}/payload.html`, "text/html"));
  });

  it("allows uploading your own service image", async () => {
    await assertSucceeds(put(ALICE, `services/${ALICE}/image.jpg`, "image/jpeg"));
  });
});

describe("artist portfolio (HIGH 6)", () => {
  it("blocks hosting HTML from the public portfolio path", async () => {
    await assertFails(
      put(ALICE, `artists/${ALICE}/portfolio/phish.html`, "text/html")
    );
  });

  it("blocks an executable disguised in the portfolio path", async () => {
    await assertFails(
      put(ALICE, `artists/${ALICE}/portfolio/app.apk`, "application/vnd.android.package-archive")
    );
  });

  it("blocks writing into another artist's portfolio", async () => {
    await assertFails(put(ALICE, `artists/${BOB}/portfolio/1.jpg`, "image/jpeg"));
  });

  it("allows an image in your own portfolio", async () => {
    await assertSucceeds(
      put(ALICE, `artists/${ALICE}/portfolio/1.jpg`, "image/jpeg")
    );
  });

  it("allows an mp4 in your own portfolio", async () => {
    await assertSucceeds(
      put(ALICE, `artists/${ALICE}/portfolio/reel.mp4`, "video/mp4")
    );
  });
});

describe("identity documents", () => {
  beforeEach(async () => {
    await put(ALICE, `identity/${ALICE}/id.jpg`, "image/jpeg");
  });

  it("blocks another user reading an identity document", async () => {
    await assertFails(getBytes(ref(store(BOB), `identity/${ALICE}/id.jpg`)));
  });

  it("blocks uploading an identity document for another user", async () => {
    await assertFails(put(BOB, `identity/${ALICE}/fake.jpg`, "image/jpeg"));
  });

  it("allows the owner to read their own document", async () => {
    await assertSucceeds(getBytes(ref(store(ALICE), `identity/${ALICE}/id.jpg`)));
  });

  it("allows an admin to read it for verification", async () => {
    await assertSucceeds(getBytes(ref(store(ADMIN), `identity/${ALICE}/id.jpg`)));
  });
});

describe("avatars and demos", () => {
  it("blocks overwriting another user's avatar", async () => {
    await assertFails(put(ALICE, `avatars/${BOB}/avatar.jpg`, "image/jpeg"));
  });

  it("blocks a non-audio file in the demo path", async () => {
    await assertFails(put(ALICE, `artists/${ALICE}/demo/demo.exe`, "application/octet-stream"));
  });

  it("allows your own avatar", async () => {
    await assertSucceeds(put(ALICE, `avatars/${ALICE}/avatar.jpg`, "image/jpeg"));
  });
});

describe("event images", () => {
  beforeEach(async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), "events", "e1"), { organizerId: ALICE });
    });
  });

  it("blocks a non-organizer uploading an event image", async () => {
    await assertFails(put(BOB, "events/e1/image.jpg", "image/jpeg"));
  });

  it("allows the organizer", async () => {
    await assertSucceeds(put(ALICE, "events/e1/image.jpg", "image/jpeg"));
  });
});
