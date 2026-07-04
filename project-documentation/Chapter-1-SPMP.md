<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chapter 1: Software Project Management Plan (SPMP)</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Georgia', 'Times New Roman', serif;
            line-height: 1.6;
            color: #2c3e50;
            background: #f5f5f5;
            padding: 20px;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            padding: 40px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        header {
            text-align: center;
            margin-bottom: 40px;
            padding-bottom: 20px;
            border-bottom: 3px solid #3498db;
        }

        h1 {
            font-size: 2.5em;
            color: #2c3e50;
            margin-bottom: 10px;
        }

        .doc-info {
            color: #7f8c8d;
            font-size: 1.1em;
        }

        h2 {
            font-size: 2em;
            color: #2c3e50;
            margin-top: 40px;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid #3498db;
            page-break-after: avoid;
        }

        h3 {
            font-size: 1.5em;
            color: #34495e;
            margin-top: 30px;
            margin-bottom: 15px;
            page-break-after: avoid;
        }

        h4 {
            font-size: 1.2em;
            color: #34495e;
            margin-top: 20px;
            margin-bottom: 10px;
        }

        p {
            margin-bottom: 15px;
            text-align: justify;
        }

        ul, ol {
            margin-left: 30px;
            margin-bottom: 15px;
        }

        li {
            margin-bottom: 8px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            page-break-inside: avoid;
        }

        th {
            background-color: #3498db;
            color: white;
            padding: 12px;
            text-align: left;
            font-weight: bold;
        }

        td {
            padding: 10px;
            border: 1px solid #ddd;
        }

        tr:nth-child(even) {
            background-color: #f8f9fa;
        }

        .box {
            background: #ecf0f1;
            border-left: 4px solid #3498db;
            padding: 15px;
            margin: 20px 0;
            page-break-inside: avoid;
        }

        .page-break {
            page-break-after: always;
        }

        @media print {
            body {
                background: white;
                padding: 0;
            }

            .container {
                box-shadow: none;
                padding: 20px;
            }

            h2 {
                page-break-after: avoid;
            }

            table, .box {
                page-break-inside: avoid;
            }
        }
    </style>
</head>

