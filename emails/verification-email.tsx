import { Body, Button, Container, Head, Heading, Hr, Html, Link, Preview, Section, Text } from "@react-email/components"

interface VerificationEmailProps {
  verificationUrl: string
  email: string
}

export default function VerificationEmail({ verificationUrl, email }: VerificationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Verifica il tuo indirizzo email per AI Platform</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Verifica il tuo indirizzo email</Heading>
          <Text style={text}>
            Grazie per esserti registrato su AI Platform. Per completare la registrazione, verifica il tuo indirizzo
            email cliccando sul pulsante qui sotto.
          </Text>
          <Section style={buttonContainer}>
            <Button style={button} href={verificationUrl}>
              Verifica Email
            </Button>
          </Section>
          <Text style={text}>Oppure copia e incolla questo URL nel tuo browser:</Text>
          <Text style={link}>
            <Link href={verificationUrl} style={link}>
              {verificationUrl}
            </Link>
          </Text>
          <Hr style={hr} />
          <Text style={footer}>Se non hai richiesto questa email, puoi ignorarla in sicurezza.</Text>
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

const link = {
  color: "#0070f3",
  textDecoration: "none",
  fontSize: "14px",
  wordBreak: "break-all" as const,
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

