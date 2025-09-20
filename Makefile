.PHONY: help doctor up1 down1 logs1 testb1 testf1 up2 down2 logs2 testb2 testf2 up3 down3 logs3 test3 up4 down4 logs4 test4 up-adk down-adk logs-adk rebuild-adk

help:
	@echo "Repo-level helpers:"
	@echo "  make doctor      - run doctor in projects 1, 2 & adk"
	@echo ""
	@echo "Project 01 (Content Generator):"
	@echo "  make up1         - start Project 01"
	@echo "  make down1       - stop Project 01"
	@echo "  make logs1       - logs for Project 01"
	@echo "  make testb1      - backend tests for Project 01"
	@echo "  make testf1      - frontend tests for Project 01"
	@echo ""
	@echo "Project 02 (Expense Tracker):"
	@echo "  make up2         - start Project 02"
	@echo "  make down2       - stop Project 02"
	@echo "  make logs2       - logs for Project 02"
	@echo "  make testb2      - backend tests for Project 02"
	@echo "  make testf2      - frontend tests for Project 02"
	@echo ""
	@echo "Project 03 (Task Tracker):"
	@echo "  make up3         - start Project 03"
	@echo "  make down3       - stop Project 03"
	@echo "  make logs3       - logs for Project 03"
	@echo "  make test3       - run tests for Project 03"
	@echo ""
	@echo "Project 04 (Google OAuth):"
	@echo "  make up4         - start Project 04"
	@echo "  make down4       - stop Project 04"
	@echo "  make logs4       - logs for Project 04"
	@echo "  make test4       - run tests for Project 04"
	@echo ""
	@echo "ADK Quickstart:"
	@echo "  make up-adk      - start adk-quickstart"
	@echo "  make down-adk    - stop adk-quickstart"
	@echo "  make logs-adk    - tail logs for adk-quickstart"
	@echo "  make rebuild-adk - rebuild adk-quickstart images"

doctor:
	@$(MAKE) -C project-01-content-generator doctor
	@$(MAKE) -C project-02-expense-tracker doctor
	@$(MAKE) -C adk-quickstart doctor

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

up3:
	@$(MAKE) -C project-03-task-tracker up

down3:
	@$(MAKE) -C project-03-task-tracker down

logs3:
	@$(MAKE) -C project-03-task-tracker logs

test3:
	@$(MAKE) -C project-03-task-tracker test

up4:
	@$(MAKE) -C project-04-Google-OAuth up

down4:
	@$(MAKE) -C project-04-Google-OAuth down

logs4:
	@$(MAKE) -C project-04-Google-OAuth logs

test4:
	@$(MAKE) -C project-04-Google-OAuth test

up-adk:
	@$(MAKE) -C adk-quickstart up

down-adk:
	@$(MAKE) -C adk-quickstart down

logs-adk:
	@$(MAKE) -C adk-quickstart logs

rebuild-adk:
	@$(MAKE) -C adk-quickstart rebuild
