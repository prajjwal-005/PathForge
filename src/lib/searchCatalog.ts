import { pipeline } from "@xenova/transformers";

interface CourseWithEmbedding {
  course: string;
  skills: string;
  level: string;
  duration: string;
  rating: string;
  certificate_type: string;
  prerequisites: string;
  skill_level_required: string;
  embedding: number[];
}

let cachedEmbeddings: CourseWithEmbedding[] | null = null;

export function loadEmbeddings(): CourseWithEmbedding[] {
  if (cachedEmbeddings) return cachedEmbeddings;
  const fs = require("fs");
  const path = require("path");
  const filePath = path.join(process.cwd(), "src", "data", "catalog_embeddings.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  cachedEmbeddings = JSON.parse(raw);
  return cachedEmbeddings!;
}

function cosineSimilarity(a: number[], b: number[]): number {
  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dot / (magA * magB);
}

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

export async function searchCatalog(missingSkills: string[], topN = 15) {
  const query = `Skills needed: ${missingSkills.join(", ")}`;
  const queryEmbedding = await getEmbedding(query);
  const catalog = loadEmbeddings();

  const scored = catalog.map((course) => ({
    ...course,
    score: cosineSimilarity(queryEmbedding, course.embedding),
  }));

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, topN)
    .map(({ embedding, score, ...course }) => course);
}