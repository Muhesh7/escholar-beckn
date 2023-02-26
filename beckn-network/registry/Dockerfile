FROM maven:3-eclipse-temurin-11 AS builder

RUN git clone https://github.com/Open-Succinct-Community/common && \
    cd common && \
    mvn clean install -DskipTests && \
    cd ..
RUN git clone https://github.com/venkatramanm/beckn-sdk-java && \
    cd beckn-sdk-java && \
    mvn clean install -DskipTests && \
    cd ..
RUN git clone https://github.com/venkatramanm/swf-all && \
    cd swf-all && \
    mvn clean install -DskipTests && \
    cd ..
RUN git clone https://github.com/venkatramanm/swf-plugin-beckn && \
    cd swf-plugin-beckn && \
    mvn clean install -DskipTests && \
    cd ..
RUN git clone https://github.com/beckn-on-succinct/beckn-registry && \
    cd beckn-registry && \
    mvn clean install -DskipTests && \
    cd ..
COPY pom.xml /pom.xml
RUN git clone https://github.com/beckn-on-succinct/beckn-registry-app && \
    cd beckn-registry-app && \
    cp -r ./overrideProperties.sample ./overrideProperties && \
    cp /pom.xml ./pom.xml && \
    mvn clean -DskipTests package

FROM openjdk:11-jre-slim

COPY --from=builder /beckn-registry-app/target/classes /app/classes
COPY --from=builder /beckn-registry-app/target/dependency /app/dependency
COPY --from=builder /beckn-registry-app/overrideProperties /app/overrideProperties

ENTRYPOINT [ \
   "java", \
    "-ea:com.venky", \
    "-Xmx4g", \
    "-XX:+HeapDumpOnOutOfMemoryError", \
    "-XX:-OmitStackTraceInFastThrow", \
    "-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=4000", \
    "-DPORT=443", \
    "-Dswf.env=development", \
    "-Dderby.locks.waitTimeout=10", \
    "-cp", \
    "/app/overrideProperties/:/app/classes/:/app/dependency/*", \
    "com.venky.swf.JettyServer" \
]
