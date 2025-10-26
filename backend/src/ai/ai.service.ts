
import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class AiService {
  private readonly genAI: GoogleGenerativeAI;

  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not defined');
    }
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }

  async summarize(text: string): Promise<string> {
    const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = `Summarize the following text:

${text}`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  }
}
