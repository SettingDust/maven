# Maven Repository Directory Structure

This directory will contain your Maven artifacts.
The structure follows the standard Maven repository layout:

```
repository/
├── com/
│   └── example/
│       └── my-library/
│           ├── 1.0.0/
│           │   ├── my-library-1.0.0.jar
│           │   ├── my-library-1.0.0.pom
│           │   └── my-library-1.0.0.jar.sha1
│           └── maven-metadata.xml
└── org/
    └── yourcompany/
        └── another-lib/
            └── 2.0.0/
                ├── another-lib-2.0.0.jar
                └── another-lib-2.0.0.pom
```

## How to publish artifacts here

1. In your Maven project, add this to your `pom.xml`:

```xml
<distributionManagement>
    <repository>
        <id>github-maven</id>
        <url>file://${project.basedir}/../github-maven/repository</url>
    </repository>
</distributionManagement>
```

2. Run:
```bash
mvn deploy
```

The artifacts will be deployed to this directory, and GitHub Actions will automatically regenerate the index page.
