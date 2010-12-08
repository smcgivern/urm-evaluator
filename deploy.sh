#!/bin/sh
rsync -r . seanmcgivern@tombstone.org.uk:~/domains/sean.mcgivern.me.uk/urm-evaluator/ --exclude=deploy.sh --exclude=.git --exclude=test/
