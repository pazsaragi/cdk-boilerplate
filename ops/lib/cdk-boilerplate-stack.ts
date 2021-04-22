import * as cdk from '@aws-cdk/core';
import * as dynamodb from '@aws-cdk/aws-dynamodb';
import * as cognito from "@aws-cdk/aws-cognito";
import * as apigateway from "@aws-cdk/aws-apigateway";
import * as lambda from "@aws-cdk/aws-lambda";
import * as s3 from "@aws-cdk/aws-s3";
import * as iam from '@aws-cdk/aws-iam';
import * as s3Deploy from '@aws-cdk/aws-s3-deployment';
import * as cloudfront from '@aws-cdk/aws-cloudfront';

export class CdkBoilerplateStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // ========================================================================
    // Amazon DynamoDB Table
    // ========================================================================

    const dbTable = new dynamodb.Table(this, 'RootTable', {
      partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      tableName: 'RootTable', // can lead to issues when destroying since roles are not destroyed
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST
    });

    // ========================================================================
    // Lambda
    // ========================================================================

    const ping = new lambda.Function(this, 'ping', {
      runtime: lambda.Runtime.PYTHON_3_8,
      handler: 'ping.handler',
      code: lambda.Code.fromAsset('../lambda/status'),
      functionName: 'Ping'
    });

    const create = new lambda.Function(this, 'create', {
      runtime: lambda.Runtime.PYTHON_3_8,
      handler: 'main.handler',
      code: lambda.Code.fromAsset('../lambda/create'),
      functionName: 'Create',
      environment: {
        DB_TABLE: dbTable.tableName
      }
    });

    const get = new lambda.Function(this, 'get', {
      runtime: lambda.Runtime.PYTHON_3_8,
      handler: 'main.handler',
      code: lambda.Code.fromAsset('../lambda/get'),
      functionName: 'Get',
      environment: {
        DB_TABLE: dbTable.tableName
      }
    });

    dbTable.grantWriteData(create.grantPrincipal);
    dbTable.grantReadData(get.grantPrincipal);

    // ========================================================================
    // Amazon Cognito User Pool
    // ========================================================================

    const userPool = new cognito.UserPool(this, 'RootPool', {
      userPoolName: 'RootPool',
      selfSignUpEnabled: true,
      autoVerify: {
        email: true
      },
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });

    userPool.addClient('web', {
    });

    userPool.addClient('native', {
    });

    // ========================================================================
    // Amazon API Gateway - API endpoints
    // ========================================================================

    const apig = new apigateway.RestApi(this, 'RootGateway', {
      restApiName: "RootAPI",
      // defaultCorsPreflightOptions: {
      //   allowOrigins: apigateway.Cors.ALL_ORIGINS,
      //   allowMethods: apigateway.Cors.ALL_METHODS // this is also the default
      // }
    });

    const integration = new apigateway.LambdaIntegration(ping);

    const createInt = new apigateway.LambdaIntegration(create, {
      proxy: true
    });

    const getInt = new apigateway.LambdaIntegration(get, {
      proxy: true
    });

    // ========================================================================
    // Cognito Authorizer
    // ========================================================================

    const auth = new apigateway.CognitoUserPoolsAuthorizer(this, 'RootAuthorizer', {
      authorizerName: "RootAuthorizer",
      cognitoUserPools: [
        userPool
      ],
    });

    // ========================================================================
    // Root (/) - no authorization required
    // ========================================================================

    const v1 = apig.root.addResource('v1');

    // Health-Check

    const status = v1.addResource('_ping');

    status.addMethod('GET', integration, { apiKeyRequired: false });

    const crud = v1.addResource('crud');

    crud.addMethod('GET', getInt,
      {
        authorizer: auth,
        authorizationType: apigateway.AuthorizationType.COGNITO
      }
    );

    const createResource = crud.addResource('create', {

    });

    createResource.addMethod('POST', createInt,
      {
        authorizer: auth,
        authorizationType: apigateway.AuthorizationType.COGNITO
      }
    );

    addCorsOptions(createResource)

  }
}

function addCorsOptions(apiResource: apigateway.IResource) {
  apiResource.addMethod('OPTIONS', new apigateway.MockIntegration({
    integrationResponses: [{
      statusCode: '200',
      responseParameters: {
        'method.response.header.Access-Control-Allow-Headers': "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'",
        'method.response.header.Access-Control-Allow-Origin': "'*'",
        'method.response.header.Access-Control-Allow-Credentials': "'false'",
        'method.response.header.Access-Control-Allow-Methods': "'OPTIONS,GET,PUT,POST,DELETE'",
      },
    }],
    passthroughBehavior: apigateway.PassthroughBehavior.NEVER,
    requestTemplates: {
      "application/json": "{\"statusCode\": 200}"
    },
  }), {
    methodResponses: [{
      statusCode: '200',
      responseParameters: {
        'method.response.header.Access-Control-Allow-Headers': true,
        'method.response.header.Access-Control-Allow-Methods': true,
        'method.response.header.Access-Control-Allow-Credentials': true,
        'method.response.header.Access-Control-Allow-Origin': true,
      },
    }]
  })
}