"use client";

import { useState, useEffect } from "react";

interface Expense {
  id: number;
  title: string;
  amount: number;
  date: string;
}

export default function Home() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [form, setForm] = useState({ title: "", amount: "" });
  const [isLoading, setIsLoading] = useState(true);

  // คำนวณยอดรวม (จะเปลี่ยนอัตโนมัติเมื่อ expenses เปลี่ยน)
  const totalAmount = expenses.reduce((sum, item) => sum + item.amount, 0);

  const fetchExpenses = async () => {
    try {
      const res = await fetch("/api/expenses");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setExpenses(data.reverse());
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.amount) return;

    try {
      await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          amount: parseFloat(form.amount),
        }),
      });
      setForm({ title: "", amount: "" });
      fetchExpenses();
    } catch (error) {
      console.error("Error adding:", error);
    }
  };

  // === ฟังก์ชันลบรายการ (ใหม่) ===
  const handleDelete = async (id: number) => {
    // 1. ถามยืนยันก่อนลบ (Optional)
    if (!confirm("ยืนยันที่จะลบรายการนี้?")) return;

    try {
      // 2. ยิง API ไปลบที่ Backend
      await fetch(`/api/expenses/${id}`, {
        method: "DELETE",
      });

      // 3. อัปเดตหน้าจอทันทีโดยการกรองเอาตัวที่ id ตรงกันออก (ไม่ต้อง fetch ใหม่ให้เสียเวลา)
      setExpenses(expenses.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting:", error);
      alert("ลบไม่สำเร็จ กรุณาลองใหม่");
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("th-TH", {
      day: "numeric",
      month: "short",
      year: "2-digit",
    }).format(date);
  };

  return (
    <main className="min-h-screen bg-slate-50 py-10 px-4 font-sans">
      <div className="max-w-md mx-auto">
        {/* Header (เหมือนเดิม) */}
        <div className="bg-linear-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-blue-100 text-sm font-medium uppercase tracking-wider">
                My Expenses
              </h2>
              <h1 className="text-3xl font-bold mt-1">รายจ่ายทั้งหมด</h1>
            </div>
            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-3-3V5a3 3 0 10-3 3v12a3 3 0 003 3h4.5A2.25 2.25 0 0021 18v-6zM19.5 12a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                />
              </svg>
            </div>
          </div>
          <div className="mt-6">
            <span className="text-4xl font-bold tracking-tight">
              ฿ {totalAmount.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Form (เหมือนเดิม) */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 mb-6">
          <h3 className="text-slate-800 font-semibold mb-4 flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5 text-indigo-500"
            >
              <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
            </svg>
            เพิ่มรายการใหม่
          </h3>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-400">📝</span>
              </div>
              <input
                type="text"
                required
                placeholder="ชื่อรายการ (เช่น กาแฟ, ค่าเดินทาง)"
                className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-slate-800 placeholder-slate-400 text-sm"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>

            <div className="flex gap-3">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400 font-bold">฿</span>
                </div>
                <input
                  type="number"
                  required
                  placeholder="0.00"
                  className="block w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-slate-800 placeholder-slate-400 text-sm"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                />
              </div>
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors shadow-md shadow-indigo-200 flex items-center gap-2"
              >
                บันทึก
              </button>
            </div>
          </form>
        </div>

        {/* List Section (เพิ่มปุ่มลบ) */}
        <div className="space-y-3">
          <h3 className="text-slate-500 text-sm font-medium uppercase tracking-wider pl-1">
            ประวัติล่าสุด
          </h3>

          {isLoading ? (
            <div className="text-center py-10 text-slate-400">Loading...</div>
          ) : expenses.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-xl border border-dashed border-slate-300">
              <p className="text-slate-400">ยังไม่มีรายการรายจ่าย</p>
            </div>
          ) : (
            expenses.map((item) => (
              <div
                key={item.id}
                className="group bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 flex justify-between items-center"
              >
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-slate-800 font-medium">{item.title}</p>
                    <p className="text-slate-400 text-xs">
                      {formatDate(item.date)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-slate-800 font-bold text-lg">
                    - {item.amount.toLocaleString()}
                  </span>

                  {/* ปุ่มลบ (Trash Icon) */}
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                    title="ลบรายการ"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
