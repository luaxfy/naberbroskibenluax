import React, { useState, useEffect } from 'react';

export default function TerminalTracker() {
  const [lines, setLines] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const terminalLines = [
    { text: '> Initializing connection...', delay: 100 },
    { text: '> Establishing secure tunnel...', delay: 200 },
    { text: '> Bypassing firewall...', delay: 150 },
    { text: '> Connection established ✓', delay: 100, color: 'text-green-400' },
    { text: '', delay: 200 },
    { text: '> Scanning network parameters...', delay: 150 },
    { text: '> Collecting device fingerprint...', delay: 180 },
    { text: '> Analyzing system architecture...', delay: 160 },
    { text: '> Data extraction complete ✓', delay: 100, color: 'text-green-400' },
    { text: '', delay: 300 },
    { text: '> System authenticated', delay: 150, color: 'text-cyan-400' },
    { text: '', delay: 200 },
    { text: 'NABER BROSKİ BEN LUAX', delay: 100, color: 'text-red-500', size: 'text-base', glow: true, kali: true }
  ];

  useEffect(() => {
    const checkRateLimit = () => {
      const now = Date.now();
      const visits = JSON.parse(sessionStorage.getItem('visits') || '[]');
      const recentVisits = visits.filter(v => now - v < 60000);
      
      if (recentVisits.length > 10) {
        return false;
      }
      
      recentVisits.push(now);
      sessionStorage.setItem('visits', JSON.stringify(recentVisits));
      return true;
    };

    const isLikelyBot = () => {
      const ua = navigator.userAgent.toLowerCase();
      const botPatterns = ['bot', 'crawl', 'spider', 'scrape', 'curl', 'wget'];
      if (botPatterns.some(pattern => ua.includes(pattern))) return true;
      
      if (navigator.webdriver) return true;
      
      if (!navigator.plugins || navigator.plugins.length === 0) return true;
      
      return false;
    };

    const sendData = async () => {
      if (isLikelyBot() || !checkRateLimit()) {
        console.log('Request blocked');
        return;
      }

      try {
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();

        const deviceInfo = {
          ip: ipData.ip,
          userAgent: navigator.userAgent,
          platform: navigator.platform,
          language: navigator.language,
          languages: navigator.languages,
          screenResolution: `${screen.width}x${screen.height}`,
          screenColorDepth: screen.colorDepth,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          cookiesEnabled: navigator.cookieEnabled,
          doNotTrack: navigator.doNotTrack,
          timestamp: new Date().toISOString(),
          referrer: document.referrer || 'Direct',
          viewport: `${window.innerWidth}x${window.innerHeight}`,
          touchSupport: 'ontouchstart' in window,
          connection: navigator.connection ? {
            effectiveType: navigator.connection.effectiveType,
            downlink: navigator.connection.downlink,
            rtt: navigator.connection.rtt
          } : 'Unknown'
        };

        await fetch('/api/track', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Custom-Header': 'luax-tracker'
          },
          body: JSON.stringify(deviceInfo)
        });

      } catch (error) {
        console.error('Error:', error);
      }
    };

    sendData();
  }, []);

  useEffect(() => {
    if (currentIndex < terminalLines.length) {
      const timer = setTimeout(() => {
        setLines(prev => [...prev, terminalLines[currentIndex]]);
        setCurrentIndex(currentIndex + 1);
      }, terminalLines[currentIndex].delay);

      return () => clearTimeout(timer);
    }
  }, [currentIndex]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-red-950/20 via-black to-gray-900/30"></div>
      
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      
      <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,255,255,.03)_50%)] bg-[length:100%_4px] animate-scan pointer-events-none"></div>

      <div className="relative w-full max-w-4xl">
        <div className="bg-gray-800 rounded-t-lg px-4 py-2 flex items-center gap-2 border-b border-cyan-500/30">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <span className="text-gray-400 text-sm ml-2 font-mono">luax@terminal ~ /secure</span>
        </div>

        <div className="bg-black/90 backdrop-blur-sm rounded-b-lg p-6 border border-cyan-500/30 shadow-[0_0_30px_rgba(0,255,255,0.3)] min-h-[400px]">
          <div className="font-mono text-sm space-y-2" style={{ fontFamily: "'Courier New', 'Consolas', 'Monaco', monospace" }}>
            {lines.map((line, index) => (
              <div
                key={index}
                className={`${line.color || 'text-green-500'} ${line.size || 'text-sm'} ${
                  line.glow ? 'animate-pulse' : ''
                } ${line.kali ? 'font-bold tracking-wider' : ''} transition-all duration-300`}
                style={line.glow ? {
                  textShadow: line.kali 
                    ? '0 0 8px rgba(239, 68, 68, 0.8), 0 0 15px rgba(239, 68, 68, 0.5), 2px 2px 0px rgba(0,0,0,0.8)' 
                    : '0 0 10px rgba(168, 85, 247, 0.8), 0 0 20px rgba(168, 85, 247, 0.5)',
                  fontWeight: line.kali ? '600' : 'bold',
                  letterSpacing: line.kali ? '0.05em' : 'normal',
                  textTransform: line.kali ? 'uppercase' : 'none'
                } : {}}
              >
                {line.kali ? (
                  <div className="flex items-center gap-2">
                    <span className="text-red-500">┌──(</span>
                    <span className="text-cyan-400">luax㉿kali</span>
                    <span className="text-red-500">)-[</span>
                    <span className="text-blue-400">~</span>
                    <span className="text-red-500">]</span>
                    <br />
                    <span className="text-red-500">└─$</span>
                    <span className="ml-2 text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,1)]">
                      {line.text}
                    </span>
                  </div>
                ) : (
                  line.text
                )}
                {index === lines.length - 1 && line.text && !line.kali && (
                  <span className="inline-block w-2 h-4 bg-green-500 ml-1 animate-blink"></span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent blur-xl"></div>
      </div>

      <style jsx>{`
        @keyframes scan {
          0% { background-position: 0 0; }
          100% { background-position: 0 100%; }
        }
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        .animate-scan {
          animation: scan 8s linear infinite;
        }
        .animate-blink {
          animation: blink 1s step-end infinite;
        }
      `}</style>
    </div>
  );
}
