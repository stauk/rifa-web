import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";

export default function RifaApp() {
  return (
    <div className="p-6 max-w-4xl mx-auto bg-gray-100 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-center mb-6">Gestión de Rifa</h1>
      <div className="mb-4 flex gap-2">
        <Input
          placeholder="Nombre del comprador"
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="grid grid-cols-1 place-items-center mt-6 p-4 bg-white rounded-lg shadow">
        <iframe 
          src="https://docs.google.com/spreadsheets/d/e/2PACX-1vRb6vco7a7zdDMGosLJCvmLiAuSysB8asj0AbLSZgAftJfTTPDJtrxnSTTw8yys87z6AnPzeiqVdvf0/pubhtml?gid=0&amp;single=true&amp;widget=true&amp;headers=false" 
          width="100%" 
          height="600" 
          className="border rounded-lg shadow-lg">
        </iframe>
      </div>
    </div>
  );
}