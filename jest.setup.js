// jest.setup.js

// Canvas API のモック
const mockContext = {
  fillRect: jest.fn(),
  clearRect: jest.fn(),
  getImageData: jest.fn(() => ({ data: new Array(4).fill(0) })),
  putImageData: jest.fn(),
  createImageData: jest.fn(() => ({ data: new Array(4).fill(0) })),
  setTransform: jest.fn(),
  drawImage: jest.fn(),
  save: jest.fn(),
  fillText: jest.fn(),
  restore: jest.fn(),
  beginPath: jest.fn(),
  moveTo: jest.fn(),
  lineTo: jest.fn(),
  closePath: jest.fn(),
  stroke: jest.fn(),
  translate: jest.fn(),
  scale: jest.fn(),
  rotate: jest.fn(),
  arc: jest.fn(),
  fill: jest.fn(),
  measureText: jest.fn(() => ({ width: 0 })),
  transform: jest.fn(),
  rect: jest.fn(),
  clip: jest.fn(),
  toDataURL: jest.fn(() => 'data:image/png;base64,mock'),
};

// HTMLCanvasElement のモック
Object.defineProperty(window.HTMLCanvasElement.prototype, 'getContext', {
  value: jest.fn(() => mockContext),
});

Object.defineProperty(window.HTMLCanvasElement.prototype, 'toDataURL', {
  value: jest.fn(() => 'data:image/png;base64,mock'),
});

// Google Maps API のモック
global.google = {
  maps: {
    Map: jest.fn(),
    Marker: jest.fn(),
    LatLng: jest.fn(),
    Geocoder: jest.fn(),
    places: {
      Autocomplete: jest.fn(),
    },
  },
};

// ResizeObserver のモック
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// IntersectionObserver のモック
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// console.error のモック（テスト中のエラーログを抑制）
const originalError = console.error;
console.error = (...args) => {
  if (
    typeof args[0] === 'string' &&
    (args[0].includes('Warning: ReactDOM.render is no longer supported') ||
     args[0].includes('Not implemented: HTMLCanvasElement.prototype.getContext'))
  ) {
    return;
  }
  originalError.call(console, ...args);
}; 