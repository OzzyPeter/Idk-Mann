from flask import Flask
from flask_cors import CORS
from Routes.lecture import lecture_bp

app = Flask(__name__)
CORS(app)

app.register_blueprint(lecture_bp)

if __name__ == "__main__":
    app.run(debug=True)
