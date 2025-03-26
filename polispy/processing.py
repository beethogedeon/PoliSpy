from fuzzywuzzy import fuzz, process
import html
import re
import pandas as pd
import textacy
import textacy.preprocessing as tprep
import spacy

nlp = spacy.load("en_core_web_sm")

def fix_journal_names(df):

    df['Publication'] = df['Publication'].astype('string') # Convert the column to string type

    # True names
    true_names = [
        "Calgary Herald",
        "Chronicle - Herald",
        "CTV News",
        "Edmonton Journal",
        "Financial Post",
        "Global News Toronto",
        "Kingston Whig - Standard",
        "Leader Post",
        "Montreal Gazette",
        "National Post",
        "New Brunswick Telegraph",
        "Northern Miner",
        "Star - Phoenix",
        "Sudbury Star",
        "Surrey Now-Leader",
        "Telegraph-Journal",
        "The Globe and Mail",
        "The Ottawa Citizen",
        "The Province",
        "The Vancouver Sun",
        "The Windsor Star",
        "Times - Colonist",
        "Toronto Star",
        "Windspeaker Edmonton",
        "Winnipeg Free Press"
    ]

    def match_journal_name(name):
        """
        Function that finds the corresponding name in the list of true names using fuzzywuzzy.
        """
        # Use process.extractOne to get the most similar name from the true_names list.
        matched_name, score = process.extractOne(name, true_names)

        # If the score is greater than a certain threshold (e.g., 80), consider it a match.
        if score >= 80:
            return matched_name
        else:
            # Otherwise, return the original name.
            return name

    # Apply the function to the "Publication" column of df1
    df["Public"] = df["Publication"].apply(match_journal_name)

    return df


def clean_build(text):
    # convert html escapes like &amp; to characters.
    text = html.unescape(text)
    # tags like <tab>
    text = re.sub(r'<[^<>]*>', ' ', text)
    # remove words contains numbers
    text = re.sub('\w*\d\w*', '', text)
    # markdown URLs like [Some text](https://....)
    text = re.sub(r'\[([^\[\]]*)\]\([^\(\)]*\)', r'\1', text)
    # text or code in brackets like [0]
    text = re.sub(r'\[[^\[\]]*\]', ' ', text)
    # standalone sequences of specials, matches &# but not #cool
    text = re.sub(r'(?:^|\s)[&#<>{}\[\]+|\\:-]{1,}(?:\s|$)', ' ', text)
    # standalone sequences of hyphens like --- or ==
    text = re.sub(r'(?:^|\s)[\-=\+]{2,}(?:\s|$)', ' ', text)
    # sequences of white spaces
    text = re.sub(r'\s+', ' ', text)
    
    text = text.strip()
    
    if textacy.__version__ < '0.11':
        # as in book
        text = tprep.normalize_hyphenated_words(text)
        text = tprep.normalize_quotation_marks(text)
        text = tprep.normalize_unicode(text)
        text = tprep.remove_accents(text)

    else:
        # adjusted to textacy 0.11
        text = tprep.normalize.hyphenated_words(text)
        text = tprep.normalize.quotation_marks(text)
        text = tprep.normalize.unicode(text)
        text = tprep.remove.accents(text)
    return text.strip()

def split_sentences(text):
    doc = nlp(text)
    return [sent.text for sent in doc.sents]


def process_files(df):
    
    df.drop_duplicates(inplace=True)
    
    df.rename(columns={'Année de publication' : 'Year'}, inplace=True)
    df.rename(columns = {'Texte intégral' : 'Texte'}, inplace=True)
    df.rename(columns = {'Identifier / keyword' : 'Keywords'}, inplace=True)
    df.rename(columns = {'Lieu de publication' : 'Place'}, inplace=True)
    df.rename(columns = {'Date de publication' : 'Date'}, inplace=True)
    df.rename(columns = {'Société / organisation' : 'NAICS'}, inplace=True)
    df.rename(columns = {'Éditeur' : 'Editeur'}, inplace=True)
    
    # Define a regex pattern to match and extract the date components
    date_pattern = r'(\w{3}) (\d{1,2}), (\d{4})'

    # Function to convert matched date string to desired format
    def convert_date(match):
        month = match.group(1)
        day = match.group(2)
        year = match.group(3)
        return f'{month} {day}, {year}'

    # Apply regex pattern and conversion function to the 'Date' column
    df['Dates'] = df['Date'].apply(lambda x: re.sub(date_pattern, convert_date, x) if pd.notnull(x) else pd.NaT)

    # Convert the 'Date' column to datetime format
    df['Dates'] = pd.to_datetime(df['Dates'], errors='coerce')
    
    # Short script to remove '\n' from the 'Texte' column
    df['Texte'] = df['Texte'].str.replace('\n', ' ', regex=True).astype('string')
    
    df = fix_journal_names(df)
    
    values_to_delete = [
    "McCarthy Tétrault Blog: Québec Employer Advisor; Quebec",
    "Sunday Business; London (UK)",
    "Michael Geist [BLOG ]",
    "Politico, U.S. edition; Arlington",
    "Daimnation! [BLOG ]; Dartmouth",
    "Boursier.com; Paris",
    "China Daily, US ed.; New York, N.Y.",
    "City A.M.; London",
    "JTN Monthly; Osaka", "Global News Toronto", "Financial Post"
]

    # Create a new DataFrame without the rows containing the specified values
    df_filtered = df[~df['Public'].isin(values_to_delete)]
    
    df_filtered['Public'] = df_filtered['Public'].astype('string')  # Convert the column to string type
    
    df_filtered['Public'] = df_filtered['Public'].replace("Now; Surrey, B.C.", "Surrey Now-Leader")
    
    return df_filtered