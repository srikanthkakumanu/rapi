FROM eclipse-temurin:11.0.12_7-jdk-focal
ARG JAR_FILE
RUN echo "DockerFile value: ${JAR_FILE}"
COPY ${JAR_FILE} app.jar
ENTRYPOINT ["java", "-jar", "/app.jar"]