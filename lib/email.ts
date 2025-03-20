import nodemailer from "nodemailer"

// Configurazione del trasportatore email
let transporter: nodemailer.Transporter

async function createTestAccount() {
  // Crea un account di test Ethereal per lo sviluppo locale
  const testAccount = await nodemailer.createTestAccount()
  console.log("Account di test Ethereal creato:", testAccount)

  return nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  })
}

async function getTransporter() {
  if (transporter) return transporter

  // Verifica se sono disponibili le credenziali SMTP
  if (process.env.EMAIL_SERVER_HOST && process.env.EMAIL_SERVER_USER && process.env.EMAIL_SERVER_PASSWORD) {
    console.log("Usando configurazione SMTP da variabili d'ambiente")
    // Configurazione per servizio SMTP
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: Number(process.env.EMAIL_SERVER_PORT || 587),
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
      secure: process.env.EMAIL_SERVER_SECURE === "true",
    })

    // Verifica la connessione
    try {
      await transporter.verify()
      console.log("Connessione SMTP verificata con successo")
    } catch (error) {
      console.error("Errore nella verifica della connessione SMTP:", error)
      console.log("Fallback su account di test Ethereal")
      transporter = await createTestAccount()
    }

    return transporter
  }

  // Fallback su Ethereal per lo sviluppo
  console.log("Nessuna configurazione SMTP trovata, usando account di test Ethereal")
  transporter = await createTestAccount()
  return transporter
}

