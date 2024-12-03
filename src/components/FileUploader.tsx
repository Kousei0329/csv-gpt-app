import { useState } from 'react';

export default function FormPage() {
  const [csvData, setCsvData] = useState<string[][] | null>(null); // CSVの内容を格納するステート
  const [responseMessage, setResponseMessage] = useState<string | null>(null); // バックエンドからのレスポンスメッセージ
  const [isLoading, setIsLoading] = useState<boolean>(false); // リクエストの進行状況を管理するステート

  // ファイル選択時の処理
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];  // ファイルを取得

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const csvText = reader.result as string;  // ファイル内容を取得
        console.log("データ読み込み開始")
        // CSVを行ごとに分けて、カンマで区切って2次元配列に変換
        const rows = csvText.split('\n').map((row) =>
          row.split(',').map((cell) => cell.trim()) // 各セルをトリムして配列にする
        );

        //console.log('Parsed CSV:', rows);  // コンソールにCSVの内容を出力
        setCsvData(rows);  // ステートに格納
        console.log("読み込み完了")
      };

      reader.readAsText(file);  // ファイルをテキストとして読み込む
    } else {
      console.error("No file selected");
    }

  };

  // CSVデータをバックエンドに送信する処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();  // フォームのデフォルトの送信を防止
    console.log("リクエスト待機")
    if (csvData) {
        console.log("リクエスト開始")
      setIsLoading(true);  // リクエストが開始されたので待機中に設定

      try {
        // POSTリクエストを送信
        const response = await fetch('/api/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ data: csvData }),  // CSVデータを送信
        });
        console.log("データを送信")
        const result = await response.json();

        if (response.ok) {
          setResponseMessage(result.message);  // バックエンドのメッセージを表示
        } else {
          setResponseMessage('Failed to upload CSV data');
        }
      } catch (error) {
        setResponseMessage('Error sending data to backend');
      } finally {
        setIsLoading(false);  // リクエスト完了後、待機中を解除
      }
    }
  };

  return (
    <div>
      <input
        type="file"
        accept=".csv"
        onChange={handleFileSelect}
      />
      <button onClick={handleSubmit}
       className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
      >Submit CSV</button>

      {/* 待機中メッセージ */}
      {isLoading && <p>Waiting for response from backend...</p>}

      {/* バックエンドからのメッセージがあれば表示 */}
      {responseMessage && !isLoading && (
        <div>
          <h3>Response:</h3>
          <p>{responseMessage}</p>  {/* レスポンスメッセージを表示 */}
        </div>
      )}

      
    </div>
  );
}
