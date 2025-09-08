# Petrol Pump Management System - Frontend

## 🚀 Project Overview

A modern, production-ready frontend application for Petrol Pump Management System built with React, TypeScript, and Tailwind CSS, following enterprise-level development guidelines.

## 📋 Project Development Guidelines Implementation

### ✅ 1. Strong Testing (MUST)

- **Testing Framework**: Vitest + React Testing Library
- **Test Types**: Unit tests, Integration tests, Component tests
- **Test Coverage**: Configured with coverage reporting
- **Commands**:
  ```bash
  npm run test          # Run tests in watch mode
  npm run test:run      # Run tests once
  npm run test:ui       # Run tests with UI
  npm run test:coverage # Run tests with coverage
  ```

### ✅ 2. Error Handling & Frontend Display

- **Structured Error Codes**: Comprehensive error code system (1000-1899)
- **Error Handler**: `ApiErrorHandler` class for consistent error processing
- **User-Friendly Messages**: Toast notifications for all user interactions
- **Error Types**:
  - Authentication Errors (1000-1099)
  - User Management Errors (1100-1199)
  - Pump Operations Errors (1200-1299)
  - Transaction Errors (1300-1399)
  - And more...

### ✅ 3. Clean & Scalable Code

- **TypeScript**: 100% TypeScript implementation
- **Modular Architecture**: Component-based architecture with clear separation
- **Linting**: ESLint + TypeScript ESLint configurations
- **Code Organization**:
  ```
  src/
  ├── components/        # Reusable UI components
  ├── contexts/         # React contexts
  ├── hooks/           # Custom React hooks
  ├── types/           # TypeScript type definitions
  ├── utils/           # Utility functions
  └── test/            # Test files
  ```

### ✅ 4. Validation & Form Handling

- **Form Validator**: Comprehensive validation system
- **Real-time Validation**: Field-level validation with immediate feedback
- **Common Rules**: Pre-defined validation rules for common fields
- **Error Display**: User-friendly error messages

### ✅ 5. Modern UI/UX

- **Tailwind CSS**: Utility-first CSS framework
- **Responsive Design**: Mobile-first responsive design
- **Toast Notifications**: Real-time user feedback system
- **Loading States**: Proper loading indicators
- **Modern Components**: Clean, professional interface

## 🏗️ Project Structure

```
frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── Auth/
│   │   │   └── PetrolPumpLogin.tsx
│   │   └── Toast/
│   │       └── ToastContainer.tsx
│   ├── contexts/
│   │   └── ToastContext.tsx
│   ├── hooks/
│   │   └── useToast.ts
│   ├── types/
│   │   └── errors.ts
│   ├── utils/
│   │   ├── errorHandler.ts
│   │   └── validation.ts
│   ├── test/
│   │   ├── setup.ts
│   │   └── validation.test.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── server/
│   └── mock-server.js
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── vitest.config.ts
└── README.md
```
