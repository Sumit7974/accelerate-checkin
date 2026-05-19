"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { v4 as uuidv4 } from "uuid";
import QRCode from "qrcode";
import Image from "next/image";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    college: "",
  });
  const [qrImage, setQrImage] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">
          ACCelerate&apos;26 Registration
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
    setLoading(true);

    if (!supabase) {
      alert("Supabase is not configured");
      setLoading(false);
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
  setLoading(false);
  console.log("SUPABASE ERROR:", error);
  alert(error.message);
}
 else {
  const qr = await QRCode.toDataURL(token);
  setQrImage(qr);
  setLoading(false);

  alert("Registration Successful");

  setForm({
    name: "",
    email: "",
    phone: "",
    college: "",
  });

  alert("Registration Successful");
}
  }}
  className="w-full bg-black text-white p-3 rounded-lg"
>
  {loading ? "Registering..." : "Register"}
</button>
{qrImage && (
  <div className="mt-6 text-center">
    <div className="flex justify-center">
      <Image
        src={qrImage}
        alt="QR Code"
        width={208}
        height={208}
        className="h-52 w-52"
        unoptimized
      />
    </div>

    <a
      href={qrImage}
      download="accelerate-qr.png"
      className="inline-block mt-4 bg-green-600 text-white px-4 py-2 rounded-lg"
    >
      Download QR
    </a>
  </div>
)}
      </div>
    </div>
  );
}
