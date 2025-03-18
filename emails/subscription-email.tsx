import { Body, Button, Container, Head, Heading, Hr, Html, Preview, Section, Text } from "@react-email/components"

interface SubscriptionEmailProps {
  name: string
  email: string
  plan: string
  billingCycle: string
}

export default function SubscriptionEmail({ name, email, plan, billingCycle }: SubscriptionEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Il tuo abbonamento {plan} è stato attivato!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Abbonamento Attivato</Heading>
          <Text style={text}>Ciao {name},</Text>
          <Text style={text}>
            Grazie per aver sottoscritto il piano {plan}! Il tuo abbonamento è stato attivato con successo e ora puoi
            accedere a tutte le funzionalità incluse nel tuo piano.
          </Text>
          <Section style={boxContainer}>
            <div style={box}>
              <Heading as="h2" style={h2}>
                Dettagli Abbonamento
              </Heading>
              <Text style={boxText}>
                <strong>Piano:</strong> {plan}
              </Text>
              <Text style={boxText}>
                <strong>Ciclo di fatturazione:</strong> {billingCycle === "monthly" ? "Mensile" : "Annuale"}
              </Text>
              <Text style={boxText}>
                <strong>Email:</strong> {email}
              </Text>
            </div>
          </Section>
          <Section style={buttonContainer}>
            <Button style={button} href="https://aiplatform.example.com/dashboard">
              Vai alla Dashboard
            </Button>
          </Section>
          <Text style={text}>
            Se hai domande sul tuo abbonamento o hai bisogno di assistenza, non esitare a contattarci.
          </Text>
          <Hr style={hr} />
          <Text style={footer}>© 2023 AI Platform. Tutti i diritti riservati.</Text>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
}

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  maxWidth: "560px",
}

const h1 = {
  fontSize: "24px",
  fontWeight: "600",
  color: "#000",
  letterSpacing: "-0.5px",
  lineHeight: "1.3",
  textAlign: "center" as const,
  margin: "40px 0",
}

const h2 = {
  fontSize: "20px",
  fontWeight: "600",
  color: "#000",
  letterSpacing: "-0.5px",
  lineHeight: "1.3",
  margin: "0 0 15px",
}

const text = {
  margin: "0 0 20px",
  fontSize: "16px",
  lineHeight: "26px",
  color: "#404040",
}

const boxContainer = {
  margin: "30px 0",
}

const box = {
  backgroundColor: "#f4f7fa",
  borderRadius: "8px",
  padding: "20px",
  marginBottom: "20px",
}

const boxText = {
  margin: "0 0 10px",
  fontSize: "14px",
  lineHeight: "24px",
  color: "#404040",
}

const buttonContainer = {
  textAlign: "center" as const,
  margin: "30px 0",
}

const button = {
  backgroundColor: "#0070f3",
  borderRadius: "4px",
  color: "#fff",
  fontSize: "16px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "12px 32px",
}

const hr = {
  borderColor: "#e6ebf1",
  margin: "42px 0 26px",
}

const footer = {
  fontSize: "12px",
  color: "#898989",
  textAlign: "center" as const,
  marginTop: "20px",
}

