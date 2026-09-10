import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  try {
    const { topic } = await req.json();

    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `
    Create a detailed Wikipedia-style encyclopedia article about '${topic}'.
    Return JSON matching EXACTLY this structure:
    {
      "title": "${topic}",
      "subtitle": "A concise overview",
      "quick_facts": [
        {"label": "Key Fact 1", "value": "Detail 1"},
        {"label": "Key Fact 2", "value": "Detail 2"}
      ],
      "sections": [
        {"heading": "Overview", "content": "Comprehensive detailed text..."},
        {"heading": "History & Origin", "content": "Detailed text..."}
      ],
      "related_topics": ["Related Topic 1", "Related Topic 2", "Related Topic 3"]
    }
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const data = JSON.parse(responseText);

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch AI data: " + error.message }, { status: 500 });
  }
}