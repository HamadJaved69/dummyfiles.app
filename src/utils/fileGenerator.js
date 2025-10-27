import JSZip from 'jszip';
import { jsPDF } from 'jspdf';
import { Document, Packer, Paragraph, TextRun } from 'docx';

// Generate random text content
const generateRandomText = (targetSizeKB) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 \n';
  const targetBytes = targetSizeKB * 1024;
  let text = '';

  while (text.length < targetBytes) {
    text += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return text.substring(0, targetBytes);
};

// Generate PDF file
export const generatePDF = async (sizeKB) => {
  const doc = new jsPDF();
  const text = generateRandomText(sizeKB / 2); // PDF has overhead
  const lines = text.match(/.{1,80}/g) || [];

  let yPosition = 10;
  lines.forEach((line, index) => {
    if (yPosition > 280) {
      doc.addPage();
      yPosition = 10;
    }
    doc.text(line, 10, yPosition);
    yPosition += 7;
  });

  return doc.output('blob');
};

// Generate DOCX file
export const generateDOCX = async (sizeKB) => {
  const text = generateRandomText(sizeKB);
  const paragraphs = text.split('\n').map(line =>
    new Paragraph({
      children: [new TextRun(line || ' ')],
    })
  );

  const doc = new Document({
    sections: [{
      properties: {},
      children: paragraphs,
    }],
  });

  return await Packer.toBlob(doc);
};

// Generate CSV file
export const generateCSV = async (sizeKB) => {
  let csv = 'ID,Name,Email,Age,City,Country,Salary\n';
  const targetBytes = sizeKB * 1024;

  let id = 1;
  while (csv.length < targetBytes) {
    const row = `${id},User${id},user${id}@example.com,${20 + (id % 50)},City${id % 100},Country${id % 20},${30000 + (id * 100)}\n`;
    csv += row;
    id++;

    // Yield to browser every 1000 rows to keep UI responsive
    if (id % 1000 === 0) {
      await new Promise(resolve => setTimeout(resolve, 0));
    }
  }

  return new Blob([csv.substring(0, targetBytes)], { type: 'text/csv' });
};

// Generate JSON file
export const generateJSON = async (sizeKB) => {
  const records = [];
  const targetBytes = sizeKB * 1024;
  let id = 1;

  // Create a sample record to estimate size
  const sampleRecord = {
    id: 1,
    name: `User 1`,
    email: `user1@example.com`,
    age: 20,
    address: {
      street: `1 Main Street`,
      city: `City 1`,
      country: `Country 1`,
      zipCode: '10001',
    },
    createdAt: new Date().toISOString(),
    active: true,
  };

  // Estimate size per record (with formatting)
  const estimatedRecordSize = JSON.stringify(sampleRecord, null, 2).length + 3; // +3 for comma and newlines
  const estimatedRecordCount = Math.floor(targetBytes / estimatedRecordSize);

  // Generate records based on estimate
  for (let i = 0; i < estimatedRecordCount; i++) {
    const record = {
      id: id,
      name: `User ${id}`,
      email: `user${id}@example.com`,
      age: 20 + (id % 50),
      address: {
        street: `${id} Main Street`,
        city: `City ${id % 100}`,
        country: `Country ${id % 20}`,
        zipCode: String(10000 + id).padStart(5, '0'),
      },
      createdAt: new Date().toISOString(),
      active: id % 2 === 0,
    };
    records.push(record);
    id++;

    // Yield to browser every 1000 records to keep UI responsive
    if (i % 1000 === 0) {
      await new Promise(resolve => setTimeout(resolve, 0));
    }
  }

  return new Blob([JSON.stringify(records, null, 2)], { type: 'application/json' });
};

// Generate TXT file
export const generateTXT = async (sizeKB) => {
  const text = generateRandomText(sizeKB);
  // Small delay to ensure UI updates
  await new Promise(resolve => setTimeout(resolve, 0));
  return new Blob([text], { type: 'text/plain' });
};

// Generate JPG file
export const generateJPG = (sizeKB) => {
  const canvas = document.createElement('canvas');
  const targetBytes = sizeKB * 1024;

  // Estimate dimensions based on target size
  const dimension = Math.sqrt(targetBytes / 3); // Rough estimate for JPG
  canvas.width = Math.max(800, Math.floor(dimension));
  canvas.height = Math.max(600, Math.floor(dimension * 0.75));

  const ctx = canvas.getContext('2d');

  // Create colorful gradient background
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, `hsl(${Math.random() * 360}, 70%, 60%)`);
  gradient.addColorStop(0.5, `hsl(${Math.random() * 360}, 70%, 60%)`);
  gradient.addColorStop(1, `hsl(${Math.random() * 360}, 70%, 60%)`);

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Add random shapes
  for (let i = 0; i < 50; i++) {
    ctx.fillStyle = `hsla(${Math.random() * 360}, 70%, 60%, 0.3)`;
    ctx.beginPath();
    ctx.arc(
      Math.random() * canvas.width,
      Math.random() * canvas.height,
      Math.random() * 100 + 20,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }

  // Add text
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.font = 'bold 48px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Dummy Image', canvas.width / 2, canvas.height / 2);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob);
    }, 'image/jpeg', 0.92);
  });
};

// Main file generator function
export const generateFile = async (type, sizeKB) => {
  switch (type) {
    case 'pdf':
      return await generatePDF(sizeKB);
    case 'docx':
      return await generateDOCX(sizeKB);
    case 'csv':
      return generateCSV(sizeKB);
    case 'json':
      return generateJSON(sizeKB);
    case 'txt':
      return generateTXT(sizeKB);
    case 'jpg':
      return await generateJPG(sizeKB);
    default:
      throw new Error(`Unsupported file type: ${type}`);
  }
};

// Generate multiple files and create ZIP
export const generateZip = async (type, sizeKB, count, onProgress) => {
  const zip = new JSZip();

  for (let i = 1; i <= count; i++) {
    onProgress?.(Math.round((i / count) * 100));
    const blob = await generateFile(type, sizeKB);
    const fileName = count === 1 ? `dummy.${type}` : `dummy_${i}.${type}`;
    zip.file(fileName, blob);
  }

  onProgress?.(100);

  if (count === 1) {
    // Return single file directly
    return await generateFile(type, sizeKB);
  }

  // Return ZIP for multiple files
  return await zip.generateAsync({ type: 'blob' });
};
