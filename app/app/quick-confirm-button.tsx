"use client";

import { useState } from "react";

type QuickConfirmButtonProps = {
  contextPath: string;
  dealId: string;
  dealTitle: string;
  restaurantId: string;
  restaurantName: string;
};

export function QuickConfirmButton({
  contextPath,
  dealId,
  dealTitle,
  restaurantId,
  restaurantName
}: QuickConfirmButtonProps) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function confirmDeal() {
    if (status === "sending") {
      return;
    }

    setStatus("sending");

    try {
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          deal_id: dealId,
          deal_title: dealTitle,
          message: `User confirmed in person: ${dealTitle} at ${restaurantName}. Park for review before updating latest checked metadata.`,
          page_url: window.location.href,
          restaurant_id: restaurantId,
          restaurant_name: restaurantName,
          source_context: ["confirm_in_person", dealTitle, contextPath].filter(Boolean).join(" | "),
          submission_type: "confirm_in_person"
        })
      });

      setStatus(response.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <span className="quickConfirm">
      <button type="button" className="secondaryLink" onClick={confirmDeal} disabled={status === "sending"}>
        {status === "sending" ? "Parking..." : status === "sent" ? "Parked for review" : "I checked this"}
      </button>
      <span aria-live="polite" className={status === "error" ? "errorMessage" : "successMessage"}>
        {status === "error" ? "Could not park this check." : status === "sent" ? "Checked date updates after review." : ""}
      </span>
    </span>
  );
}
