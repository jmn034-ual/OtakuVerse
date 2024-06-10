# Etapa 1: Construir la aplicación usando Maven
FROM maven:3.8.4-openjdk-17-slim AS build

# Copia el pom.xml y los archivos de la aplicación
COPY src /usr/src/app/src
COPY pom.xml /usr/src/app

# Define el directorio de trabajo para que cualquier comando subsiguiente se ejecute en este directorio
WORKDIR /usr/src/app

# Compila la aplicación, omite las pruebas unitarias para una construcción más rápida
RUN mvn clean install -DskipTests

# Etapa 2: Crear la imagen que ejecutará la aplicación
FROM openjdk:17-jdk-alpine

# Argumento de puerto para ser consistente y flexible
ARG JAR_FILE=/usr/src/app/target/*.jar

# Copia el JAR file desde la etapa de construcción a esta etapa de ejecución
COPY --from=build ${JAR_FILE} app.jar

# Expone el puerto que la aplicación usará
EXPOSE 8080

# Ejecuta la aplicación Java
ENTRYPOINT ["java","-jar","/app.jar"]