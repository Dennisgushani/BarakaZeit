import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Loader2 } from 'lucide-react';

const PrayerTimes = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation wird von deinem Browser nicht unterstützt.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        // Dynamische Auswahl der Methode: 
        // Methode 3 (MWL) für Europa, sonst Methode 2 (ISNA)
        // Eine einfache Schätzung basierend auf Breitengrad/Längengrad für Europa
        const isEurope = latitude > 35 && latitude < 70 && longitude > -25 && longitude < 40;
        const methodId = isEurope ? 3 : 2;

        try {
          // API-Aufruf mit deinen exakten Anforderungen
          const response = await fetch(
            `https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=${methodId}&higherLatitudeMethod=3`
          );
          const result = await response.json();

          if (result.code === 200) {
            setData(result.data);
          } else {
            throw new Error("API-Fehler");
          }
        } catch (err) {
          setError("Fehler beim Abrufen der Gebetszeiten.");
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        setError("Standortzugriff verweigert. Bitte aktiviere die Ortungsdienste.");
        setLoading(false);
      }
    );
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-10 space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-[#D4A574]" />
        <p className="text-slate-500">Ermittle Standort und Gebetszeiten...</p>
      </div>
    );
  }

  if (error) {
    return <div className="p-6 text-red-500 bg-red-50 rounded-lg border border-red-200">{error}</div>;
  }

  const timings = data.timings;
  const prayerDisplay = [
    { id: 'Fajr', label: 'Fajr', arabic: 'الفجر' },
    { id: 'Sunrise', label: 'Sonnenaufgang', arabic: 'الشروق' },
    { id: 'Dhuhr', label: 'Dhuhr', arabic: 'الظهر' },
    { id: 'Asr', label: 'Asr', arabic: 'العصر' },
    { id: 'Maghrib', label: 'Maghrib', arabic: 'المغرب' },
    { id: 'Isha', label: 'Isha', arabic: 'العشاء' },
  ];

  return (
    <div className="max-w-md mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
      {/* Header Bereich mit Logo-Platzhalter */}
      <div className="bg-[#0369A1] p-8 text-white text-center relative">
        <div className="flex justify-center mb-4">
            {/* Hier wird dein Logo-Bild eingefügt */}
            <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
                <span className="text-[#D4A574] font-serif text-xl font-bold">LICHT</span>
            </div>
        </div>
        <h2 className="text-2xl font-serif font-bold">Gebetszeiten</h2>
        <div className="flex items-center justify-center mt-2 text-white/80 text-sm">
          <MapPin className="w-4 h-4 mr-1" />
          <span>{data.meta.timezone} (Auto-Location)</span>
        </div>
      </div>

      {/* Liste der Zeiten */}
      <div className="p-6 space-y-3 bg-slate-50">
        {prayerDisplay.map((prayer) => (
          <div 
            key={prayer.id}
            className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-slate-100 hover:border-[#D4A574] transition-colors group"
          >
            <div className="flex flex-col">
              <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                {prayer.arabic}
              </span>
              <span className="text-slate-700 font-bold">{prayer.label}</span>
            </div>
            <div className="text-2xl font-mono font-bold text-[#0369A1] group-hover:text-[#D4A574] transition-colors">
              {timings[prayer.id]}
            </div>
          </div>
        ))}
      </div>

      {/* Info-Footer */}
      <div className="p-4 bg-slate-100 text-center text-[10px] text-slate-400 uppercase tracking-[0.2em]">
        Methode: {data.meta.method.name} | Sommer-Korrektur Aktiv
      </div>
    </div>
  );
};

export default PrayerTimes;

