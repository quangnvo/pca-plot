import matplotlib.pyplot as plt
import pandas as pd
from sklearn import datasets
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler

# load features and targets separately
iris = datasets.load_iris()
X = iris.data
y = iris.target

# Scale Data
x_scaled = StandardScaler().fit_transform(X)
print("X scaled: \n", x_scaled[:5])

# Perform PCA on Scaled Data
pca = PCA(n_components=2)


pca_features = pca.fit_transform(x_scaled)

# Principal components correlation coefficients
loadings = pca.components_

# Number of features before PCA
n_features = pca.n_features_in_

# Feature names before PCA
feature_names = iris.feature_names

# PC names
pc_list = [f'PC{i}' for i in list(range(1, n_features + 1))]

# Match PC names to loadings
pc_loadings = dict(zip(pc_list, loadings))

# Matrix of corr coefs between feature names and PCs
loadings_df = pd.DataFrame.from_dict(pc_loadings)
loadings_df['feature_names'] = feature_names
loadings_df = loadings_df.set_index('feature_names')
print(loadings_df)
