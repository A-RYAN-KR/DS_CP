from flask import Flask, request, jsonify
from pymongo import MongoClient
from ast_utils import get_ast_tokens
from similarity_utils import cosine_similarity
import os
import flask_cors

app = Flask(__name__)
flask_cors.CORS(app)  # Enable CORS for all routes

# Replace with your MongoDB Atlas connection string
MONGO_URI = "mongodb+srv://aryankr:nJ4s3WF_R7En3Ph@cluster0.hwcxlke.mongodb.net/Data_Structure_CP?retryWrites=true&w=majority&appName=Cluster0"
client = MongoClient(MONGO_URI)
db = client["code_similarity_db"]
submissions_collection = db["submissions"]

@app.route('/submit_code', methods=['POST'])
def submit_code():
    """
    Store student code submissions in MongoDB Atlas.
    Expects JSON: { "student_id": "S1", "code": "def add(a, b): return a + b" }
    """
    try:
        data = request.get_json()
        student_id = data.get("student_id")
        code = data.get("code")

        if not student_id or not code:
            return jsonify({'error': 'Both "student_id" and "code" are required'}), 400

        submissions_collection.insert_one({"student_id": student_id, "code": code})
        return jsonify({'message': 'Submission saved successfully'}), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/detect_plagiarism', methods=['GET'])
def detect_plagiarism():
    """
    Detects plagiarism by comparing all stored code submissions pairwise.
    Returns pairs with similarity above a threshold.
    """
    threshold = 0.9  # Adjust threshold based on testing
    submissions = list(submissions_collection.find({}, {"student_id": 1, "code": 1, "_id": 0}))

    similar_pairs = []
    seen_pairs = set()

    for i in range(len(submissions)):
        for j in range(i + 1, len(submissions)):  # Avoid duplicate & self-pairs
            if i == j:
                continue  # Skip self-comparison
            student1 = submissions[i]["student_id"]
            student2 = submissions[j]["student_id"]
            code1 = submissions[i]["code"]
            code2 = submissions[j]["code"]

            tokens1 = get_ast_tokens(code1)
            tokens2 = get_ast_tokens(code2)

            if tokens1 is None or tokens2 is None:
                continue  # Skip if there's a syntax error

            similarity_score = cosine_similarity(tokens1, tokens2)

            if similarity_score >= threshold:
                pair = tuple(sorted([student1, student2]))  # Keep consistent ordering
                if pair not in seen_pairs:
                    similar_pairs.append([student1, student2, round(similarity_score, 6)])
                    seen_pairs.add(pair)

    return jsonify({"similar_pairs": similar_pairs})

    # except Exception as e:
    #     return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
