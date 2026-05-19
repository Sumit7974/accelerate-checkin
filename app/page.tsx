"use client";
// Create a modern registration form using Tailwind CSS
// Fields: name, email, phone, college
// Add a submit button
// Use React useState
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/lib/supabase";
import { useState } from "react";
export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [college, setCollege] = useState('');
const handleRegister = async () => {
  if (!supabase) {
    alert("Supabase is not configured");
    return;
  }

  const participantId = uuidv4();
  const { data, error } = await supabase
    .from("participants")
    .insert([
      {
        participant_id: participantId,
        name,
        email,
        phone,
        college,
      },
    ]);

  if (error) {
    console.log(error);
    alert("Registration failed");
  } else {
    alert("Registration successful");
    console.log(data);
  }
};

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Register</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="college" className="block text-sm font-medium text-gray-700">
            College
          </label>
          <input
            type="text"
            id="college"
            value={college}
            onChange={(e) => setCollege(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
    <button
  onClick={handleRegister}
  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
>
  Register
</button>
      </form>
    </div>
  );
}
