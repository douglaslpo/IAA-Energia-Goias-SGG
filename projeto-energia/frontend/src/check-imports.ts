import * as ts from 'typescript';
import * as fs from 'fs';
import * as path from 'path';

const checkImports = (filePath: string) => {
    const program = ts.createProgram([filePath], {});
    const sourceFile = program.getSourceFile(filePath);
    
    if (!sourceFile) return;
    
    ts.forEachChild(sourceFile, node => {
        if (ts.isImportDeclaration(node)) {
            const importPath = node.moduleSpecifier.getText();
            const resolvedPath = path.resolve(path.dirname(filePath), importPath);
            
            if (!fs.existsSync(resolvedPath)) {
                console.error(`Error: Import not found - ${importPath} in ${filePath}`);
            }
        }
    });
}; 