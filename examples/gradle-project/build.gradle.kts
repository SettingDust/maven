plugins {
    java
    `maven-publish`
}

group = "com.example"
version = project.findProperty("version") as String? ?: "0.0.1-SNAPSHOT"

repositories {
    mavenCentral()
}

dependencies {
    testImplementation("org.junit.jupiter:junit-jupiter:5.9.3")
}

java {
    sourceCompatibility = JavaVersion.VERSION_17
    targetCompatibility = JavaVersion.VERSION_17
    
    // 发布源码和文档
    withSourcesJar()
    withJavadocJar()
}

publishing {
    publications {
        create<MavenPublication>("maven") {
            from(components["java"])
            
            pom {
                name.set("Example Library")
                description.set("An example library for demonstration")
                url.set("https://github.com/yourusername/example-library")
                
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
                
                scm {
                    connection.set("scm:git:git://github.com/yourusername/example-library.git")
                    developerConnection.set("scm:git:ssh://github.com/yourusername/example-library.git")
                    url.set("https://github.com/yourusername/example-library")
                }
            }
        }
    }
}

tasks.test {
    useJUnitPlatform()
}
