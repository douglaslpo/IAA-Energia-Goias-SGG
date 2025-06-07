import * as fs from 'fs';
import * as path from 'path';

const validateComponent = (componentPath: string) => {
    const content = fs.readFileSync(componentPath, 'utf8');
    
    // Verificar imports de estilo
    if (content.includes('styled-components') && !content.includes('import styled from')) {
        console.error(`Error: Missing styled-components import in ${componentPath}`);
    }
    
    // Verificar tipos
    if (!content.includes('interface') && !content.includes('type')) {
        console.warn(`Warning: No TypeScript interfaces/types found in ${componentPath}`);
    }
    
    // Verificar exports
    if (!content.includes('export')) {
        console.error(`Error: No exports found in ${componentPath}`);
    }
}; 