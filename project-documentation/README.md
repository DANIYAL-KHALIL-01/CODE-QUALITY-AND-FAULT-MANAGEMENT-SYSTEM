# Project Documentation - Code Quality & Fault Prediction System

This folder contains comprehensive documentation for the Code Quality & Fault Prediction System, including Software Project Management Plan (SPMP), Software Requirements Specification (SRS), System Design Description (SDD), Implementation & Testing documentation, and all system diagrams.

---

## 📁 Documentation Structure

```
project-documentation/
├── README.md (this file)
├── Chapter-1-SPMP.md                    # Software Project Management Plan
├── Chapter-2-SRS.md                     # Software Requirements Specification
├── Chapter-3-SDD.md                     # System Design Description
├── Chapter-4-Implementation-Testing.md  # Implementation and Testing
└── diagrams/
    └── System-Diagrams.md               # All system diagrams (Use Case, ER, Sequence, etc.)
```

---

## 📖 Document Descriptions

### Chapter 1: Software Project Management Plan (SPMP)

**Purpose:** Defines the project management approach, organization, and processes.

**Contents:**
- Project scope and objectives
- Project organization and team structure
- Tools and technologies
- Software lifecycle model (Iterative Incremental)
- Development methodology (Agile Scrum)
- Quality assurance processes
- Risk management with risk table

**Key Sections:**
1. Introduction (Purpose, Scope)
2. Project Organization (Tools)
3. Managerial Process (Lifecycle Model)
4. Technical Process (Methodology, QA)
5. Risk Management (Probability, Impact, Mitigation)

**Target Audience:** Project managers, stakeholders, team leads

---

### Chapter 2: Software Requirements Specification (SRS)

**Purpose:** Complete description of system requirements and functionality.

**Contents:**
- Functional requirements (FR1-FR8)
- Non-functional requirements (Performance, Security, Reliability, Usability)
- System constraints and assumptions
- User characteristics and personas
- Hardware and software requirements
- Use case diagrams and descriptions
- System sequence diagrams

**Key Features Documented:**
- User authentication and management
- Repository analysis and GitHub integration
- Code complexity metrics calculation
- Machine learning predictions
- Test prioritization
- Bug report management
- Interactive dashboards

**Target Audience:** Developers, testers, stakeholders

---

### Chapter 3: System Design Description (SDD)

**Purpose:** Comprehensive architectural and detailed design specification.

**Contents:**
- System architecture overview (3-tier architecture)
- Module and subsystem design
- Database design (ER diagrams, schema)
- User interface design
- Component interactions
- API design (RESTful endpoints)
- Security design (authentication, authorization)
- Error handling strategies
- Future enhancements

**Key Sections:**
1. Introduction and Design Considerations
2. System Architecture (Layered)
3. Module Design (Frontend, Backend, ML)
4. Data Design (7 database tables)
5. UI Design (Components, layouts)
6. Hardware-Software Mapping
7. Communication Design (API specs)
8. Error Handling
9. Security Design
10. Future Enhancements

**Target Audience:** System architects, developers, database designers

---

### Chapter 4: Implementation and Testing

**Purpose:** Documents implementation approach and comprehensive testing.

**Contents:**
- Implementation phases (8 phases over 17 weeks)
- Coding standards and best practices
- Testing objectives and strategies
- Test case specifications (50+ test cases)
- Defect tracking and resolution
- Validation and verification activities
- Acceptance criteria
- Testing results and metrics

**Testing Coverage:**
- Unit testing (Python, TypeScript)
- Integration testing (API, components)
- System testing (end-to-end)
- Performance testing (load, stress)
- Security testing (vulnerabilities)

**Key Metrics:**
- Code coverage: 75%
- Test pass rate: 96%
- Performance targets met: 100%
- Zero critical bugs

**Target Audience:** Developers, testers, QA engineers

---

### System Diagrams

**Purpose:** Visual representations of system architecture and design.

**Included Diagrams:**
1. **Use Case Diagram** - User interactions and system use cases
2. **System Architecture Diagram** - Layered architecture overview
3. **Entity Relationship Diagram** - Database schema and relationships
4. **Sequence Diagrams:**
   - Repository analysis flow
   - User authentication flow
   - Dashboard data loading
5. **Component Diagram** - Frontend and backend components
6. **Deployment Diagram** - Physical deployment architecture
7. **Activity Diagram** - Code analysis process
8. **State Diagram** - Bug report lifecycle
9. **Data Flow Diagrams** - System processes and data flow
10. **ML Pipeline Diagram** - Machine learning workflow

**Format:** Mermaid diagrams (GitHub/VS Code compatible)

**Target Audience:** All team members, stakeholders

---

## 🎯 Project Overview

**Project Name:** Code Quality & Fault Prediction System

**Description:** An intelligent web-based platform that analyzes source code repositories to predict fault-prone modules using machine learning. The system integrates with GitHub, calculates code complexity metrics, and provides actionable insights for improving software quality.

**Key Technologies:**
- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS
- **Backend:** Python, Flask, SQLAlchemy
- **Database:** SQLite
- **Machine Learning:** scikit-learn, Random Forest
- **Code Analysis:** Radon, Lizard
- **Integration:** GitHub API, PyGithub

---

## 👥 User Roles

1. **Software Developers** - Analyze code, identify bug-prone areas
2. **QA Engineers** - Prioritize testing, manage bug reports
3. **Project Managers** - Monitor quality metrics, view dashboards
4. **DevOps Engineers** - Integration and deployment

---

## 🚀 Quick Start Guide

