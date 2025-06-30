document.getElementById('uploadBtn').addEventListener('click', uploadCSV);
document.getElementById('scanBtn').addEventListener('click', startScan);

function uploadCSV() {
    const fileInput = document.getElementById('csvFile');
    const file = fileInput.files[0];

    if (!file) {
        alert('Silakan pilih file CSV terlebih dahulu.');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(event) {
        const text = event.target.result;
        const data = parseCSV(text);
        localStorage.setItem('barcodeData', JSON.stringify(data));
        alert('File CSV berhasil diunggah dan disimpan.');
    };
    reader.readAsText(file);
}

function parseCSV(text) {
    const rows = text.split('\n');
    const data = rows.map(row => row.split(',').map(item => item.trim()));
    return data;
}

function startScan() {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');

    // Mengakses kamera
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            video.srcObject = stream;
            video.play();
            requestAnimationFrame(tick);
        })
        .catch(err => {
            console.error('Error accessing camera: ', err);
        });

    function tick() {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, canvas.width, canvas.height);

        if (code) {
            alert(`Barcode terdeteksi: ${code.data}`);
            // Anda dapat menambahkan logika untuk memverifikasi data dengan Local Storage di sini
        }

        requestAnimationFrame(tick);
    }
}