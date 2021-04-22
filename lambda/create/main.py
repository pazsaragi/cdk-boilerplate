import boto3
import logging
import uuid
import os
import json


dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(os.getenv("DB_TABLE"))


def create_business(email, name):
    ids = uuid.uuid4()
    response = table.put_item(
       Item={
            'pk': 'data#'+str(ids),
            'sk': 'data#'+str(ids),
            'EntityType': 'data',
            'Email': email,
            'Name': name,
        }
    )
    return response


def handler(event, context):
    data = json.loads(event['body'])
    
    if 'email' not in data or 'name' not in data:
        logging.error("Validation Failed")
        raise Exception("Couldn't create the business.")
        
    response = {
        "statusCode": 200,
        "body": json.dumps(create_business(data['email'], data['name'])),
        "headers": {
            "Content-Type" : "application/json",
            "Access-Control-Allow-Origin" : "*"
        }
    }
    return response
