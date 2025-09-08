#!/usr/bin/env node

/**
 * Auto-Documentation Generator
 * Scans the codebase and updates APPLICATION_ARCHITECTURE_MATRIX.md
 * Run this script automatically on file changes or before commits
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ArchitectureAnalyzer {
  constructor() {
    this.projectRoot = process.cwd();
    this.sourceDir = path.join(this.projectRoot, 'src');
    this.serverDir = path.join(this.projectRoot, 'server');
    this.docFile = path.join(
      this.projectRoot,
      'APPLICATION_ARCHITECTURE_MATRIX.md'
    );

    this.routes = [];
    this.components = [];
    this.apiEndpoints = [];
    this.accessControls = [];
    this.errors = [];

    console.log(`🔍 Initializing analyzer for: ${this.projectRoot}`);
  }

  // Scan source files for routes, components, and API calls
  async scanCodebase() {
    console.log('🔍 Scanning codebase for architecture changes...');

    await this.scanRoutes();
    await this.scanComponents();
    await this.scanAPIEndpoints();
    await this.scanAccessControls();
    await this.generateReport();
  }

  // Extract routes from React Router configuration
  async scanRoutes() {
    const appFile = path.join(this.sourceDir, 'App.tsx');
    if (fs.existsSync(appFile)) {
      const content = fs.readFileSync(appFile, 'utf8');

      // Extract Route components
      const routeMatches = content.match(
        /<Route\s+path="([^"]+)"\s+element={<([^>]+)\s*\/?>}/g
      );
      if (routeMatches) {
        routeMatches.forEach(match => {
          const pathMatch = match.match(/path="([^"]+)"/);
          const elementMatch = match.match(/element={<([^>\s]+)/);

          if (pathMatch && elementMatch) {
            this.routes.push({
              path: pathMatch[1],
              component: elementMatch[1],
              protection: this.determineProtection(elementMatch[1]),
            });
          }
        });
      }
    }
  }

  // Scan for React components and their dependencies
  async scanComponents() {
    const scanDir = dir => {
      if (!fs.existsSync(dir)) return;

      const files = fs.readdirSync(dir);
      files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
          scanDir(filePath);
        } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
          const content = fs.readFileSync(filePath, 'utf8');
          const relativePath = path.relative(this.sourceDir, filePath);

          // Extract component exports
          const exportMatches = content.match(
            /export\s+(default\s+)?(?:function|const)\s+(\w+)/g
          );
          if (exportMatches) {
            exportMatches.forEach(match => {
              const nameMatch = match.match(/(?:function|const)\s+(\w+)/);
              if (nameMatch) {
                this.components.push({
                  name: nameMatch[1],
                  file: relativePath,
                  hasAuth:
                    content.includes('useAuth') || content.includes('token'),
                  hasProtection: content.includes('ProtectedRoute'),
                  apiCalls: this.extractAPICalls(content),
                });
              }
            });
          }
        }
      });
    };

    scanDir(this.sourceDir);
  }

  // Extract API calls from components
  extractAPICalls(content) {
    const apiCalls = [];
    const fetchMatches = content.match(/fetch\s*\(\s*['"`]([^'"`]+)['"`]/g);

    if (fetchMatches) {
      fetchMatches.forEach(match => {
        const urlMatch = match.match(/['"`]([^'"`]+)['"`]/);
        if (urlMatch) {
          apiCalls.push(urlMatch[1]);
        }
      });
    }

    return apiCalls;
  }

  // Scan server files for API endpoints
  async scanAPIEndpoints() {
    const serverFile = path.join(this.serverDir, 'auth-server.js');
    if (fs.existsSync(serverFile)) {
      const content = fs.readFileSync(serverFile, 'utf8');

      // Extract Express routes
      const routeMatches = content.match(
        /app\.(get|post|put|delete|patch)\s*\(\s*['"`]([^'"`]+)['"`]/g
      );
      if (routeMatches) {
        routeMatches.forEach(match => {
          const methodMatch = match.match(/app\.(\w+)/);
          const pathMatch = match.match(/['"`]([^'"`]+)['"`]/);

          if (methodMatch && pathMatch) {
            this.apiEndpoints.push({
              method: methodMatch[1].toUpperCase(),
              path: pathMatch[1],
              file: 'server/auth-server.js',
              implemented: true,
            });
          }
        });
      }
    }
  }

  // Determine route protection level
  determineProtection(componentName) {
    const publicComponents = [
      'LoginPage',
      'RegistrationPage',
      'ForgotPasswordPage',
    ];
    return publicComponents.includes(componentName) ? 'PUBLIC' : 'PROTECTED';
  }

  // Scan for access control implementations
  async scanAccessControls() {
    // Look for role-based access control patterns
    const authContextFile = path.join(
      this.sourceDir,
      'contexts',
      'AuthContext.tsx'
    );
    if (fs.existsSync(authContextFile)) {
      const content = fs.readFileSync(authContextFile, 'utf8');

      // Extract role definitions
      const roleMatches = content.match(/role[s]?\s*[:=]\s*['"`](\w+)['"`]/g);
      if (roleMatches) {
        roleMatches.forEach(match => {
          const roleMatch = match.match(/['"`](\w+)['"`]/);
          if (roleMatch) {
            this.accessControls.push({
              role: roleMatch[1],
              context: 'AuthContext',
            });
          }
        });
      }
    }
  }

  // Generate updated documentation
  async generateReport() {
    console.log('📝 Updating documentation...');

    const timestamp = new Date().toISOString();
    const stats = {
      routes: this.routes.length,
      components: this.components.length,
      apiEndpoints: this.apiEndpoints.length,
      lastUpdate: timestamp,
    };

    // Read existing documentation
    let docContent = '';
    if (fs.existsSync(this.docFile)) {
      docContent = fs.readFileSync(this.docFile, 'utf8');
    }

    // Update the timestamp and stats in the documentation
    docContent = docContent.replace(
      /\*\*Last Updated\*\*: [^\n]+/,
      `**Last Updated**: ${timestamp}`
    );

    // Update route count in metrics section
    docContent = docContent.replace(
      /\*\*Frontend Routes\*\*: \d+\/\d+ implemented \(\d+%\)/,
      `**Frontend Routes**: ${this.routes.length}/10 implemented (${Math.round((this.routes.length / 10) * 100)}%)`
    );

    // Write updated documentation
    fs.writeFileSync(this.docFile, docContent);

    // Generate summary report
    this.generateSummaryReport(stats);
  }

  // Generate a summary report of changes
  generateSummaryReport(stats) {
    const reportContent = `
# Architecture Analysis Report
**Generated**: ${stats.lastUpdate}

## Summary
- **Routes Found**: ${stats.routes}
- **Components Analyzed**: ${stats.components}
- **API Endpoints**: ${stats.apiEndpoints}

## Route Analysis
${this.routes.map(route => `- ${route.path} → ${route.component} (${route.protection})`).join('\n')}

## Component Analysis
${this.components.map(comp => `- ${comp.name} (${comp.file})${comp.hasAuth ? ' [AUTH]' : ''}${comp.hasProtection ? ' [PROTECTED]' : ''}`).join('\n')}

## API Endpoints
${this.apiEndpoints.map(api => `- ${api.method} ${api.path}`).join('\n')}

## Recommendations
${this.generateRecommendations()}
`;

    fs.writeFileSync(
      path.join(this.projectRoot, 'ARCHITECTURE_REPORT.md'),
      reportContent
    );
    console.log('✅ Documentation updated successfully!');
    console.log('📊 Summary report generated: ARCHITECTURE_REPORT.md');
  }

  // Generate recommendations based on analysis
  generateRecommendations() {
    const recommendations = [];

    if (this.routes.length > 0) {
      const protectedRoutes = this.routes.filter(
        r => r.protection === 'PROTECTED'
      );
      if (protectedRoutes.length === 0) {
        recommendations.push(
          '- Consider implementing protected routes for sensitive areas'
        );
      }
    }

    if (this.components.length > 0) {
      const authComponents = this.components.filter(c => c.hasAuth);
      if (authComponents.length / this.components.length < 0.3) {
        recommendations.push(
          '- Consider implementing authentication in more components'
        );
      }
    }

    if (this.apiEndpoints.length < 5) {
      recommendations.push(
        '- API implementation appears minimal - consider expanding backend functionality'
      );
    }

    return recommendations.length > 0
      ? recommendations.join('\n')
      : '- Architecture appears well-structured';
  }
}

// CLI Interface
const args = process.argv.slice(2);
const command = args[0] || 'scan';

// Check if this script is being run directly
const isMainModule =
  process.argv[1] && process.argv[1].endsWith('docs-generator.js');

if (isMainModule) {
  console.log('🚀 Starting Architecture Documentation Generator...');
  const analyzer = new ArchitectureAnalyzer();

  switch (command) {
    case 'scan':
      console.log('📋 Running scan command...');
      analyzer.scanCodebase().catch(console.error);
      break;
    case 'watch':
      console.log('🔄 Starting documentation watcher...');
      try {
        const { default: DocumentationWatcher } = await import(
          './docs-watcher.js'
        );
        const watcher = new DocumentationWatcher();
        watcher.startWatching();
      } catch (error) {
        console.error('❌ Error starting watcher:', error.message);
      }
      break;
    case 'help':
      console.log(`
Usage: node docs-generator.js [command]

Commands:
  scan    Scan codebase and update documentation (default)
  watch   Watch for file changes and auto-update
  help    Show this help message
      `);
      break;
    default:
      console.log('Unknown command. Use "help" for usage information.');
  }
}

export default ArchitectureAnalyzer;
