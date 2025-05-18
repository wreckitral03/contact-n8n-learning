"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle, CheckCircle2 } from "lucide-react"

interface FormState {
  status: "idle" | "submitting" | "success" | "error"
  message: string | null
}

export function ContactForm() {
  const [formState, setFormState] = useState<FormState>({
    status: "idle",
    message: null,
  })

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setFormState({ status: "submitting", message: null })

    const formData = new FormData(event.currentTarget)
const data = {
  name: String(formData.get("name") || ""),
  email: String(formData.get("email") || ""),
  message: String(formData.get("message") || ""),
}

    try {
      const response = await fetch("http://localhost:4000/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Something went wrong. Please try again later.")
      }

      setFormState({
        status: "success",
        message: "Thank you! Your message has been sent successfully.",
      })

      // Reset the form safely
      if (event.currentTarget) {
        event.currentTarget.reset()
      }
    } catch (error) {
      setFormState({
        status: "error",
        message: error instanceof Error ? error.message : "Something went wrong. Please try again later.",
      })
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Your name"
              required
              disabled={formState.status === "submitting"}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="your.email@example.com"
              required
              disabled={formState.status === "submitting"}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              name="message"
              placeholder="Your message"
              rows={5}
              required
              disabled={formState.status === "submitting"}
            />
          </div>

          {formState.status === "success" && (
            <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-md">
              <CheckCircle2 className="h-5 w-5" />
              <p>{formState.message}</p>
            </div>
          )}

          {formState.status === "error" && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-md">
              <AlertCircle className="h-5 w-5" />
              <p>{formState.message}</p>
            </div>
          )}

          <Button type="submit" className="w-full md:w-auto" disabled={formState.status === "submitting"}>
            {formState.status === "submitting" ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
