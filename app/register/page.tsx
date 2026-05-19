"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { v4 as uuidv4 } from "uuid";
import QRCode from "qrcode";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    college: "",
  });
  const [qrImage, setQrImage] = useState("");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">
          ACCelerate'26 Registration
        </h1>

        <input
          type="text"
          placeholder="Name"
          className="w-full border p-3 mb-4 rounded-lg"
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-3 mb-4 rounded-lg"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          type="text"
          placeholder="Phone"
          className="w-full border p-3 mb-4 rounded-lg"
          onChange={(e) =>
            setForm({ ...form, phone: e.target.value })
          }
        />

        <input
          type="text"
          placeholder="College"
          className="w-full border p-3 mb-4 rounded-lg"
          onChange={(e) =>
            setForm({ ...form, college: e.target.value })
          }
        />

    <button
  onClick={async () => {
    if (
      !form.name ||
      !form.email ||
      !form.phone ||
      !form.college
    ) {
      alert("Please fill all fields");
      return;
    }

    const token = uuidv4();

    const { error } = await supabase
      .from("participants")
      .insert([
        {
  participant_id: token.slice(0, 8),
  full_name: form.name,
  email: form.email,
  phone: form.phone,
  college: form.college,
  qr_token: token,
}
      ]);

    if (error) {
      console.log("SUPABASE ERROR:", error);
      alert("Error saving participant");
    } else {
  const qr = await QRCode.toDataURL(token);

  setQrImage(qr);

  alert("Registration Successful");
}
  }}
  className="w-full bg-black text-white p-3 rounded-lg"
>
  Register
</button>
{qrImage && (
  <div className="mt-6 flex justify-center">
    <img src={qrImage} alt="QR Code" className="w-52 h-52" />
  </div>
)}
      </div>
    </div>
  );
}