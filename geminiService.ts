
import { GoogleGenAI } from "@google/genai";
import { ParsedJielongItem } from "../types";

export const parseJielongLocally = (text: string): ParsedJielongItem[] => {
  const lines = text.split('\n').filter(l => l.trim());
  const results: ParsedJielongItem[] = [];
  const pattern = /^\d+[\.\s、]*([^\s：:x*]+)[\s：:x*]+(.+)$/;

  lines.forEach(line => {
    const match = line.match(pattern);
    if (match) {
      const wechatNickname = match[1].trim();
      const content = match[2].trim();
      const qtyMatch = content.match(/[x*x*×](\d+)/) || content.match(/(\d+)\s*[个份斤箱]/);
      const quantity = qtyMatch ? parseInt(qtyMatch[1]) : 1;
      const productName = content.replace(/[x*x*×]\d+/, '').replace(/\d+\s*[个份斤箱]/, '').trim();

      results.push({
        wechatNickname,
        items: [{ productName, quantity }]
      });
    }
  });
  return results;
};

export const parseJielongText = async (
  text: string, 
  productContext: { name: string, specs: string[] }[], 
  customerNicknames: string[]
): Promise<ParsedJielongItem[]> => {
  const apiKey = (import.meta as any).env?.VITE_API_KEY || (window as any).process?.env?.API_KEY || "";
  
  if (!apiKey || !navigator.onLine) {
    return parseJielongLocally(text);
  }

  const ai = new GoogleGenAI({ apiKey });
  const productInfo = productContext.map(p => 
    `${p.name}${p.specs.length > 0 ? ` (规格: ${p.specs.join(', ')})` : ''}`
  ).join('; ');

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `从接龙文本提取订单:
      ${text}
      参考商品库: ${productInfo}`,
      config: {
        systemInstruction: "你是一个专业的订单提取助手。必须返回 JSON 数组，包含 wechatNickname 和 items (productName, specName, quantity)。",
        responseMimeType: "application/json",
      }
    });

    const jsonStr = response.text || '[]';
    return JSON.parse(jsonStr.trim()) as ParsedJielongItem[];
  } catch (error) {
    console.error("AI解析异常:", error);
    return parseJielongLocally(text);
  }
};
