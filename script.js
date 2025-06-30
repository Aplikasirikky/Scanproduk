const html5QrCode = new Html5Qrcode("reader");
let jsonData = []; // Menyimpan data CSV setelah dibaca

document.getElementById("uploadBtn").addEventListener("click", () => {
    const fileInput = document.getElementById("fileInput");
    const file = fileInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            const csvData = event.target.result;
            const rows = csvData.split("\n");
            jsonData = rows.map(row => {
                const cols = row.split(",");
                return {
                    'Kode Produk': cols[0], // Ganti dengan indeks yang sesuai
                    // Tambahkan kolom lainnya sesuai kebutuhan
                };
            }).filter(item => item['Kode Produk']); // Menghilangkan item kosong
            console.log(jsonData); // Menampilkan data ke console
            alert("File berhasil diunggah dan dibaca!");
        };
        reader.readAsText(file);
    } else {
        alert("Silakan pilih file CSV terlebih dahulu.");
    }
});

html5QrCode.start(
    { facingMode: "environment" }, 
    {
        fps: 10,
        qrbox: { width: 250, height: 250 }
    },
    (decodedText, decodedResult) => {
        console.log(`QR Code Detected: ${decodedText}`);
        searchProductInCSV(decodedText);
        html5QrCode.stop();
    },
    (errorMessage) => {
        console.warn(`QR code scan error: ${errorMessage}`);
    }
).catch(err => {
    console.error(`Unable to start scanning: ${err}`);
});

document.getElementById("stop").addEventListener("click", () => {
    html5QrCode.stop();
});

// Fungsi untuk mencari produk berdasarkan kode yang dipindai
function searchProductInCSV(productCode) {
    const product = jsonData.find(item => item['Kode Produk'] === productCode); // Ganti 'Kode Produk' dengan nama kolom yang sesuai
    if (product) {
        document.getElementById("output").textContent = JSON.stringify(product, null, 2);
    } else {
        document.getElementById("output").textContent = `Produk dengan kode ${productCode} tidak ditemukan.`;
    }
}