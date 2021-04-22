import boto3
import logging
import os


dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(os.getenv("DB_TABLE"))


def get_business(pk_id):
    response = table.get_item(
       Key={
            'pk': pk_id
        }
    )
    
    return response


def handler(event, context):
    data = event['body']
    if 'id' not in data:
        logging.error("Validation Failed")
        raise Exception("Couldn't find the business.")
    
    response = {
        "statusCode": 200,
        "body": get_business(data['id']),
        "headers": {
            "Content-Type" : "application/json",
            "Access-Control-Allow-Origin" : "*"
        }
    }
    return response
