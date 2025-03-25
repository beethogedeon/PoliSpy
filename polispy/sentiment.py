import pandas as pd
from transformers import BertTokenizer, BertForSequenceClassification, pipeline


def finbert_classification(df):
    # Load the pre-trained model
    finbert = BertForSequenceClassification.from_pretrained('yiyanghkust/finbert-tone', num_labels=3)
    tokenizer = BertTokenizer.from_pretrained('yiyanghkust/finbert-tone')

    nlp = pipeline("text-classification", model=finbert, tokenizer=tokenizer)

    # Function to truncate the input text to a maximum length of 512 tokens
    def truncate_text(text):
        return text[:512]


    # Assuming you have a DataFrame called 'df' with a column named 'memo'
    df['tone_score'] = df['clean_news'].apply(lambda x: nlp(truncate_text(x))[0])
    df['tone'] = df['tone_score'].apply(lambda x: x['label'])
    df['score_tone'] = df['tone_score'].apply(lambda x: x['score'])
    df['tone'] = df['tone'].str.replace('\s+', ' ', regex=True)
    #df['sent'] = df['score_tone'].where(df['tone'] == 'Positive', 0).where(df['tone'] == 'Neutral', -df['score_tone'])
    df['FinBert'] = df.apply(lambda row: row['score_tone'] if row['tone'] == 'Positive' else -row['score_tone'] if row['tone'] == 'Negative' else 0, axis=1)

    # Drop the 'tone_score' column if no longer needed
    df = df.drop(columns=['tone_score'])
    
    return df


