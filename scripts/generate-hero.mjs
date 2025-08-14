import OpenAI from "openai";
import fs from "node:fs";
import path from "node:path";

const prompt = (process.argv[2] && process.argv.slice(2).join(" ")) || `
Scientific, pencil hand-drawing background of peptide secondary structure: one right-handed alpha-helix (3.6 residues/turn implied by hatch spacing) and one antiparallel beta-sheet (arrowheads, hydrogen-bond ladders suggested), clean white or transparent background, graphite cross-hatching, soft paper texture, no text, no labels, composition suitable as a hero background (wide aspect, room for overlay text), accurate proportions (helix pitch/diameter plausible), understated, minimal, high-res technical illustration
`.trim();

async function generateHeroImage() {
  try {
    const client = new OpenAI();
    
    console.log("Generating hero image with prompt:", prompt);
    
    const res = await client.images.generate({
      model: "dall-e-3",
      prompt,
      size: "1792x1024",
      quality: "hd",
      n: 1,
      response_format: "b64_json"
    });
    
    const b64 = res.data[0].b64_json;
    const outDir = path.join(process.cwd(), "public", "hero");
    fs.mkdirSync(outDir, { recursive: true });
    
    const outputPath = path.join(outDir, "peptide-hero.png");
    fs.writeFileSync(outputPath, Buffer.from(b64, "base64"));
    
    console.log("✅ Wrote public/hero/peptide-hero.png");
  } catch (error) {
    console.error("❌ Failed to generate hero image:", error.message);
    process.exit(1);
  }
}

generateHeroImage();
