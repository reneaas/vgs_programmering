message=$1
echo $message

git add --all
git commit -m "$message"
git push

jupyter-book build --all ./
ghp-import -n -p -f _build/html