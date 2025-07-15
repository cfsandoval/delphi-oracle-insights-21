import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": process.env.NODE_ENV === 'production' 
    ? "https://*.lovableproject.com" 
    : "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Max-Age": "86400"
};

interface EmailRequest {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

// Simple rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function isRateLimited(email: string, maxRequests: number = 5, windowMs: number = 60000): boolean {
  const now = Date.now();
  const windowStart = now - windowMs;
  
  const record = rateLimitMap.get(email);
  
  if (!record || record.resetTime < windowStart) {
    rateLimitMap.set(email, { count: 1, resetTime: now });
    return false;
  }
  
  if (record.count >= maxRequests) {
    return true;
  }
  
  record.count++;
  return false;
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email) && email.length <= 254;
}

function sanitizeInput(input: string, maxLength: number): string {
  if (!input || typeof input !== 'string') return '';
  return input.trim().substring(0, maxLength);
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, subject, html, from }: EmailRequest = await req.json();

    // Validate input
    if (!validateEmail(to)) {
      return new Response(
        JSON.stringify({ error: "Invalid email address" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Check rate limiting
    if (isRateLimited(to, 3, 300000)) { // 3 emails per 5 minutes per email
      return new Response(
        JSON.stringify({ error: "Rate limit exceeded" }),
        { status: 429, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Sanitize inputs
    const sanitizedSubject = sanitizeInput(subject, 200);
    const sanitizedFrom = from ? sanitizeInput(from, 100) : "Delphi Platform <onboarding@resend.dev>";

    console.log("Sending email to:", to);

    const emailResponse = await resend.emails.send({
      from: sanitizedFrom,
      to: [to],
      subject: sanitizedSubject,
      html: html, // HTML is already sanitized in the emailService
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);