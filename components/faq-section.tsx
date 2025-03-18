"use client"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function FaqSection() {
  const faqs = [
    {
      question: "Come funziona il periodo di prova gratuito?",
      answer:
        "Il piano Free è sempre gratuito e ti permette di provare le funzionalità di base della nostra piattaforma. Non è richiesta alcuna carta di credito per registrarsi e iniziare a utilizzare il servizio.",
    },
    {
      question: "Posso cambiare piano in qualsiasi momento?",
      answer:
        "Sì, puoi passare da un piano all'altro in qualsiasi momento. Se passi a un piano superiore, ti verrà addebitata solo la differenza. Se passi a un piano inferiore, il cambiamento avrà effetto al termine del ciclo di fatturazione corrente.",
    },
    {
      question: "Come funziona la fatturazione?",
      answer:
        "La fatturazione avviene automaticamente ogni mese o anno, a seconda del ciclo di fatturazione scelto. Accettiamo tutte le principali carte di credito e debito.",
    },
    {
      question: "Posso annullare il mio abbonamento?",
      answer:
        "Sì, puoi annullare il tuo abbonamento in qualsiasi momento. L'annullamento avrà effetto alla fine del ciclo di fatturazione corrente.",
    },
    {
      question: "I miei dati sono al sicuro?",
      answer:
        "Assolutamente. La privacy e la sicurezza dei tuoi dati sono la nostra priorità. Utilizziamo la crittografia di livello bancario e non condividiamo mai i tuoi dati con terze parti senza il tuo consenso esplicito.",
    },
    {
      question: "Offrite sconti per studenti o organizzazioni no-profit?",
      answer:
        "Sì, offriamo sconti speciali per studenti, istituti educativi e organizzazioni no-profit. Contatta il nostro team di supporto per maggiori informazioni.",
    },
  ]

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Domande Frequenti</h2>
          <p className="mt-4 text-lg text-gray-500 dark:text-gray-400 max-w-3xl mx-auto">
            Trova risposte alle domande più comuni sulla nostra piattaforma AI.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}

