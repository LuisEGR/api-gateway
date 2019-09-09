#!/bin/bash

npm run build
docker build -t codi-api-gateway .

docker tag codi-api-gateway nexus-0.dev.openshift.multivaloresgf.local:18444/codi/codi-api-gateway:dev
docker push nexus-0.dev.openshift.multivaloresgf.local:18444/codi/codi-api-gateway:dev

oc project codi

oc delete all --selector app=codi-codi-api-gateway

oc new-app --name=codi-api-gateway \
--docker-image=nexus-0.dev.openshift.multivaloresgf.local:18444/codi/codi-api-gateway:dev \
-e MONGO_COLLECTION=rutasDev -e MONGO_DB=gateway

oc env dc/codi-api-gateway --from=configmap/conexion-mongo
oc expose svc/codi-api-gateway
# oc env dc/codi-02-registrosubsecuente --from=configmap/banxico
# oc env dc/codi-03-registroappomision --from=configmap/banxico
