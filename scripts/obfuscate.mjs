// scripts/obfuscate.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import JavaScriptObfuscator from 'javascript-obfuscator';
import { glob } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const obfuscationOptions = {
  compact: true,
  controlFlowFlattening: true,
  controlFlowFlatteningThreshold: 0.5,
  deadCodeInjection: true,
  deadCodeInjectionThreshold: 0.2,
  debugProtection: false,
  disableConsoleOutput: false,
  identifierNamesGenerator: 'hexadecimal',
  numbersToExpressions: true,
  renameGlobals: false,
  selfDefending: true,
  simplify: true,
  sourceMap: false,
  splitStrings: true,
  splitStringsChunkLength: 5,
  stringArray: true,
  stringArrayCallsTransform: true,
  stringArrayCallsTransformThreshold: 0.5,
  stringArrayEncoding: ['base64'],
  stringArrayThreshold: 0.75,
  target: 'node'
};

async function obfuscateFiles() {
  try {
    console.log('🔒 Starting code obfuscation...');
    
    const distDir = path.resolve(__dirname, '../lib');
    console.log('📍 Debug: Resolved dist dir:', distDir);
    
    if (!fs.existsSync(distDir)) {
      console.error('❌ Dist directory not found. Please run build first.');
      process.exit(1);
    }
    
    // Debug: List directory contents
    const distContents = fs.readdirSync(distDir, { withFileTypes: true });
    console.log('📍 Debug: Dist directory contents:');
    distContents.forEach(item => {
      console.log(`  ${item.isDirectory() ? 'DIR' : 'FILE'}: ${item.name}`);
    });
    
    // Try different glob patterns
    const patterns = [
      '**/*.js',
      '**/*.cjs', 
      '**/*.{js,cjs}',
      '**/**.js',
      '**/**.cjs'
    ];
    
    let jsFiles = [];
    
    for (const pattern of patterns) {
      const fullPattern = path.join(distDir, pattern).replace(/\\/g, '/'); // Normalize for Windows
      console.log(`📍 Debug: Trying pattern: ${fullPattern}`);
      
      try {
        const files = await glob(fullPattern, { 
          windowsPathsNoEscape: true,
          posix: false 
        });
        console.log(`📍 Debug: Pattern "${pattern}" found ${files.length} files`);
        if (files.length > 0) {
          jsFiles = files;
          break;
        }
      } catch (err) {
        console.log(`📍 Debug: Pattern "${pattern}" failed:`, err.message);
      }
    }
    
    // Fallback: Manual file search
    if (jsFiles.length === 0) {
      console.log('📍 Debug: Trying manual file search...');
      
      function findJSFiles(dir) {
        const files = [];
        const items = fs.readdirSync(dir, { withFileTypes: true });
        
        for (const item of items) {
          const fullPath = path.join(dir, item.name);
          if (item.isDirectory()) {
            files.push(...findJSFiles(fullPath));
          } else if (item.name.endsWith('.js') || item.name.endsWith('.cjs')) {
            files.push(fullPath);
          }
        }
        return files;
      }
      
      jsFiles = findJSFiles(distDir);
    }

    console.log(`📁 Found ${jsFiles.length} JavaScript files to obfuscate`);
    
    if (jsFiles.length === 0) {
      console.log('⚠️ No JavaScript files found to obfuscate');
      console.log('📍 Debug: Expected files like index.js, index.cjs, etc.');
      return;
    }

    // Show found files
    jsFiles.forEach(file => {
      console.log(`  📄 ${path.relative(distDir, file)}`);
    });

    for (const filePath of jsFiles) {
      try {
        console.log(`🔧 Processing: ${path.relative(distDir, filePath)}`);
        
        const sourceCode = fs.readFileSync(filePath, 'utf8');
        
        if (!sourceCode.trim()) {
          console.log(`⏭️ Skipping empty file: ${path.relative(distDir, filePath)}`);
          continue;
        }

        console.log(`📝 Obfuscating: ${path.basename(filePath)} (${sourceCode.length} chars)`);

        const obfuscated = JavaScriptObfuscator.obfuscate(sourceCode, {
          ...obfuscationOptions,
          inputFileName: path.basename(filePath)
        });

        const obfuscatedCode = obfuscated.getObfuscatedCode();
        fs.writeFileSync(filePath, obfuscatedCode, 'utf8');
        console.log(`✅ Obfuscated: ${path.relative(distDir, filePath)} (${obfuscatedCode.length} chars)`);
        
      } catch (error) {
        console.error(`❌ Failed to obfuscate ${filePath}:`, error.message);
      }
    }

    console.log('\n🎉 Obfuscation complete!');
    
  } catch (error) {
    console.error('❌ Obfuscation failed:', error.message);
    console.error('❌ Stack trace:', error.stack);
    process.exit(1);
  }
}

obfuscateFiles();