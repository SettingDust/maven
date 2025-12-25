# 📦 Gradle Publishing Guide

This guide explains how to configure your Gradle project to automatically publish artifacts to this Maven repository via GitHub Actions.

## 🎯 Overview

Publishing workflow:
1. Push a version tag to Gradle project (e.g., `v1.0.0`)
2. Trigger Gradle project's GitHub Actions
3. Execute `./gradlew publishToMavenLocal`
4. Copy artifacts from Maven Local (`~/.m2/repository`)
5. Commit to this Maven repository's `repository/` directory
6. Automatically trigger index page regeneration and deployment

## ⚙️ Configuration Steps

### 1️⃣ Configure Maven Publish in Gradle Project

Add to your `build.gradle` or `build.gradle.kts`:

#### Groovy (build.gradle)
```groovy
plugins {
    id 'java'
    id 'maven-publish'
}

group = 'com.example'
version = project.findProperty('version') ?: '0.0.1-SNAPSHOT'

publishing {
    publications {
        maven(MavenPublication) {
            from components.java
            
            // Optional: Customize POM
            pom {
                name = 'My Library'
                description = 'A library description'
                url = 'https://github.com/yourusername/your-project'
                
                licenses {
                    license {
                        name = 'The Apache License, Version 2.0'
                        url = 'http://www.apache.org/licenses/LICENSE-2.0.txt'
                    }
                }
                
                developers {
                    developer {
                        id = 'yourId'
                        name = 'Your Name'
                        email = 'your.email@example.com'
                    }
                }
            }
        }
    }
}
```

#### Kotlin DSL (build.gradle.kts)
```kotlin
plugins {
    java
    `maven-publish`
}

group = "com.example"
version = project.findProperty("version") as String? ?: "0.0.1-SNAPSHOT"

publishing {
    publications {
        create<MavenPublication>("maven") {
            from(components["java"])
            
            pom {
                name.set("My Library")
                description.set("A library description")
                url.set("https://github.com/yourusername/your-project")
                
                licenses {
                    license {
                        name.set("The Apache License, Version 2.0")
                        url.set("http://www.apache.org/licenses/LICENSE-2.0.txt")
                    }
                }
                
                developers {
                    developer {
                        id.set("yourId")
                        name.set("Your Name")
                        email.set("your.email@example.com")
                    }
                }
            }
        }
    }
}
```

### 2️⃣ Create Personal Access Token (PAT)

1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token"
3. Select permissions:
   - ✅ `repo` (Full repository access)
   - ✅ `workflow` (Update GitHub Actions workflows)
4. Generate and copy the token

### 3️⃣ Configure Secret in Gradle Project

1. Go to Gradle project repository's Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Add:
   - **Name:** `MAVEN_REPO_TOKEN`
   - **Value:** The PAT you just copied

### 4️⃣ Create GitHub Actions Workflow

Create `.github/workflows/publish.yml` in your Gradle project:

```yaml
name: Publish to Maven Repository

on:
  push:
    tags:
      - 'v*'
  workflow_dispatch:

jobs:
  publish:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Set up JDK 17
        uses: actions/setup-java@v4
        with:
          java-version: '17'
          distribution: 'temurin'

      - name: Setup Gradle
        uses: gradle/actions/setup-gradle@v3

      - name: Extract version
        id: version
        run: |
          VERSION=${GITHUB_REF#refs/tags/v}
          echo "version=$VERSION" >> $GITHUB_OUTPUT

      - name: Publish to Maven Local
        run: ./gradlew publishToMavenLocal -Pversion=${{ steps.version.outputs.version }}

      - name: Checkout Maven Repo
        uses: actions/checkout@v4
        with:
          repository: yourusername/github-maven  # Change to your Maven repo
          token: ${{ secrets.MAVEN_REPO_TOKEN }}
          path: maven-repo

      - name: Copy artifacts
        run: |
          GROUP_PATH="com/example"  # Change to your groupId
          SOURCE="$HOME/.m2/repository/$GROUP_PATH"
          TARGET="maven-repo/repository/$GROUP_PATH"
          
          mkdir -p "$TARGET"
          cp -r "$SOURCE"/* "$TARGET/"

      - name: Commit and push
        working-directory: maven-repo
        run: |
          git config user.name "GitHub Actions"
          git config user.email "actions@github.com"
          git add repository/
          git commit -m "Publish: ${{ github.repository }}@${{ steps.version.outputs.version }}"
          git push
```

