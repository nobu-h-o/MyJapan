import preference2 from './api';

async function loadGoogleMapsAPI() {
    try {
        const response = await fetch('http://localhost:3000/api/google-maps-config');
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
    }
}

// Geocoding APIを使って地名から座標を取得
async function geocodeAddress(geocoder, address) {
    return new Promise((resolve, reject) => {
        geocoder.geocode({ address: address }, (results, status) => {
            if (status === 'OK') {
                resolve(results[0].geometry.location);  // 座標を返す
            } else {
                console.error('Geocode failed for the following reason:', status);
                reject(status);
            }
        });
    });
}

async function initializeMaps() {
    const mapOptions = {
        zoom: 10,
        center: { lat: 35.6811673, lng: 139.7670516 },
        mapTypeId: 'roadmap'
    };
    const map1 = new google.maps.Map(document.getElementById(`map1`), mapOptions);
    const map2 = new google.maps.Map(document.getElementById('map2'), mapOptions);
    const geocoder = new google.maps.Geocoder();
    const bounds1 = new google.maps.LatLngBounds();
    const bounds2 = new google.maps.LatLngBounds();

    // map1用のロケーション設定
    const locations1 = [
        { address: 'Kyoto Station', title: 'Kyoto Station', color: 'red' },
        { address: 'Kiyomizu Temple', title: 'Kiyomizu Temple', color: 'blue' },
        { address: 'Ginkaku-ji', title: 'Ginkaku-ji', color: 'green'},
        { address: 'kawaramachi', title: 'kawaramachi', color: 'yellow'},
    ];

    // map2用のロケーション設定
    const locations2 = [
        { address: 'Arashiyama', title: 'Arashiyama', color: 'red' },
        { address: 'Tenryu-ji Temple', title: 'Tenryu-ji Temple', color: 'blue' },
        { address: 'Kinkaku-ji Temple', title: 'Kinkaku-ji Temple', color: 'green'},
        { address: 'Kitano Tenmangu Shrine', title: 'Kitano Tenmangu Shrine', color: 'yellow'}
    ];

    // map1にマーカーを配置
    for (const location of locations1) {
        try {
            const position = await geocodeAddress(geocoder, location.address);
            const iconUrl = `http://maps.google.com/mapfiles/ms/icons/${location.color}-dot.png`;

            new google.maps.Marker({
                position: position,
                map: map1,
                title: location.title,
                icon: iconUrl
            });

            bounds1.extend(position);
        } catch (error) {
            console.error(`Error geocoding ${location.address}:`, error);
        }
    }

    // map2にマーカーを配置
    for (const location of locations2) {
        try {
            const position = await geocodeAddress(geocoder, location.address);
            const iconUrl = `http://maps.google.com/mapfiles/ms/icons/${location.color}-dot.png`;

            new google.maps.Marker({
                position: position,
                map: map2,
                title: location.title,
                icon: iconUrl
            });

            bounds2.extend(position);
        } catch (error) {
            console.error(`Error geocoding ${location.address}:`, error);
        }
    }

    // すべてのマーカーが表示されるようにマップを調整
    map1.fitBounds(bounds1);
    map2.fitBounds(bounds2);
}

(async function() {
    try {
        await loadGoogleMapsAPI();
        document.addEventListener('pagesLoaded', async () => {
            console.log('Pages loaded. Initializing maps...');
            await initializeMaps();
        });
    } catch (error) {
        console.error('Error loading Google Maps API:', error);
    }
})();
