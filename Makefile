# Hanuman GPT — local development tasks
#
# These targets route through rbenv (see .ruby-version) so they use the
# project's Ruby 3.3.11 even when Homebrew Ruby is first on your PATH.
# Plain `bundle exec jekyll serve` fails in that case with
# "command not found: jekyll".

RUN := rbenv exec

.PHONY: help install serve build clean

help:
	@echo "make install  - install Ruby gems (bundle install)"
	@echo "make serve    - build + serve locally at http://127.0.0.1:4000"
	@echo "make build    - build the static site into _site/"
	@echo "make clean    - remove Jekyll build artifacts"

install:
	$(RUN) bundle install

serve: install
	$(RUN) bundle exec jekyll serve --host 127.0.0.1 --port 4000 --force_polling

build:
	$(RUN) bundle exec jekyll build

clean:
	$(RUN) bundle exec jekyll clean
