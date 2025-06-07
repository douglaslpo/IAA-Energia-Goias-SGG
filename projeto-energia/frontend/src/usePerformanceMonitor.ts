import { useEffect, useRef } from 'react';

export const usePerformanceMonitor = (componentName: string): void => {
    const renderCount = useRef(0);
    const lastRenderTime = useRef(Date.now());

    useEffect(() => {
        renderCount.current++;
        const currentTime = Date.now();
        const timeSinceLastRender = currentTime - lastRenderTime.current;
        
        if (timeSinceLastRender > 1000) {
            console.warn(`[Performance] ${componentName} took ${timeSinceLastRender}ms to render`);
        }

        if (renderCount.current > 10) {
            console.warn(`[Performance] ${componentName} has rendered ${renderCount.current} times`);
        }

        lastRenderTime.current = currentTime;
    });
};

export default usePerformanceMonitor; 