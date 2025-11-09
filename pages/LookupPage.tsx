
import React, { useState, useCallback } from 'react';
import { GoogleGenAI } from '@google/genai';
import Card from '../components/Card';

// Assume geminiService.ts exists for API calls, but for simplicity, we implement here.
// In a real app, this should be in services/geminiService.ts
const lookupActiveIngredient = async (ingredient: string) => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = 'gemini-2.5-flash';
  const prompt = `Cung cấp thông tin chi tiết về hoạt chất bảo vệ thực vật sau: "${ingredient}". Vui lòng trình bày các mục sau: Tên hoạt chất, Nhóm hóa học, Cơ chế tác động, Phổ tác dụng (các loại sâu/bệnh/cỏ dại chính), và một số lưu ý quan trọng khi sử dụng. Trả lời bằng tiếng Việt.`;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
  });

  return response.text;
};

const LookupPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = useCallback(async () => {
    if (!query.trim()) return;
    setIsLoading(true);
    setError(null);
    setResult('');
    try {
      const data = await lookupActiveIngredient(query);
      setResult(data);
    } catch (err) {
      setError('Không thể tra cứu thông tin. Vui lòng thử lại sau.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [query]);

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Nhập tên hoạt chất..."
          className="flex-grow px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          disabled={isLoading}
        />
        <button
          onClick={handleSearch}
          disabled={isLoading || !query.trim()}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors"
        >
          {isLoading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-search"></i>}
        </button>
      </div>

      {error && <Card className="p-4 bg-red-100 border border-red-300 text-red-700">{error}</Card>}

      {result && (
        <Card>
          <div className="p-4 prose max-w-none">
            <h3 className="text-lg font-semibold mb-2">Kết quả tra cứu cho: "{query}"</h3>
            {result.split('\n').map((line, index) => {
              if (line.startsWith('*') || /^\d+\./.test(line)) {
                  const boldPart = line.match(/^(\*.*?):/);
                  if (boldPart) {
                      return <p key={index}><strong className="font-semibold">{boldPart[1].replace('*','').trim()}:</strong>{line.substring(boldPart[0].length)}</p>
                  }
              }
              return <p key={index}>{line}</p>;
            })}
          </div>
        </Card>
      )}
       {!result && !isLoading && (
        <Card className="p-6 text-center text-gray-500">
          <i className="fas fa-flask text-4xl mb-3"></i>
          <p>Nhập tên một hoạt chất (ví dụ: Glyphosate, Imidacloprid) để bắt đầu tra cứu.</p>
        </Card>
      )}
    </div>
  );
};

export default LookupPage;
