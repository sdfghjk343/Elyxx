export function TestimonialSection() {
  const testimonials = [
    {
      quote:
        "Questa AI ha rivoluzionato il mio modo di lavorare. Risparmio ore ogni giorno grazie alle sue funzionalità avanzate.",
      author: "Marco Rossi",
      role: "Imprenditore",
      avatar: "/placeholder.svg?height=100&width=100",
    },
    {
      quote: "La qualità delle risposte è impressionante. È come avere un assistente personale disponibile 24/7.",
      author: "Laura Bianchi",
      role: "Content Creator",
      avatar: "/placeholder.svg?height=100&width=100",
    },
    {
      quote:
        "L'abbonamento Pro vale ogni centesimo. La generazione di testi e l'assistenza codice sono funzionalità che uso quotidianamente.",
      author: "Alessandro Verdi",
      role: "Sviluppatore Software",
      avatar: "/placeholder.svg?height=100&width=100",
    },
  ]

  return (
    <section className="py-20">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Cosa Dicono i Nostri Utenti</h2>
          <p className="mt-4 text-lg text-gray-500 dark:text-gray-400 max-w-3xl mx-auto">
            Scopri come la nostra piattaforma AI sta aiutando persone e aziende a raggiungere i loro obiettivi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-background rounded-xl border p-6 shadow-sm">
              <div className="flex flex-col h-full">
                <div className="flex-grow">
                  <p className="text-lg italic mb-6">"{testimonial.quote}"</p>
                </div>
                <div className="flex items-center">
                  <div className="mr-4">
                    <img
                      alt={`Avatar di ${testimonial.author}`}
                      className="rounded-full w-12 h-12 object-cover"
                      src={testimonial.avatar || "/placeholder.svg"}
                    />
                  </div>
                  <div>
                    <p className="font-semibold">{testimonial.author}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

