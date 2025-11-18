import { db } from "./firebase";
import { doc, setDoc, collection, addDoc } from "firebase/firestore";

export async function createCourse(data: any) {
  const ref = await addDoc(collection(db, "courses"), {
    ...data,
    createdAt: new Date(),
  });
  return ref.id;
}

export async function createModule(courseId: string, data: any) {
  const ref = await addDoc(collection(db, `courses/${courseId}/modules`), {
    ...data,
    createdAt: new Date(),
  });
  return ref.id;
}

export async function createLesson(courseId: string, moduleId: string, lessonId: string, lessonData: any) {
  await setDoc(
    doc(db, `courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`),
    { ...lessonData, createdAt: new Date() }
  );
}
