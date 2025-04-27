'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import Script from 'next/script';
import { PageFlip } from 'page-flip';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import axios from 'axios';

interface ResultsProps {
  preferences: {
    preference1: string; // 目的地
    preference2: string; // 滞在日数
    preference3: string; // 年齢
    preference4: string; // 未知の場所に対する感情
    preference5: string; // 旅行の目的
    preference6: string; // 屋内/屋外
  };
}

interface TravelData {
  destination: string;
  duration: string;
  age: string;
  interests: string[];
  purpose: string;
  outdoorPreference: string;
  response: string;
  budget?: string;
}

export default function Results({ preferences }: ResultsProps) {
  // Recoilの状態管理を削除し、propsを使用
  const [userData, setUserData] = useState<{data: TravelData} | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [hasFetchedData, setHasFetchedData] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const flipbookRef = useRef<HTMLDivElement>(null);
  const pageFlipInstance = useRef<PageFlip | null>(null);

  useEffect(() => {
    console.log('初期データを設定します');
    
    // propsからデータを作成
    const { preference1, preference2, preference3, preference4, preference5, preference6 } = preferences;
    
    // 初期データを設定
    const initialData: TravelData = {
      destination: preference1, 
      duration: preference2,
      age: preference3,
      interests: [preference4],
      purpose: preference5,
      outdoorPreference: preference6,
      response: '',
      budget: "100,000円"
    };
    
    setUserData({ data: initialData });
    
    if (!hasFetchedData) {
      console.log('APIリクエストを開始します');
      fetchTravelPlan(initialData);
    }
    
    return () => {
      console.log('アンマウントに伴い、フリップブックを破棄します');
      if (pageFlipInstance.current) {
        pageFlipInstance.current.destroy();
        pageFlipInstance.current = null;
      }
      setIsInitialized(false);
    };
  }, [preferences]);

  const generateMockResponse = (destination: string) => {
    return `
      Destination: ${destination || 'Tokyo'}
      Description: DAY 1:
                          <br> 8:00 Visit ${destination || 'Tokyo'} Station; Start your day with a delicious breakfast at a local cafe.
                          <br> 10:00 Explore Central Park; Enjoy the beautiful scenery and take photos.
                          <br> 12:00 Lunch at Traditional Restaurant; Try local cuisine and experience the culture.
                          <br> 14:00 Visit Museum of History; Learn about the rich history of the area.
                          <br> 17:00 Shopping at Local Market; Buy souvenirs and interact with locals.
                          <br> 19:00 Dinner at Famous Restaurant; End your day with excellent local food.
      DAY 2:
                          <br> 8:00 Breakfast at Hotel; Start your day with a nutritious meal.
                          <br> 9:30 Visit Ancient Temple; Experience spiritual and historical aspects.
                          <br> 12:00 Lunch at Garden Restaurant; Enjoy food with beautiful garden views.
                          <br> 14:00 Hiking nearby Mountains; Experience outdoor activities suitable for your age.
                          <br> 17:30 Relax at Hot Springs; Rejuvenate after an active day.
                          <br> 19:00 Traditional Dinner; Experience local cuisine and cultural atmosphere.
    `;
  };
  
  const [scripts, setScripts] = useState({
    jspdf: false,
    html2canvas: false
  });

  const handleScriptLoad = (name: keyof typeof scripts) => {
    setScripts(prev => ({
      ...prev,
      [name]: true
    }));
  };

  const fetchTravelPlan = async (data: TravelData) => {
    if (hasFetchedData) {
      console.log('すでにデータを取得済みのため、APIリクエストをスキップします');
      return;
    }
    
    // フェッチ開始前にフラグを設定（重複呼び出し防止）
    setHasFetchedData(true);
    setLoading(true);
    setError(null);
    
    try {
      console.log('旅行プランの取得を開始します:', data);
      
      // プロンプトを構築
      const prompt = 
`Based on the following trip preferences, suggest the most appropriate itinerary in Japan and provide a brief description.
Please ensure the plan covers exactly ${data.duration} days, with specific timeslots from 8:00 to 22:00 each day.

Preferences:
1. Where are you visiting? ${data.destination || ''}
2. How long is your trip? ${data.duration || ''} days
3. How old are you? ${data.age || ''}
4. How do you feel about unknown places and experiences? ${data.interests?.join(', ') || ''}
5. What is the most important purpose of travel? ${data.purpose || ''}
6. Indoors or Outdoors? ${data.outdoorPreference || ''}

Response format:
Destination: <n>
Description: DAY 1:
<br> timeslot1 | <b>Place to visit</b>
<br> -- details (food, history, etc.)
<br><br>
...
DAY ${data.duration}:
<br> timeslot1 | <b>Place to visit</b>
<br> -- details (food, history, etc.)
<br><br>

Please respond in plain text without using any Markdown formatting. Ensure that each day is fully detailed and that the itinerary spans the full ${data.duration} days.`;

      console.log('プロンプトを使用してAPIリクエストを送信中...');
      
      // APIリクエストの設定
      const response = await axios.post('/api/openai', { 
        prompt: prompt,
        max_tokens: 2000
      });
      
      console.log('APIからの応答を受信しました:', response.data);
      
      // レスポンスからテキストを取得
      const responseText = response.data.text || '';
      
      if (!responseText) {
        throw new Error('APIからの応答が空です');
      }
      
      // ユーザーデータを更新
      setUserData(prev => ({
        data: {
          ...prev!.data,
          response: responseText
        }
      }));
      
      console.log('API応答でユーザーデータを更新しました');
      
    } catch (error: any) {
      console.error('旅行プランの取得中にエラーが発生しました:', error);
      
      const errorMessage = error.response?.data?.error || error.message || '不明なエラーが発生しました';
      setError(`旅行プランの生成中にエラーが発生しました: ${errorMessage}`);
      
      // エラー時はモックデータを使用（フォールバック）
      console.log('フォールバックとしてモックデータを使用します');
      setUserData(prev => ({
        data: {
          ...prev!.data,
          response: generateMockResponse(prev!.data.destination)
        }
      }));
    }
    setLoading(false);
  };

  // レスポンスが利用可能かどうかをチェックする関数
  const responseNotAvailable = () => {
    return !userData || !userData.data || !userData.data.response;
  };

  // シンプル表示（フォールバック用）
  const displaySimplePages = (element: HTMLElement) => {
    // 元の内容をクリア
    element.innerHTML = '';
    
    // シンプル表示用のコンテナを作成
    const container = document.createElement('div');
    container.className = 'simple-pages-container';
    container.style.width = '100%';
    container.style.maxWidth = '800px';
    container.style.margin = '0 auto';
    container.style.overflow = 'auto';
    container.style.padding = '20px';
    
    // カバーページを追加
    const coverEl = document.createElement('div');
    coverEl.className = 'simple-page';
    coverEl.innerHTML = `<div class="simple-page-content">
      <h2>${userData?.data?.destination || ''}旅行プラン</h2>
      <p>期間: ${userData?.data?.duration || ''}日</p>
    </div>`;
    container.appendChild(coverEl);
    
    // 旅程がある場合は日程ページを追加
    if (userData?.data?.response) {
      const daysText = userData.data.response.split('DAY');
      for (let i = 1; i < daysText.length; i++) {
        const dayContent = daysText[i];
        if (dayContent) {
          // 旅程部分
          const itineraryEl = document.createElement('div');
          itineraryEl.className = 'simple-page';
          itineraryEl.innerHTML = `<div class="simple-page-content">
            <h3>Day ${i} - 旅程</h3>
            <div class="simple-page-text">${dayContent.replace(/<br>/g, '<br />')}</div>
          </div>`;
          container.appendChild(itineraryEl);
          
          // 地図部分
          const mapEl = document.createElement('div');
          mapEl.className = 'simple-page';
          mapEl.innerHTML = `<div class="simple-page-content">
            <h3>Day ${i} - 地図</h3>
            <p>この場所に${i}日目の旅行先の地図が表示されます。</p>
            <div id="simple-map-day-${i}" class="map-container"></div>
          </div>`;
          container.appendChild(mapEl);
        }
      }
    }
    
    // 裏表紙相当
    const backCoverEl = document.createElement('div');
    backCoverEl.className = 'simple-page';
    backCoverEl.innerHTML = `<div class="simple-page-content">
      <h2>素敵な旅をお楽しみください！</h2>
      <p>このプランがあなたの素晴らしい思い出作りに役立ちますように。</p>
    </div>`;
    container.appendChild(backCoverEl);
    
    element.appendChild(container);
  };

  // PDFとしてダウンロードする関数
  const downloadAsPDF = async () => {
    if (!flipbookRef.current || responseNotAvailable()) return;
    
    try {
      const pdf = new jsPDF('p', 'pt', 'a4');
      const pages = document.querySelectorAll('.page');
      
      for (let i = 0; i < pages.length; i++) {
        const page = pages[i] as HTMLElement;
        const canvas = await html2canvas(page, {
          scale: 2,
          useCORS: true,
          logging: false
        });
        
        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        
        if (i > 0) {
          pdf.addPage();
        }
        
        pdf.addImage(imgData, 'JPEG', 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight());
      }
      
      pdf.save(`${userData?.data?.destination || 'travel'}_plan.pdf`);
    } catch (err) {
      console.error('PDF作成中にエラーが発生しました:', err);
      setError('PDFの作成中にエラーが発生しました');
    }
  };

  // フリップブックを初期化する関数
  const initializeFlipbook = useCallback((element: HTMLElement | null) => {
    if (!element) return;
    
    console.log('フリップブックを初期化中...', element);
    
    try {
      // 既存のPageFlipインスタンスをクリア
      if (pageFlipInstance.current) {
        console.log('前回のPageFlipインスタンスをクリア');
        pageFlipInstance.current.destroy();
        pageFlipInstance.current = null;
      }
      
      // 既存のstf__wrapper要素をすべて削除（重複防止）
      const existingWrappers = element.querySelectorAll('.stf__wrapper');
      if (existingWrappers.length > 0) {
        console.log(`${existingWrappers.length}個の既存ラッパーを削除します`);
        existingWrappers.forEach(wrapper => wrapper.remove());
      }
      
      // 要素内のすべての子要素をクリア
      while (element.firstChild) {
        element.removeChild(element.firstChild);
      }
      
      // レスポンスが利用可能かチェック
      if (!userData?.data?.response) {
        console.error('レスポンスデータがありません');
        return;
      }
      
      // HTMLを生成
      const html = generatePageHTML(userData.data.response);
      
      // HTMLをDOMに追加
      element.innerHTML = html;
      
      // PageFlipの初期化を少し遅らせて、DOMが完全に更新されるのを待つ
      setTimeout(() => {
        try {
          // PageFlipを初期化
          pageFlipInstance.current = new PageFlip(element, {
            width: 400,
            height: 600,
            size: "fixed",
            minWidth: 400,
            maxWidth: 400,
            minHeight: 600,
            maxHeight: 600,
            showCover: true,
            usePortrait: false,
            startPage: 0 // 最初のページから開始
          });
          
          // ページめくりを初期化
          const pages = element.querySelectorAll('.page');
          if (pages.length > 0) {
            pageFlipInstance.current.loadFromHTML(pages);
            console.log('PageFlipの初期化が完了しました、ページ数:', pages.length);
          } else {
            console.error('ページ要素が見つかりません');
            displaySimplePages(element);
          }
        } catch (error) {
          console.error('PageFlipの初期化エラー:', error);
          // エラーの場合はシンプル表示にフォールバック
          displaySimplePages(element);
        }
      }, 500); // DOMが完全に更新されるのを待つための遅延
    } catch (error) {
      console.error('フリップブックの準備中にエラー:', error);
      setError('フリップブックの準備中にエラーが発生しました');
      // エラーの場合はシンプル表示にフォールバック
      displaySimplePages(element);
    }
  }, [userData, displaySimplePages]);

  // フリップブックを表示する関数
  const displayFlipbook = useCallback(() => {
    if (loading) {
      console.log('まだロード中のため、フリップブックを表示しません');
      return;
    }
    
    if (responseNotAvailable()) {
      console.log('応答が利用できないため、フリップブックを表示しません');
      return;
    }
    
    // flipbookRefを使用する
    if (flipbookRef.current) {
      console.log('参照を使用してフリップブックを表示します');
      initializeFlipbook(flipbookRef.current);
    } else {
      // バックアップとしてIDを使用
      const flipbookElement = document.getElementById('flipbook');
      if (flipbookElement) {
        console.log('IDを使用してフリップブックを表示します');
        initializeFlipbook(flipbookElement);
      } else {
        console.error('フリップブック要素が見つかりません');
      }
    }
  }, [loading, responseNotAvailable, initializeFlipbook]);

  // フリップブック用のHTML生成
  const generatePageHTML = (response: string) => {
    try {
      if (!response || response.trim() === '') {
        console.error('応答が空です。HTMLを生成できません。');
        return '';
      }

      console.log('応答からHTMLを生成します:', response.substring(0, 100) + '...');

      // 旅行先と期間を抽出する試み
      let destination = userData?.data?.destination || 'あなたの素晴らしい旅行';
      let duration = '';
      
      const durationMatch = response.match(/(\d+)日間/);
      if (durationMatch) {
        duration = durationMatch[0];
      }
      
      // 応答を「DAY」で分割して各日のコンテンツを取得
      const dayRegex = /DAY\s*(\d+)(?:\s*[:：])?([\s\S]*?)(?=DAY\s*\d+|$)/gi;
      const days: { day: string; content: string }[] = [];
      
      let match;
      while ((match = dayRegex.exec(response)) !== null) {
        const dayNumber = match[1];
        let content = match[2].trim();
        
        // 冒頭の「：」や「:」を削除
        content = content.replace(/^[：:]\s*/, '');
        
        days.push({
          day: `DAY ${dayNumber}`,
          content: content
        });
      }
      
      // HTMLの生成
      let html = '';
      
      // 表紙
      html += `
        <div class="page page-cover">
          <div class="page-content">
            <h2>${destination}<br>${duration}</h2>
            <p>あなたのための旅行プラン</p>
          </div>
        </div>
      `;
      
      // 各日のページ（左：旅程、右：地図）
      days.forEach((day, index) => {
        // 左ページ（旅程）
        html += `
          <div class="page">
            <div class="page-content">
              <h3>${day.day}</h3>
              <div class="day-content">
                ${day.content.replace(/\n/g, '<br>')}
              </div>
              <div class="page-footer">
                ${destination} - ${day.day}
              </div>
            </div>
          </div>
        `;
        
        // 右ページ（地図）
        html += `
          <div class="page">
            <div class="page-content">
              <h3>${day.day}の訪問先マップ</h3>
              <div class="map-placeholder">
                <p>${day.day}の主な訪問先</p>
                <div class="map-container"></div>
              </div>
              <div class="page-footer">
                ${destination} - ${day.day}のマップ
              </div>
            </div>
          </div>
        `;
      });
      
      // 裏表紙
      html += `
        <div class="page page-cover">
          <div class="page-content">
            <h2>素晴らしい旅を！</h2>
            <p>このプランがあなたの素敵な旅の一助となりますように</p>
          </div>
        </div>
      `;
      
      console.log('フリップブック用HTML生成完了');
      return html;
    } catch (error) {
      console.error('HTMLの生成中にエラーが発生しました:', error);
      return '<div class="page"><div class="page-content"><p>コンテンツの読み込みに失敗しました。</p></div></div>';
    }
  };

  // ロード完了時にフリップブックを表示
  useEffect(() => {
    console.log('ロード状態が変更されました:', loading);
    if (!loading && userData && userData.data.response && !isInitialized) {
      // データがロードされ、まだ初期化されていない場合にのみフリップブックを表示
      console.log('ロード完了時にフリップブックを表示します');
      displayFlipbook();
      setIsInitialized(true);
    }
  }, [loading, userData, displayFlipbook, isInitialized]);

  return (
    <section id="Results" className="visible">
      <Script 
        src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"
        onLoad={() => handleScriptLoad('jspdf')}
      />
      <Script 
        src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"
        onLoad={() => handleScriptLoad('html2canvas')}
      />
      
      <div className="results-container">
        {loading && (
          <div id="loading" className="loading-indicator">
            <div className="spinner"></div>
            <p>旅行プランを生成中...</p>
          </div>
        )}
        
        {error && (
          <div className="error-message">
            <p>エラーが発生しました: {error}</p>
            <button onClick={() => fetchTravelPlan(userData!.data)}>再試行する</button>
          </div>
        )}
        
        {responseNotAvailable() ? (
          <div className="no-results">
            <p>まだ旅行プランが作成されていません。</p>
            <p>質問に回答して、あなただけの旅行プランを作成しましょう。</p>
          </div>
        ) : (
          <>
            <div 
              id="flipbook" 
              ref={flipbookRef}
              className={`flipbook-container ${loading ? 'hidden' : ''}`}
            ></div>
            <div className="download-button">
              <button id="download-btn" onClick={downloadAsPDF}>旅行プランをダウンロード</button>
            </div>
          </>
        )}
      </div>

      <style jsx>{`
        .results-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          min-height: 80vh;
          padding: 20px;
        }
        
        .loading-indicator {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          margin: 50px 0;
        }
        
        .spinner {
          border: 5px solid #f3f3f3;
          border-top: 5px solid #f1b1b8;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          animation: spin 1s linear infinite;
          margin-bottom: 20px;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .error-message {
          background-color: #ffeeee;
          color: #cc0000;
          padding: 15px;
          border-radius: 5px;
          margin: 20px 0;
          text-align: center;
        }
        
        .flipbook-container {
          width: 100%;
          max-width: 900px;
          height: 650px;
          min-height: 650px;
          margin: 20px auto;
          box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.2);
          background-color: #f8f8f8;
          border-radius: 8px;
          padding: 0;
          overflow: hidden;
          position: relative;
        }
        
        .download-button {
          margin-top: 20px;
          text-align: center;
        }
        
        .download-button button {
          background-color: #f1b1b8;
          color: white;
          border: none;
          padding: 10px 24px;
          border-radius: 50px;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        
        .download-button button:hover {
          background-color: #e89ca3;
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }
        
        .hidden {
          display: none;
        }
        
        .no-results {
          text-align: center;
          padding: 40px;
          background-color: #f9f9f9;
          border-radius: 8px;
          margin-top: 30px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }
        
        .no-results p {
          margin: 10px 0;
          color: #555;
        }
        
        .no-results p:first-child {
          font-weight: bold;
          font-size: 1.2rem;
          color: #333;
        }
        
        /* フォールバック用のシンプル表示 */
        .simple-pages-container {
          width: 100%;
          height: 100%;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 20px;
          padding: 20px;
        }
        
        .simple-pages-container .page {
          width: 100%;
          max-width: 800px;
          margin: 0 auto;
          min-height: 400px;
          border: 1px solid #ddd;
        }
        
        @media (max-width: 768px) {
          .flipbook-container {
            height: 70vh;
            min-height: 500px;
          }
        }
        
        @media (max-width: 480px) {
          .flipbook-container {
            height: 60vh;
            min-height: 400px;
          }
        }
      `}</style>
      
      <style jsx global>{`
        /* PageFlip用のグローバルスタイル */
        .page {
          background-color: white;
          color: #333;
          padding: 0;
          overflow: hidden;
          box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
          border-radius: 4px;
        }
        
        .page-content {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: center;
          padding: 30px;
          box-sizing: border-box;
          font-family: 'Hiragino Kaku Gothic Pro', 'メイリオ', sans-serif;
          position: relative;
        }
        
        .page-cover {
          background: linear-gradient(135deg, #f0a3a3 0%, #f1b1b8 100%);
          color: white;
          border-radius: 4px;
        }
        
        .page-cover .page-content {
          justify-content: center;
          text-align: center;
        }
        
        .page-cover h2 {
          font-size: 2.2rem;
          text-shadow: 0 2px 4px rgba(0,0,0,0.2);
          margin-bottom: 1.5rem;
          text-align: center;
          letter-spacing: 1px;
        }
        
        .page h3 {
          color: #e67a85;
          text-align: center;
          margin-bottom: 20px;
          border-bottom: 2px solid #f1b1b8;
          padding-bottom: 10px;
          width: 100%;
        }
        
        .day-content {
          font-size: 0.9rem;
          line-height: 1.6;
          width: 100%;
          flex: 1;
          overflow-y: auto;
          padding-right: 10px;
        }
        
        .page-text {
          font-size: 0.9rem;
          line-height: 1.8;
          width: 100%;
          text-align: left;
          overflow-y: auto;
          padding-right: 10px;
          max-height: 85%;
        }
        
        .page-text br, .day-content br {
          margin-bottom: 10px;
        }
        
        .page-footer {
          position: absolute;
          bottom: 10px;
          font-size: 0.8rem;
          color: #777;
          text-align: center;
          width: 100%;
        }
        
        /* 地図プレースホルダーのスタイル */
        .map-placeholder {
          width: 100%;
          height: 70%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          background-color: #f5f5f5;
          border-radius: 8px;
          padding: 20px;
          box-sizing: border-box;
          text-align: center;
        }
        
        .map-placeholder p {
          margin-bottom: 20px;
          color: #666;
        }
        
        .map-container {
          width: 100%;
          height: 80%;
          background-color: #e8e8e8;
          border: 1px solid #ddd;
          border-radius: 5px;
          margin-top: 10px;
        }
        
        /* シンプル表示のスタイル */
        .simple-pages-container {
          display: flex;
          flex-direction: column;
          gap: 30px;
        }
        
        .simple-page {
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          padding: 30px;
        }
        
        .simple-page-content {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        .simple-page-content h2 {
          color: #e67a85;
          margin-bottom: 20px;
        }
        
        .simple-page-content h3 {
          color: #e67a85;
          width: 100%;
          border-bottom: 2px solid #f1b1b8;
          padding-bottom: 10px;
          margin-bottom: 20px;
        }
        
        .simple-page-text {
          width: 100%;
          line-height: 1.8;
        }
        
        /* PageFlipライブラリのスタイル */
        .stf__parent {
          width: 100% !important;
          height: 100% !important;
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden; /* オーバーフローを防止 */
        }
        
        .stf__block {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
        }
        
        .stf__item {
          display: none;
          position: absolute;
          transform-origin: 0 0;
          background-color: white;
          border-radius: 4px;
          overflow: hidden;
        }
        
        .stf__item--visible {
          display: block;
        }
        
        /* カスタムスクロールバー */
        .page-text::-webkit-scrollbar,
        .day-content::-webkit-scrollbar {
          width: 6px;
          background-color: #f5f5f5;
        }
        
        .page-text::-webkit-scrollbar-thumb,
        .day-content::-webkit-scrollbar-thumb {
          background-color: #f1b1b8;
          border-radius: 3px;
        }
        
        .page-text::-webkit-scrollbar-track,
        .day-content::-webkit-scrollbar-track {
          background-color: #f5f5f5;
        }
        
        @media (max-width: 768px) {
          .page-content {
            padding: 20px;
          }
          
          .page-cover h2 {
            font-size: 1.8rem;
          }
          
          .page h3 {
            font-size: 1.2rem;
          }
        }
      `}</style>
    </section>
  );
}