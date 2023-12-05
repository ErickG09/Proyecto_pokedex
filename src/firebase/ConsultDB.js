import { collection, getDocs } from 'firebase/firestore';

export async function ConsultDB(db) {
  const var1 = collection(db, 'team');
  const var2 = await getDocs(var1);
  const var3 = var2.docs.map((doc) => doc.data());
  return var3;
}
