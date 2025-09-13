import { useState } from 'react';
import UFClogo from './assets/UFC_Logo.svg'; // adjust path

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
      const res = await fetch('/.netlify/functions/scrape');
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
                new Date(event.prelimsTimestamp * 1000).getHours() <
                  16
                  ? 'should-watch'
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
