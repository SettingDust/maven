# Maven Repository Browser

![Maven Repository](public/favicon.svg)

A beautiful, Reposilite-style Maven repository browser powered by GitHub Pages and Astro.

## ✨ Features

- 🎨 **Clean UI** - Reposilite-inspired design with dual-pane layout
- 🌲 **Tree Navigation** - Interactive file browser with breadcrumb navigation
- 📦 **Smart Scanning** - Build-time file size detection and intelligent sorting
- 🎯 **Syntax Highlighting** - Color-coded Gradle/Maven dependency snippets
- 🚀 **Zero Server** - Static site hosted on GitHub Pages
- ⚡ **Auto Deploy** - CI/CD pipeline with GitHub Actions

## 🚀 Quick Start

### Local Development

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm run dev
# Visit http://localhost:4321

# Build for production
pnpm run build
```

### Deploy to GitHub Pages

1. **Enable GitHub Pages**  
   Settings → Pages → Source: "GitHub Actions"

2. **Configure Site URL**  
   Edit `astro.config.mjs`:
   ```javascript
   export default defineConfig({
     site: 'https://yourusername.github.io',
     base: '/repository-name'
   });
   ```

3. **Push Changes**  
   GitHub Actions will automatically build and deploy

## 📦 Publishing Artifacts

### Automated (Recommended)

See [Gradle Publishing Guide](docs/PUBLISH_GUIDE.md) for setting up automated publishing from your Gradle projects.

### Manual

1. Copy artifacts to `repository/` following Maven structure:
   ```
   repository/
   └── com/example/my-lib/1.0.0/
       ├── my-lib-1.0.0.jar
       ├── my-lib-1.0.0.pom
       └── my-lib-1.0.0-sources.jar
   ```

2. Commit and push:
   ```bash
   git add repository/
   git commit -m "chore: publish my-lib 1.0.0"
   git push
   ```

## 🔧 Using the Repository

### Gradle (Kotlin)
```kotlin
repositories {
    maven("https://yourusername.github.io/repo-name/repository")
}

dependencies {
    implementation("com.example:my-lib:1.0.0")
}
```

### Gradle (Groovy)
```groovy
repositories {
    maven "https://yourusername.github.io/repo-name/repository"
}

dependencies {
    implementation 'com.example:my-lib:1.0.0'
}
```

### Maven
```xml
<repositories>
    <repository>
        <id>github-maven</id>
        <url>https://yourusername.github.io/repo-name/repository</url>
    </repository>
</repositories>

<dependencies>
    <dependency>
        <groupId>com.example</groupId>
        <artifactId>my-lib</artifactId>
        <version>1.0.0</version>
    </dependency>
</dependencies>
```

## 📁 Project Structure

```
.
├── .github/workflows/    # CI/CD automation
├── repository/           # Maven artifacts
├── src/
│   ├── layouts/         # Page templates
│   └── pages/           # Index page with file browser
├── public/              # Static assets
└── docs/                # Documentation
```

## 🎨 UI Features

- **Dual-Pane Layout** - File browser + dependency info sidebar
- **Smart File Sorting** - POM → JAR → sources → checksums
- **Build-Time Scanning** - Accurate file sizes and metadata
- **Client-Side Routing** - Instant navigation without page reload
- **Responsive Design** - Works on desktop and mobile

## 📚 Documentation

- [Local Testing Guide](docs/TESTING.md)
- [Gradle Publishing Guide](docs/PUBLISH_GUIDE.md)
- [GitHub Actions Example](.github/workflows/publish-from-gradle.yml.example)

## 🛠️ Tech Stack

- [Astro](https://astro.build) - Static site generator
- [GitHub Pages](https://pages.github.com) - Free hosting
- [GitHub Actions](https://github.com/features/actions) - CI/CD automation

## 📄 License

MIT License

## 🤝 Contributing

Issues and Pull Requests welcome!