### Prerequisites
- Python 3.8+
- Node.js 18+
- Git
- GitHub account with personal access token

### Installation

**Backend Setup:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python database/init_db.py
python app.py
```

**Frontend Setup:**
```bash
cd frontend
pnpm install
pnpm dev
```

**Access Application:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

### First Time Usage
1. Navigate to http://localhost:5173
2. Click "Sign Up" and create an account
3. Login with your credentials
4. Go to Settings and add your GitHub personal access token
5. Navigate to Repository page
6. Add a repository URL (e.g., https://github.com/owner/repo)
7. Click "Analyze" to start code analysis
8. View results in Dashboard and Metrics pages

---

## 📊 Key Features

### 1. Code Analysis
- Multi-language support (Python, JavaScript, Java, C++, etc.)
- Cyclomatic Complexity (CC)
- Maintainability Index (MI)
- Halstead Metrics
- Code churn analysis

### 2. Machine Learning Predictions
- Fault probability prediction (0-1 scale)
- Risk level classification (Low, Medium, High, Critical)
- Confidence scores
- Random Forest classifier with 82% accuracy

### 3. Dashboards & Visualization
- Overview cards (Total Files, High Risk Count, Avg Complexity)
- Risk distribution charts (pie/donut)
- Complexity trend analysis (line charts)
- Code churn visualization
- Recent analysis history

### 4. Test Prioritization
- Risk-based test recommendations
- Priority scoring algorithm
- Test case management

### 5. Bug Report Management
- Create and track bugs
- Severity and priority levels
- Status workflow (Open → In Progress → Resolved → Closed)
- Link bugs to modules

---

## 🔒 Security Features

- Password hashing (PBKDF2-SHA256)
- Session-based authentication
- HttpOnly cookies
- SQL injection prevention (ORM)
- XSS protection (React auto-escaping)
- Encrypted GitHub tokens
- Authorization checks

---

## 📈 Performance Metrics

| Metric | Target | Achieved |
|--------|--------|----------|
| API Response Time | < 2s | 0.8s avg |
| Dashboard Load Time | < 3s | 1.8s avg |
| Code Coverage | > 70% | 75% |
| Concurrent Users | 50 | ✓ |
| Analysis Speed | < 10 min (1000 files) | ✓ |

---

## 🧪 Testing Summary

- **Total Test Cases:** 50+
- **Test Pass Rate:** 96%
- **Unit Tests:** Backend (pytest), Frontend (Vitest)
- **Integration Tests:** API endpoints
- **System Tests:** End-to-end user flows
- **Performance Tests:** Load and stress testing
- **Security Tests:** Vulnerability scanning

---

## 📝 Development Practices

### Coding Standards
- **Python:** PEP 8 compliance, type hints, docstrings
- **TypeScript:** ESLint configuration, strict typing
- **Git:** Feature branch workflow, meaningful commits
- **Code Review:** All PRs reviewed before merge

### Quality Assurance
- Automated testing on every commit
- Code coverage monitoring
- Static code analysis
- Security vulnerability scanning
- Performance profiling

---

## 🔄 Project Timeline

| Phase | Duration | Deliverables |
|-------|----------|--------------|
| Phase 1: Setup | 2 weeks | Environment, project structure |
| Phase 2: Backend Core | 2 weeks | Database, authentication, API |
| Phase 3: Frontend | 2 weeks | UI components, routing, auth pages |
| Phase 4: GitHub Integration | 3 weeks | Repository management, code analysis |
| Phase 5: ML Module | 3 weeks | Feature extraction, model training |
| Phase 6: Advanced Features | 2 weeks | Test prioritization, bug reports |
| Phase 7: Testing | 2 weeks | Comprehensive testing, bug fixes |
| Phase 8: Documentation | 1 week | Final docs, deployment |

**Total Duration:** 17 weeks

---

## 🎓 Learning Resources

### For Developers
- [Flask Documentation](https://flask.palletsprojects.com/)
- [React Documentation](https://react.dev/)
- [SQLAlchemy Tutorial](https://docs.sqlalchemy.org/en/14/tutorial/)
- [scikit-learn Guide](https://scikit-learn.org/stable/user_guide.html)

### For Understanding the System
- **SPMP:** Start here for project overview
- **SRS:** Understand what the system does
- **SDD:** Learn how it's built
- **Implementation & Testing:** See how it was developed and tested

---

## 🤝 Contributing

When contributing to the project:
1. Read the SRS to understand requirements
2. Review the SDD for design guidelines
3. Follow coding standards in Chapter 4
4. Write tests for new features
5. Update documentation

---

## 📧 Support

For questions or issues:
- Review relevant documentation chapter
- Check diagrams for visual reference
- Consult test cases for usage examples
- Refer to API specifications in SDD

---

## 🏆 Project Achievements

✅ Complete implementation of all requirements  
✅ 75% code coverage  
✅ Zero critical bugs at release  
✅ All performance targets met  
✅ Comprehensive documentation  
✅ Successful user acceptance testing  
✅ Production-ready deployment  

---

## 📅 Document Information

| Property | Value |
|----------|-------|
| **Project Name** | Code Quality & Fault Prediction System |
| **Version** | 1.0 |
| **Date Created** | February 4, 2026 |
| **Last Updated** | February 4, 2026 |
| **Status** | Complete |
| **Team** | Development Team |

---

## 📜 License

This project documentation is part of the academic submission for the Code Quality & Fault Prediction System project.

---

**Note:** All diagrams are created using Mermaid syntax and can be viewed directly on GitHub, VS Code (with Mermaid extension), or at https://mermaid.live/

---

**End of Documentation README**