## 🚀 Usage

### Publishing a New Version

1. **Prepare for release**
   ```bash
   # Ensure all changes are committed
   git add .
   git commit -m "Prepare release v1.0.0"
   ```

2. **Create and push tag**
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

3. **Automatic publishing**
   - GitHub Actions triggers automatically
   - Builds and publishes to Maven Local
   - Copies to Maven repository
   - Automatically generates index page

### Manual Trigger

1. Go to Actions page in Gradle project
2. Select "Publish to Maven Repository" workflow
3. Click "Run workflow"

## 📝 Advanced Configuration

### Multi-module Projects

For Gradle projects with multiple modules:

```groovy
// In root build.gradle
subprojects {
    apply plugin: 'maven-publish'
    
    publishing {
        publications {
            maven(MavenPublication) {
                from components.java
            }
        }
    }
}
```

### Publishing Sources and Documentation

```groovy
java {
    withSourcesJar()
    withJavadocJar()
}

publishing {
    publications {
        maven(MavenPublication) {
            from components.java
            // Sources and javadoc will be included automatically
        }
    }
}
```

### Sync All Artifacts with rsync

For multiple groupIds or complex structures:

```yaml
- name: Copy artifacts
  run: |
    rsync -av \
      --exclude='*.repositories' \
      --exclude='_remote.repositories' \
      "$HOME/.m2/repository/" \
      "maven-repo/repository/"
```

### Conditional Publishing (Specific Modules Only)

```yaml
- name: Copy specific artifacts
  run: |
    # Only copy specific artifacts
    for artifact in "my-library" "my-util"; do
      SOURCE="$HOME/.m2/repository/com/example/$artifact"
      if [ -d "$SOURCE" ]; then
        TARGET="maven-repo/repository/com/example/$artifact"
        mkdir -p "$TARGET"
        cp -r "$SOURCE"/* "$TARGET/"
        echo "Copied $artifact"
      fi
    done
```

## 🔍 Troubleshooting

### Issue: Artifacts Not Found

**Cause:** `publishToMavenLocal` may not have executed correctly

**Solution:**
```bash
# Test locally
./gradlew publishToMavenLocal
ls -la ~/.m2/repository/com/example/your-artifact
```

### Issue: Permission Denied

**Cause:** PAT has insufficient permissions or has expired

**Solution:**
1. Regenerate PAT with `repo` permission
2. Update Secret `MAVEN_REPO_TOKEN`

### Issue: Version Conflict

**Cause:** Same version already exists

**Solutions:**
1. Use a new version number
2. Or add force overwrite logic to workflow:
```yaml
- name: Copy artifacts (force overwrite)
  run: |
    cp -rf "$SOURCE"/* "$TARGET/"  # Note: -f forces overwrite
```

## 📊 Best Practices

1. **Version Management**
   - Use Semantic Versioning
   - Stable versions: `v1.0.0` format
   - Development versions: `SNAPSHOT` suffix

2. **Automation**
   - Only publish official versions on tag push
   - Use PR triggers for SNAPSHOT versions

3. **Documentation**
   - Include complete project info in POM
   - Publish sources and JavaDoc

4. **Notifications**
   - Configure GitHub Actions notifications
   - Document changes in Release notes

## 🔗 Related Resources

- [Gradle Maven Publish Plugin](https://docs.gradle.org/current/userguide/publishing_maven.html)
- [GitHub Actions Documentation](https://docs.github.com/actions)
- [Maven Repository Layout](https://maven.apache.org/repository/layout.html)
- [Semantic Versioning](https://semver.org/)
