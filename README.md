# RAPI

Simple RESTful micro service to demonstrate:

- Spring Boot
- Spring HATEOAS
- Spring Data JPA
- PostgreSQL
- Docker
- Docker-Compose
- Gradle

etc.

## Jenkins Pipeline

It is defined in *Jenkinsfile*.

## Docker Image

There are four different ways to run this micro-service using Docker.

- Running a Spring Boot application in Docker.
  - Build a docker image by adding *Dockerfile* in the project

- Push the image to DockerHub or any Container Registry.

- Configure Jenkins to be able to run micro-service Docker image.
  - When We are already running Jenkins in a Docker container, Run this micro-service Docker image inside Jenkins Docker container (It's like running docker inside docker).

- Build the micro-service in Jenkins itself by updating Jenkins pipeline.
  - Update Jenkins pipeline to include two extra stages as mentioned below.
  - 1. Build Docker image using Docker
  - 2. Push that docker image to Docker Hub or container registry

## Important Commands

1. Running a Spring Boot application in Docker:

To Build and create a docker image: `./gradlew assemble docker`
To Run created docker image: `./gradlew assemble docker dockerRun`
To Stop running container via Gradle plugin: `./gradlew dockerStop`

2. Push the image to DockerHub:

To Login to DockerHub: `docker login --username <USERNAME> --password <PASSWORD>`
To push the docker image to DockerHub: `./gradlew dockerPush`

4. Build the micro-service in Jenkins itself:



