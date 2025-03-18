import { Body, Button, Container, Head, Heading, Hr, Html, Preview, Section, Text } from "@react-email/components"

interface WelcomeEmailProps {
  name: string
  email: string
}

export default function WelcomeEmail({ name, email }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Benvenuto su AI Platform!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Benvenuto su AI Platform!</Heading>
          <Text style={text}>Ciao {name},</Text>
          <Text style={text}>
            Grazie per aver verificato il tuo account. Siamo entusiasti di averti con noi! Ora puoi iniziare a
            utilizzare tutte le funzionalità della nostra piattaforma AI.
          </Text>
          <Section style={buttonContainer}>
            <Button style={button} href="https://aiplatform.example.com/dashboard">
              Vai alla Dashboard
            </Button>
          </Section>
          <Text style={text}>Ecco alcune cose che puoi fare:</Text>
          <ul>
            <li style={listItem}>Chatta con la nostra AI avanzata</li>
            <li style={listItem}>Genera testi creativi e professionali</li>
            <li style={listItem}>Ottieni assistenza per il codice</li>
            <li style={listItem}>Esplora tutte le funzionalità disponibili</li>
          </ul>
          <Text style={text}>Se hai domande o hai bisogno di assistenza, non esitare a contattarci.</Text>
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

const text = {
  margin: "0 0 20px",
  fontSize: "16px",
  lineHeight: "26px",
  color: "#404040",
}

const listItem = {
  margin: "0 0 10px",
  fontSize: "16px",
  lineHeight: "26px",
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

