// pages/api/upload.ts
import { OpenAI } from 'openai';
import { NextApiRequest, NextApiResponse } from 'next';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { data } = req.body;  // 受け取ったCSVデータ
    console.log("データ受け取り")
    if (!data || !Array.isArray(data)) {
      return res.status(400).json({ error: 'Invalid data format' });
    }

    console.log("生成中・・・")
    const dataStr = JSON.stringify(data);

    // データが8192文字以上ならば、8192文字で切り捨て
    const truncatedData = dataStr.length > 8192 ? dataStr.slice(0, 8192) : dataStr;
    const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content:"これから入力されるデータはcsvファイルから抽出したものです。"},
          { role: "system", content:"出力は必ず日本語で、簡潔にしてください"},
          { role: 'user', content: `以下のデータを解析して、欠損地とその補完方法について述べてください。${truncatedData}` },
        ],
      });
    //console.log('Received CSV Data:', data);  // 受け取ったCSVデータをコンソールに出力

    // 必要な処理を行う（データベース保存や解析など）

    // 成功レスポンス
    return res.status(200).json({ message: response.choices[0].message.content });
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
