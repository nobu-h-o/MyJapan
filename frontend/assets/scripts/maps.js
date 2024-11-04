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

async function initializeMaps() {
    const MyLatLng1 = new google.maps.LatLng(35.6811673, 139.7670516);
    const Options1 = {
        zoom: 15,
        center: MyLatLng1,
        mapTypeId: 'roadmap'
    };
    const map1 = new google.maps.Map(document.getElementById('map1'), Options1);

    const MyLatLng2 = new google.maps.LatLng(35.6811673, 139.7670516);
    const Options2 = {
        zoom: 15,
        center: MyLatLng2,
        mapTypeId: 'roadmap'
    };
    const map2 = new google.maps.Map(document.getElementById('map2'), Options2);
}

(async function() {
    try {
        await loadGoogleMapsAPI();
        initializeMaps();
    } catch (error) {
        console.error('Error loading Google Maps API:', error);
    }
})();
