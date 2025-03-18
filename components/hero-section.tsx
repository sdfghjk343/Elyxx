import Link from "next/link"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="w-full py-24 md:py-32 lg:py-40 bg-gradient-to-b from-primary/20 to-background">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Intelligenza Artificiale Avanzata per Tutti
              </h1>
              <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                Accedi alla potenza dell'AI con la nostra piattaforma intuitiva. Chatta, crea contenuti, ottieni
                risposte e molto altro ancora.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button asChild size="lg">
                <Link href="/register">Inizia Gratuitamente</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="#pricing">Vedi i Piani</Link>
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative w-full aspect-square md:aspect-[4/3] lg:aspect-[3/4] overflow-hidden rounded-xl">
              <img
                alt="AI Assistant Demo"
                className="object-cover w-full h-full"
                src="/placeholder.svg?height=800&width=600"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-background/20 pointer-events-none" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="bg-background/90 backdrop-blur-sm p-4 rounded-lg border shadow-lg">
                  <p className="text-sm font-medium">AI Assistant</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Come posso aiutarti oggi?</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

