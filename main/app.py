from flask import Flask, request, jsonify, render_template, redirect, url_for
from flask_cors import CORS

app = Flask(__name__, template_folder="templates", static_folder="static")
CORS(app)

@app.route('/')
def home():
    return render_template('index.html')  # Serve home page

@app.route('/test')
def test():
    return render_template('test.html')  # Serve test page

@app.route('/redirect-home')
def redirect_home():
    return redirect(url_for('home'))  # Redirect to home page

@app.route('/submit-test', methods=['POST'])
def submit_test():
    data = request.get_json()
    if not data or 'answers' not in data:
        return jsonify({"error": "Invalid data"}), 400

    answers = data['answers']
    inattention_score = sum(answers[:5])
    hyperactivity_score = sum(answers[5:10])
    impulsivity_score = sum(answers[10:15])
    additional_questions_score = sum(answers[15:20])
    total_score = inattention_score + hyperactivity_score +impulsivity_score + additional_questions_score

    if total_score >= 40:
        risk_level = "High"
        recommendation = "Strong indication of ADHD. Please consult a medical professional."
    elif total_score >= 20:
        risk_level = "Moderate"
        recommendation = "Some symptoms of ADHD. Consider discussing with a specialist."
    else:
        risk_level = "Low"
        recommendation = "Little to no indication of ADHD."

    return jsonify({
        "total_score": total_score,
        "inattention_score": inattention_score,
        "hyperactivity_score": hyperactivity_score,
        "impulsivity_score" : impulsivity_score,
        "additional_questions_score" : additional_questions_score,
        "risk_level": risk_level,
        "recommendation": recommendation
    })

if __name__ == '__main__':
    app.run(debug=True)
