body.application {
  margin: 0;
  padding: 0;
  font-family: 'Poppins', sans-serif;
}

.row {
  margin: 0;
  display: flex;
  flex-wrap: wrap;
}

#app-wrapper {
  height: 100vh;
  width: 100%;
  position: relative;
}

#app-toolbar {
  background: rgba(34, 34, 34, 0.85);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
  color: #fff;
  position: sticky;
  top: 0;
  width: 100%;
  z-index: 10;
}

#app-toolbar .btn-primary {
  background-color: #0066ff;
  border: none;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

#app-toolbar .btn-primary:hover,
#app-toolbar .btn-primary:focus {
  background-color: #004bbd;
}

#app-maparea {
  border-right: 2px solid #ccc;
  position: fixed;
  width: 65%;
  top: 50px;
  bottom: 0;
  z-index: 5;
}

#app-sidebar {
  padding: 15px;
  position: absolute;
  right: 0;
  top: 100px;
  width: 35%;
}

#app-sidebar .chart-wrapper {
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.app-sidebar-chart {
  height: 320px;
}

.tools {
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 80px;
  padding: 15px 20px;
  gap: 20px;
}

.tool input,
.tool select {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid #444;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
  color: #fff;
  border-radius: 5px;
  padding: 8px;
}

.radius input,
.radius select {
  width: 50%;
}

.tool input,
.tool label,
.tool h5 {
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.5);
}

<script>
  document.addEventListener('DOMContentLoaded', function () {
    const appWrapperNode = document.getElementById('app-wrapper');
    const appMapAreaNode = document.getElementById('app-maparea');
    const refreshButton = document.getElementById('refresh');

    const DEFAULTS = {
      lat: 37.7749,
      lng: -122.4194,
      zoom: 13
    };

    if (appMapAreaNode) {
      let map = L.map(appMapAreaNode).setView([DEFAULTS.lat, DEFAULTS.lng], DEFAULTS.zoom);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(map);

      const marker = L.marker([DEFAULTS.lat, DEFAULTS.lng], { draggable: true }).addTo(map);

      marker.on('dragend', function (e) {
        const position = e.target.getLatLng();
        console.log(`Marker moved to: ${position.lat}, ${position.lng}`);
      });

      if (refreshButton) {
        refreshButton.addEventListener('click', function () {
          map.setView([DEFAULTS.lat, DEFAULTS.lng], DEFAULTS.zoom);
        });
      }
    } else {
      console.error('Map area not found!');
    }
  });
</script>
