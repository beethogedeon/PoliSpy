import pandas as pd
from datetime import datetime, timedelta
import re
import unicodedata

def add_week_month(source_party, date_column='Dates'):
    """
    Adds two columns to the dataframe:
    - 'Week': date of the Monday of the week (format 'YYYY-MM-DD')
    - 'Monthly': month and year (format 'YYYY-MM')
    
    Parameters:
    -----------
    df : pandas.DataFrame
        The dataframe containing the data
    date_column : str, default='Dates'
        The name of the column containing dates in 'YYYY-MM-DD' format
        
    Returns:
    --------
    pandas.DataFrame
        The dataframe with new 'Week' and 'Monthly' columns
    """
    
    df = pd.read_csv(f"{data_folder}/{source_party}.csv")  # Load your data
    # Create a copy of the dataframe to avoid modifying the original
    df_result = df.copy()
    
    df_result = df_result[df_result["tone_score"]!=-10]
    df_result = df_result[df_result["Dates"]!="Undefined"]
    
    # Fix NaN values in the date column
    df_result[date_column].fillna(method='ffill', inplace=True)
    
    # Convert the date column to datetime type if it's not already
    if not pd.api.types.is_datetime64_any_dtype(df_result[date_column]):
        df_result[date_column] = pd.to_datetime(df_result[date_column])
    
    # Function to find the date of Monday of the week
    def find_monday(date):
        # weekday() returns 0 for Monday, 1 for Tuesday, etc.
        days_to_subtract = date.weekday()
        monday_date = date - timedelta(days=days_to_subtract)
        return monday_date.strftime('%Y-%m-%d')
    
    # Create the Week column with the date of Monday of the week
    df_result['Week'] = df_result[date_column].apply(find_monday)
    
    # Create the Monthly column in 'YYYY-MM' format
    df_result['Monthly'] = df_result[date_column].apply(
        lambda x: f"{x.year}-{x.month:02d}"
    )
    
    df_result.drop(columns=["Sentences"], inplace=True)  # Drop the original date column
    
    df_result.to_csv(f"{data_folder}/{source_party}_clea.csv", index=False, encoding='utf-8-sig')
    
    return df_result


# 1. Define updated keyword dictionary with Mark Carney and leader names
party_keywords = {
    "LPC": ["liberal party", "lpc","liberals", "justin trudeau", "trudeau", "mark carney", "carney"],
    "PCC": ["conservative party", "pcc","cpc", "conservatives", "pierre poilievre", "poilievre"],
    "NDP": ["ndp", "new democratic party", "jagmeet singh", "jagmeet"],
    "BQ": ["bloc québécois", "bq","bloc quebecois", "yves-françois blanchet", "blanchet"],
    "GPC": ["green party", "gpc","greens", "elizabeth may", "mike morrice", "may", "morrice"]
}



# 2. Load your data
data_folder = "/home/beetho/Downloads/PoliSpy"

def count_mentions(source_party:str):
    """
    Count mentions of a given party in the text column of the dataframe.
    
    Parameters:
    -----------
    source_party : str
        The party to count mentions for (e.g., 'LPC', 'PCC', etc.)
        
    Returns:
    --------
    int
        The total count of mentions for the specified party
    """
    df = pd.read_csv(f"{data_folder}/{source_party}.csv")  # Load your data
    
    #df.drop_duplicates(subset=["Texte","Dates"], inplace=True)  # Remove duplicates based on the 'Texte' column

    # 4. Normalize text: lowercase and remove accents
    def remove_accents(text):
        return ''.join(c for c in unicodedata.normalize('NFD', text) if unicodedata.category(c) != 'Mn')

    df["text_clean"] = df["Sentences"].astype(str).str.lower().apply(remove_accents)

    # 5. Count mentions of other parties
    for party, keywords in party_keywords.items():
        if party == source_party:
            continue
        def count_mentions(text):
            count = 0
            for kw in keywords:
                pattern = r"\b" + re.escape(remove_accents(kw.lower())) + r"\b"
                count += len(re.findall(pattern, text))
            return count
        df[f"mentions_{party}"] = df["text_clean"].apply(count_mentions)

    # 6. Drop intermediate column
    df.drop(columns=["text_clean"], inplace=True)

    # 7. Save or display result
    df.to_csv(f"{data_folder}/{source_party}_mention_counts.csv", index=False)
    
    
if __name__ == "__main__":
    
    for party in party_keywords.keys():
        print(f"Processing {party}...")
        count_mentions(party)
        #add_week_month(party)