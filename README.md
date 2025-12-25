# GitHub Maven Repository

Use GitHub Pages as a Maven repository with automated index generation powered by Astro.

## 🚀 Features

- ✅ Free Maven repository hosting
- ✅ GitHub Pages powered, no additional servers required
- ✅ Beautiful index page auto-generated with Astro
- ✅ GitHub Actions automated deployment
- ✅ Standard Maven toolchain support
- ✅ Gradle project auto-publish via CI

## 📚 Quick Start

### Local Testing

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Create example artifacts** (optional for testing)
   ```bash
   # Create a sample artifact structure
   mkdir -p repository/com/example/my-library/1.0.0
   
   # Add a sample POM file
   cat > repository/com/example/my-library/1.0.0/my-library-1.0.0.pom << 'EOF'
   <?xml version="1.0" encoding="UTF-8"?>
   <project>
     <modelVersion>4.0.0</modelVersion>
     <groupId>com.example</groupId>
     <artifactId>my-library</artifactId>
     <version>1.0.0</version>
   </project>
   EOF
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```
   Visit `http://localhost:4321` to see the index page

4. **Build for production**
   ```bash
   npm run build
   ```
   The static site will be generated in `dist/` directory

5. **Preview production build**
   ```bash
   npm run preview
   ```

### GitHub Pages Setup

1. Go to repository Settings → Pages
2. Select Source: "GitHub Actions"
3. Edit `astro.config.mjs` to configure your site:
   ```javascript
   export default defineConfig({
     site: 'https://yourusername.github.io',
     base: '/github-maven',
     // ... other config
   });
   ```

## 📦 Project Structure

```
github-maven/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions deployment config
├── repository/                 # Maven repository directory (stores artifacts)
├── src/
│   ├── layouts/
│   │   └── Layout.astro       # Page layout
│   └── pages/
│       └── index.astro        # Index page (auto-scan and display artifacts)
├── public/
│   └── favicon.svg            # Website icon
├── astro.config.mjs           # Astro configuration
├── package.json               # Project dependencies
└── README.md                  # This file
```

## 🛠️ Getting Started

### 1️⃣ Clone or Fork This Repository

```bash
git clone https://github.com/yourusername/github-maven.git
cd github-maven
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Configure GitHub Pages

1. Go to repository Settings → Pages
2. Select Source: "GitHub Actions"

### 4️⃣ Modify Configuration

Edit `astro.config.mjs` and update:

```javascript
export default defineConfig({
  site: 'https://yourusername.github.io',  // Change to your GitHub Pages URL
  base: '/github-maven',                    // Change to your repository name
  // ... other config
});
```

### 5️⃣ Local Development (Optional)

```bash
npm run dev
```

Visit `http://localhost:4321` to view the site

## 📤 Publishing Artifacts

### Method 1: Auto-publish from Gradle Projects (Recommended)

Automatically publish Gradle project artifacts to this repository via GitHub Actions.

**Complete Guide:** See [Gradle Publishing Guide](docs/PUBLISH_GUIDE.md)

**Quick Start:**

1. Configure Maven Publish plugin in your Gradle project
2. Create Personal Access Token and configure Secret
3. Copy `.github/workflows/publish-from-gradle.yml.example` to your project
4. Push a version tag (e.g., `v1.0.0`) to trigger auto-publish

Detailed instructions: [docs/PUBLISH_GUIDE.md](docs/PUBLISH_GUIDE.md)

### Method 2: Manual Copy

Copy artifacts to the `repository/` directory following Maven's standard directory structure:

```
repository/
└── com/
    └── example/
        └── my-library/
            └── 1.0.0/
                ├── my-library-1.0.0.jar
                ├── my-library-1.0.0.pom
                └── my-library-1.0.0.jar.sha1
```

### Commit and Push

```bash
git add repository/
git commit -m "Publish artifact: my-library-1.0.0"
git push
```

