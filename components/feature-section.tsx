import { Brain, MessageSquare, FileText, Image, Code, Lock, Zap, Clock } from "lucide-react"

export function FeatureSection() {
  const features = [
    {
      icon: <MessageSquare className="h-10 w-10 text-primary" />,
      title: "Chat Avanzato",
      description: "Conversazioni naturali e contestuali con la nostra AI avanzata.",
    },
    {
      icon: <Brain className="h-10 w-10 text-primary" />,
      title: "Memoria Contestuale",
      description: "L'AI ricorda le conversazioni precedenti per risposte più pertinenti.",
    },
    {
      icon: <FileText className="h-10 w-10 text-primary" />,
      title: "Generazione di Testi",
      description: "Crea articoli, email, storie e altro con un semplice prompt.",
    },
    {
      icon: <Image className="h-10 w-10 text-primary" />,
      title: "Descrizione Immagini",
      description: "Carica immagini e ottieni descrizioni dettagliate.",
    },
    {
      icon: <Code className="h-10 w-10 text-primary" />,
      title: "Assistenza Codice",
      description: "Aiuto con la programmazione, debugging e spiegazioni tecniche.",
    },
    {
      icon: <Lock className="h-10 w-10 text-primary" />,
      title: "Privacy Garantita",
      description: "I tuoi dati sono protetti e non vengono condivisi con terze parti.",
    },
    {
      icon: <Zap className="h-10 w-10 text-primary" />,
      title: "Risposte Rapide",
      description: "Elaborazione veloce per risposte immediate alle tue domande.",
    },
    {
      icon: <Clock className="h-10 w-10 text-primary" />,
      title: "Disponibile 24/7",
      description: "Accesso all'AI in qualsiasi momento, giorno e notte.",
    },
  ]

  return (
    <section className="py-20">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Funzionalità Potenti</h2>
          <p className="mt-4 text-lg text-gray-500 dark:text-gray-400 max-w-3xl mx-auto">
            La nostra piattaforma AI offre una vasta gamma di funzionalità avanzate per soddisfare tutte le tue
            esigenze.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-6 bg-background rounded-xl border shadow-sm"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-500 dark:text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

