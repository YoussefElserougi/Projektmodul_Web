// app/page.tsx
// Landing Page mit Link zum Chat

import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 pt-24">
      <div className="max-w-2xl text-center">
        {/* Logo/Header */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-2xl mb-4">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="white" 
              className="w-10 h-10"
            >
              <path fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-3.476.383.39.39 0 00-.297.17l-2.755 4.133a.75.75 0 01-1.248 0l-2.755-4.133a.39.39 0 00-.297-.17 48.9 48.9 0 01-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Change Request Portal
          </h1>
          <p className="text-xl text-gray-600">
            Stadtwerke München
          </p>
        </div>

        {/* Beschreibung */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Willkommen! 👋
          </h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Hier kannst du eine neue Change-Anfrage stellen. Unser intelligenter 
            Assistent führt dich Schritt für Schritt durch den Prozess und sammelt 
            alle wichtigen Informationen für dein Vorhaben.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 text-left">
            <div className="bg-blue-50 rounded-xl p-4">
              <div className="text-2xl mb-2">📝</div>
              <h3 className="font-semibold text-gray-800">Formular</h3>
              <p className="text-sm text-gray-600">Strukturierte Erfassung in 8 Sektionen</p>
            </div>
            <div className="bg-green-50 rounded-xl p-4">
              <div className="text-2xl mb-2">💬</div>
              <h3 className="font-semibold text-gray-800">Chat-Assistent</h3>
              <p className="text-sm text-gray-600">KI hilft beim Formulieren & Validieren</p>
            </div>
            <div className="bg-purple-50 rounded-xl p-4">
              <div className="text-2xl mb-2">⚡</div>
              <h3 className="font-semibold text-gray-800">Intelligent</h3>
              <p className="text-sm text-gray-600">Dynamische Felder je nach Projektklasse</p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="flex justify-center">
            <Link 
              href="/chat"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 
                         text-white font-semibold px-8 py-4 rounded-xl 
                         transition-all hover:scale-105 hover:shadow-lg"
            >
              <span>🏗️ Neue Anfrage starten</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="currentColor" 
                className="w-5 h-5"
              >
                <path fillRule="evenodd" d="M12.97 3.97a.75.75 0 011.06 0l7.5 7.5a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 11-1.06-1.06l6.22-6.22H3a.75.75 0 010-1.5h16.19l-6.22-6.22a.75.75 0 010-1.06z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <p className="text-gray-500 text-sm">
          Bei Fragen wende dich an das Change Management Team
        </p>
      </div>
    </main>
  );
}
