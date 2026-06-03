import { NextResponse, type NextRequest } from "next/server";

export const dynamic = "force-dynamic";

const allowedSubmissionTypes = new Set(["report_issue", "suggest_restaurant", "submit_deal"]);
const forwardTimeoutMs = 12_000;

type ReportPayload = {
  submission_type?: string;
  restaurant_name?: string;
  deal_title?: string;
  deal_url?: string;
  page_url?: string;
  message?: string;
  reporter_name?: string;
  reporter_email?: string;
  preferred_contact?: string;
  deal_id?: string;
  restaurant_id?: string;
  source_context?: string;
};

function cleanValue(value: unknown): string {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().slice(0, 4000);
}

function normalizePayload(body: unknown): Required<ReportPayload> {
  const payload = body && typeof body === "object" ? body as ReportPayload : {};
  const submissionType = cleanValue(payload.submission_type);

  return {
    submission_type: allowedSubmissionTypes.has(submissionType) ? submissionType : "report_issue",
    restaurant_name: cleanValue(payload.restaurant_name),
    deal_title: cleanValue(payload.deal_title),
    deal_url: cleanValue(payload.deal_url),
    page_url: cleanValue(payload.page_url),
    message: cleanValue(payload.message),
    reporter_name: cleanValue(payload.reporter_name),
    reporter_email: cleanValue(payload.reporter_email),
    preferred_contact: cleanValue(payload.preferred_contact),
    deal_id: cleanValue(payload.deal_id),
    restaurant_id: cleanValue(payload.restaurant_id),
    source_context: cleanValue(payload.source_context)
  };
}

function hubSpotBody(payload: Required<ReportPayload>) {
  const messageWithContext = [
    `Type: ${payload.submission_type}`,
    payload.restaurant_name ? `Restaurant: ${payload.restaurant_name}` : "",
    payload.deal_title ? `Deal: ${payload.deal_title}` : "",
    payload.deal_url ? `Link: ${payload.deal_url}` : "",
    payload.page_url ? `Page: ${payload.page_url}` : "",
    payload.preferred_contact ? `Preferred contact: ${payload.preferred_contact}` : "",
    payload.deal_id ? `Deal ID: ${payload.deal_id}` : "",
    payload.restaurant_id ? `Restaurant ID: ${payload.restaurant_id}` : "",
    payload.source_context ? `Context: ${payload.source_context}` : "",
    "",
    payload.message
  ].filter(Boolean).join("\n");

  const hubSpotFields = [
    { name: "submission_type", value: payload.submission_type },
    payload.restaurant_name ? { name: "restaurant_name", value: payload.restaurant_name } : undefined,
    payload.deal_title ? { name: "deal_title", value: payload.deal_title } : undefined,
    payload.deal_url ? { name: "deal_url", value: payload.deal_url } : undefined,
    payload.page_url ? { name: "page_url", value: payload.page_url } : undefined,
    { name: "message", value: messageWithContext },
    payload.reporter_name ? { name: "reporter_name", value: payload.reporter_name } : undefined,
    payload.reporter_email ? { name: "reporter_email", value: payload.reporter_email } : undefined,
    payload.preferred_contact ? { name: "preferred_contact", value: payload.preferred_contact } : undefined,
    payload.deal_id ? { name: "deal_id", value: payload.deal_id } : undefined,
    payload.restaurant_id ? { name: "restaurant_id", value: payload.restaurant_id } : undefined,
    payload.source_context ? { name: "source_context", value: payload.source_context } : undefined,
    payload.reporter_email ? { name: "email", value: payload.reporter_email } : undefined,
    payload.reporter_name ? { name: "firstname", value: payload.reporter_name } : undefined
  ].filter((field): field is { name: string; value: string } => Boolean(field));

  return {
    submittedAt: Date.now().toString(),
    fields: hubSpotFields,
    context: {
      pageName: "Forkcast Intake",
      pageUri: payload.page_url
    }
  };
}

async function postJsonWithTimeout(url: string, body: unknown) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), forwardTimeoutMs);

  try {
    return await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body),
      signal: controller.signal
    });
  } finally {
    clearTimeout(timeout);
  }
}

async function forwardToHubSpot(payload: Required<ReportPayload>) {
  const portalId = process.env.HUBSPOT_PORTAL_ID;
  const formGuid = process.env.HUBSPOT_INTAKE_FORM_GUID;

  if (!portalId || !formGuid) {
    return false;
  }

  const response = await postJsonWithTimeout(
    `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formGuid}`,
    hubSpotBody(payload)
  );

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`HubSpot intake failed with ${response.status}${body ? `: ${body.slice(0, 500)}` : ""}`);
  }

  return true;
}

async function forwardToWebhook(payload: Required<ReportPayload>) {
  const webhookUrl = process.env.REPORT_WEBHOOK_URL;

  if (!webhookUrl) {
    return false;
  }

  const response = await postJsonWithTimeout(webhookUrl, {
      app: "forkcast",
      received_at: new Date().toISOString(),
      ...payload
  });

  if (!response.ok) {
    throw new Error(`Report webhook failed with ${response.status}`);
  }

  return true;
}

export async function POST(request: NextRequest) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Please send the form again." }, { status: 400 });
  }

  const payload = normalizePayload(body);

  if (!payload.message) {
    return NextResponse.json({ message: "Please add a short message." }, { status: 400 });
  }

  if (
    request.headers.get("x-forkcast-smoke-test") === "true" &&
    process.env.FORKCAST_REPORT_SMOKE_DRY_RUN === "true"
  ) {
    return NextResponse.json({
      message: "Smoke test received. Report intake dry-run is enabled."
    });
  }

  try {
    if (await forwardToHubSpot(payload)) {
      return NextResponse.json({
        message: "Thanks. This will be reviewed before anything changes on the site."
      });
    }

    if (await forwardToWebhook(payload)) {
      return NextResponse.json({
        message: "Thanks. This will be reviewed before anything changes on the site."
      });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "This form is temporarily unavailable. Please try again later." },
      { status: 502 }
    );
  }

  if (process.env.NODE_ENV === "production" || process.env.VERCEL_ENV === "production") {
    return NextResponse.json(
      { message: "This form is temporarily unavailable. Please try again later." },
      { status: 503 }
    );
  }

  console.info("Forkcast local intake test", {
    submission_type: payload.submission_type,
    restaurant_name: payload.restaurant_name,
    deal_title: payload.deal_title,
    deal_id: payload.deal_id,
    restaurant_id: payload.restaurant_id
  });

  return NextResponse.json({
    message: "Local test received. Add HubSpot settings before sharing this form."
  });
}
