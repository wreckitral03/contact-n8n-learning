import { ContactForm } from "../../components/contact-form"

export default function ContactPage() {
  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
        <p className="text-muted-foreground mb-8">
          Fill out the form below and we'll get back to you as soon as possible.
        </p>
        <ContactForm />
      </div>
    </div>
  )
}