<body>
    <div class="container">
        <header>
            <h1>Software Project Management Plan (SPMP)</h1>
            <div class="doc-info">
                Fault Prediction System<br>
                Version 1.1 | February 5, 2026
            </div>
        </header>

            

           

            <div class="page-break"></div>

            <h2 id="introduction">1. INTRODUCTION</h2>

            <h3 id="project-overview">1.1 Project Overview</h3>
            <p>The <strong>Fault Prediction System</strong> is a web-based platform that analyzes software repositories and predicts fault-prone modules using machine learning. The system integrates a React/TypeScript frontend with a Python/Flask backend, persists analytics in SQLite, and connects to GitHub to retrieve code and commit history. Core functions include code metric extraction (Cyclomatic Complexity, Halstead Metrics, Maintainability Index), fault prediction, test prioritization recommendations, and visualization dashboards.</p>

            <p><strong>System Analysis Summary:</strong></p>
            <ul>
                <li><strong>Frontend:</strong> React + TypeScript with Vite, Tailwind CSS, Radix UI, and reusable UI components for dashboards and reports.</li>
                <li><strong>Backend:</strong> Flask REST API with authentication, repository analysis, metrics computation, prediction services, and database operations.</li>
                <li><strong>Machine Learning:</strong> Feature extraction and prediction pipeline using scikit-learn with persisted model artifacts.</li>
                <li><strong>Data Layer:</strong> SQLite database containing users, repositories, metrics, predictions, bugs, tests, and settings.</li>
                <li><strong>Integrations:</strong> GitHub REST API for repository access and metadata.</li>
            </ul>

            <h3 id="project-deliverables">1.2 Project Deliverables</h3>
            <ol>
                <li>Frontend application (React/TypeScript) with dashboards, analytics, and management pages</li>
                <li>Backend REST API service (Flask) providing analysis and prediction endpoints</li>
                <li>Machine learning pipeline for fault prediction (training + inference)</li>
                <li>SQLite database schema and migration scripts</li>
                <li>GitHub integration service for repository ingestion</li>
                <li>User authentication and role-based access control</li>
                <li>Project documentation set: SRS, SDD, SPMP, and Testing documents</li>
            </ol>

            <div class="page-break"></div>

            <h2 id="project-organization">2. PROJECT ORGANIZATION</h2>

            <h3 id="software-process-model">2.1 Software Process Model</h3>
            <p><strong>Model:</strong> Iterative Incremental lifecycle with Agile practices.</p>
            <p><strong>Justification (IEEE-1058 aligned):</strong> The system contains parallel streams (frontend UI, backend services, ML pipeline). Iterative development reduces risk by delivering working increments, validating ML performance early, and enabling continuous integration across components.</p>

            <h3 id="roles-responsibilities">2.2 Roles and Responsibilities</h3>
            <table>
                <thead>
                    <tr>
                        <th>Role</th>
                        <th>Primary Responsibilities</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Project Manager</td>
                        <td>Planning, scope control, progress tracking, risk management, stakeholder reporting</td>
                    </tr>
                    <tr>
                        <td>Frontend Developer</td>
                        <td>UI/UX implementation, dashboard visualizations, client-side integration</td>
                    </tr>
                    <tr>
                        <td>Backend Developer</td>
                        <td>API development, database logic, authentication, GitHub integration</td>
                    </tr>
                    <tr>
                        <td>ML Engineer</td>
                        <td>Feature engineering, model training, inference integration, performance tuning</td>
                    </tr>
                    <tr>
                        <td>QA Engineer</td>
                        <td>Test planning, test execution, defect logging, regression verification</td>
                    </tr>
                    <tr>
                        <td>Technical Writer</td>
                        <td>Documentation updates, formatting, standards compliance</td>
                    </tr>
                </tbody>
            </table>

            <h3 id="tools-techniques">2.3 Tools and Techniques</h3>
            <table>
                <thead>
                    <tr>
                        <th>Category</th>
                        <th>Tools/Techniques</th>
                        <th>Purpose</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Frontend</td>
                        <td>React, TypeScript, Vite, Tailwind CSS, Radix UI</td>
                        <td>UI construction, styling, and responsive layout</td>
                    </tr>
                    <tr>
                        <td>Backend</td>
                        <td>Flask, SQLAlchemy, Flask-CORS</td>
                        <td>REST API, persistence, cross-origin access</td>
                    </tr>
                    <tr>
                        <td>Machine Learning</td>
                        <td>scikit-learn, Pandas, NumPy</td>
                        <td>Training, feature processing, inference</td>
                    </tr>
                    <tr>
                        <td>Code Analysis</td>
                        <td>Radon, Lizard</td>
                        <td>Complexity and static metric computation</td>
                    </tr>
                    <tr>
                        <td>Repository Access</td>
                        <td>Git, PyGithub</td>
                        <td>Repository cloning and metadata retrieval</td>
                    </tr>
                    <tr>
                        <td>Testing</td>
                        <td>PyTest, Vitest, Postman</td>
                        <td>Unit, integration, and API validation</td>
                    </tr>
                    <tr>
                        <td>Project Management</td>
                        <td>ProjectLibre (optional), GitHub Issues</td>
                        <td>Planning, progress tracking, task management</td>
                    </tr>
                </tbody>
            </table>

            <div class="page-break"></div>

            <h2 id="project-management-plan">3. PROJECT MANAGEMENT PLAN</h2>

            <h3 id="tasks">3.1 Tasks</h3>
            <table>
                <thead>
                    <tr>
                        <th>Task</th>
                        <th>Description</th>
                        <th>Deliverables / Milestones</th>
                        <th>Resources Needed</th>
                        <th>Dependencies / Constraints</th>
                        <th>Risks & Contingencies</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>3.1.1 Requirements & Planning</td>
                        <td>Confirm scope, analyze frontend/backend baseline, and finalize requirements and constraints.</td>
                        <td>Updated SRS and SPMP; baseline system analysis summary.</td>
                        <td>Project Manager, Technical Writer</td>
                        <td>Existing frontend and backend codebase.</td>
                        <td>Risk: Missing requirements. Contingency: stakeholder walkthrough and approval checkpoints.</td>
                    </tr>
                    <tr>
                        <td>3.1.2 System Design Alignment</td>
                        <td>Align architecture, database schema, and integration interfaces to current implementation.</td>
                        <td>Updated SDD with verified architecture and ER diagrams.</td>
                        <td>Backend Developer, ML Engineer</td>
                        <td>Database models and API endpoints.</td>
                        <td>Risk: Schema mismatch. Contingency: schema review and migration update.</td>
                    </tr>
                    <tr>
                        <td>3.1.3 Backend Stabilization</td>
                        <td>Finalize API routes, authentication, GitHub integration, and code analysis pipeline.</td>
                        <td>Stable REST API with documented endpoints.</td>
                        <td>Backend Developer</td>
                        <td>GitHub API rate limits, authentication tokens.</td>
                        <td>Risk: API throttling. Contingency: caching and retry backoff.</td>
                    </tr>
                    <tr>
                        <td>3.1.4 ML Model Validation & Integration</td>
                        <td>Validate model performance and integrate inference into the backend.</td>
                        <td>Trained model artifact and prediction service.</td>
                        <td>ML Engineer</td>
                        <td>Feature consistency between training and inference.</td>
                        <td>Risk: Low accuracy. Contingency: tuning, fallback heuristic scoring.</td>
                    </tr>
                    <tr>
                        <td>3.1.5 Frontend Integration</td>
                        <td>Integrate API responses with dashboard pages, metrics charts, and recommendations UI.</td>
                        <td>Connected UI for metrics, predictions, bugs, tests.</td>
                        <td>Frontend Developer</td>
                        <td>Stable backend API and authentication flow.</td>
                        <td>Risk: API contract changes. Contingency: API versioning and mock services.</td>
                    </tr>
                    <tr>
                        <td>3.1.6 System Testing & Quality Assurance</td>
                        <td>Perform unit, integration, and end-to-end tests across the full stack.</td>
                        <td>Test reports, defect logs, and fixes.</td>
                        <td>QA Engineer, Developers</td>
                        <td>Integrated builds and test environments.</td>
                        <td>Risk: Late defect discovery. Contingency: continuous testing during integration.</td>
                    </tr>
                    <tr>
                        <td>3.1.7 Documentation & Submission</td>
                        <td>Finalize SPMP, SRS, SDD, and testing documentation aligned to IEEE standards.</td>
                        <td>Final documentation set and PDF exports.</td>
                        <td>Technical Writer, Project Manager</td>
                        <td>Completed system analysis and test results.</td>
                        <td>Risk: Documentation gaps. Contingency: review checklist against IEEE-1058.</td>
                    </tr>
                </tbody>
            </table>

            <h3 id="assignments">3.2 Assignments</h3>
            <table>
                <thead>
                    <tr>
                        <th>Task</th>
                        <th>Primary Owner</th>
                        <th>Supporting Roles</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Requirements & Planning</td>
                        <td>Project Manager</td>
                        <td>Technical Writer</td>
                    </tr>
                    <tr>
                        <td>Design Alignment</td>
                        <td>Backend Developer</td>
                        <td>ML Engineer</td>
                    </tr>
                    <tr>
                        <td>Backend Stabilization</td>
                        <td>Backend Developer</td>
                        <td>Project Manager</td>
                    </tr>
                    <tr>
                        <td>ML Validation & Integration</td>
                        <td>ML Engineer</td>
                        <td>Backend Developer</td>
                    </tr>
                    <tr>
                        <td>Frontend Integration</td>
                        <td>Frontend Developer</td>
                        <td>Backend Developer</td>
                    </tr>
                    <tr>
                        <td>Testing & QA</td>
                        <td>QA Engineer</td>
                        <td>All Developers</td>
                    </tr>
                    <tr>
                        <td>Documentation</td>
                        <td>Technical Writer</td>
                        <td>Project Manager</td>
                    </tr>
                </tbody>
            </table>

            <h3 id="timetable">3.3 Timetable</h3>
            <p>Detailed Gantt chart is available separately and is not repeated here as requested. The schedule below summarizes phases and milestone windows.</p>

            <table>
                <thead>
                    <tr>
                        <th>Phase</th>
                        <th>Duration</th>
                        <th>Milestone Output</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Requirements & Planning</td>
                        <td>1 week</td>
                        <td>Approved SPMP/SRS</td>
                    </tr>
                    <tr>
                        <td>Design Alignment</td>
                        <td>1 week</td>
                        <td>Updated SDD</td>
                    </tr>
                    <tr>
                        <td>Implementation Stabilization</td>
                        <td>3 weeks</td>
                        <td>Stable Backend + Frontend Integration</td>
                    </tr>
                    <tr>
                        <td>ML Validation</td>
                        <td>1 week</td>
                        <td>Validated Model + Inference</td>
                    </tr>
                    <tr>
                        <td>Testing & QA</td>
                        <td>2 weeks</td>
                        <td>Test Reports + Fixes</td>
                    </tr>
                    <tr>
                        <td>Documentation & Submission</td>
                        <td>1 week</td>
                        <td>Final Documentation Pack</td>
                    </tr>
                </tbody>
            </table>

            <div class="page-break"></div>

            <h2 id="additional-material">4. ADDITIONAL MATERIAL</h2>
            <ul>
                <li><strong>Open Source PM Tools:</strong> ProjectLibre (http://www.projectlibre.org/) or GitHub Issues may be used for task tracking.</li>
                <li><strong>IEEE Standards:</strong> IEEE-1058 (Software Project Management Plans) and IEEE-1540 (Software Risk Management).</li>
                <li><strong>Notes:</strong> Gantt chart is maintained separately and not duplicated in this document.</li>
            </ul>

        <hr style="margin: 40px 0; border: none; border-top: 2px solid #3498db;">

        <footer style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd;">
            <p><strong>End of Chapter 1 - Software Project Management Plan</strong></p>
            <p style="color: #7f8c8d;">Fault Prediction System | Version 1.1 | February 5, 2026</p>
        </footer>
    </div>

</body>
</html>
        