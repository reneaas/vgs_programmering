build:
	python3 update_quiz_figures.py
	jb build . --all

pdfs:
	zsh build_individual_pdfs.sh