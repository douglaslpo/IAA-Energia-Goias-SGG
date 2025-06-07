#!/usr/bin/env ts-node

import * as fs from 'fs';
import * as path from 'path';

const COMPONENTS_DIR = path.join(__dirname, '../src/frontend/components');

const validateComponent = (componentPath: string) => {
    const stats = fs.statSync(componentPath);
    
    if (stats.isDirectory()) {
        const files = fs.readdirSync(componentPath);
        const hasIndex = files.includes('index.tsx');
        const hasStyles = files.includes('styles.ts');
        
        if (!hasIndex || !hasStyles) {
            console.error(`❌ Component ${componentPath} missing required files`);
            process.exit(1);
        }
        
        // Verifica imports
        const indexContent = fs.readFileSync(path.join(componentPath, 'index.tsx'), 'utf8');
        if (!indexContent.includes('import { ') || !indexContent.includes(' } from \'./styles\';')) {
            console.error(`❌ Component ${componentPath} has incorrect imports`);
            process.exit(1);
        }

        console.log(`✅ Component ${path.basename(componentPath)} is valid`);
    }
};

const validateAllComponents = (dir: string) => {
    const items = fs.readdirSync(dir);
    
    items.forEach(item => {
        const fullPath = path.join(dir, item);
        if (fs.statSync(fullPath).isDirectory()) {
            validateComponent(fullPath);
            // Recursivamente valida subdiretórios
            validateAllComponents(fullPath);
        }
    });
};

console.log('🔍 Validando estrutura dos componentes...');
validateAllComponents(COMPONENTS_DIR);
console.log('✅ Validação concluída!'); 