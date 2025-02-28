import { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { toast } from "react-hot-toast";

const firebaseConfig = {
  apiKey: "AIzaSyBmHXzrsTO7zw86xZACLw410lI4mBLu0SA",
  authDomain: "rifanumbers.firebaseapp.com",
  projectId: "rifanumbers",
  storageBucket: "rifanumbers.appspot.com",
  messagingSenderId: "707426927800",
  appId: "1:707426927800:web:dc7a73c28a7d9c5a38a04d",
  measurementId: "G-DN75GCFBN8"
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
    <div className="p-6 max-w-4xl mx-auto bg-gray-100 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-center mb-6">Gestión de Rifa</h1>
      <div className="mb-4 flex gap-2">
        <input 
          placeholder="Nombre del comprador"
          value={seller}
          onChange={(e) => setSeller(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="grid grid-cols-10 gap-2 mt-6 p-4 bg-white rounded-lg shadow">
        {numbers.map((num) => (
          <div 
            key={num.number} 
            className={`cursor-pointer text-center p-4 font-bold rounded-lg shadow-lg transition-all ${num.sold ? "bg-red-500 text-white" : "bg-green-500 text-white hover:bg-green-600"}`} 
            onClick={() => !num.sold ? sellNumber(num.number) : removeNumber(num.id, num.number)}
          >
            {num.number}
            {num.sold && <p className="text-xs mt-1 font-semibold">Vendido a {num.seller}</p>}
          </div>
        ))}
      </div>
      <div className="mt-6 text-center">
        <button 
          className="bg-red-600 text-white p-2 rounded shadow-lg hover:bg-red-700"
          onClick={() => numbers.filter(n => n.sold).forEach(n => removeNumber(n.id, n.number))}
        >
          Liberar todos los números vendidos
        </button>
      </div>
    </div>
  );
}