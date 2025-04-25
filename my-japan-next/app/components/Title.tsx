'use client';

import { useEffect } from 'react';
import Script from 'next/script';

interface TitleProps {
  onNext: () => void;
}

export default function Title({ onNext }: TitleProps) {
  // 桜エフェクトの初期化
  useEffect(() => {
    // Sakuraオブジェクトが存在する場合（スクリプトがロード済みの場合）に初期化
    if (typeof window !== 'undefined' && window.Sakura) {
      const sakura = new window.Sakura('body');
      
      // クリーンアップ関数
      return () => {
        sakura.stop();
      };
    }
  }, []);

  return (
    <section id="Title" className="visible">
      <Script 
        src="https://cdn.jsdelivr.net/gh/jhammann/sakura/dist/sakura.min.js"
        onLoad={() => {
          if (typeof window !== 'undefined' && window.Sakura) {
            new window.Sakura('body');
          }
        }}
      />
      
      <div className="Text titleText">
        <h1>Welcome To Japan</h1>
        <p>Make a Personalized Travel Plan by Answering 6 Questions!</p>
        <button className="next rectangle" onClick={onNext}>Start</button>
      </div>
    </section>
  );
}