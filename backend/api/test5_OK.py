import json

import pandas as pd
import plotly
import plotly.express as px
import plotly.graph_objects as go
from flask import Flask, jsonify
from flask_cors import CORS  # Import CORS
from sklearn import datasets
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes


@app.route('/api/pca_plot', methods=['GET'])
def pca_plot():
    # Load the iris dataset
    iris = datasets.load_iris()
    df = pd.DataFrame(iris.data, columns=iris.feature_names)
    df['target'] = iris.target
    target_names = {0: 'setosa', 1: 'versicolor', 2: 'virginica'}
    df['target_names'] = df['target'].map(target_names)

    # Standardize the features to have mean=0 and variance=1
    features = ['sepal length (cm)', 'sepal width (cm)',
                'petal length (cm)', 'petal width (cm)']
    x = df.loc[:, features].values
    x = StandardScaler().fit_transform(x)

    # Compute the PCA
    pca = PCA(n_components=2)
    principalComponents = pca.fit_transform(x)
    principalDf = pd.DataFrame(
        data=principalComponents, columns=['PC1', 'PC2'])

    # Concatenate the target_names to the principal components
    finalDf = pd.concat([principalDf, df[['target_names']]], axis=1)

    # Create the plot
    fig = px.scatter(finalDf, x='PC1', y='PC2', color='target_names')

    # Convert the plot to JSON
    plot_json = plotly.io.to_json(fig, pretty=True)

    return plot_json


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
