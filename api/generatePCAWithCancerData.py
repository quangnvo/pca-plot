# import all libraries
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd

# import the breast _cancer dataset
from sklearn.datasets import load_breast_cancer
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler

data = load_breast_cancer()

# construct a dataframe using pandas
df1 = pd.DataFrame(data['data'], columns=data['feature_names'])

# Standardize the data
scaling = StandardScaler()
scaled_data = scaling.fit_transform(df1)

# Make PCA
principal = PCA()
x = principal.fit_transform(scaled_data)

plt.figure(figsize=(10, 10))
plt.scatter(x[:, 0], x[:, 1], c=data['target'], cmap='plasma')
plt.xlabel('pc1')
plt.ylabel('pc2')

# Show the plot
plt.show()
