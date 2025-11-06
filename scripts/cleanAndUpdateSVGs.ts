import fs from "fs";
import path from "path";

const ROOT_SVG_FOLDER = path.resolve("./src/assets");

function getAllSvgFiles(dir: string, collected: string[] = []): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      getAllSvgFiles(fullPath, collected);
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith(".svg")) {
      collected.push(fullPath);
    }
  }
  return collected;
}

/**
 * Làm sạch SVG triệt để:
 * - Xoá toàn bộ <text>, <tspan>, <desc>, <title>
 * - Xoá comment
 * - Xoá font-family, font-weight, style
 * - Thêm xmlns nếu thiếu
 * - Nén whitespace
 */
function cleanSvgContent(content: string): string {
  let cleaned = content;

  // ⚠️ Regex mạnh hơn, xoá toàn bộ text, kể cả viết xuống dòng
  cleaned = cleaned.replace(/<text[\s\S]*?<\/text>/gi, "");
  cleaned = cleaned.replace(/<tspan[\s\S]*?<\/tspan>/gi, "");
  cleaned = cleaned.replace(/<desc[\s\S]*?<\/desc>/gi, "");
  cleaned = cleaned.replace(/<title[\s\S]*?<\/title>/gi, "");

  // Xoá comment
  cleaned = cleaned.replace(/<!--[\s\S]*?-->/g, "");

  // Xoá inline style dư
  cleaned = cleaned.replace(/\sfont-family="[^"]*"/gi, "");
  cleaned = cleaned.replace(/\sfont-weight="[^"]*"/gi, "");
  cleaned = cleaned.replace(/\sstyle="[^"]*"/gi, "");

  // Thêm xmlns nếu thiếu
  if (!cleaned.includes('xmlns="http://www.w3.org/2000/svg"')) {
    cleaned = cleaned.replace(
      /<svg(?![^>]*xmlns=)/i,
      '<svg xmlns="http://www.w3.org/2000/svg" '
    );
  }

  // Xoá khoảng trắng thừa và dòng trống
  cleaned = cleaned
    .replace(/^\s*[\r\n]/gm, "")
    .replace(/\r?\n|\r/g, "\n")
    .replace(/\s{2,}/g, " ")
    .trim();

  return cleaned + "\n";
}

function cleanAndUpdateAllSVGs(): void {
  console.log(`\n🎨 Đang quét SVG trong: ${ROOT_SVG_FOLDER}\n`);

  const svgFiles = getAllSvgFiles(ROOT_SVG_FOLDER);
  console.log(`🔍 Tìm thấy ${svgFiles.length} file SVG.\n`);

  for (const filePath of svgFiles) {
    try {
      const original = fs.readFileSync(filePath, "utf8");
      const cleaned = cleanSvgContent(original);

      if (original.trim() !== cleaned.trim()) {
        fs.writeFileSync(filePath, cleaned, "utf8");
        console.log(`✅ Đã làm sạch: ${path.relative(process.cwd(), filePath)}`);
      } else {
        console.log(`🟢 Bỏ qua (không cần sửa): ${path.relative(process.cwd(), filePath)}`);
      }
    } catch (err) {
      console.error(`❌ Lỗi xử lý ${filePath}:`, (err as Error).message);
    }
  }

  console.log(`\n✨ Hoàn tất! Tất cả SVG đã được làm sạch triệt để.\n`);
}

cleanAndUpdateAllSVGs();
