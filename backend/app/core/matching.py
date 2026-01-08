from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from app.models.schemas import Student, Internship
from typing import List, Dict
import numpy as np

class TFIDFMatchingEngine:
    def __init__(self):
        self.vectorizer = TfidfVectorizer(stop_words='english')

    def _create_student_text(self, student: Student) -> str:
        """Combine relevant student fields into a single text block."""
        return f"{student.careerGoals} {' '.join(student.skills)} {' '.join(student.industryFocus)}".lower()

    def _create_internship_text(self, internship: Internship) -> str:
        """Combine relevant internship fields into a single text block."""
        return f"{internship.title} {internship.sector} {internship.description} {' '.join(internship.requiredSkills)}".lower()

    def _calculate_skill_overlap(self, student_skills: List[str], required_skills: List[str]) -> float:
        """Calculate Jaccard similarity-like overlap for skills."""
        if not required_skills:
            return 1.0 # No requirements means perfect fit technically
        
        s_skills = set(s.lower() for s in student_skills)
        r_skills = set(r.lower() for r in required_skills)
        
        matches = len(s_skills.intersection(r_skills))
        
        # We value coverage of required skills more than general overlap
        # Score = Matched / Required
        return matches / len(r_skills) if len(r_skills) > 0 else 0


    def _hybrid_score(self, vector_sim: float, skill_score: float) -> float:
        """Combine scores with weights and curve."""
        # Weighted Average
        # Skills are very important (70%), Semantic Context (30%)
        raw_score = (vector_sim * 0.3) + (skill_score * 0.7)
        
        # Boosting Curve: Apply a square root or similar to boost mid-range scores
        # e.g., 0.5 becomes 0.7, 0.8 becomes 0.89
        boosted_score = raw_score ** 0.5 
        
        return round(boosted_score * 100, 2)


    def calculate_score(self, student: Student, internship: Internship) -> float:
        """Calculate match score between a single student and internship."""
        try:
            student_text = self._create_student_text(student)
            internship_text = self._create_internship_text(internship)
            
            # Vector Score
            tfidf_matrix = self.vectorizer.fit_transform([student_text, internship_text])
            vector_sim = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
            
            # Skill Score
            skill_sim = self._calculate_skill_overlap(student.skills, internship.requiredSkills)
            
            return self._hybrid_score(vector_sim, skill_sim)
        except Exception:
            import traceback
            traceback.print_exc()
            # Fallback if vectorizer yields 0 features (empty text) or other error
            skill_sim = self._calculate_skill_overlap(student.skills, internship.requiredSkills)
            return round(skill_sim * 100, 2)

    def get_recommendations(self, student: Student, internships: List[Internship], top_n: int = 5) -> List[Dict]:
        """Rank internships for a given student."""
        if not internships:
            return []

        student_text = self._create_student_text(student)
        internship_texts = [self._create_internship_text(i) for i in internships]
        
        all_texts = [student_text] + internship_texts
        
        try:
            tfidf_matrix = self.vectorizer.fit_transform(all_texts)
            # Cosine similarity between student (index 0) and internships (indices 1+)
            vector_similarities = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:]).flatten()
        except ValueError:
            # Handle empty vocabulary edge case
            vector_similarities = [0.0] * len(internships)
        
        scored_internships = []
        for i, vector_sim in enumerate(vector_similarities):
            skill_sim = self._calculate_skill_overlap(student.skills, internships[i].requiredSkills)
            final_score = self._hybrid_score(vector_sim, skill_sim)
            
            scored_internships.append({
                "internship": internships[i],
                "score": final_score
            })
            
        # Sort by score descending
        scored_internships.sort(key=lambda x: x["score"], reverse=True)
        
        return scored_internships[:top_n]
