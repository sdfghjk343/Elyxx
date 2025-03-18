import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PricingPlans } from "@/components/pricing-plans"
import { HeroSection } from "@/components/hero-section"
import { FeatureSection } from "@/components/feature-section"
import { TestimonialSection } from "@/components/testimonial-section"
import { FaqSection } from "@/components/faq-section"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />

      <main className="flex-1">
        <FeatureSection />

        <section id="pricing" className="py-20 bg-gray-50 dark:bg-gray-900">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Scegli il Piano Perfetto per Te
              </h2>
              <p className="mt-4 text-lg text-gray-500 dark:text-gray-400 max-w-3xl mx-auto">
                Offriamo diversi piani di abbonamento per soddisfare le tue esigenze. Inizia gratuitamente o potenzia la
                tua esperienza con i nostri piani premium.
              </p>
            </div>

            <PricingPlans />
          </div>
        </section>

        <TestimonialSection />
        <FaqSection />
      </main>

      <section className="bg-primary py-16">
        <div className="container px-4 md:px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Pronto a Iniziare?</h2>
          <p className="mt-4 text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            Registrati oggi e scopri il potere della nostra AI avanzata. Inizia gratuitamente e aggiorna quando sei
            pronto.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link href="/register">Registrati Gratis</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="bg-transparent text-white border-white hover:bg-white/10"
            >
              <Link href="/login">Accedi</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

