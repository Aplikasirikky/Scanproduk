const html5QrCode = new Html5Qrcode("reader");
let jsonData = []; // Menyimpan data XLSX setelah dibaca

document.getElementById("uploadBtn").addEventListener("click", () => {
    const fileInput = document.getElementById("fileInput");
    const file = fileInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            const data = new Uint8Array(event.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            jsonData = XLSX.utils.sheet_to_json(firstSheet);
            console.log(jsonData); // Menampilkan data ke console
            alert("File berhasil diunggah dan dibaca!");
        };
        reader.readAsArrayBuffer(file);
    } else {
        alert("Silakan pilih file XLSX terlebih dahulu.");
    }
});

html5QrCode.start(
    { facingMode: "environment" }, 
    {
        fps: 10,
        qrbox: { width: 250, height: 250 }
    },
    (decodedText, decodedResult) => {
        // Ketika QR Code terdeteksi
        console.log(`QR Code Detected: ${decodedText}`);
        searchProductInXLS(decodedText);
        html5QrCode.stop();
    },
    (errorMessage) => {
        // Kesalahan saat memindai
        console.warn(`QR code scan error: ${errorMessage}`);
    }
).catch(err => {
    console.error(`Unable to start scanning: ${err}`);
});

document.getElementById("stop").addEventListener("click", () => {
    html5QrCode.stop();
});

// Fungsi untuk mencari produk berdasarkan kode yang dipindai
function searchProductInXLS(productCode) {
    const product = jsonData.find(item => item['Kode Produk'] === productCode); // Ganti 'Kode Produk' dengan nama kolom yang sesuai
    if (product) {
        document.getElementById("output").textContent = JSON.stringify(product, null, 2);
    } else {
        document.getElementById("output").textContent = `Produk dengan kode ${productCode} tidak ditemukan.`;
    }
}