message=$1

# sjekker om melding er tom, isåfall settes en default melding.
if [ -z "$message" ]
then
    message="Oppdaterte boken"
fi

git add --all
git commit -m "$message"
git push

jupyter-book build --all ./
ghp-import -n -p -f _build/html