#!/usr/bin/env node

/**
 * File Watcher for Architecture Documentation
 * Monitors source files and automatically updates documentation
 */

import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class DocumentationWatcher {
  constructor() {
    this.projectRoot = process.cwd();
    this.watchedDirs = [
      path.join(this.projectRoot, 'src'),
      path.join(this.projectRoot, 'server'),
    ];
    this.debounceDelay = 2000; // 2 seconds
    this.updateTimeout = null;
  }

  startWatching() {
    console.log('🔄 Starting documentation watcher...');
    console.log('📁 Watching directories:');
    this.watchedDirs.forEach(dir => {
      if (fs.existsSync(dir)) {
        console.log(`   - ${dir}`);
        this.watchDirectory(dir);
      }
    });

    console.log('\n✅ Documentation watcher is running!');
    console.log(
      '💡 Make changes to your code and the documentation will auto-update'
    );
    console.log('🛑 Press Ctrl+C to stop watching\n');
  }

  watchDirectory(directory) {
    const watcher = fs.watch(
      directory,
      { recursive: true },
      (eventType, filename) => {
        if (filename && this.shouldWatch(filename)) {
          const filePath = path.join(directory, filename);
          console.log(`📝 File changed: ${filename}`);
          this.scheduleUpdate();
        }
      }
    );

    // Handle watcher errors
    watcher.on('error', error => {
      console.error(`❌ Watcher error for ${directory}:`, error.message);
    });
  }

  shouldWatch(filename) {
    // Only watch relevant file types
    const relevantExtensions = ['.tsx', '.ts', '.js', '.jsx'];
    const extension = path.extname(filename);

    // Ignore certain files
    const ignorePatterns = [
      'node_modules',
      '.git',
      'dist',
      'build',
      '.cache',
      'coverage',
      '.vscode',
      '.husky',
    ];

    return (
      relevantExtensions.includes(extension) &&
      !ignorePatterns.some(pattern => filename.includes(pattern))
    );
  }

  scheduleUpdate() {
    // Debounce updates to avoid excessive regeneration
    if (this.updateTimeout) {
      clearTimeout(this.updateTimeout);
    }

    this.updateTimeout = setTimeout(() => {
      this.updateDocumentation();
    }, this.debounceDelay);
  }

  updateDocumentation() {
    console.log('🔄 Updating documentation...');

    const generator = spawn('node', ['docs-generator.js', 'scan'], {
      stdio: 'inherit',
      cwd: this.projectRoot,
    });

    generator.on('close', code => {
      if (code === 0) {
        console.log('✅ Documentation updated successfully!\n');
      } else {
        console.error('❌ Documentation update failed\n');
      }
    });

    generator.on('error', error => {
      console.error('❌ Error running documentation generator:', error.message);
    });
  }
}

// CLI Interface
if (import.meta.url === `file://${process.argv[1]}`) {
  const watcher = new DocumentationWatcher();

  // Handle process termination
  process.on('SIGINT', () => {
    console.log('\n🛑 Stopping documentation watcher...');
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    console.log('\n🛑 Documentation watcher terminated');
    process.exit(0);
  });

  // Start watching
  watcher.startWatching();
}

export default DocumentationWatcher;
