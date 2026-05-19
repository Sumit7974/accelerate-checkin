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
const [isAmityAssociated, setIsAmityAssociated] = useState('');
const [categoryType, setCategoryType] = useState('');
const [category, setCategory] = useState('');
const [gender, setGender] = useState('');
const [designation, setDesignation] = useState('');
const [address, setAddress] = useState('');
const [amount, setAmount] = useState('');
const [gstAmount, setGstAmount] = useState('');
const [payableAmount, setPayableAmount] = useState('');
  const [phone, setPhone] = useState('');
  const [college, setCollege] = useState('');
  const handleRegister = async () => {
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
  is_amity_associated: isAmityAssociated,
  category_type: categoryType,
  category,
  gender,
  designation,
  address,
  amount: Number(amount),
  gst_amount: Number(gstAmount),
  payable_amount: Number(payableAmount),
}
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
        <div className="mb-4">
  <label className="block text-sm font-medium text-gray-700">
    Gender
  </label>

  <input
    type="text"
    value={gender}
    onChange={(e) => setGender(e.target.value)}
    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
  />
</div> 
<div className="mb-4">
  <label className="block text-sm font-medium text-gray-700">
    Designation
  </label>

  <input
    type="text"
    value={designation}
    onChange={(e) => setDesignation(e.target.value)}
    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
  />
</div><div className="mb-4">
  <label className="block text-sm font-medium text-gray-700">
    Address
  </label>

  <input
    type="text"
    value={address}
    onChange={(e) => setAddress(e.target.value)}
    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
  />
</div><div className="mb-4">
  <label className="block text-sm font-medium text-gray-700">
    Category
  </label>

  <input
    type="text"
    value={category}
    onChange={(e) => setCategory(e.target.value)}
    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
  />
</div><div className="mb-4">
  <label className="block text-sm font-medium text-gray-700">
    Category Type
  </label>

  <input
    type="text"
    value={categoryType}
    onChange={(e) => setCategoryType(e.target.value)}
    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
  />
</div><div className="mb-4">
  <label className="block text-sm font-medium text-gray-700">
    Is Amity Associated
  </label>

  <input
    type="text"
    value={isAmityAssociated}
    onChange={(e) => setIsAmityAssociated(e.target.value)}
    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
  />
</div><div className="mb-4">
  <label className="block text-sm font-medium text-gray-700">
    Amount
  </label>

  <input
    type="number"
    value={amount}
    onChange={(e) => setAmount(e.target.value)}
    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
  />
</div><div className="mb-4">
  <label className="block text-sm font-medium text-gray-700">
    GST Amount
  </label>

  <input
    type="number"
    value={gstAmount}
    onChange={(e) => setGstAmount(e.target.value)}
    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
  />
</div><div className="mb-4">
  <label className="block text-sm font-medium text-gray-700">
    Payable Amount
  </label>

  <input
    type="number"
    value={payableAmount}
    onChange={(e) => setPayableAmount(e.target.value)}
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