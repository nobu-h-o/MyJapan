declare module 'page-flip' {
  export interface PageFlipOptions {
    width: number;
    height: number;
    size?: 'fixed' | 'stretch';
    minWidth?: number;
    maxWidth?: number;
    minHeight?: number;
    maxHeight?: number;
    drawShadow?: boolean;
    flippingTime?: number;
    usePortrait?: boolean;
    startZIndex?: number;
    startPage?: number;
    autoSize?: boolean;
    maxShadowOpacity?: number;
    showCover?: boolean;
    mobileScrollSupport?: boolean;
    swipeDistance?: number;
    clickEventForward?: boolean;
    useMouseEvents?: boolean;
    disableFlipByClick?: boolean;
  }

  export interface PageFlipEvent {
    data: number | string;
    object: PageFlip;
  }

  export class PageFlip {
    constructor(element: HTMLElement, options: PageFlipOptions);
    
    on(eventName: 'flip' | 'changeOrientation' | 'changeState' | 'init' | 'update', callback: (event: PageFlipEvent) => void): void;
    
    getPageCount(): number;
    getOrientation(): 'portrait' | 'landscape';
    getBoundsRect(): { left: number; top: number; width: number; height: number };
    getCurrentPageIndex(): number;
    
    turnToPage(pageNum: number): void;
    turnToNextPage(): void;
    turnToPrevPage(): void;
    
    flipNext(corner?: 'top' | 'bottom'): void;
    flipPrev(corner?: 'top' | 'bottom'): void;
    flip(pageNum: number, corner?: 'top' | 'bottom'): void;
    
    loadFromImages(images: string[]): void;
    loadFromHTML(items: NodeListOf<Element> | HTMLElement[]): void;
    updateFromHtml(items: NodeListOf<Element> | HTMLElement[]): void;
    updateFromImages(images: string[]): void;
    
    destroy(): void;
  }
} 