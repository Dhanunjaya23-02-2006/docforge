"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ErrorMessage } from "@/components/tools/ErrorMessage";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to send message.");
      }

      setStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  return (
    <div className="container max-w-2xl pt-16 pb-20">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
        <p className="text-text-muted">Have a question or feedback? We'd love to hear from you.</p>
      </div>

      <div className="card p-6 md:p-8">
        {status === "success" ? (
          <div className="text-center py-8">
            <svg className="h-16 w-16 text-success mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <h2 className="text-2xl font-bold mb-2">Message Sent!</h2>
            <p className="text-text-muted mb-6">Thank you for reaching out. We will get back to you shortly.</p>
            <Button onClick={() => setStatus("idle")}>Send Another Message</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {status === "error" && (
              <ErrorMessage message={errorMessage} onDismiss={() => setStatus("idle")} />
            )}
            
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="label">Name</label>
                <Input name="name" value={formData.name} onChange={handleChange} required />
              </div>
              <div>
                <label className="label">Email</label>
                <Input name="email" type="email" value={formData.email} onChange={handleChange} required />
              </div>
            </div>
            
            <div>
              <label className="label">Subject</label>
              <Input name="subject" value={formData.subject} onChange={handleChange} required />
            </div>
            
            <div>
              <label className="label">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                className="input w-full resize-none"
              ></textarea>
            </div>
            
            <Button type="submit" className="w-full" disabled={status === "loading"}>
              {status === "loading" ? "Sending..." : "Send Message"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
