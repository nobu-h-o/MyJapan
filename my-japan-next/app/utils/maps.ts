'use client';

// Google Mapsのスクリプトを動的にロード
export async function loadGoogleMapsAPI() {
  try {
    const response = await fetch(`/api/google-maps-config`);
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

// 地名から座標を取得
export async function geocodeAddress(geocoder: any, address: string) {
  return new Promise((resolve, reject) => {
    geocoder.geocode({ address: address }, (results: any, status: string) => {
      if (status === 'OK') {
        resolve(results[0].geometry.location);
      } else {
        console.error('Geocode failed for the following reason:', status);
        reject(status);
      }
    });
  });
}

// マップの初期化
export async function initializeMaps(totalMaps: number) {
  if (typeof window === 'undefined' || !window.google) return;
  
  const geocoder = new window.google.maps.Geocoder();
  const boundsArray = [];

  // 各マップを初期化
  for (let i = 1; i <= totalMaps; i++) {
    const mapElement = document.getElementById(`map${i}`);
    if (!mapElement) {
      console.error(`Map element with id map${i} not found.`);
      continue;
    }

    const mapOptions = {
      zoom: 10,
      center: { lat: 35.6811673, lng: 139.7670516 }, // 東京をデフォルト中心に
      mapTypeId: 'roadmap'
    };

    const map = new window.google.maps.Map(mapElement, mapOptions);
    const bounds = new window.google.maps.LatLngBounds();
    boundsArray.push(bounds);

    // このマップの位置情報を取得
    const locations = getLocationsForMap(i);

    // 各位置にマーカーを配置
    for (const location of locations) {
      try {
        const position = await geocodeAddress(geocoder, location.address);
        const iconUrl = `http://maps.google.com/mapfiles/ms/icons/${location.color}-dot.png`;

        new window.google.maps.Marker({
          position,
          map,
          title: location.title,
          icon: iconUrl
        });

        bounds.extend(position);
      } catch (error) {
        console.error(`Error geocoding ${location.address}:`, error);
      }
    }

    // 地図の表示範囲を調整
    map.fitBounds(bounds);
  }
}

// マップごとの位置情報を取得
function getLocationsForMap(mapIndex: number) {
  // データベースまたはAPIから取得する代わりに、現在の目的地に基づいてハードコーディングされた場所を返す
  // localStorage または sessionStorage から目的地情報を取得
  let destination = 'Tokyo';  // デフォルト値
  
  if (typeof window !== 'undefined') {
    // セッションストレージから保存された目的地を取得
    const savedDestination = sessionStorage.getItem('preference1');
    if (savedDestination) {
      destination = savedDestination;
    }
  }
  
  // 目的地に基づいて場所を返す
  const locationsByDestination: Record<string, Array<{address: string, title: string, color: string}>> = {
    'Tokyo': [
      { address: 'Tokyo Station, Tokyo', title: 'Tokyo Station', color: 'red' },
      { address: 'Shibuya Crossing, Tokyo', title: 'Shibuya Crossing', color: 'blue' },
      { address: 'Asakusa Temple, Tokyo', title: 'Asakusa Temple', color: 'green' },
      { address: 'Shinjuku, Tokyo', title: 'Shinjuku', color: 'yellow' }
    ],
    'Kyoto': [
      { address: 'Kyoto Station, Kyoto', title: 'Kyoto Station', color: 'red' },
      { address: 'Kiyomizu Temple, Kyoto', title: 'Kiyomizu Temple', color: 'blue' },
      { address: 'Ginkaku-ji, Kyoto', title: 'Ginkaku-ji', color: 'green' },
      { address: 'Arashiyama, Kyoto', title: 'Arashiyama', color: 'yellow' }
    ],
    'Osaka': [
      { address: 'Osaka Station, Osaka', title: 'Osaka Station', color: 'red' },
      { address: 'Dotonbori, Osaka', title: 'Dotonbori', color: 'blue' },
      { address: 'Universal Studios Japan, Osaka', title: 'Universal Studios Japan', color: 'green' },
      { address: 'Osaka Castle, Osaka', title: 'Osaka Castle', color: 'yellow' }
    ],
    'Hokkaido': [
      { address: 'Sapporo Station, Hokkaido', title: 'Sapporo Station', color: 'red' },
      { address: 'Otaru Canal, Hokkaido', title: 'Otaru Canal', color: 'blue' },
      { address: 'Furano, Hokkaido', title: 'Furano', color: 'green' },
      { address: 'Lake Toya, Hokkaido', title: 'Lake Toya', color: 'yellow' }
    ],
    'Okinawa': [
      { address: 'Naha Airport, Okinawa', title: 'Naha Airport', color: 'red' },
      { address: 'Shuri Castle, Okinawa', title: 'Shuri Castle', color: 'blue' },
      { address: 'Churaumi Aquarium, Okinawa', title: 'Churaumi Aquarium', color: 'green' },
      { address: 'Ishigaki Island, Okinawa', title: 'Ishigaki Island', color: 'yellow' }
    ]
  };
  
  // マップインデックスに基づいて場所をカスタマイズすることも可能
  // 例えば、異なる日には別の場所など
  return locationsByDestination[destination] || locationsByDestination['Tokyo'];
}

// マップ初期化のイベントリスナー設定
export function setupMapListeners() {
  if (typeof window !== 'undefined') {
    document.addEventListener('pagesLoaded', async (event: any) => {
      const { totalMaps } = event.detail;
      console.log('Pages loaded. Initializing maps...', totalMaps);
      
      try {
        await loadGoogleMapsAPI();
        await initializeMaps(totalMaps);
      } catch (error) {
        console.error('Error initializing maps:', error);
      }
    });
  }
} 