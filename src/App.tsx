import { useState } from 'react';
import UFClogo from './assets/UFC_Logo.svg';
import whatsAPP from './assets/whatsapp-share-button-icon.svg';
import gCalIcon from './assets/g-cal-icon.svg';

function App() {
  interface EventDetails {
    headline: string;
    prelimsTimestamp: number;
    mainTimestamp: number;
    cardUrl: string;
  }

  const [eventDetails, setEventDetails] = useState<EventDetails[]>(
    []
  );
  const [loading, setLoading] = useState(false);

  const handleScrape = async () => {
    setLoading(true); // <-- Start loading
    try {
      // fetch url to be different if local vs production
      const url = window.location.hostname.includes('localhost')
        ? '/api/scrape'
        : '/.netlify/functions/scrape';
      const res = await fetch(url);
      const data = await res.json();

      console.log(data);
      setEventDetails(data.eventDetails || []);
    } finally {
      setLoading(false); // <-- Stop loading
    }
  };

  return (
    <>
      <div>
        <img src={UFClogo} className="logo" alt="Vite logo" />
      </div>
      <h1>When is your next live card?</h1>
      <button onClick={handleScrape} disabled={loading}>
        {loading ? 'Loading...' : 'Check'}
      </button>
      {loading && <div className="loading-spinner"></div>}
      {eventDetails.length > 0 ? (
        <div className="events-grid">
          {eventDetails.map((event, index) => (
            <div
              key={index}
              className={`event-card ${
                new Date(event.prelimsTimestamp * 1000).getHours() >=
                  8 &&
                new Date(event.prelimsTimestamp * 1000).getHours() <=
                  17
                  ? 'should-watch'
                  : new Date(
                      event.prelimsTimestamp * 1000
                    ).getHours() >= 17 &&
                    new Date(
                      event.prelimsTimestamp * 1000
                    ).getHours() <= 19
                  ? 'probably-watch'
                  : 'might-sleep'
              }`}
            >
              <div className="event-card__content">
                <h2>{event.headline}</h2>
                <p>
                  <strong>Prelims:</strong>{' '}
                  {new Date(
                    event.prelimsTimestamp * 1000
                  ).toLocaleString()}
                </p>
                <p>
                  <strong>Main Card:</strong>{' '}
                  {new Date(
                    event.mainTimestamp * 1000
                  ).toLocaleString()}
                </p>
                <a
                  href={event.cardUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Event Details
                </a>
                <div className="interactive-icons">
                  <a
                    className="whatsapp-share"
                    href={`https://wa.me/?text=${encodeURIComponent(
                      `Check out this UFC event: ${event.headline}\n${event.cardUrl}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img src={whatsAPP} alt="WhatsApp" height="30" />
                  </a>
                  <a
                    className="calendar-share"
                    href={`https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
                      event.headline
                    )}&dates=${new Date(
                      Number(event.prelimsTimestamp) * 1000
                    )
                      .toISOString()
                      .replace(/[-:]|\.\d{3}/g, '')}/${new Date(
                      (Number(event.prelimsTimestamp) + 18000) * 1000 //  5 hours duration
                    )
                      .toISOString()
                      .replace(
                        /[-:]|\.\d{3}/g,
                        ''
                      )}&details=${encodeURIComponent(
                      event.cardUrl
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ marginLeft: '10px', fontSize: '1rem' }}
                  >
                    <img
                      src={gCalIcon}
                      alt="Google Calendar"
                      height="30"
                    />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No events found. Click "Check" to load events.</p>
      )}
    </>
  );
}

export default App;
