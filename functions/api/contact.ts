/**
 * Serverless Contact Handler for Cloudflare Pages / Edge Runtime
 * Endpoint: POST /api/contact
 * Zero Recurring Cost Architecture (€0/month)
 */

interface ContactPayload {
  name: string;
  email: string;
  organization: string;
  role: string;
  intent: string;
  problemContext: string;
  source: string;
  submittedAt: string;
  _hp?: string; // Honeypot field
}

// Security & Sanitization Helper
function sanitizeString(str: unknown, maxLen = 500): string {
  if (typeof str !== 'string') return '';
  return str
    .replace(/[<>]/g, '') // Strip basic HTML tags
    .trim()
    .slice(0, maxLen);
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return emailRegex.test(email) && email.length <= 120;
}

export async function onRequestPost(context: { request: Request; env: Record<string, string | undefined> }) {
  const { request, env } = context;

  // 1. Enforce JSON content type
  const contentType = request.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    return new Response(
      JSON.stringify({ ok: false, error: 'INVALID_CONTENT_TYPE', message: 'Content-Type must be application/json' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  let body: Partial<ContactPayload>;
  try {
    body = await request.json();
  } catch {
    return new Response(
      JSON.stringify({ ok: false, error: 'MALFORMED_JSON', message: 'Could not parse JSON body' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // 2. Honeypot verification (anti-spam)
  if (body._hp && body._hp.length > 0) {
    // Silently reject bots without revealing honeypot detection
    return new Response(
      JSON.stringify({ ok: true, status: 'PROCESSED' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // 3. Validation & Sanitization
  const name = sanitizeString(body.name, 100);
  const email = sanitizeString(body.email, 120);
  const organization = sanitizeString(body.organization, 150) || 'Não especificada';
  const role = sanitizeString(body.role, 80) || 'Outro';
  const intent = sanitizeString(body.intent, 100) || 'Geral';
  const problemContext = sanitizeString(body.problemContext, 4000);
  const source = sanitizeString(body.source, 80) || 'website_qualification_form';
  const submittedAt = new Date().toISOString();

  if (!name || name.length < 2) {
    return new Response(
      JSON.stringify({ ok: false, error: 'VALIDATION_FAILED', field: 'name', message: 'Nome deve ter pelo menos 2 caracteres.' }),
      { status: 422, headers: { 'Content-Type': 'application/json' } }
    );
  }

  if (!email || !isValidEmail(email)) {
    return new Response(
      JSON.stringify({ ok: false, error: 'VALIDATION_FAILED', field: 'email', message: 'Email profissional inválido.' }),
      { status: 422, headers: { 'Content-Type': 'application/json' } }
    );
  }

  if (!problemContext || problemContext.length < 10) {
    return new Response(
      JSON.stringify({ ok: false, error: 'VALIDATION_FAILED', field: 'problemContext', message: 'Descrição do contexto deve conter pelo menos 10 caracteres.' }),
      { status: 422, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // 4. CRM Normalized Payload
  const crmRecord = {
    name,
    email,
    organization,
    role,
    intent,
    problemContext,
    source,
    submittedAt,
  };

  // 5. Delivery Check (Owner credential gating)
  const webhookUrl = env?.CONTACT_WEBHOOK_URL;

  if (webhookUrl) {
    try {
      const dispatchRes = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(crmRecord),
      });

      if (!dispatchRes.ok) {
        throw new Error(`Upstream webhook returned status ${dispatchRes.status}`);
      }

      return new Response(
        JSON.stringify({ ok: true, status: 'DELIVERED', message: 'Contexto técnico recebido com sucesso.' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } catch {
      // Fall through to CONFIG_REQUIRED if upstream dispatch encounters issue
      return new Response(
        JSON.stringify({
          ok: true,
          status: 'CONFIG_REQUIRED',
          message: 'Payload validado. Entrega pendente de configuração upstream.',
          record: crmRecord,
        }),
        { status: 202, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

  // No secrets or credentials committed in code:
  // Transparently return validated status requiring owner backend webhook binding.
  return new Response(
    JSON.stringify({
      ok: true,
      status: 'CONFIG_REQUIRED',
      message: 'Payload validado com sucesso. Entrega no destino requer configuração de variável CONTACT_WEBHOOK_URL pelo proprietário.',
      record: crmRecord,
    }),
    { status: 202, headers: { 'Content-Type': 'application/json' } }
  );
}
