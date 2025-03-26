import pandas as pd
import os
from langchain_openai import AzureChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from pydantic import BaseModel, Field
from typing import Literal

class SentenceSentiment(BaseModel):
    tone_score: float = Field(..., ge=-1, le=1, description="A score from -1 (strongly negative) to 1 (strongly positive).")
    sentiment: Literal["Positive", "Neutral", "Negative"] = Field(..., description="Sentiment classification.")
    
class PoliticalClassification(BaseModel):
    category: Literal[
        "U.S.–Canada Relations & Tariffs",
        "Economy",
        "Taxation & Subsidies",
        "Energy & Pipelines",
        "Climate & Environment",
        "Technology & Innovation",
        "Security & Sovereignty",
        "Immigration",
        "Jobs & Labour",
        "Small Business",
        "Housing & Affordability",
        "Healthcare",
        "Education",
        "Indigenous Affairs",
        "Income Support",
        "Public Spending",
        "Childcare & Seniors",
        "Transportation",
        "Trade & Foreign Affairs",
        "Other"
    ] = Field(..., description="The category that best captures the main issue discussed.")


sentiment_llm = AzureChatOpenAI(
    api_key=os.getenv("AZURE_OPENAI_API_KEY"),
    azure_endpoint=os.getenv("AZURE_ENDPOINT"),
    azure_deployment="gpt-4o",  # or your deployment
    api_version="2025-03-01-preview",  # or your api version
    temperature=0,
    max_tokens=None,
    timeout=None,
    max_retries=2,
).with_structured_output(SentenceSentiment)

political_llm = AzureChatOpenAI(
    api_key=os.getenv("AZURE_OPENAI_API_KEY"),
    azure_endpoint=os.getenv("AZURE_ENDPOINT"),
    azure_deployment="gpt-4o",  # or your deployment
    api_version="2025-03-01-preview",  # or your api version
    temperature=0,
    max_tokens=None,
    timeout=None,
    max_retries=2,
).with_structured_output(PoliticalClassification)

sentiment_prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            """As an expert in Canadian political analysis, assess the sentiment of the following sentence drawn from news coverage related to Canadian political parties.
            For each sentence:
            Assign a tone score between -1 (strongly negative) and 1 (strongly positive).
            Classify the sentiment as Positive, Neutral, or Negative.
            """,
        ),
        ("human", "Sentence : {input}"),
    ]
)

political_prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            """As an expert in Canadian political analysis, your task is to classify the following sentences extracted from news articles or newspapers related to each Canadian party into predefined issues or topics discussed. Choose the category that best captures the main issue discussed.
            Categories: U.S.–Canada Relations & Tariffs, Economy, Taxation & Subsidies, Energy & Pipelines, Climate & Environment, Technology & Innovation, Security & Sovereignty, Immigration, Jobs & Labour, Small Business, Housing & Affordability, Healthcare, Education, Indigenous Affairs, Income Support, Public Spending, Childcare & Seniors, Transportation, Trade & Foreign Affairs, Other (if none of the above apply)
            """,
        ),
        ("human", "Sentence : {input}"),
    ]
)

sentiment_chain = sentiment_prompt | sentiment_llm
political_chain = political_prompt | political_llm

def get_sentiment(sentence: str):
    
    result = sentiment_chain.invoke(sentence)
    
    return result.sentiment, result.tone_score

def get_category(sentence: str):
 
    result = political_chain.invoke(sentence)
    
    return result.category