import fs from "fs";
import path from "path";

const routesPath = "c:\\Users\\Administrator\\Downloads\\shop-bot-advanced-adcampaign-fb-master\\shop-bot-advanced-adcampaign-fb-master\\server\\routes.ts";
const content = fs.readFileSync(routesPath, "utf-8");
const lines = content.split("\n");

console.log("=== SEARCHING ROUTES.TS ===");
const query = "login";
let count = 0;
lines.forEach((line, idx) => {
  if (line.toLowerCase().includes(query.toLowerCase())) {
    count++;
    if (count <= 20) {
      console.log(`Line ${idx + 1}: ${line.trim()}`);
    }
  }
});
console.log(`Total occurrences of '${query}':`, count);

console.log("=== SEARCHING PASSPORT ===");
let pCount = 0;
lines.forEach((line, idx) => {
  if (line.toLowerCase().includes("passport")) {
    pCount++;
    if (pCount <= 20) {
      console.log(`Line ${idx + 1}: ${line.trim()}`);
    }
  }
});
console.log(`Total occurrences of 'passport':`, pCount);

console.log("=== SEARCHING REPLIT_INTEGRATIONS ===");
let rCount = 0;
lines.forEach((line, idx) => {
  if (line.toLowerCase().includes("replit_integrations")) {
    rCount++;
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
