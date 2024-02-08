import random
import string

from flask import Blueprint, jsonify

bp = Blueprint('generateSampleData', __name__)


@bp.route('/api/generate_data', methods=['GET'])
def generate_data():
    data = []
    for _ in range(300):
        sample = {
            'locus tag': ''.join(random.choices(string.ascii_uppercase + string.digits, k=10)),
            'logFC': f"{random.uniform(-2, 2):.2f}",
            'logCPM': f"{random.uniform(3, 7):.2f}",
            'PValue': f"{random.uniform(0, 1):.2f}",
            'FDR': f"{random.uniform(0, 1):.2f}"
        }
        data.append(sample)

        print("generated data: 🚀🚀🚀 \n", data)
    return jsonify(data)
