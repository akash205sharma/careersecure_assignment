"use client"

import FavouriteCourses from "@/components/FavouriteCourses";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {

  const router = useRouter();
  const session = useSession();
  const admin = session.data?.user;
  const [page, setPage] = useState(1)
  const limit = 5;
  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState<Partial<User>>({});
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  useEffect(() => {
    if (session.status === "unauthenticated") {
      router.push("/login");
    }
  }, [session.status]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (session.status === "authenticated" && admin?.email) {
        const res = await fetch(`/api/dataApi?email=${admin.email}`);
        const newAdmin = await res.json();
        console.log("new admin", newAdmin.data);
        setUsers(newAdmin.data);
      }
    };

    fetchUsers();
  }, [session.status, admin?.email]);



  type User = {
    id: string;
    phone: string;
    createdAt: string;
    email: string;
    companyEmail: string;
    officeEmail: string;
    cinPanGst: string;
    agreeToTerms: boolean;
    isRecruiter: boolean;
    isVerified: boolean;
    updatedAt: string;
    remarks: string;
    favouriteCourses: string[];
  };


  const handleChange = (field: keyof User, value: string | boolean | string[]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };
  const handleEditClick = (user: User) => {
    setEditingUserId(user.id);
    setForm(user);
  };

  const handleSubmit = async () => {
    console.log("submitting")
    if (!form.phone || !form.email) { console.log("returning", !form.phone, !form.createdAt, !form.email, !form.updatedAt); return; }
    const userData: User = {
      ...form,
      id: editingUserId || crypto.randomUUID(),
      phone: form.phone,
      createdAt: form.createdAt || new Date().toISOString().slice(0, 16),
      email: form.email!,
      companyEmail: form.companyEmail || "",
      officeEmail: form.officeEmail || "",
      cinPanGst: form.cinPanGst || "",
      agreeToTerms: form.agreeToTerms || false,
      isRecruiter: form.isRecruiter || false,
      isVerified: form.isVerified || false,
      updatedAt: form.updatedAt || new Date().toISOString().slice(0, 16),
      remarks: form.remarks || "",
      favouriteCourses: form.favouriteCourses || [],
    };

    if (editingUserId) {
      try {
        const res = await fetch("/api/dataApi", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            admin: { email: admin?.email },
            updatedUser: form  // your form state must include a valid `id`
          })
        });

        const result = await res.json();
        if (!res.ok || !result.success) {
          throw new Error(result.error || "Update failed");
        }

        setUsers(result.user.data);
        setForm({});
      } catch (err) {
        console.error(err);
      }
    } else {
      try {
        const res = await fetch("/api/dataApi", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ admin: admin, data: userData }),
        });

        if (res.ok) {
          setUsers([...users, userData]);
          setForm({});
        } else {
          alert("Failed to add user to database");
        }
      } catch (error) {
        console.error(error)
      }
    }
  };

  function formatDateTime(input: string): string {
    const date = new Date(input);

    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    const formattedDate = date.toLocaleDateString("en-US", options);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${formattedDate} ${hours}:${minutes}`;
  }

  const paginatedUsers = users.slice((page - 1) * limit, page * limit);

  return (
    <div className="flex flex-col lg:flex-row p-4 gap-4">
      {/* Left: Table */}
      <div className="lg:w-2/3 w-full overflow-x-auto">
        <table className="min-w-full border rounded shadow text-sm">
          <thead className="bg-gray-100">
            <tr>
              {["Phone", "Created", "Email", "Company email", "Office email", "CinPanGst", "Agree", "Recruiter", "Verified", "Updated", "ID", "Remarks", "Courses"].map(h => (
                <th key={h} className="p-2 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedUsers?.map((user) => (
              <tr key={user.id} className="border-t hover:bg-gray-50">

                <td className="p-2">{user.phone}</td>
                <td className="p-2">{formatDateTime(user.createdAt)}</td>
                <td className="p-2">{user.email}</td>
                <td className="p-2">{user.companyEmail}</td>
                <td className="p-2">{user.officeEmail}</td>
                <td className="p-2">{user.cinPanGst ? "✓" : ""}</td>
                <td className="p-2">{user.agreeToTerms ? "✓" : ""}</td>
                <td className="p-2">{user.isRecruiter ? "✓" : ""}</td>
                <td className="p-2">{user.isVerified ? "✓" : ""}</td>
                <td className="p-2">{formatDateTime(user.updatedAt)}</td>
                <td className="p-2">{user.id}</td>
                <td className="p-2">{user.remarks}</td>
                <td className="p-2">{user.favouriteCourses.join(", ")}</td>
                <td className="p-2">
                  <button
                    onClick={() => handleEditClick(user)}
                    className="px-2 py-1 bg-blue-500 text-white rounded text-xs"
                  >
                    Edit
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-between mt-4 text-sm text-gray-600">
          <span>{users?.length} total results</span>
          <div className="space-x-2">
            <button disabled={page === 1} onClick={() => setPage((p) => p - 1)} className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50">Previous</button>
            <button disabled={page * limit >= users?.length} onClick={() => setPage((p) => p + 1)} className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50">Next</button>
          </div>
        </div>
      </div>

      {/* Right: Form */}
      <div className="lg:w-1/3 w-full bg-white shadow rounded p-4 space-y-4">
        <h2 className="text-lg font-semibold">{editingUserId ? "Edit User" : "Add User"}</h2>
        <div className="grid grid-cols-1 gap-3">
          <Input label="Phone number" required={true} value={form.phone || ""} onChange={(e) => handleChange("phone", e.target.value)} />
          <Input label="Created at" required={true} type="datetime-local" value={form.createdAt || new Date().toISOString().slice(0, 16)} onChange={(e) => handleChange("createdAt", e.target.value)} />
          <Input label="Email" required={true} value={form.email || ""} onChange={(e) => handleChange("email", e.target.value)} />
          <Input label="Company email" value={form.companyEmail || ""} onChange={(e) => handleChange("companyEmail", e.target.value)} />
          <Input label="Office email" value={form.officeEmail || ""} onChange={(e) => handleChange("officeEmail", e.target.value)} />
          <Input label="Cin pan gst" value={form.cinPanGst || ""} onChange={(e) => handleChange("cinPanGst", e.target.value)} />
          <textarea placeholder="Remarks" className="border p-2 rounded" value={form.remarks || ""} onChange={(e) => handleChange("remarks", e.target.value)} />
          <FavouriteCourses value={form.favouriteCourses || []} onChange={(courses) => handleChange("favouriteCourses", courses)} />

          <div className="space-y-2">
            <Checkbox label="Agree to terms" required={true} checked={form.agreeToTerms || true} onChange={(v) => handleChange("agreeToTerms", v)} />
            <Checkbox label="Is recruiter" checked={form.isRecruiter || false} onChange={(v) => handleChange("isRecruiter", v)} />
            <Checkbox label="Is verified" required={true} checked={form.isVerified || true} onChange={(v) => handleChange("isVerified", v)} />
          </div>
          <Input label="Updated at" type="datetime-local" required={true} value={form.updatedAt || new Date().toISOString().slice(0, 16)} onChange={(e) => handleChange("updatedAt", e.target.value)} />
          <div className="flex gap-2">
            <button onClick={() => setForm({})} className=" cursor-pointer w-full bg-gray-200 p-2 rounded">Reset</button>

            {editingUserId ? (
              <>
                <button onClick={() => {
                  setForm({});
                  setEditingUserId(null);
                }} className="w-full bg-gray-200 p-2 rounded">Cancel</button>
                <button onClick={handleSubmit} className="w-full bg-green-600 text-white p-2 rounded">Update</button>
              </>
            ) : (
              <button onClick={handleSubmit} className="w-full bg-blue-600 text-white p-2 rounded">Submit</button>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

function Input({
  label,
  type = "text",
  value,
  required = false,
  onChange,
}: {
  label: React.ReactNode;
  type?: string;
  value: string;
  required?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div>
      <label className="block text-sm mb-1">{label}{required && <span className="text-red-500"> * </span>}</label>
      <input
        type={type}
        className="border w-full p-2 rounded"
        value={value}
        onChange={onChange}
      />
    </div>
  );
}


function Checkbox({ label, checked, onChange, required = false }: { label: string; checked: boolean; required?: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      {label}
      {required && <span className="text-red-500"> * </span>}
    </label>
  );
}

