import { getCarryoutPlaces } from "../../lib/data";

export default async function CarryoutPage() {
  const places = await getCarryoutPlaces();

  return (
    <main className="pageShell">
      <section className="heroBand">
        <div>
          <p className="eyebrow">Carryout-friendly source seeds</p>
          <h1>Monkey Junction carryout</h1>
          <p className="lede">
            Food-first Wilmington places with official source or ordering signals.
            This public list shows official-source place seeds only. They are
            not published deal claims or live ordering guarantees.
          </p>
          <p className="notes">
            Static prototype data, not live availability. Confirm ordering
            details with the listed source.
          </p>
        </div>
        <div className="statusPanel" aria-label="Carryout source status">
          <span className="statusLabel">Place seeds</span>
          <strong>{places.length}</strong>
          <span>Official-source place records</span>
        </div>
      </section>

      <section className="dealList" aria-label="Monkey Junction carryout places">
        {places.map((place) => (
          <article key={place.placeId} className="dealCard compactDealCard">
            <div>
              <p className="eyebrow">{place.locationArea}</p>
              <h2>{place.restaurantName}</h2>
              <div className="badgeRow" aria-label="Carryout evidence">
                <span>{place.sourceStatus === "verified" ? "Official source found" : "Needs review"}</span>
                <span>Carryout seed</span>
                {place.deliverySignal ? <span>Delivery signal</span> : null}
              </div>
              <p>{place.carryoutSignal}</p>
              <p className="locationLine">{place.address}</p>
              <p className="notes">{place.notes}</p>
            </div>

            <div className="cardActions">
              <a href={place.orderingUrl || place.sourceUrl} className="primaryLink">
                Open source
              </a>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
