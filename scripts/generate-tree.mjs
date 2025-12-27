import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');
const repositoryPath = path.join(rootDir, 'repository');
const publicDir = path.join(rootDir, 'public');
const treeDataDir = path.join(publicDir, 'tree-data');

// Ensure tree-data directory exists
if (!fs.existsSync(treeDataDir)) {
  fs.mkdirSync(treeDataDir, { recursive: true });
}

// Scan repository and generate tree structure
function scanRepository() {
  const tree = {
    name: 'repository',
    type: 'dir',
    path: '',
    children: []
  };

  if (!fs.existsSync(repositoryPath)) {
    console.warn('Repository directory not found');
    return tree;
  }

  // Recursively scan directory
  function scanDir(dirPath, relativePath = '', groupId = '', artifactId = '') {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    const result = [];

    for (const entry of entries) {
      if (entry.name === 'README.md' || entry.name.startsWith('.')) continue;

      const fullPath = path.join(dirPath, entry.name);
      const entryRelativePath = relativePath ? `${relativePath}/${entry.name}` : entry.name;

      if (entry.isDirectory()) {
        // Check if this is a version directory (contains .pom files)
        const versionEntries = fs.readdirSync(fullPath, { withFileTypes: true });
        const hasPomFiles = versionEntries.some(e => e.isFile() && e.name.endsWith('.pom'));

        if (hasPomFiles) {
          // This is a version directory - use parent's groupId and artifactId
          const versionName = entry.name;
          const files = versionEntries
            .filter(e => e.isFile())
            .map(e => ({
              name: e.name,
              size: fs.statSync(path.join(fullPath, e.name)).size
            }))
            .sort((a, b) => {
              // Sort files by type priority, then alphabetically
              const mainJarName = `${artifactId}-${versionName}.jar`;
              
              const getPriority = (name) => {
                if (name.endsWith('.pom')) return 1;
                
                // Check if it's the main jar (exact match)
                if (name === mainJarName) return 2;
                
                // Check if it's a jar file
                if (name.endsWith('.jar')) {
                  if (name.includes('-sources.jar')) return 3;
                  if (name.includes('-javadoc.jar')) return 4;
                  // Other jars with classifiers
                  return 5;
                }
                
                if (name.endsWith('.sha1')) return 6;
                if (name.endsWith('.md5')) return 7;
                return 8;
              };
              
              const priorityDiff = getPriority(a.name) - getPriority(b.name);
              if (priorityDiff !== 0) return priorityDiff;
              return a.name.localeCompare(b.name);
            });

          // Save version files to separate JSON
          const jsonPath = path.join(treeDataDir, `${entryRelativePath.replace(/\//g, '_')}.json`);
          fs.writeFileSync(jsonPath, JSON.stringify({ files }, null, 2));

          result.push({
            name: entry.name,
            type: 'version',
            path: entryRelativePath,
            groupId: groupId,
            artifactId: artifactId,
            hasData: true
          });
        } else {
          // Check if this directory contains version directories (is an artifact)
          const hasVersionDirs = versionEntries.some(sub => {
            if (!sub.isDirectory()) return false;
            const subPath = path.join(fullPath, sub.name);
            try {
              const subEntries = fs.readdirSync(subPath);
              return subEntries.some(f => f.endsWith('.pom'));
            } catch {
              return false;
            }
          });

          if (hasVersionDirs) {
            // This is an artifact directory
            const currentArtifactId = entry.name;
            const currentGroupId = groupId || relativePath.replace(/\//g, '.');
            const children = scanDir(fullPath, entryRelativePath, currentGroupId, currentArtifactId);
            
            // Sort versions in reverse order (newest first)
            const sortedChildren = children.sort((a, b) => b.name.localeCompare(a.name));
            
            result.push({
              name: entry.name,
              type: 'artifact',
              path: entryRelativePath,
              groupId: currentGroupId,
              artifactId: currentArtifactId,
              versions: sortedChildren.map(c => c.name),
              children: sortedChildren
            });
          } else {
            // Regular directory (part of groupId) - recurse
            const newGroupId = groupId ? `${groupId}.${entry.name}` : entry.name;
            const children = scanDir(fullPath, entryRelativePath, newGroupId, artifactId);
            if (children.length > 0) {
              result.push({
                name: entry.name,
                type: 'dir',
                path: entryRelativePath,
                children
              });
            }
          }
        }
      }
    }

    return result;
  }

  tree.children = scanDir(repositoryPath);
  return tree;
}

// Generate tree and save to JSON
const tree = scanRepository();
const mainTreePath = path.join(treeDataDir, 'tree.json');
fs.writeFileSync(mainTreePath, JSON.stringify(tree, null, 2));

console.log('✅ Tree data generated successfully!');
console.log(`📁 Main tree: ${mainTreePath}`);
console.log(`📁 Tree data dir: ${treeDataDir}`);
