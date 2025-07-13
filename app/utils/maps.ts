'use client';

// Google Mapsのスクリプトを動的にロード
export async function loadGoogleMapsAPI() {
  // 既に読み込まれているかチェック
  if (typeof window !== 'undefined' && window.google && window.google.maps) {
    console.log('Google Maps API is already loaded');
    return;
  }

  try {
    const response = await fetch(`/api/google-maps`);
    const data = await response.json();
    
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://maps.google.com/maps/api/js?key=${data.apiKey}&language=en`;
      script.async = true;
      script.defer = true;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  } catch (error) {
    console.error('Error fetching API key:', error);
    throw error;
  }
} 