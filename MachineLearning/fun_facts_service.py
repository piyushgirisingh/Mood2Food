#!/usr/bin/env python3
"""
Fun Facts Service for Emotional Eating
Integrates with the ML service to provide dynamic fun facts
"""

from datasets import Dataset
import random
import json
from datetime import datetime
import os

class FunFactsService:
    def __init__(self):
        self.dataset = None
        self.facts_cache = []
        self.load_dataset()
    
    def load_dataset(self):
        """Load the emotional eating facts dataset"""
        try:
            self.dataset = Dataset.load_from_disk("emotional_eating_facts_dataset")
            self.facts_cache = list(self.dataset)
            print(f"✅ Loaded {len(self.facts_cache)} emotional eating facts")
        except Exception as e:
            print(f"❌ Error loading dataset: {e}")
            self.load_fallback_facts()
    
    def load_fallback_facts(self):
        """Load fallback facts if dataset is not available"""
        self.facts_cache = [
            {
                "fact": "75% of overeating is caused by emotions, not hunger!",
                "category": "Statistics",
                "tip": "Next time you reach for food, ask yourself: 'Am I really hungry?'",
                "source": "American Psychological Association"
            },
            {
                "fact": "Stress can make you crave sugary foods because cortisol increases blood sugar levels.",
                "category": "Science",
                "tip": "Try deep breathing instead of reaching for sweets when stressed.",
                "source": "Journal of Endocrinology"
            },
            {
                "fact": "The average person makes 200+ food decisions per day, most unconsciously!",
                "category": "Psychology",
                "tip": "Being mindful of your food choices can help break emotional eating patterns.",
                "source": "Cornell Food and Brand Lab"
            }
        ]
        print(f"✅ Loaded {len(self.facts_cache)} fallback facts")
    
    def get_fact_of_the_day(self):
        """Get today's fact based on day of year"""
        if not self.facts_cache:
            return None
        
        today = datetime.now()
        day_of_year = today.timetuple().tm_yday
        fact_index = day_of_year % len(self.facts_cache)
        
        return self.facts_cache[fact_index]
    
    def get_random_fact(self):
        """Get a random fact"""
        if not self.facts_cache:
            return None
        
        return random.choice(self.facts_cache)
    
    def get_facts_by_category(self, category):
        """Get all facts from a specific category"""
        if not self.facts_cache:
            return []
        
        return [fact for fact in self.facts_cache if fact['category'].lower() == category.lower()]
    
    def get_categories(self):
        """Get all available categories"""
        if not self.facts_cache:
            return []
        
        return list(set([fact['category'] for fact in self.facts_cache]))
    
    def get_facts_by_source(self, source):
        """Get all facts from a specific source"""
        if not self.facts_cache:
            return []
        
        return [fact for fact in self.facts_cache if source.lower() in fact['source'].lower()]
    
    def get_fact_stats(self):
        """Get statistics about the facts dataset"""
        if not self.facts_cache:
            return {}
        
        categories = {}
        sources = {}
        
        for fact in self.facts_cache:
            cat = fact['category']
            src = fact['source']
            
            categories[cat] = categories.get(cat, 0) + 1
            sources[src] = sources.get(src, 0) + 1
        
        return {
            "total_facts": len(self.facts_cache),
            "total_categories": len(categories),
            "total_sources": len(sources),
            "categories": categories,
            "sources": sources
        }
    
    def search_facts(self, query):
        """Search facts by keyword"""
        if not self.facts_cache:
            return []
        
        query = query.lower()
        results = []
        
        for fact in self.facts_cache:
            if (query in fact['fact'].lower() or 
                query in fact['category'].lower() or 
                query in fact['tip'].lower() or 
                query in fact['source'].lower()):
                results.append(fact)
        
        return results
    
    def get_fact_by_id(self, fact_id):
        """Get a specific fact by index"""
        if not self.facts_cache or fact_id >= len(self.facts_cache):
            return None
        
        return self.facts_cache[fact_id]
    
    def get_facts_for_emotion(self, emotion):
        """Get facts relevant to a specific emotion"""
        emotion_mapping = {
            "sadness": ["Loss", "Loneliness", "Abandonment", "Grief"],
            "anger": ["Conflict", "Injustice", "Betrayal", "Power"],
            "stress": ["Stress", "Overwhelm", "Anxiety", "Pressure"],
            "boredom": ["Boredom", "Loneliness", "Purpose", "Engagement"],
            "loneliness": ["Loneliness", "Connection", "Social", "Isolation"],
            "anxiety": ["Anxiety", "Stress", "Overwhelm", "Fear"],
            "happiness": ["Celebration", "Gratitude", "Joy", "Success"],
            "fear": ["Fear", "Safety", "Threat", "Vulnerability"],
            "guilt": ["Guilt", "Shame", "Forgiveness", "Self-compassion"],
            "shame": ["Shame", "Guilt", "Self-worth", "Acceptance"]
        }
        
        relevant_categories = emotion_mapping.get(emotion.lower(), [])
        relevant_facts = []
        
        for fact in self.facts_cache:
            if any(cat.lower() in fact['category'].lower() for cat in relevant_categories):
                relevant_facts.append(fact)
        
        return relevant_facts if relevant_facts else self.get_random_fact()

# Test the service
if __name__ == "__main__":
    print("🧠 Testing Fun Facts Service")
    print("=" * 40)
    
    service = FunFactsService()
    
    # Test fact of the day
    fact_of_day = service.get_fact_of_the_day()
    print(f"📅 Fact of the Day: {fact_of_day['fact']}")
    print(f"   Category: {fact_of_day['category']}")
    print(f"   Tip: {fact_of_day['tip']}")
    print(f"   Source: {fact_of_day['source']}")
    print()
    
    # Test random fact
    random_fact = service.get_random_fact()
    print(f"🎲 Random Fact: {random_fact['fact']}")
    print(f"   Category: {random_fact['category']}")
    print()
    
    # Test categories
    categories = service.get_categories()
    print(f"📊 Available Categories ({len(categories)}):")
    for cat in sorted(categories)[:10]:  # Show first 10
        print(f"   - {cat}")
    print()
    
    # Test stats
    stats = service.get_fact_stats()
    print(f"📈 Dataset Statistics:")
    print(f"   Total Facts: {stats['total_facts']}")
    print(f"   Total Categories: {stats['total_categories']}")
    print(f"   Total Sources: {stats['total_sources']}")
    print()
    
    # Test emotion-based facts
    emotion_facts = service.get_facts_for_emotion("sadness")
    print(f"😢 Facts for Sadness:")
    if isinstance(emotion_facts, list):
        for fact in emotion_facts[:3]:  # Show first 3
            print(f"   - {fact['fact']}")
    else:
        print(f"   - {emotion_facts['fact']}")
    print()
    
    # Test search
    search_results = service.search_facts("sleep")
    print(f"🔍 Search Results for 'sleep':")
    for fact in search_results[:3]:  # Show first 3
        print(f"   - {fact['fact']}")
    print()
    
    print("✅ Fun Facts Service test complete!") 