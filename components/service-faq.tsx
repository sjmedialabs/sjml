"use client"

import { useState } from "react"

interface FAQ {
  question: string
  answer: string
}

export function ServiceFaq({ faqs }: { faqs: FAQ[] }) {
  const [openFaq, setOpenFaq] = useState(0)

  return (
    <div className="space-y-3">
      {faqs.map((faq, index) => (
        <div key={index} className="bg-secondary rounded-lg overflow-hidden">
          <button
            onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
            className="w-full px-6 py-4 flex items-center justify-between text-left"
          >
            <span className="text-foreground text-sm font-medium">{faq.question}</span>
            <span className="text-foreground text-xl">{openFaq === index ? "−" : "+"}</span>
          </button>
          {openFaq === index && (
            <div className="px-6 pb-4">
              <p className="text-[#888] text-sm leading-relaxed">{faq.answer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}