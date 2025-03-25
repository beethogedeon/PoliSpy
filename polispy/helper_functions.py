import os
import re
import sys
import csv
import glob

# ======== PQ Parser ========

fieldnames = ['Titre','Année de publication','Texte intégral','Publication', 'Lieu de publication', 'Auteur', 'Éditeur', 'Date de publication', 'Sujet', 'Société / organisation']

sep = "____________________________________________________________"

## function that takes a directory of .txt files from ProQuest as input
def parsePQ(path, output_path, file_output='csv'):
    '''This function parses text file downloads from ProQuest into metadata and full-text.

    It takes as input a path to .txt files that have been downloaded from ProQuest Global Newsstream.
    It returns a CSV file of selected metadata along with the full text for each article as a separate row.
    Optional: set the second parameter to 'txt' to also output individual articles as .txt files in /output/

    Parameters
    ----------

    path : str
        path to .txt files that will be parsed (e.g., 'txts/' or 'pdfs/')
    file_output : str (default = 'csv')
        change to file_output='txt' to return individual articles as text files AND a CSV file for all;
        default behavior only outputs the CSV file
    '''
    # open a csv file to write metadata to
    with open(output_path, 'w', newline='', encoding='utf-8-sig') as csvfile:
        # add fieldnames as header
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        #cycle through every text file in the directory given as an argument
        files_all = glob.iglob(path + "*.txt")

        for filename in files_all:

            #remove the path, whitespace, and '.txt' from filename to later use when printing output
            file_id = filename[:-4].strip(path)

            with open(filename, 'r', encoding='utf-8-sig') as in_file:
                # text var for string of all docs
                text = in_file.read()

                # split string by separator into single articles
                docs = re.split(sep, text)

                # remove first and last items from docs list: first item is empty string; last is copyright info
                docs = docs[1:-1]

                # loop through every doc to collect metadata and full text
                for i, doc in enumerate(docs):
                    if file_output == 'txt':
                        new_file = 'output/' + file_id + str(i) + '.txt'
                        txt_file = open(new_file,'w')
                    # remove white space from beginning and end of each article
                    doc = doc.strip()

                    # skip any empty docs
                    if doc=="":
                        continue

                    if file_output == 'txt':
                        txt_file.write(doc)
                        txt_file.close()

                    # split doc on every new line
                    metadata_lines = doc.split('\n\n')

                    #remove first "line" from article which is the article title without any field title
                    metadata_lines = metadata_lines[1:]

                    #declare a new dictionary
                    metadata_dict = {}

                    #for each element add the fieldname/key and following value to a dictionary
                    for line in metadata_lines:

                        #ignore lines that do not have a field beginning "Xxxxxx:" (e.g. "Publication title: ")
                        if not re.match(r'^[^:]+: ', line):
                            continue
                        #looks for beginning of new line following structure of "Publication year: " splitting on the colon space
                        (key,value) = line.split(sep=': ', maxsplit=1)

                        #only add to dictionary if the key is in fieldnames
                        if key in fieldnames:
                            metadata_dict[key] = value

                    #write the dictionary values to new row in csv
                    writer.writerow(metadata_dict)
            print("Writing", file_id)
            
# ======== [END] PQ Parser ========

# ======== [START] Data Processing ========



# ======== [START] Sentiment Analysis ========