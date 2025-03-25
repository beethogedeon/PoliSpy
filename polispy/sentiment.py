import pandas as pd
import os

from openai import AzureOpenAI

client = AzureOpenAI(
   azure_endpoint=os.getenv("OPENAI_AZURE_ENDPOINT"), #do not add "/openai" at the end here because this will be automatically added by this SDK
   api_key=os.getenv("OPENAI_API_KEY"),
   api_version=os.getenv("OPENAI_API_VERSION")
)

