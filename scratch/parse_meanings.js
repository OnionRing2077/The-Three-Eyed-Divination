const fs = require('fs');

const text = fs.readFileSync('ความหมาย12 ยาม ทั้ง 7 วัน.txt', 'utf8');
const lines = text.split(/\r?\n/);

const daysOfWeek = ['วันอาทิตย์', 'วันจันทร์', 'วันอังคาร', 'วันพุธ', 'วันพฤหัส', 'วันศุกร์', 'วันเสาร์'];
// Handle variations like วันพฤหัสบดี
const dayMatchRegex = /^วัน(อาทิตย์|จันทร์|อังคาร|พุธ|พฤหัส|พฤหัสบดี|ศุกร์|เสาร์)\s*$/;

let currentDay = -1;
let currentSlot = -1;
let data = {};

for (let i = 0; i < 7; i++) data[i] = {};

for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) continue;

  if (line.startsWith('*ข้อสังเกตุ')) {
    currentSlot = -1;
    continue;
  }

  const dayMatch = line.match(dayMatchRegex);
  if (dayMatch) {
    const dayStr = dayMatch[1];
    if (dayStr === 'อาทิตย์') currentDay = 0;
    else if (dayStr === 'จันทร์') currentDay = 1;
    else if (dayStr === 'อังคาร') currentDay = 2;
    else if (dayStr === 'พุธ') currentDay = 3;
    else if (dayStr === 'พฤหัส' || dayStr === 'พฤหัสบดี') currentDay = 4;
    else if (dayStr === 'ศุกร์') currentDay = 5;
    else if (dayStr === 'เสาร์') currentDay = 6;
    currentSlot = -1;
    continue;
  }

  const slotMatch = line.match(/^ยามที่\s*([๐-๙]+|\d+)\s*\((.*?)\)\s*-\s*(.*)/);
  if (slotMatch && currentDay !== -1) {
    let slotNum = slotMatch[1];
    // Convert Thai numerals to Arabic if needed
    const thaiNums = '๐๑๒๓๔๕๖๗๘๙';
    if (thaiNums.includes(slotNum[0])) {
      slotNum = slotNum.split('').map(c => thaiNums.indexOf(c)).join('');
    }
    currentSlot = parseInt(slotNum, 10) - 1;
    
    if (!data[currentDay][currentSlot]) {
      data[currentDay][currentSlot] = {
        description: [],
        categories: {}
      };
    }
    continue;
  }

  if (currentDay !== -1 && currentSlot !== -1) {
    // Check if it's a category
    const catMatch = line.match(/^(การงาน|การเงิน|การเดินทาง|การค้าขาย|สุขภาพ|ความรัก|คดีความ)\s*:\s*(.*)/);
    if (catMatch) {
      data[currentDay][currentSlot].categories[catMatch[1]] = catMatch[2].trim();
    } else {
      // It's part of the general description
      data[currentDay][currentSlot].description.push(line);
    }
  }
}

// Post-process to stringify descriptions
for (let d = 0; d < 7; d++) {
  for (let s = 0; s < 12; s++) {
    if (data[d] && data[d][s]) {
      data[d][s].description = data[d][s].description.join(' ');
    }
  }
}

fs.writeFileSync('scratch/parsed_meanings.json', JSON.stringify(data, null, 2));
console.log('Parsed data written to scratch/parsed_meanings.json');
