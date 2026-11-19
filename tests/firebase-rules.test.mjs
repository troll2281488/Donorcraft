import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  initializeTestEnvironment,
  assertFails,
  assertSucceeds,
} from "@firebase/rules-unit-testing";
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { ref, uploadString, getBytes } from "firebase/storage";

const projectId = "demo-donorcraft-rules";
const testEnv = await initializeTestEnvironment({
  projectId,
  firestore: { rules: readFileSync("firestore.rules", "utf8") },
  storage: { rules: readFileSync("storage.rules", "utf8") },
});

const owner = testEnv.authenticatedContext("player-a");
const guest = testEnv.authenticatedContext("player-b");
const anonymous = testEnv.unauthenticatedContext();

try {
  // Profiles: only the signed-in owner can create/read their own valid profile.
  await assertSucceeds(setDoc(doc(owner.firestore(), "users/player-a"), {
    nickname: "PlayerA",
    createdAt: serverTimestamp(),
  }));
  await assertSucceeds(getDoc(doc(owner.firestore(), "users/player-a")));
  await assertFails(getDoc(doc(guest.firestore(), "users/player-a")));
  await assertFails(getDoc(doc(anonymous.firestore(), "users/player-a")));
  await assertFails(setDoc(doc(owner.firestore(), "users/player-a"), {
    nickname: "A",
    createdAt: serverTimestamp(),
  }));
  await assertFails(setDoc(doc(owner.firestore(), "users/player-a"), {
    nickname: "PlayerA",
    password: "must-not-be-stored-here",
    createdAt: serverTimestamp(),
  }));

  // Worlds: owner-only metadata and immutable ownership.
  await assertSucceeds(setDoc(doc(owner.firestore(), "worlds/world-a"), {
    ownerUid: "player-a",
    name: "My world",
    createdAt: serverTimestamp(),
    status: "stopped",
  }));
  await assertSucceeds(getDoc(doc(owner.firestore(), "worlds/world-a")));
  await assertFails(getDoc(doc(guest.firestore(), "worlds/world-a")));
  await assertFails(getDoc(doc(anonymous.firestore(), "worlds/world-a")));
  await assertFails(updateDoc(doc(owner.firestore(), "worlds/world-a"), {
    ownerUid: "player-b",
  }));
  await assertFails(updateDoc(doc(owner.firestore(), "worlds/world-a"), {
    status: "admin",
  }));
  await assertFails(setDoc(doc(guest.firestore(), "worlds/world-b"), {
    ownerUid: "player-a",
    name: "Stolen world",
    createdAt: serverTimestamp(),
  }));

  // Join codes and server sessions are backend-only.
  await assertFails(getDoc(doc(owner.firestore(), "joinCodes/ABC123")));
  await assertFails(setDoc(doc(owner.firestore(), "joinCodes/ABC123"), {
    worldId: "world-a",
  }));
  await assertFails(getDoc(doc(owner.firestore(), "serverSessions/session-a")));

  // Snapshot objects are private to the matching account.
  const ownerSnapshot = ref(owner.storage(), "users/player-a/worlds/world-a/snapshots/test.txt");
  await assertSucceeds(uploadString(ownerSnapshot, "snapshot-data"));
  const guestSnapshot = ref(guest.storage(), "users/player-a/worlds/world-a/snapshots/test.txt");
  await assertFails(getBytes(guestSnapshot));
  await assertFails(uploadString(
    ref(guest.storage(), "users/player-a/worlds/world-a/snapshots/attack.txt"),
    "not-the-owner",
  ));

  console.log("Firebase security rules tests passed.");
} finally {
  await testEnv.cleanup();
}
