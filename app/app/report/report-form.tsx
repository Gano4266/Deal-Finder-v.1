"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";

const submissionOptions = [
  { value: "report_issue", label: "Correct info" },
  { value: "suggest_restaurant", label: "Suggest a restaurant" },
  { value: "submit_deal", label: "Send a special" }
] as const;

const ownerFeedbackOption = {
  value: "owner_feedback",
  label: "Submit feedback to owner"
} as const;

const dealConfirmationOption = {
  value: "confirm_in_person",
  label: "Confirm in person"
} as const;

type SubmissionType =
  | (typeof submissionOptions)[number]["value"]
  | typeof ownerFeedbackOption.value
  | typeof dealConfirmationOption.value;

type ReportFormProps = {
  contextLabel: string;
  contextPath: string;
  contextType: "deal" | "restaurant" | "general";
  dealId?: string;
  dealTitle?: string;
  initialSubmissionType?: SubmissionType;
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
  initialSubmissionType = "report_issue",
  intakeAvailable,
  restaurantId,
  restaurantName
}: ReportFormProps) {
  const [submissionType, setSubmissionType] = useState<SubmissionType>(initialSubmissionType);
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
  const isOwnerFeedbackMode = initialSubmissionType === ownerFeedbackOption.value;
  const itemSubmissionOptions = contextType === "deal"
    ? [dealConfirmationOption, ...submissionOptions]
    : submissionOptions;
  const messagePlaceholder = isOwnerFeedbackMode
    ? "Share a thought, request, or idea for the Forkcast owner."
    : submissionType === dealConfirmationOption.value
      ? "Example: I checked in person tonight and this special was still honored."
      : "Example: This special is now Thursdays, or I found a new taco special.";

  useEffect(() => {
    setSubmissionType(initialSubmissionType);
    setRestaurantNameValue(restaurantName ?? "");
    setDealTitleValue(dealTitle ?? "");
    setDealUrl("");
    setMessage("");
    setReporterName("");
    setReporterEmail("");
    setPreferredContact("");
    setStatus("idle");
    setErrorMessage("");
  }, [contextPath, dealId, dealTitle, initialSubmissionType, restaurantId, restaurantName]);

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
          deal_id: isOwnerFeedbackMode ? "" : dealId ?? "",
          deal_title: isOwnerFeedbackMode ? "" : dealTitleValue,
          deal_url: dealUrl,
          message,
          page_url: window.location.href,
          preferred_contact: preferredContact,
          reporter_email: reporterEmail,
          reporter_name: reporterName,
          restaurant_id: isOwnerFeedbackMode ? "" : restaurantId ?? "",
          restaurant_name: isOwnerFeedbackMode ? "" : restaurantNameValue,
          source_context: [
            isOwnerFeedbackMode ? "owner_feedback" : contextType,
            isOwnerFeedbackMode ? "Forkcast owner feedback" : contextLabel,
            contextPath
          ].filter(Boolean).join(" | "),
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
    if (isOwnerFeedbackMode) {
      setRestaurantNameValue("");
      setDealTitleValue("");
    }
    setReporterName("");
    setReporterEmail("");
    setPreferredContact("");
  }

  return (
    <form className="reportForm" onSubmit={submitReport}>
      {isOwnerFeedbackMode ? (
        <section className="ownerFeedbackNotice" aria-label="Owner feedback type">
          <p>{ownerFeedbackOption.label}</p>
          <span>This message is not attached to a deal or restaurant.</span>
        </section>
      ) : (
        <>
          <fieldset disabled={formDisabled}>
            <legend>Item-specific update</legend>
            <div className="choiceStack">
              {itemSubmissionOptions.map((option) => (
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
        </>
      )}

      <label className="formField">
        <span>Message</span>
        <textarea
          name="message"
          value={message}
          onChange={textChange(setMessage)}
          placeholder={messagePlaceholder}
          rows={4}
          required
          disabled={formDisabled}
        />
      </label>

      <label className="formField">
        <span>{isOwnerFeedbackMode ? "Relevant link, optional" : "Link, optional"}</span>
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
