#FILE=test/equations.md
#DIR=test/equations
#OUTS=latex-body
#IN=katex-warning-error
FILE=test/$(IN).md
DIR=test/$(IN)
OUTS=latex-body,html-body

.PHONY: test

test: $(DIR)/now/

$(DIR)/now/: $(DIR)/ref/
	@mkdir -p $(DIR)/now/
	./biedit convert '$(FILE)' -o $(DIR)/now/ -f $(OUTS)
	@rm -f $(DIR)/now/*.png
	diff $(DIR)/ref/ $(DIR)/now/

ref: $(DIR)/ref/

$(DIR)/ref/: 
	@mkdir -p $(DIR)/ref/
	./biedit convert '$(FILE)' -o $(DIR)/ref/ -f $(OUTS)
	@rm -f $(DIR)/ref/*.png

.PHONY: clean
clean:
	rm -rf $(DIR)/now/