import pandas as pd

from processing import process_files, split_sentences

def process_each_file(path):
    df = pd.read_csv(path)
    
    df.drop_duplicates(inplace=True)
    
    df = process_files(df)
    
    df["Sentences"] = df["Texte"].apply(split_sentences)
    
    df.drop(columns=["Texte"], inplace=True)
    
    df = df.explode("Sentences", ignore_index=True)