import pandas as pd
import os

from processing import process_files, split_sentences
from nlp import get_sentiment, get_category

def process_each_file(path):
    df = pd.read_csv(path)
    
    df.drop_duplicates(inplace=True)
    
    df = process_files(df)
    
    df["Sentences"] = df["Texte"].apply(split_sentences)
    
    df.drop(columns=["Texte"], inplace=True)
    
    df = df.explode("Sentences", ignore_index=True)
    
    # Ensure there is no float in the "Sentences" column
    df.dropna(subset=["Sentences"], inplace=True)
    df["Sentences"] = df["Sentences"].astype(str)
    
    df["Sentiment"], df["Tone"] = zip(*df["Sentences"].apply(get_sentiment))
    
    df["Category"] = df["Sentences"].apply(get_category)
    
    return df

def merge_with_previous_version(new_df, file_name):
    final_data_path = f"data/final_data/{file_name}"
    
    if os.path.exists(final_data_path):
        # Charger l'ancienne version
        old_df = pd.read_csv(final_data_path)
        
        # Fusionner les deux DataFrames et supprimer les doublons
        merged_df = pd.concat([old_df, new_df], ignore_index=True)
        merged_df.drop_duplicates(subset=["Titre", "Texte", "Dates"], inplace=True)
        
        return merged_df
    else:
        # Pas de version antérieure, retourner simplement le nouveau DataFrame
        return new_df

def main():
    
    # check if there is some files in the data/structured_data folder
    list_files = os.listdir("data/structured_data")
    if not list_files:
        print("No files to process.")
        return
    else:
        
        # process each file
        for file in list_files:
            print(f"Processing file {file}...")
            new_df = process_each_file(f"data/structured_data/{file}")
            
            print("Size : ",len(new_df))
            
            # Vérifier et fusionner avec une version antérieure si elle existe
            final_df = merge_with_previous_version(new_df, file)
            
            # Sauvegarder le fichier final
            final_df.to_csv(f"data/final_data/{file}")
            
            print(f"File {file} processed and saved.")
            
            
if __name__ == "__main__":
    main()