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
    const map1 = new google.maps.Map(document.getElementById('map1'), mapOptions);
    const geocoder = new google.maps.Geocoder();
    const bounds = new google.maps.LatLngBounds();

    // 複数の地名を配列で指定
    const locations = [
        { address: 'Tokyo Station', title: 'Tokyo Station', color: 'red' },
        { address: 'Waseda University', title: 'Waseda University', color: 'blue' },
        { address: '赤レンガ倉庫', title: '赤レンガ倉庫', color: 'green' }
    ];

    for (const location of locations) {
        try {
            const position = await geocodeAddress(geocoder, location.address);
            const iconUrl = `http://maps.google.com/mapfiles/ms/icons/${location.color}-dot.png`;

            // マーカーを配置
            new google.maps.Marker({
                position: position,
                map: map1,
                title: location.title,
                icon: iconUrl
            });

            bounds.extend(position);
        } catch (error) {
            console.error(`Error geocoding ${location.address}:`, error);
        }
    }

    // すべてのピンが収まるように地図をリサイズ
    map1.fitBounds(bounds);
}

(async function() {
    try {
        await loadGoogleMapsAPI();
        initializeMaps();
    } catch (error) {
        console.error('Error loading Google Maps API:', error);
    }
})();
