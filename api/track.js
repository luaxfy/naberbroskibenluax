const requestCounts = new Map();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (req.headers['x-custom-header'] !== 'luax-tracker') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const now = Date.now();
  
  if (!requestCounts.has(ip)) {
    requestCounts.set(ip, []);
  }
  
  const timestamps = requestCounts.get(ip).filter(t => now - t < 60000);
  
  if (timestamps.length > 5) {
    return res.status(429).json({ error: 'Too many requests' });
  }
  
  timestamps.push(now);
  requestCounts.set(ip, timestamps);

  try {
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    
    if (!webhookUrl) {
      return res.status(500).json({ error: 'Webhook not configured' });
    }

    const data = req.body;

    const embed = {
      title: "🎯 Yeni Ziyaretçi Tespit Edildi",
      color: 0x8B5CF6,
      fields: [
        { name: "🌐 IP Adresi", value: data.ip || "Bilinmiyor", inline: true },
        { name: "🖥️ Platform", value: data.platform || "Bilinmiyor", inline: true },
        { name: "🌍 Dil", value: data.language || "Bilinmiyor", inline: true },
        { name: "📱 User Agent", value: "```" + (data.userAgent || "Bilinmiyor").substring(0, 100) + "```", inline: false },
        { name: "📺 Ekran", value: data.screenResolution || "Bilinmiyor", inline: true },
        { name: "🎨 Renk Derinliği", value: data.screenColorDepth ? `${data.screenColorDepth} bit` : "Bilinmiyor", inline: true },
        { name: "🕐 Saat Dilimi", value: data.timezone || "Bilinmiyor", inline: true },
        { name: "🔗 Referrer", value: data.referrer || "Direct", inline: false },
        { name: "📶 Bağlantı", value: data.connection ? `${data.connection.effectiveType} (${data.connection.downlink} Mbps)` : "Bilinmiyor", inline: true },
        { name: "📱 Touch", value: data.touchSupport ? "✅ Var" : "❌ Yok", inline: true },
        { name: "🍪 Cookies", value: data.cookiesEnabled ? "✅ Aktif" : "❌ Kapalı", inline: true },
        { name: "⏰ Zaman", value: new Date(data.timestamp).toLocaleString('tr-TR'), inline: false }
      ],
      timestamp: new Date().toISOString(),
      footer: { text: "LUAX Tracker v1.0" }
    };

    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ embeds: [embed] })
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
