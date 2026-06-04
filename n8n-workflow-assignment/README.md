# Agentic Workflow Design: Syllabus-to-Assignment Pipeline

## 1. Problem Statement
**Target User:** Teachers and Educators.
**Pain Point:** Creating customized, high-quality assessments is a time-consuming manual process. Teachers often have a raw syllabus or a loosely structured list of topics and struggle to quickly convert these into structured assignments with the correct difficulty and question types.
**Workflow Goal:** Automate the conversion of unstructured syllabus text into a ready-to-deploy assessment. The system must autonomously plan the assessment structure, dynamically generate questions based on the subject, and use deterministic routing to ensure the right subject logic is applied.
**Expected Output:** A teacher-facing chat interface that takes raw input and instantly outputs a perfectly formatted quiz.

## 2. Workflow Breakdown & Logic
Our workflow employs a mix of AI reasoning and deterministic control logic, moving beyond a simple chatbot into a multi-agent pipeline:

1. **Trigger (Chat Interface):** An interactive UI node that receives the raw text/syllabus from the teacher.
2. **AI Planner (Information Extraction):** A `Basic LLM Chain` node connected to a `Structured Output Parser`. This AI acts as a planner. It reads the raw text and extracts structured JSON containing the `subject`, `summary`, and `question_count`.
3. **Deterministic Router (Switch Node):** A standard logic gate that routes the workflow based on the AI's output (e.g., checking if the extracted `subject` contains "Science" or "Math") to apply subject-specific generation rules.
4. **AI Generator (Task Execution):** A second, specialized AI node that takes the strictly routed variables and generates the exact quiz questions and answers based on those constraints.
5. **Tool Integration (HTTP Request):** After generation, an HTTP POST request is made to push the finalized quiz payload to the backend database, proving tool usage and system integration.

## 3. Agentic Practices Demonstrated
- **Role Definition:** Separate AI nodes are used for different tasks (one AI solely for extracting/planning, another AI solely for generating).
- **Structured Outputs:** The Planner AI is strictly constrained to output JSON schemas (`subject`, `summary`, `question_count`) rather than free text.
- **Routing & Deterministic Control:** A Switch node deterministically determines the execution path based on the AI's JSON output, proving the combination of AI and traditional control logic.
- **Dynamic Variable Injection:** The Generator AI dynamically consumes the structured variables extracted by the Planner AI.
- **Tool & Integration Usage:** The workflow concludes with an HTTP Request node, demonstrating how the agentic pipeline pushes data into external systems (database) rather than just acting as a conversational bot.
