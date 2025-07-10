from flask import Flask, render_template, jsonify, request
import random

app = Flask(__name__)

@app.route('/math_game_/')
def index():
    return render_template('math_game_index.html')

@app.route('/math_game_api/problem')
def generate_problem():
    operations = ['+', '-', '*']
    level = request.args.get('level', 1, type=int)
    
    operation = random.choice(operations)
    max_number = min(10 + (level - 1) * 5, 50)
    
    if operation == '+':
        num1 = random.randint(1, max_number)
        num2 = random.randint(1, max_number)
        answer = num1 + num2
    elif operation == '-':
        num1 = random.randint(max_number, max_number * 2)
        num2 = random.randint(1, max_number)
        answer = num1 - num2
    elif operation == '*':
        num1 = random.randint(1, min(max_number, 12))
        num2 = random.randint(1, min(max_number, 12))
        answer = num1 * num2
    
    return jsonify({
        'problem': f'{num1} {operation} {num2}',
        'answer': answer,
        'level': level
    })

@app.route('/math_game_api/check', methods=['POST'])
def check_answer():
    data = request.json
    user_answer = data.get('answer')
    correct_answer = data.get('correct_answer')
    
    is_correct = user_answer == correct_answer
    
    return jsonify({
        'correct': is_correct,
        'message': 'Correct!' if is_correct else f'Incorrect. The answer was {correct_answer}'
    })

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0")
