import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { SESClient, SendEmailCommand } from 'https://esm.sh/@aws-sdk/client-ses@3.398.0'

interface ContactEmailRequest {
  name: string
  email: string
  message: string
  pricingPlan: 'Starter' | 'Professional' | 'Enterprise'
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Validate request method
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Parse request body
    const body: ContactEmailRequest = await req.json()

    // Validate required fields
    if (!body.name || !body.email || !body.message || !body.pricingPlan) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get AWS SES credentials from environment variables
    const awsAccessKeyId = Deno.env.get('AWS_ACCESS_KEY_ID')
    const awsSecretAccessKey = Deno.env.get('AWS_SECRET_ACCESS_KEY')
    const awsRegion = Deno.env.get('AWS_REGION') || 'us-east-1'

    if (!awsAccessKeyId || !awsSecretAccessKey) {
      console.error('AWS credentials not configured')
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Initialize SES client
    const sesClient = new SESClient({
      region: awsRegion,
      credentials: {
        accessKeyId: awsAccessKeyId,
        secretAccessKey: awsSecretAccessKey,
      },
    })

    // Format email content
    const htmlContent = `
      <html>
        <head></head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #2c3e50;">New Contact Form Submission from Portun.app</h2>

            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p><strong>Name:</strong> ${body.name}</p>
              <p><strong>Email:</strong> ${body.email}</p>
              <p><strong>Interested Plan:</strong> ${body.pricingPlan}</p>
            </div>

            <h3 style="color: #2c3e50;">Message:</h3>
            <p style="white-space: pre-wrap; background-color: #f8f9fa; padding: 15px; border-radius: 5px;">
              ${body.message}
            </p>

            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
            <p style="color: #666; font-size: 12px;">
              This is an automated message from the Portun.app contact form.
            </p>
          </div>
        </body>
      </html>
    `

    const textContent = `
New Contact Form Submission from Portun.app

Name: ${body.name}
Email: ${body.email}
Interested Plan: ${body.pricingPlan}

Message:
${body.message}
    `

    // Send email via AWS SES
    const command = new SendEmailCommand({
      Source: 'noreply@portun.app', // Must be verified in AWS SES
      Destination: {
        ToAddresses: ['hello@portun.app'],
        // BCC to customer's email for reference and SMS notification
        BccAddresses: [body.email, '3105080976@tmomail.net'],
      },
      Message: {
        Subject: {
          Data: `New Inquiry - ${body.name} (${body.pricingPlan} Plan)`,
          Charset: 'UTF-8',
        },
        Body: {
          Html: {
            Data: htmlContent,
            Charset: 'UTF-8',
          },
          Text: {
            Data: textContent,
            Charset: 'UTF-8',
          },
        },
      },
      // Optional: Add reply-to address
      ReplyToAddresses: [body.email],
    })

    const response = await sesClient.send(command)

    console.log('Email sent successfully:', response.MessageId)

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Email sent successfully',
        messageId: response.MessageId,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error sending email:', error)

    return new Response(
      JSON.stringify({
        error: 'Failed to send email',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
