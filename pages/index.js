import { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { toast } from "react-hot-toast";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const numbersCollection = collection(db, "rifaNumbers");

export default function RifaApp() {
  const [numbers, setNumbers] = useState([]);
  const [seller, setSeller] = useState("");

  useEffect(() => {
    const unsubscribe = onSnapshot(numbersCollection, (snapshot) => {
      const numbersList = Array.from({ length: 100 }, (_, i) => ({ number: i + 1, sold: false, seller: "", id: null }));
      snapshot.forEach(docSnap => {
        const data = docSnap.data();
        const index = numbersList.findIndex(n => n.number === data.number);
        if (index !== -1) {
          numbersList[index] = { ...numbersList[index], sold: true, seller: data.seller, id: docSnap.id };
        }
      });
      setNumbers(numbersList);
    });
    return () => unsubscribe();
  }, []);

  const sellNumber = async (num) => {
    if (!seller.trim()) {
      toast.error("Introduce el nombre del comprador antes de vender.");
      return;
    }

    const index = numbers.findIndex(n => n.number === num);
    if (index === -1 || numbers[index].sold) {
      toast.error("Número ya vendido o inválido.");
      return;
    }

    await addDoc(numbersCollection, { number: num, seller });
    toast.success(`Número ${num} vendido a ${seller}`);
  };

  const removeNumber = async (id, num) => {
    if (!id) return;
    await deleteDoc(doc(db, "rifaNumbers", id));
    toast.success(`Número ${num} ha sido liberado.`);
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold text-center mb-4">Gestión de Rifa</h1>
      <input 
        placeholder="Nombre del comprador"
        value={seller}
        onChange={(e) => setSeller(e.target.value)}
      />
      <div className="grid grid-cols-10 gap-2 mt-6">
        {numbers.map((num) => (
          <div 
            key={num.number} 
            className={num.sold ? "bg-red-300 cursor-pointer" : "bg-green-300 cursor-pointer"} 
            onClick={() => !num.sold ? sellNumber(num.number) : removeNumber(num.id, num.number)}
          >
            <p className="text-center">{num.number}</p>
            {num.sold && <p className="text-xs">Vendido a {num.seller}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}