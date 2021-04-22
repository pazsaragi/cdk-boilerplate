# !/bin/sh

echo "Deploying stack ..."

cd ops && cdk deploy

echo "Deploying frontend ..."

cd web && yarn run build