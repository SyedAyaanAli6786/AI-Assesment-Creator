# Agentic Workflow Design: Syllabus-to-Assignment Pipeline

## 1. Problem Statement
**Target User:** Teachers and Educators.
**Pain Point:** Creating customized, high-quality assessments is a time-consuming manual process. Teachers often have a raw syllabus or a loosely structured list of topics and struggle to quickly convert these into structured assignments with the correct difficulty and question types.
**Workflow Goal:** Automate the conversion of unstructured syllabus text into a ready-to-deploy assessment. The system must autonomously plan the assessment structure, dynamically generate questions based on the subject, deterministically validate the output, and require human (teacher) approval before injecting it into the application database.
**Expected Output:** A validated, teacher-approved JSON payload containing the assessment configuration and generated questions, successfully sent to the application backend.

## 2. Workflow Breakdown & Logic
Our workflow employs a mix of AI reasoning and deterministic control logic:

1. **Trigger (Webhook):** Receives raw text/syllabus from the user.
2. **AI Extractor (Information Extraction):** An AI node that reads the raw text and extracts structured JSON: `subject`, `topics`, `difficulty`, and `requested_question_count`.
3. **Deterministic Router (Switch Node):** Routes the workflow based on the `subject` (e.g., Science vs. Humanities) to apply subject-specific generation rules.
4. **AI Generator (Task Execution):** A specialized AI node that generates the exact questions and answers based on the routed subject constraints. Outputs structured JSON.
5. **Deterministic Validator (Code Node):** A JavaScript step that counts the generated questions. If the count does not match the `requested_question_count`, it triggers a fallback.
6. **Human-in-the-Loop (Wait Node & Email/Slack):** The workflow pauses and presents the generated questions to the teacher via an actionable link.
7. **Action Node (HTTP Request):** Upon teacher approval, the workflow deterministically executes a POST request to the backend API (`/api/assignments`) to save the assessment to the database.

## 3. Agentic Practices Demonstrated
- **Role Definition:** Separate AI nodes for planning/extracting vs. generating.
- **Structured Outputs:** AI nodes are constrained to output strict JSON schemas.
- **Routing:** Switch node determines the execution path based on AI output.
- **Validation & Fallback:** Deterministic code checks AI accuracy (counting questions) before proceeding.
- **Human-in-the-loop:** The workflow pauses for human consent before making destructive or state-changing actions (database injection).

## 4. Individual Contribution Note
*(If applicable, insert your specific contributions here. E.g., "I designed the AI routing logic and implemented the deterministic validation node to ensure the AI did not hallucinate extra questions.")*
