'use client';
import { useRouter } from "next/navigation";
export default function Home() {
  const router = useRouter();
  return (
    <main className="flex flex-col items-center justify-center h-screen bg-blue-200">
      <div>Hello I am Aman</div>
      <div>To continue practising please login first</div>
      <button className="cursor-pointer bg-yellow-400 w-20 rounded-4xl h-10" onClick={()=>router.push('./login') }>Login</button>
    </main>
  );
}
