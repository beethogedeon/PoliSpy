from fuzzywuzzy import fuzz, process
import html
import re
import textacy
import textacy.preprocessing as tprep

def fix_journal_names(df):

    df['Journal'] = df['Journal'].astype('string') # Convert the column to string type

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
    df["Journals"] = df["Journal"].apply(match_journal_name)

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


