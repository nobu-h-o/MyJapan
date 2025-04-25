/**
 * turn.js - jQuery依存のないバージョン
 * シンプルなページめくりライブラリ
 */

(function(window) {
  'use strict';

  // Turn関数の定義
  window.Turn = function(element, options) {
    if (!(this instanceof Turn)) {
      return new Turn(element, options);
    }

    this.element = element;
    this.options = Object.assign({
      width: 800,
      height: 600,
      autoCenter: true,
      gradients: true,
      acceleration: true
    }, options);

    this.init();
    return this;
  };

  // 初期化
  Turn.prototype.init = function() {
    this.currentPage = 1;
    
    // ページ要素を取得
    this.pageElements = this.element.querySelectorAll('.page, .hard');
    this._pagesCount = this.pageElements.length;
    
    // 基本的なスタイリング
    this.element.style.width = this.options.width + 'px';
    this.element.style.height = this.options.height + 'px';
    this.element.style.position = 'relative';
    this.element.style.perspective = '1800px';
    
    // 各ページの初期化
    Array.from(this.pageElements).forEach((page, index) => {
      const zIndex = this._pagesCount - index;
      page.style.position = 'absolute';
      page.style.width = (this.options.width / 2) + 'px';
      page.style.height = this.options.height + 'px';
      page.style.transformOrigin = index % 2 === 0 ? 'right center' : 'left center';
      page.style.zIndex = zIndex;
      page.style.transition = 'transform 0.5s ease';
      
      // 最初のページ以外は回転
      if (index > 1) {
        if (index % 2 === 0) {
          page.style.transform = 'rotateY(-180deg)';
          page.style.left = '0';
        } else {
          page.style.transform = 'rotateY(0deg)';
          page.style.left = (this.options.width / 2) + 'px';
        }
      } else {
        if (index % 2 === 0) {
          page.style.transform = 'rotateY(0deg)';
          page.style.left = '0';
        } else {
          page.style.transform = 'rotateY(0deg)';
          page.style.left = (this.options.width / 2) + 'px';
        }
      }
    });
    
    // コールバックがある場合は実行
    if (this.options.when && this.options.when.init) {
      this.options.when.init(this);
    }
    
    // ページめくりの操作ボタンをページの端に追加
    this.addControls();
    
    // 最初のページを表示
    this.showPage(1);
  };
  
  // ページめくりコントロールを追加
  Turn.prototype.addControls = function() {
    const leftControl = document.createElement('div');
    leftControl.style.position = 'absolute';
    leftControl.style.left = '0';
    leftControl.style.top = '0';
    leftControl.style.width = '20%';
    leftControl.style.height = '100%';
    leftControl.style.cursor = 'pointer';
    leftControl.style.zIndex = (this._pagesCount + 1).toString();
    
    const rightControl = document.createElement('div');
    rightControl.style.position = 'absolute';
    rightControl.style.right = '0';
    rightControl.style.top = '0';
    rightControl.style.width = '20%';
    rightControl.style.height = '100%';
    rightControl.style.cursor = 'pointer';
    rightControl.style.zIndex = (this._pagesCount + 1).toString();
    
    // クリックイベント
    leftControl.addEventListener('click', () => {
      if (this.currentPage > 1) {
        this.page(this.currentPage - 2);
      }
    });
    
    rightControl.addEventListener('click', () => {
      if (this.currentPage < this._pagesCount) {
        this.page(this.currentPage + 2);
      }
    });
    
    this.element.appendChild(leftControl);
    this.element.appendChild(rightControl);
  };

  // 指定したページに移動
  Turn.prototype.page = function(pageNumber) {
    if (pageNumber < 1) pageNumber = 1;
    if (pageNumber > this._pagesCount) pageNumber = this._pagesCount;
    
    this.showPage(pageNumber);
    
    // コールバックがある場合は実行
    if (this.options.when && this.options.when.turned) {
      this.options.when.turned(null, pageNumber);
    }
    
    return this;
  };
  
  // ページを表示
  Turn.prototype.showPage = function(pageNumber) {
    this.currentPage = pageNumber;
    
    // すべてのページのスタイルをリセット
    Array.from(this.pageElements).forEach((page, index) => {
      // ページが現在のページより前か後かに基づいてスタイルを適用
      if (index < pageNumber - 1) {
        // 前のページ
        if (index % 2 === 0) {
          page.style.transform = 'rotateY(-180deg)';
          page.style.left = '0';
        } else {
          page.style.transform = 'rotateY(0deg)';
          page.style.left = (this.options.width / 2) + 'px';
        }
      } else {
        // 現在または後のページ
        if (index % 2 === 0) {
          page.style.transform = 'rotateY(0deg)';
          page.style.left = '0';
        } else {
          page.style.transform = 'rotateY(0deg)';
          page.style.left = (this.options.width / 2) + 'px';
        }
      }
    });
  };
  
  // 総ページ数のプロパティ（getter AND setter）
  Object.defineProperty(Turn.prototype, 'pages', {
    get: function() {
      return this._pagesCount;
    },
    set: function(value) {
      console.log('Setting pages to:', value);
      this._pagesCount = value;
    }
  });
  
  // 破棄
  Turn.prototype.destroy = function() {
    // イベントリスナーなどのクリーンアップ
    const leftControl = this.element.lastElementChild;
    const rightControl = this.element.lastElementChild?.previousElementSibling;
    
    if (leftControl) this.element.removeChild(leftControl);
    if (rightControl) this.element.removeChild(rightControl);
    
    this.element.classList.remove('initialized');
  };
  
  // 静的メソッド: Turn.jsインスタンスを破棄
  window.Turn.destroy = function(element) {
    const instance = element._turnInstance;
    if (instance) {
      instance.destroy();
      delete element._turnInstance;
    }
  };
})(window);