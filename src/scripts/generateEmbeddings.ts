import "dotenv/config";
import fs from "fs";
import path from "path";
import Papa from "papaparse";

import { pipeline } from "@xenova/transformers";

let embedder: any = null;

async function getEmbedding(text: string): Promise<number[]> {
  if (!embedder) {
    embedder = await pipeline("feature-extraction", "Xenova/nomic-embed-text-v1");
  }
  const output = await embedder(`search_document: ${text}`, {
    pooling: "mean",
    normalize: true,
  });
  return Array.from(output.data);
}

async function generateEmbeddings() {
  const filePath = path.join(process.cwd(),"src" ,"data", "coursera_enriched.csv");
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data } = Papa.parse<any>(fileContent, {
    header: true,
    skipEmptyLines: true,
  });

  console.log(`Loaded ${data.length} courses`);

  const results = [];
  function cleanSkills(raw: string): string {
  return raw
    .replace(/[{}"]/g, "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .join(", ");
}
  for (let i = 0; i < data.length; i++) {
    const course = data[i];

    const textToEmbed = `
      Course: ${course.course}
      Skills: ${cleanSkills(course.skills)}
      Level: ${course.level}
      Prerequisites: ${course.prerequisites}
    `.trim();

    try {
      const embedding = await getEmbedding(textToEmbed);

      results.push({
        course: course.course,
        skills: course.skills,
        level: course.level,
        duration: course.duration,
        rating: course.rating,
        certificate_type: course.certificate_type,
        prerequisites: course.prerequisites,
        skill_level_required: course.skill_level_required,
        embedding,
      });

      console.log(`✓ ${i + 1}/${data.length}: ${course.course}`);
      await new Promise((r) => setTimeout(r, 200));

    } catch (err) {
      console.error(`✗ Failed on: ${course.course}`, err);
    }
  }

  const outPath = path.join(process.cwd(), "src","data", "catalog_embeddings.json");
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2));
  console.log(`\nSaved ${results.length} embeddings to catalog_embeddings.json`);
}

generateEmbeddings();