.PHONY: help doctor up1 down1 logs1 testb1 testf1 up2 down2 logs2 testb2 testf2 up-adk down-adk logs-adk rebuild-adk

help:
	@echo "Repo-level helpers:"
	@echo "  make doctor      - run doctor in both projects"
	@echo "  make up1         - start Project 01 (content generator)"
	@echo "  make down1       - stop Project 01"
	@echo "  make logs1       - logs for Project 01"
	@echo "  make testb1      - backend tests for Project 01"
	@echo "  make testf1      - frontend tests for Project 01"
	@echo "  make up2         - start Project 02 (expense tracker)"
	@echo "  make down2       - stop Project 02"
	@echo "  make logs2       - logs for Project 02"
	@echo "  make testb2      - backend tests for Project 02"
	@echo "  make testf2      - frontend tests for Project 02"
	@echo "  make up-adk      - start adk-quickstart (frontend + backend)"
	@echo "  make down-adk    - stop adk-quickstart"
	@echo "  make logs-adk    - tail logs for adk-quickstart"
	@echo "  make rebuild-adk - rebuild adk-quickstart images"

doctor:
	@$(MAKE) -C project-01-content-generator doctor
	@$(MAKE) -C project-02-expense-tracker doctor

up1:
	@$(MAKE) -C project-01-content-generator up

down1:
	@$(MAKE) -C project-01-content-generator down

logs1:
	@$(MAKE) -C project-01-content-generator logs

testb1:
	@$(MAKE) -C project-01-content-generator test-backend

testf1:
	@$(MAKE) -C project-01-content-generator test-frontend

up2:
	@$(MAKE) -C project-02-expense-tracker up

down2:
	@$(MAKE) -C project-02-expense-tracker down

logs2:
	@$(MAKE) -C project-02-expense-tracker logs

testb2:
	@$(MAKE) -C project-02-expense-tracker test-backend

testf2:
	@$(MAKE) -C project-02-expense-tracker test-frontend

up-adk:
	@$(MAKE) -C adk-quickstart up

down-adk:
	@$(MAKE) -C adk-quickstart stop

logs-adk:
	@$(MAKE) -C adk-quickstart logs

rebuild-adk:
	@$(MAKE) -C adk-quickstart rebuild
