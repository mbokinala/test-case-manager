import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebaseClient";
import { TestCase } from "./interfaces/testcase";

export async function getTestCase(id: string): Promise<TestCase> {
    let docSnap = await getDoc(doc(db, 'testcases', id as string));
    if (docSnap.exists()) {
        const { title, description, section } = docSnap.data();

        return { id: docSnap.id, title, description, section };
    } else {
        throw new Error(`test case ${id} does not exist`);
    }
}