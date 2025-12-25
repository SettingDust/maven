# Local Testing Guide

This guide explains how to test the Maven repository locally before deploying to GitHub Pages.

## Prerequisites

- Node.js 18 or higher
- npm or pnpm

## Quick Start

### 1. Install Dependencies

```bash
npm install
# or
pnpm install
```

### 2. Create Sample Artifacts (Optional)

Create a sample Maven artifact structure for testing:

```bash
# Create directory structure
mkdir -p repository/com/example/my-library/1.0.0

# Create a sample POM file
cat > repository/com/example/my-library/1.0.0/my-library-1.0.0.pom << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <groupId>com.example</groupId>
    <artifactId>my-library</artifactId>
    <version>1.0.0</version>
    <packaging>jar</packaging>
    <name>My Library</name>
    <description>Example library for testing</description>
</project>
EOF

# Create a dummy JAR file
echo "dummy content" > repository/com/example/my-library/1.0.0/my-library-1.0.0.jar

# Create another version
mkdir -p repository/com/example/my-library/2.0.0
cat > repository/com/example/my-library/2.0.0/my-library-2.0.0.pom << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0">
    <modelVersion>4.0.0</modelVersion>
    <groupId>com.example</groupId>
    <artifactId>my-library</artifactId>
    <version>2.0.0</version>
</project>
EOF
echo "dummy content v2" > repository/com/example/my-library/2.0.0/my-library-2.0.0.jar
```

### 3. Start Development Server

```bash
npm run dev
```

The development server will start at `http://localhost:4321`

### 4. View the Index Page

Open your browser and navigate to `http://localhost:4321`

You should see:
- Repository statistics (total artifacts and versions)
- List of all available artifacts
- All versions for each artifact
- Latest version highlighted

### 5. Test with Real Gradle Artifacts

If you have a Gradle project, you can publish to Maven Local and copy artifacts:

```bash
# In your Gradle project
./gradlew publishToMavenLocal

# Copy artifacts to this repository
# Replace com/example with your actual groupId
cp -r ~/.m2/repository/com/example/* repository/com/example/
```

Then refresh the development server to see your artifacts.

## Building for Production

### Build the Static Site

```bash
npm run build
```

The static files will be generated in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

This will serve the production build locally at `http://localhost:4321`

## Testing the Repository with Maven/Gradle

### Setup Local HTTP Server

You can test the repository as if it's hosted on GitHub Pages:

```bash
# Using Python
cd dist
python -m http.server 8000

# Using Node.js http-server
npx http-server dist -p 8000
```

### Configure Maven to Use Local Repository

In your test project's `pom.xml`:

```xml
<repositories>
    <repository>
        <id>local-maven</id>
        <url>http://localhost:8000/repository/</url>
    </repository>
</repositories>
```

### Configure Gradle to Use Local Repository

In your test project's `build.gradle.kts`:

```kotlin
repositories {
    maven {
        url = uri("http://localhost:8000/repository/")
    }
}
```

## Troubleshooting

### Artifacts Not Showing

1. Check if `.pom` files exist in version directories
2. Ensure directory structure follows Maven convention: `groupId/artifactId/version/`
3. Check console for scanning errors

### Development Server Errors

1. Clear Astro cache: `rm -rf .astro`
2. Reinstall dependencies: `rm -rf node_modules && npm install`
3. Check Node.js version: `node --version` (should be 18+)

### Build Errors

If you encounter build errors:

```bash
# Clear cache and rebuild
rm -rf .astro dist node_modules
npm install
npm run build
```

## Directory Structure

```
repository/
└── com/
    └── example/
        └── my-library/
            ├── 1.0.0/
            │   ├── my-library-1.0.0.jar
            │   ├── my-library-1.0.0.pom
            │   └── my-library-1.0.0.jar.sha1  (optional)
            ├── 2.0.0/
            │   ├── my-library-2.0.0.jar
            │   └── my-library-2.0.0.pom
            └── maven-metadata.xml  (optional)
```

## Next Steps

Once local testing is successful:

1. Push changes to GitHub
2. GitHub Actions will automatically build and deploy
3. Access your repository at `https://yourusername.github.io/github-maven/`

## Related Documentation

- [Gradle Publishing Guide](PUBLISH_GUIDE.md)
- [Main README](../README.md)
- [Example Gradle Project](../examples/gradle-project/README.md)
