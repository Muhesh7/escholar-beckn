#!/bin/bash

C_RESET='\033[0m'
C_RED='\033[0;31m'
C_GREEN='\033[0;32m'
C_BLUE='\033[0;34m'
C_YELLOW='\033[1;33m'

# println echos string
function println() {
  echo -e "$1"
}

# errorln echos i red color
function errorln() {
  println "${C_RED}${1}${C_RESET}"
}

# successln echos in green color
function successln() {
  println "${C_GREEN}${1}${C_RESET}"
}

# infoln echos in blue color
function infoln() {
  println "${C_BLUE}${1}${C_RESET}"
}

# warnln echos in yellow color
function warnln() {
  println "${C_YELLOW}${1}${C_RESET}"
}

# fatalln echos in red color and exits with fail status
function fatalln() {
  errorln "$1"
  exit 1
}

verifyResult() {
  if [ $1 -ne 0 ]; then
    fatalln "$2"
  fi
}

export -f errorln
export -f successln
export -f infoln
export -f warnln


# Set environment variables for the peer org
setGlobals() {
  NAME=$1
  SUBDOMAIN=$2
  DOMAIN=$3
  PEER_NO=$4
  PORT=$5

  infoln "Using organization ${SUBDOMAIN}.${DOMAIN}"
  export CORE_PEER_LOCALMSPID="${NAME}MSP"
  export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/${SUBDOMAIN}.${DOMAIN}/tlsca/tlsca.${SUBDOMAIN}.${DOMAIN}-cert.pem
  export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/${SUBDOMAIN}.${DOMAIN}/users/Admin@${SUBDOMAIN}.${DOMAIN}/msp
  export CORE_PEER_ADDRESS=localhost:${PORT}

  export ORDERER_CA=${PWD}/organizations/ordererOrganizations/${DOMAIN}/tlsca/tlsca.${DOMAIN}-cert.pem
  export ORDERER_ADMIN_TLS_SIGN_CERT=${PWD}/organizations/ordererOrganizations/${DOMAIN}/orderers/orderer.${DOMAIN}/tls/server.crt
  export ORDERER_ADMIN_TLS_PRIVATE_KEY=${PWD}/organizations/ordererOrganizations/${DOMAIN}/orderers/orderer.${DOMAIN}/tls/server.key

  if [ "$VERBOSE" == "true" ]; then
    env | grep CORE
  fi
}

# Set environment variables for use in the CLI container 
setGlobalsCLI() {
  setGlobals $1

  local USING_ORG=""
  if [ -z "$OVERRIDE_ORG" ]; then
    USING_ORG=$1
  else
    USING_ORG="${OVERRIDE_ORG}"
  fi
  if [ $USING_ORG -eq 1 ]; then
    export CORE_PEER_ADDRESS=peer0.provider.${DOMAIN}:7051
  elif [ $USING_ORG -eq 2 ]; then
    export CORE_PEER_ADDRESS=peer0.benefactors.${DOMAIN}:9051
  else
    errorln "ORG Unknown"
  fi
}
