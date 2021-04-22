# !/bin/sh

cd ops && npm i

cd web && yarn && amplify init && amplify import auth && amplify push
