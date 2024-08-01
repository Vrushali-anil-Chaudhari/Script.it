import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from collections import Counter
import string

def remove_stopwords(query):
    stop_words = set(stopwords.words('english'))
    word_tokens = word_tokenize(query)
    filtered_sentence = [word for word in word_tokens if word.lower() not in stop_words]
    return ' '.join(filtered_sentence)


def most_repeated_words(text, query, close_range=3):
    
    # Tokenize the query into words and phrases
    query_phrases = query.lower().split()
    
    query_combinations = [' '.join(query_phrases[i:j]) for i in range(len(query_phrases)) for j in range(i+1, len(query_phrases)+1)]
    print("Generated query combinations:", query_combinations)
    
    # Initialize a Counter to count the frequency of phrases in the text
    phrase_counts = Counter()
    
    # Count the frequency of each phrase in the text
    for phrase in query_combinations:
        phrase_counts[phrase] = text.lower().count(phrase)
    
    if not phrase_counts:
        return []
    
    # Get the highest frequency count for phrases
    max_count = max(phrase_counts.values())
    
    # Find all phrases with the highest frequency count and those within the close_range
    most_common_phrases = [phrase for phrase, count in phrase_counts.items() if count >= (max_count - close_range) and count > 0]
    print("Most common phrases or words:", most_common_phrases)
    
    # Filter out shorter phrases that are part of longer phrases
    filtered_phrases = most_common_phrases.copy()
    for phrase in most_common_phrases:
        for longer_phrase in most_common_phrases:
            if phrase != longer_phrase and phrase in longer_phrase:
                if phrase in filtered_phrases:
                    filtered_phrases.remove(phrase)
    
    print("Filtered common phrases or words:", filtered_phrases)
    return filtered_phrases