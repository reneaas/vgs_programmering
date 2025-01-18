import pkg_resources

# List of packages from requirements.txt
packages = [
    "numpy",
    "matplotlib",
    "sympy",
    "jupyter-book",
    "sphinx-proof",
    "jupyter-repo2docker",
    "sphinx-inline-tabs",
    "jupyterquiz",
    "import-ipynb",
    "sphinx-mermaid",
    "sphinxcontrib-tikz",
    "pygments",
]

# Retrieve installed versions
installed_versions = {}
for pkg in packages:
    try:
        installed_versions[pkg] = pkg_resources.get_distribution(pkg).version
    except pkg_resources.DistributionNotFound:
        installed_versions[pkg] = "Not installed"

for pkg, version in installed_versions.items():
    print(f"{pkg}: {version}")
