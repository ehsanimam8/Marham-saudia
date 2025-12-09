import '@testing-library/jest-dom';

// Mock Pointer Capture for Radix UI
if (typeof Element !== 'undefined') {
    Element.prototype.hasPointerCapture = () => false;
    Element.prototype.setPointerCapture = () => { };
    Element.prototype.releasePointerCapture = () => { };
}

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
    observe() { }
    unobserve() { }
    disconnect() { }
};

// Mock scrollIntoView
Element.prototype.scrollIntoView = () => { };
HTMLElement.prototype.scrollIntoView = () => { };
