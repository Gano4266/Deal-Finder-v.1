"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";

const submissionOptions = [
  { value: "report_issue", label: "Correct info" },
  { value: "suggest_restaurant", label: "Suggest a restaurant" },
  { value: "submit_deal", label: "Send a special" }
] as const;

type SubmissionType = (typeof submissionOptions)[number]["value"];

type ReportFormProps = {
  contextLabel: string;
  contextPath: string;
  contextType: "deal" | "restaurant" | "general";
  dealId?: string;
  dealTitle?: string;
  intakeAvailable: boolean;
  restaurantId?: string;
  restaurantName?: string;
};

export function ReportForm({
  contextLabel,
  contextPath,
  contextType,
  dealId,
  dealTitle,
  intakeAvailable,
  restaurantId,
  restaurantName
}: ReportFormProps) {
  const [submissionType, setSubmissionType] = useState<SubmissionType>("report_issue");
  const [restaurantNameValue, setRestaurantNameValue] = useState(restaurantName ?? "");
  const [dealTitleValue, setDealTitleValue] = useState(dealTitle ?? "");
  const [dealUrl, setDealUrl] = useState("");
  const [message, setMessage] = useState("");
  const [reporterName, setReporterName] = useState("");
  const [reporterEmail, setReporterEmail] = useState("");
  const [preferredContact, setPreferredContact] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const formDisabled = !intakeAvailable || status === "sending";

  useEffect(() => {
    setRestaurantNameValue(restaurantName ?? "");
    setDealTitleValue(dealTitle ?? "");
    setDealUrl("");
    setMessage("");
    setReporterName("");
    setReporterEmail("");
    setPreferredContact("");
    setStatus("idle");
    setErrorMessage("");
  }, [contextPath, dealId, dealTitle, restaurantId, restaurantName]);

  function clearStatusForEdit() {
    if (status === "sent" || status === "error") {
      setStatus("idle");
      setErrorMessage("");
    }
  }

  function textChange(setter: (value: string) => void) {
    return (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      clearStatusForEdit();
      setter(event.target.value);
    };
  }

  async function submitReport(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!intakeAvailable) {
      return;
    }

    setStatus("sending");
    setErrorMessage("");

    let response: Response;

    try {
      response = await fetch("/api/reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          deal_id: dealId ?? "",
          deal_title: dealTitleValue,
          deal_url: dealUrl,
          message,
          page_url: window.location.href,
          preferred_contact: preferredContact,
          reporter_email: reporterEmail,
          reporter_name: reporterName,
          restaurant_id: restaurantId ?? "",
          restaurant_name: restaurantNameValue,
          source_context: [contextType, contextLabel, contextPath].filter(Boolean).join(" | "),
          submission_type: submissionType
        })
      });
    } catch {
      setStatus("error");
      setErrorMessage("We couldn't send this update. Please try again.");
      return;
    }

    if (!response.ok) {
      const body = await response.json().catch(() => undefined);
      setStatus("error");
      setErrorMessage(body?.message ?? "This form is not connected yet. Please try again later.");
      return;
    }

    setStatus("sent");
    setMessage("");
    setDealUrl("");
    setReporterName("");
    setReporterEmail("");
    setPreferredContact("");
  }

  return (
    <form className="reportForm" onSubmit={submitReport}>
      <fieldset disabled={formDisabled}>
        <legend>What kind of update is this?</legend>
        <div className="choiceStack">
          {submissionOptions.map((option) => (
            <label key={option.value} className="radioChoice">
              <input
                type="radio"
                name="submission_type"
                value={option.value}
                checked={submissionType === option.value}
                onChange={() => {
                  clearStatusForEdit();
                  setSubmissionType(option.value);
                }}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <label className="formField">
        <span>Restaurant name</span>
        <input
          name="restaurant_name"
          value={restaurantNameValue}
          onChange={textChange(setRestaurantNameValue)}
          placeholder="Restaurant name"
          disabled={formDisabled}
        />
      </label>

      <label className="formField">
        <span>Deal or special</span>
        <input
          name="deal_title"
          value={dealTitleValue}
          onChange={textChange(setDealTitleValue)}
          placeholder="Example: Tuesday tacos, wing night, kids eat free"
          disabled={formDisabled}
        />
      </label>

      <label className="formField">
        <span>Message</span>
        <textarea
          name="message"
          value={message}
          onChange={textChange(setMessage)}
          placeholder="Example: This special is now Thursdays, or I found a new taco special."
          rows={4}
          required
          disabled={formDisabled}
        />
      </label>

      <label className="formField">
        <span>Link, optional</span>
        <input
          name="deal_url"
          value={dealUrl}
          onChange={textChange(setDealUrl)}
          placeholder="Restaurant page, menu, Instagram/Facebook post, or another link"
          disabled={formDisabled}
        />
      </label>

      <div className="formFieldGrid">
        <label className="formField">
          <span>Name, optional</span>
          <input
            name="reporter_name"
            value={reporterName}
            onChange={textChange(setReporterName)}
            placeholder="Your name"
            disabled={formDisabled}
          />
        </label>

        <label className="formField">
          <span>Email, optional</span>
          <input
            name="reporter_email"
            type="email"
            value={reporterEmail}
            onChange={textChange(setReporterEmail)}
            placeholder="you@example.com"
            disabled={formDisabled}
          />
        </label>
      </div>

      <label className="formField">
        <span>Preferred contact, optional</span>
        <input
          name="preferred_contact"
          value={preferredContact}
          onChange={textChange(setPreferredContact)}
          placeholder="Email, text, Instagram, or no follow-up"
          disabled={formDisabled}
        />
      </label>

      <div className="cardActions">
        {intakeAvailable ? (
          <button type="submit" className="primaryLink" disabled={status === "sending"}>
            {status === "sending" ? "Sending..." : "Send update"}
          </button>
        ) : (
          <span className="disabledLink">This form is not connected yet</span>
        )}
      </div>

      <div aria-live="polite">
        {status === "sent" ? (
          <p className="successMessage">Thanks. This will be reviewed before anything changes on the site.</p>
        ) : null}
        {status === "error" ? (
          <p className="errorMessage">{errorMessage}</p>
        ) : null}
      </div>
    </form>
  );
}
