from transformers import pipeline

# Load Hugging Face model
classifier = pipeline("text-classification", model="j-hartmann/emotion-english-distilroberta-base")

def analyze_emotion(text):
    results = classifier(text)
    print("DEBUG:", results)  # See what's coming back
    top_result = results[0]   # first result in the list
    return top_result["label"], top_result["score"]