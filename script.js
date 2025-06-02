let certificateTemplate = null;

// Template upload and preview
document.getElementById('templateUpload').addEventListener('change', function (e) {
  const file = e.target.files[0];
  if (file && (file.type === "image/png" || file.type === "image/jpeg")) {
    const reader = new FileReader();
    reader.onload = function (event) {
      const img = new Image();
      img.onload = function () {
        certificateTemplate = img;

        // Show the preview
        const preview = document.getElementById('templatePreview');
        preview.src = img.src;
        document.getElementById('templatePreviewContainer').style.display = 'block';

        // Set up canvas for name positioning
        posCanvas.width = 800;
        posCanvas.height = (img.height * 800) / img.width;
        namePosition = { x: posCanvas.width / 2, y: posCanvas.height / 2 + 30 };
        drawPositionCanvas();

        alert("Template uploaded and previewed successfully!");
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  } else {
    alert("Please upload a valid PNG or JPG image.");
  }
});

// Init EmailJS
(function () {
  emailjs.init("oppLJXldS8e3obDT4");
})();

document.getElementById('generateAgain').addEventListener('click', async () => {
  location.reload();
});

const modal = document.getElementById('modal');
const fullImage = document.getElementById('fullImage');
const closeModal = document.querySelector('.closeModal');

closeModal.onclick = () => modal.style.display = 'none';
window.onclick = (e) => {
  if (e.target === modal) modal.style.display = 'none';
};

let namePosition = { x: 0, y: 0 };
let dragging = false;
let offset = { x: 0, y: 0 };
const allCanvases = [];

const posCanvas = document.getElementById('positionCanvas');
const posCtx = posCanvas.getContext('2d');

function drawPositionCanvas() {
  posCtx.clearRect(0, 0, posCanvas.width, posCanvas.height);
  if (certificateTemplate) {
    posCtx.drawImage(certificateTemplate, 0, 0, posCanvas.width, posCanvas.height);
    posCtx.font = '30px serif';
    posCtx.fillStyle = 'red';
    posCtx.textAlign = 'center';
    posCtx.fillText('Sample Name', namePosition.x, namePosition.y);
  }
}

posCanvas.addEventListener('mousedown', (e) => {
  const rect = posCanvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  if (Math.abs(x - namePosition.x) < 100 && Math.abs(y - namePosition.y) < 30) {
    dragging = true;
    offset.x = x - namePosition.x;
    offset.y = y - namePosition.y;
  }
});

posCanvas.addEventListener('mousemove', (e) => {
  if (dragging) {
    const rect = posCanvas.getBoundingClientRect();
    namePosition.x = e.clientX - rect.left - offset.x;
    namePosition.y = e.clientY - rect.top - offset.y;
    drawPositionCanvas();
  }
});

posCanvas.addEventListener('mouseup', () => dragging = false);
posCanvas.addEventListener('mouseleave', () => dragging = false);

document.getElementById('csvFile').addEventListener('change', function (event) {
  const file = event.target.files[0];
  if (!file) return;

  if (!certificateTemplate) {
    alert("Please upload a certificate template first.");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    const lines = e.target.result.split('\n').filter(line => line.trim() !== '');
    const data = lines.map(line => line.split(',').map(cell => cell.trim().replace('\r', '')));
    const container = document.getElementById('certificates');
    container.innerHTML = '';
    allCanvases.length = 0;

    for (let i = 1; i < data.length; i++) {
      const name = data[i][0];
      const email = data[i][1];

      const canvas = document.createElement('canvas');
      canvas.width = certificateTemplate.width;
      canvas.height = certificateTemplate.height;
      const ctx = canvas.getContext('2d');

      ctx.drawImage(certificateTemplate, 0, 0, canvas.width, canvas.height);
      const scale = canvas.width / posCanvas.width;
      ctx.font = '100px serif';
      ctx.fillStyle = 'black';
      ctx.textAlign = 'center';
      ctx.fillText(name, namePosition.x * scale, namePosition.y * scale);

      allCanvases.push({ canvas, name });

      const wrapper = document.createElement('div');
      wrapper.className = 'certificate-wrapper';

      const thumb = document.createElement('canvas');
      thumb.className = 'thumb';
      thumb.width = 300;
      thumb.height = (canvas.height * 300) / canvas.width;
      const thumbCtx = thumb.getContext('2d');
      thumbCtx.drawImage(canvas, 0, 0, thumb.width, thumb.height);

      const downloadBtn = document.createElement('button');
      downloadBtn.innerText = 'Download';
      downloadBtn.onclick = () => {
        const pdf = new jspdf.jsPDF({
          orientation: 'landscape',
          unit: 'px',
          format: [canvas.width, canvas.height],
        });
        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        pdf.addImage(imgData, 'JPEG', 0, 0, canvas.width, canvas.height);
        pdf.save(`${name}-certificate.pdf`);
      };

      const viewBtn = document.createElement('button');
      viewBtn.innerText = 'View Full';
      viewBtn.onclick = () => {
        fullImage.src = canvas.toDataURL();
        modal.style.display = 'block';
      };

      const sendBtn = document.createElement('button');
      sendBtn.innerText = 'Send Email';
      sendBtn.onclick = () => {
        sendBtn.innerText = 'Sending...';
        sendBtn.disabled = true;

        const scaledCanvas = document.createElement('canvas');
        const scaleFactor = 0.33;
        scaledCanvas.width = canvas.width * scaleFactor;
        scaledCanvas.height = canvas.height * scaleFactor;
        const scaledCtx = scaledCanvas.getContext('2d');
        scaledCtx.drawImage(canvas, 0, 0, scaledCanvas.width, scaledCanvas.height);

        const certDataURL = scaledCanvas.toDataURL('image/jpeg', 0.7);

        emailjs.send("service_7wqm21n", "template_n801tjn", {
          to_email: email,
          to_name: name,
          time: new Date().toLocaleString(),
          message: `Here is your certificate:<br><img src="${certDataURL}"/><br><a href="${certDataURL}" target="_blank">Download Certificate</a>`
        }).then(() => {
          sendBtn.innerText = 'Sent ✔️';
        }).catch(error => {
          console.error("Email failed:", error);
          sendBtn.innerText = 'Error ❌';
          sendBtn.disabled = false;
        });
      };

      wrapper.appendChild(thumb);
      wrapper.appendChild(downloadBtn);
      wrapper.appendChild(viewBtn);
      wrapper.appendChild(sendBtn);
      container.appendChild(wrapper);
    }
  };

  reader.readAsText(file);
});

// ⬇️ Download All Certificates as PDF in ZIP
document.getElementById('downloadAllBtn').addEventListener('click', async () => {
  if (allCanvases.length === 0) {
    alert('No certificates generated yet.');
    return;
  }

  const zip = new JSZip();
  const folder = zip.folder("certificates");

  for (const { canvas, name } of allCanvases) {
    const pdf = new jspdf.jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [canvas.width, canvas.height],
    });
    const imgData = canvas.toDataURL('image/jpeg', 1.0);
    pdf.addImage(imgData, 'JPEG', 0, 0, canvas.width, canvas.height);

    const pdfBlob = pdf.output('blob');
    folder.file(`${name}-certificate.pdf`, pdfBlob);
  }

  const zipBlob = await zip.generateAsync({ type: "blob" });
  saveAs(zipBlob, "certificates.zip");
});
