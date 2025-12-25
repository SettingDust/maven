# Gradle 项目示例

这是一个示例 Gradle 项目，展示如何配置自动发布到 GitHub Maven 仓库。

## 📁 文件说明

- `build.gradle.kts` - Gradle 构建配置（Kotlin DSL）
- `settings.gradle.kts` - 项目设置
- `.github/workflows/publish.yml` - GitHub Actions 自动发布工作流

## 🚀 使用步骤

### 1. 复制示例文件到你的项目

```bash
# 复制 Gradle 配置
cp build.gradle.kts your-project/
cp settings.gradle.kts your-project/

# 复制 GitHub Actions 工作流
mkdir -p your-project/.github/workflows
cp .github/workflows/publish.yml your-project/.github/workflows/
```

### 2. 修改配置

#### 修改 `build.gradle.kts`

```kotlin
group = "com.yourcompany"  // 改为你的 groupId
version = project.findProperty("version") as String? ?: "0.0.1-SNAPSHOT"

// 修改 POM 信息
pom {
    name.set("Your Library Name")
    description.set("Your library description")
    url.set("https://github.com/yourusername/your-project")
    // ... 其他信息
}
```

#### 修改 `.github/workflows/publish.yml`

```yaml
# 修改 Maven 仓库地址
repository: yourusername/github-maven  # 第 57 行

# 修改 groupId 路径
GROUP_ID="com/yourcompany"  # 第 65 行
```

### 3. 配置 Personal Access Token

1. 创建 PAT：GitHub Settings → Developer settings → Personal access tokens
2. 选择权限：`repo` (完整仓库访问)
3. 在项目中添加 Secret：
   - 名称：`MAVEN_REPO_TOKEN`
   - 值：刚才创建的 PAT

### 4. 发布版本

```bash
# 创建并推送标签
git tag v1.0.0
git push origin v1.0.0

# 或者手动触发工作流
# GitHub → Actions → Publish to Maven Repository → Run workflow
```

## 🔧 本地测试

```bash
# 本地发布到 Maven Local
./gradlew publishToMavenLocal -Pversion=1.0.0

# 查看发布的文件
ls -la ~/.m2/repository/com/example/example-library/
```

## 📝 Groovy DSL 版本

如果你使用 Groovy DSL (`build.gradle`)，参考以下配置：

```groovy
plugins {
    id 'java'
    id 'maven-publish'
}

group = 'com.example'
version = project.findProperty('version') ?: '0.0.1-SNAPSHOT'

java {
    sourceCompatibility = JavaVersion.VERSION_17
    targetCompatibility = JavaVersion.VERSION_17
    withSourcesJar()
    withJavadocJar()
}

publishing {
    publications {
        maven(MavenPublication) {
            from components.java
            
            pom {
                name = 'Example Library'
                description = 'An example library'
                url = 'https://github.com/yourusername/example-library'
                
                licenses {
                    license {
                        name = 'The Apache License, Version 2.0'
                        url = 'http://www.apache.org/licenses/LICENSE-2.0.txt'
                    }
                }
            }
        }
    }
}
```

## 💡 最佳实践

1. **版本管理**
   - 使用语义化版本：`v1.0.0`, `v1.0.1`, `v2.0.0`
   - 开发版本使用 `SNAPSHOT` 后缀

2. **自动化发布**
   - 只在推送标签时发布正式版本
   - 使用 `workflow_dispatch` 支持手动触发

3. **文档完整**
   - 在 POM 中包含完整的项目信息
   - 发布源码 jar 和 javadoc jar

4. **验证构件**
   - 发布前本地测试
   - 检查工作流输出日志

## 🔗 相关资源

- [完整发布指南](../../docs/PUBLISH_GUIDE.md)
- [GitHub Actions 工作流示例](../../.github/workflows/publish-from-gradle.yml.example)
- [Gradle Maven Publish 文档](https://docs.gradle.org/current/userguide/publishing_maven.html)
