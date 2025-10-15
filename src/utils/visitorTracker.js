// Client-side visitor tracking for Discord webhook
const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1428093232587210833/Js18qH8E-nJ2M8JNA5QV16aZF-TY5H3RWufVfaLplsodLkE7ZT3VKwQJr5-lG5kfBDOh';

export const sendVisitorLog = async () => {
  try {
    // Gather visitor details
    const visitorData = {
      timestamp: new Date().toISOString(),
      url: window.location.href,
      referrer: document.referrer || 'Direct visit',
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      cookiesEnabled: navigator.cookieEnabled,
      onlineStatus: navigator.onLine,
    };

    // Detect device type
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isTablet = /iPad|Android/i.test(navigator.userAgent) && !/Mobile/i.test(navigator.userAgent);
    let deviceType = 'Desktop';
    if (isMobile) deviceType = 'Mobile';
    if (isTablet) deviceType = 'Tablet';

    // Get approximate location info from third-party API (client-side)
    let locationData = null;
    try {
      const locationResponse = await fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(3000) });
      if (locationResponse.ok) {
        locationData = await locationResponse.json();
      }
    } catch (err) {
      console.log('Location fetch skipped');
    }

    // Build Discord embed
    const embed = {
      title: '✨ New Content-Spark Visit',
      color: 0x10B981, // Green color for Content-Spark
      fields: [
        {
          name: '🕒 Timestamp',
          value: new Date(visitorData.timestamp).toLocaleString(),
          inline: true
        },
        {
          name: '🌍 Page',
          value: visitorData.url,
          inline: false
        },
        {
          name: '🔗 Referrer',
          value: visitorData.referrer,
          inline: false
        },
        {
          name: '📱 Device Type',
          value: deviceType,
          inline: true
        },
        {
          name: '💻 Platform',
          value: visitorData.platform,
          inline: true
        },
        {
          name: '🖥️ Screen',
          value: visitorData.screenResolution,
          inline: true
        },
        {
          name: '🪟 Viewport',
          value: visitorData.viewport,
          inline: true
        },
        {
          name: '🌐 Language',
          value: visitorData.language,
          inline: true
        },
        {
          name: '🕐 Timezone',
          value: visitorData.timezone,
          inline: true
        },
        {
          name: '🔌 Online',
          value: visitorData.onlineStatus ? 'Yes' : 'No',
          inline: true
        },
        {
          name: '🍪 Cookies',
          value: visitorData.cookiesEnabled ? 'Enabled' : 'Disabled',
          inline: true
        }
      ],
      footer: {
        text: 'Content-Spark Visitor Tracker'
      },
      timestamp: visitorData.timestamp
    };

    // Add location data if available
    if (locationData && !locationData.error) {
      embed.fields.push({
        name: '📍 Location (Approx.)',
        value: `${locationData.city || 'Unknown'}, ${locationData.region || ''} ${locationData.country_name || ''}`.trim(),
        inline: true
      });
      if (locationData.ip) {
        embed.fields.push({
          name: '🌐 IP',
          value: locationData.ip,
          inline: true
        });
      }
      if (locationData.org) {
        embed.fields.push({
          name: '🏢 ISP',
          value: locationData.org,
          inline: false
        });
      }
    }

    // Add browser info
    const browserInfo = getBrowserInfo(visitorData.userAgent);
    embed.fields.push({
      name: '🌐 Browser',
      value: `${browserInfo.name} ${browserInfo.version}`,
      inline: true
    });

    // Send to Discord webhook
    const response = await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        embeds: [embed]
      })
    });

    if (!response.ok) {
      console.error('Failed to send visitor log to Discord');
    }
  } catch (error) {
    console.error('Error tracking visitor:', error);
  }
};

// Helper function to extract browser info
const getBrowserInfo = (userAgent) => {
  let name = 'Unknown';
  let version = '';

  if (userAgent.includes('Firefox/')) {
    name = 'Firefox';
    version = userAgent.match(/Firefox\/(\d+\.\d+)/)?.[1] || '';
  } else if (userAgent.includes('Edg/')) {
    name = 'Edge';
    version = userAgent.match(/Edg\/(\d+\.\d+)/)?.[1] || '';
  } else if (userAgent.includes('Chrome/')) {
    name = 'Chrome';
    version = userAgent.match(/Chrome\/(\d+\.\d+)/)?.[1] || '';
  } else if (userAgent.includes('Safari/')) {
    name = 'Safari';
    version = userAgent.match(/Version\/(\d+\.\d+)/)?.[1] || '';
  } else if (userAgent.includes('Opera/') || userAgent.includes('OPR/')) {
    name = 'Opera';
    version = userAgent.match(/(Opera|OPR)\/(\d+\.\d+)/)?.[2] || '';
  }

  return { name, version };
};
