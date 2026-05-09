import * as fs from 'fs';
import { assertFails, assertSucceeds, initializeTestEnvironment, RulesTestEnvironment } from '@firebase/rules-unit-testing';
import { doc, getDoc, setDoc, deleteDoc, collection, updateDoc, getDocs } from 'firebase/firestore';

let testEnv: RulesTestEnvironment;

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: 'demo-rules-test',
    firestore: {
      rules: fs.readFileSync('DRAFT_firestore.rules', 'utf8'),
    },
  });
});

afterAll(async () => {
  await testEnv.cleanup();
});

beforeEach(async () => {
  await testEnv.clearFirestore();
});

describe('Firestore Rules', () => {
  it('allows verified user to create their profile', async () => {
    const context = testEnv.authenticatedContext('user123', { email_verified: true, email: 'test@example.com' });
    const db = context.firestore();
    
    await assertSucceeds(setDoc(doc(db, 'users', 'user123'), {
      email: 'test@example.com',
      createdAt: context.firestore().constructor.name === "Firestore" ? new Date() : { isEqual: () => false }, // server timestamp mockup hack for test, better to use FieldValue.serverTimestamp() but we are simulating. Actually in modular SDK we use serverTimestamp().
    }));
  });
});