export async function sendVerificationEmail(email: string, token: string) {
  try {
    const transport = await getTransporter()
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"
    const verificationUrl = `${baseUrl}/verify-email?token=${token}`
    const domain = process.env.DOMAIN_NAME || "AI Platform"

    console.log(`Invio email di verifica a ${email} con URL: ${verificationUrl}`)

    const info = await transport.sendMail({
      from: `"${domain}" <${process.env.EMAIL_FROM || "noreply@example.com"}>`,
      to: email,
      subject: "Verifica il tuo indirizzo email",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333; text-align: center;">Verifica il tuo indirizzo email</h1>
          <p>Grazie per esserti registrato su ${domain}. Per completare la registrazione, verifica il tuo indirizzo email cliccando sul pulsante qui sotto.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" style="background-color: #0070f3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Verifica Email</a>
          </div>
          <p>Oppure copia e incolla questo URL nel tuo browser:</p>
          <p style="word-break: break-all;"><a href="${verificationUrl}">${verificationUrl}</a></p>
          <hr style="border-color: #e6ebf1; margin: 30px 0;">
          <p style="color: #666; font-size: 12px; text-align: center;">Se non hai richiesto questa email, puoi ignorarla in sicurezza.</p>
        </div>
      `,
    })

    // Per sviluppo, mostra l'URL di anteprima dell'email
    console.log(`Email di verifica inviata: ${nodemailer.getTestMessageUrl(info) || "Email inviata"}`)

    return info
  } catch (error) {
    console.error("Errore nell'invio dell'email:", error)
    // Non lanciare l'errore per evitare di bloccare il flusso di registrazione
    return null
  }
}

export async function sendWelcomeEmail(email: string, name: string) {
  try {
    const transport = await getTransporter()
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"
    const domain = process.env.DOMAIN_NAME || "AI Platform"

    console.log(`Invio email di benvenuto a ${email}`)

    const info = await transport.sendMail({
      from: `"${domain}" <${process.env.EMAIL_FROM || "noreply@example.com"}>`,
      to: email,
      subject: `Benvenuto su ${domain}!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333; text-align: center;">Benvenuto su ${domain}!</h1>
          <p>Ciao ${name},</p>
          <p>Grazie per aver verificato il tuo account. Siamo entusiasti di averti con noi! Ora puoi iniziare a utilizzare tutte le funzionalità della nostra piattaforma AI.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${baseUrl}/dashboard" style="background-color: #0070f3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Vai alla Dashboard</a>
          </div>
          <p>Ecco alcune cose che puoi fare:</p>
          <ul>
            <li>Chatta con la nostra AI avanzata</li>
            <li>Genera testi creativi e professionali</li>
            <li>Ottieni assistenza per il codice</li>
            <li>Esplora tutte le funzionalità disponibili</li>
          </ul>
          <p>Se hai domande o hai bisogno di assistenza, non esitare a contattarci.</p>
          <hr style="border-color: #e6ebf1; margin: 30px 0;">
          <p style="color: #666; font-size: 12px; text-align: center;">© ${new Date().getFullYear()} ${domain}. Tutti i diritti riservati.</p>
        </div>
      `,
    })

    console.log(`Email di benvenuto inviata: ${nodemailer.getTestMessageUrl(info) || "Email inviata"}`)

    return info
  } catch (error) {
    console.error("Errore nell'invio dell'email di benvenuto:", error)
    return null
  }
}

export async function sendSubscriptionEmail(email: string, name: string, plan: string, billingCycle: string) {
  try {
    const transport = await getTransporter()
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"
    const domain = process.env.DOMAIN_NAME || "AI Platform"

    console.log(`Invio email di abbonamento a ${email} per il piano ${plan}`)

    const info = await transport.sendMail({
      from: `"${domain}" <${process.env.EMAIL_FROM || "noreply@example.com"}>`,
      to: email,
      subject: `Il tuo abbonamento ${plan} è stato attivato!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333; text-align: center;">Abbonamento Attivato</h1>
          <p>Ciao ${name},</p>
          <p>Grazie per aver sottoscritto il piano ${plan}! Il tuo abbonamento è stato attivato con successo e ora puoi accedere a tutte le funzionalità incluse nel tuo piano.</p>
          <div style="background-color: #f4f7fa; border-radius: 8px; padding: 20px; margin: 30px 0;">
            <h2 style="margin-top: 0;">Dettagli Abbonamento</h2>
            <p><strong>Piano:</strong> ${plan}</p>
            <p><strong>Ciclo di fatturazione:</strong> ${billingCycle === "monthly" ? "Mensile" : "Annuale"}</p>
            <p><strong>Email:</strong> ${email}</p>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${baseUrl}/dashboard" style="background-color: #0070f3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Vai alla Dashboard</a>
          </div>
          <p>Se hai domande sul tuo abbonamento o hai bisogno di assistenza, non esitare a contattarci.</p>
          <hr style="border-color: #e6ebf1; margin: 30px 0;">
          <p style="color: #666; font-size: 12px; text-align: center;">© ${new Date().getFullYear()} ${domain}. Tutti i diritti riservati.</p>
        </div>
      `,
    })

    console.log(`Email di abbonamento inviata: ${nodemailer.getTestMessageUrl(info) || "Email inviata"}`)

    return info
  } catch (error) {
    console.error("Errore nell'invio dell'email di abbonamento:", error)
    return null
  }
}

export async function sendPasswordResetEmail(email: string, token: string) {
  try {
    const transport = await getTransporter()
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"
    const resetUrl = `${baseUrl}/reset-password?token=${token}`
    const domain = process.env.DOMAIN_NAME || "AI Platform"

    console.log(`Invio email di reset password a ${email}`)

    const info = await transport.sendMail({
      from: `"${domain}" <${process.env.EMAIL_FROM || "noreply@example.com"}>`,
      to: email,
      subject: "Reimposta la tua password",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333; text-align: center;">Reimposta la tua password</h1>
          <p>Abbiamo ricevuto una richiesta per reimpostare la password associata a questo indirizzo email (${email}). Clicca sul pulsante qui sotto per reimpostare la tua password.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #0070f3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Reimposta Password</a>
          </div>
          <p>Oppure copia e incolla questo URL nel tuo browser:</p>
          <p style="word-break: break-all;"><a href="${resetUrl}">${resetUrl}</a></p>
          <p>Se non hai richiesto di reimpostare la tua password, puoi ignorare questa email in sicurezza.</p>
          <hr style="border-color: #e6ebf1; margin: 30px 0;">
          <p style="color: #666; font-size: 12px; text-align: center;">© ${new Date().getFullYear()} ${domain}. Tutti i diritti riservati.</p>
        </div>
      `,
    })

    console.log(`Email di reset password inviata: ${nodemailer.getTestMessageUrl(info) || "Email inviata"}`)

    return info
  } catch (error) {
    console.error("Errore nell'invio dell'email di reset password:", error)
    return null
  }
}