GitHub Actions will automatically:
1. Detect changes in `repository/` directory
2. Scan all artifacts using Astro
3. Generate index page
4. Deploy to GitHub Pages

## 🔧 Using the Repository

Add this repository to your project's `pom.xml` or `settings.xml`:

```xml
<repositories>
    <repository>
        <id>github-maven</id>
        <url>https://yourusername.github.io/github-maven/repository/</url>
    </repository>
</repositories>
```

Then add dependencies normally:

```xml
<dependency>
    <groupId>com.example</groupId>
    <artifactId>my-library</artifactId>
    <version>1.0.0</version>
</dependency>
```

### For Gradle Projects

```kotlin
repositories {
    maven {
        url = uri("https://yourusername.github.io/github-maven/repository/")
    }
}

dependencies {
    implementation("com.example:my-library:1.0.0")
}
```

## 🎨 Customization

### Modify Styles

Edit the `<style>` section in `src/pages/index.astro` to customize the page appearance.

### Modify Layout

Edit `src/layouts/Layout.astro` to modify the base page structure.

## 📝 Workflow

### Auto-publish from Gradle Projects

1. **Push tag** → Push version tag in Gradle project (e.g., `git push origin v1.0.0`)
2. **Trigger publish CI** → Gradle project's GitHub Actions triggers automatically
3. **Build and publish** → Execute `./gradlew publishToMavenLocal`
4. **Copy artifacts** → Copy artifacts from Maven Local to this repo's `repository/` directory
5. **Commit and push** → Automatically commit and push to this repository
6. **Trigger deploy CI** → This repo's GitHub Actions detects changes and triggers
7. **Generate index** → Astro scans `repository/` directory and generates index page
8. **Deploy** → Deploy generated static site to GitHub Pages

### Manual Publish (Local)

1. **Publish artifacts** → Run `mvn deploy` or `./gradlew publishToMavenLocal` then manually copy
2. **Commit to Git** → Commit and push changes in `repository/` directory
3. **Trigger CI** → GitHub Actions detects changes and triggers build
4. **Generate index** → Astro scans `repository/` directory and generates index page
5. **Deploy** → Deploy generated static site to GitHub Pages

## 🔍 Index Page Features

- 📊 Display repository statistics (total artifacts, total versions)
- 📦 List all available artifacts
- 🏷️ Show all versions for each artifact
- 💁 Highlight latest version

## ⚙️ GitHub Actions Configuration

The workflow triggers when:
- Changes in `repository/` directory are pushed to `main` branch
- Manual trigger (workflow_dispatch)

Workflow steps:
1. Checkout code
2. Setup Node.js environment
3. Install dependencies
4. Build static site with Astro
5. Deploy to GitHub Pages

## 📄 License

MIT License

## 🤝 Contributing

Issues and Pull Requests are welcome!

## 💡 Tips

- Ensure `repository/` directory follows standard Maven repository structure
- Index page auto-updates after publishing new artifacts
- Index page automatically scans and displays all published artifacts
- Recommend tagging important versions with Git Tags
- For Gradle projects, use automated publish workflow (see [Publishing Guide](docs/PUBLISH_GUIDE.md))
- Example workflow file: [.github/workflows/publish-from-gradle.yml.example](.github/workflows/publish-from-gradle.yml.example)

## 🔗 Related Links

- [📖 Local Testing Guide](docs/TESTING.md)
- [📖 Gradle Publishing Guide](docs/PUBLISH_GUIDE.md)
- [⚙️ GitHub Actions Example](.github/workflows/publish-from-gradle.yml.example)
- [Astro Documentation](https://docs.astro.build)
- [GitHub Pages Documentation](https://docs.github.com/pages)
- [Maven Repository Layout](https://maven.apache.org/repository/layout.html)
- [Gradle Maven Publish Plugin](https://docs.gradle.org/current/userguide/publishing_maven.html)
