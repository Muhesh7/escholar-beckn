#!/bin/bash

. scripts/setenv.sh
. scripts/utils.sh

# use this as the default docker-compose yaml definition
COMPOSE_FILE_BASE=docker/docker-compose-test-net.yaml
# docker-compose.yaml file if you are using couchdb
COMPOSE_FILE_COUCH=docker/docker-compose-couch.yaml
# certificate authorities compose file
COMPOSE_FILE_CA=docker/docker-compose-ca.yaml

# stop org3 containers also in addition to provider and benefactors, in case we were running sample to add org3
IMAGE_TAG=$IMAGETAG docker-compose -f $COMPOSE_FILE_BASE -f $COMPOSE_FILE_COUCH down --volumes --remove-orphans
# Don't remove the generated artifacts -- note, the ledgers are always removed

# Bring down the network, deleting the volumes
# remove orderer block and other channel configuration transactions and certs
docker run --rm -v "$(pwd):/data" busybox sh -c 'cd /data && rm -rf system-genesis-block/*.block organizations/peerOrganizations organizations/ordererOrganizations'
docker run --rm -v "$(pwd):/data" busybox sh -c 'cd /data && rm -rf organizations/fabric-ca/provider/msp organizations/fabric-ca/provider/tls-cert.pem organizations/fabric-ca/provider/ca-cert.pem organizations/fabric-ca/provider/IssuerPublicKey organizations/fabric-ca/provider/IssuerRevocationPublicKey organizations/fabric-ca/provider/fabric-ca-server.db'
docker run --rm -v "$(pwd):/data" busybox sh -c 'cd /data && rm -rf organizations/fabric-ca/benefactors/msp organizations/fabric-ca/benefactors/tls-cert.pem organizations/fabric-ca/benefactors/ca-cert.pem organizations/fabric-ca/benefactors/IssuerPublicKey organizations/fabric-ca/benefactors/IssuerRevocationPublicKey organizations/fabric-ca/benefactors/fabric-ca-server.db'
docker run --rm -v "$(pwd):/data" busybox sh -c 'cd /data && rm -rf organizations/fabric-ca/orderer/msp organizations/fabric-ca/orderer/tls-cert.pem organizations/fabric-ca/orderer/ca-cert.pem organizations/fabric-ca/orderer/IssuerPublicKey organizations/fabric-ca/orderer/IssuerRevocationPublicKey organizations/fabric-ca/orderer/fabric-ca-server.db'
docker run --rm -v "$(pwd):/data" busybox sh -c 'cd /data && rm -rf channel-artifacts log.txt *.tar.gz'

