# Graph Report - TaiXiuCaNhan  (2026-06-01)

## Corpus Check
- 293 files · ~115,154 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1849 nodes · 5745 edges · 130 communities (118 shown, 12 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 7 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f375d0d1`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 42|Community 42]]
- [[_COMMUNITY_Community 43|Community 43]]
- [[_COMMUNITY_Community 44|Community 44]]
- [[_COMMUNITY_Community 45|Community 45]]
- [[_COMMUNITY_Community 46|Community 46]]
- [[_COMMUNITY_Community 47|Community 47]]
- [[_COMMUNITY_Community 48|Community 48]]
- [[_COMMUNITY_Community 49|Community 49]]
- [[_COMMUNITY_Community 50|Community 50]]
- [[_COMMUNITY_Community 51|Community 51]]
- [[_COMMUNITY_Community 52|Community 52]]
- [[_COMMUNITY_Community 53|Community 53]]
- [[_COMMUNITY_Community 54|Community 54]]
- [[_COMMUNITY_Community 55|Community 55]]
- [[_COMMUNITY_Community 56|Community 56]]
- [[_COMMUNITY_Community 57|Community 57]]
- [[_COMMUNITY_Community 73|Community 73]]
- [[_COMMUNITY_Community 74|Community 74]]
- [[_COMMUNITY_Community 76|Community 76]]
- [[_COMMUNITY_Community 78|Community 78]]
- [[_COMMUNITY_Community 79|Community 79]]
- [[_COMMUNITY_Community 82|Community 82]]
- [[_COMMUNITY_Community 83|Community 83]]
- [[_COMMUNITY_Community 84|Community 84]]
- [[_COMMUNITY_Community 85|Community 85]]
- [[_COMMUNITY_Community 86|Community 86]]
- [[_COMMUNITY_Community 87|Community 87]]
- [[_COMMUNITY_Community 88|Community 88]]
- [[_COMMUNITY_Community 90|Community 90]]
- [[_COMMUNITY_Community 98|Community 98]]
- [[_COMMUNITY_Community 99|Community 99]]
- [[_COMMUNITY_Community 105|Community 105]]
- [[_COMMUNITY_Community 106|Community 106]]
- [[_COMMUNITY_Community 107|Community 107]]
- [[_COMMUNITY_Community 108|Community 108]]
- [[_COMMUNITY_Community 109|Community 109]]
- [[_COMMUNITY_Community 110|Community 110]]
- [[_COMMUNITY_Community 111|Community 111]]
- [[_COMMUNITY_Community 112|Community 112]]
- [[_COMMUNITY_Community 113|Community 113]]
- [[_COMMUNITY_Community 114|Community 114]]
- [[_COMMUNITY_Community 115|Community 115]]
- [[_COMMUNITY_Community 116|Community 116]]
- [[_COMMUNITY_Community 117|Community 117]]
- [[_COMMUNITY_Community 118|Community 118]]
- [[_COMMUNITY_Community 119|Community 119]]
- [[_COMMUNITY_Community 120|Community 120]]
- [[_COMMUNITY_Community 121|Community 121]]
- [[_COMMUNITY_Community 122|Community 122]]
- [[_COMMUNITY_Community 123|Community 123]]
- [[_COMMUNITY_Community 124|Community 124]]
- [[_COMMUNITY_Community 125|Community 125]]
- [[_COMMUNITY_Community 126|Community 126]]
- [[_COMMUNITY_Community 127|Community 127]]
- [[_COMMUNITY_Community 128|Community 128]]
- [[_COMMUNITY_Community 129|Community 129]]

## God Nodes (most connected - your core abstractions)
1. `useLanguage()` - 167 edges
2. `getDbConnection()` - 116 edges
3. `Wallet` - 61 edges
4. `useToast()` - 49 edges
5. `useCurrency()` - 44 edges
6. `AppRepositories` - 42 edges
7. `Transaction` - 40 edges
8. `ROUTES` - 36 edges
9. `AccountType` - 35 edges
10. `ITransactionRepository` - 34 edges

## Surprising Connections (you probably didn't know these)
- `addLoanPayment()` --calls--> `runInTransaction()`  [INFERRED]
  src/modules/loans/services/add-loan-payment.ts → src/core/db/sqlite/transaction.ts
- `createLoan()` --calls--> `runInTransaction()`  [INFERRED]
  src/modules/loans/services/create-loan.ts → src/core/db/sqlite/transaction.ts
- `exportToPdf()` --calls--> `formatDate()`  [INFERRED]
  src/modules/export/services/export-pdf.ts → src/modules/loans/components/LoanCard.tsx
- `CancelLoanDeps` --references--> `ILoanRepository`  [EXTRACTED]
  src/modules/loans/services/cancel-loan.ts → src/modules/loans/repositories/loan.repository.ts
- `MainLayout()` --calls--> `useConfirm()`  [EXTRACTED]
  src/app/layouts/MainLayout.tsx → src/shared/components/ConfirmDialog/ConfirmContext.tsx

## Import Cycles
- 2-file cycle: `src/core/telemetry/error-log.repository.ts -> src/core/telemetry/logger.ts -> src/core/telemetry/error-log.repository.ts`
- 3-file cycle: `src/core/db/sqlite/connection.ts -> src/core/telemetry/logger.ts -> src/core/telemetry/error-log.repository.ts -> src/core/db/sqlite/connection.ts`

## Communities (130 total, 12 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.06
Nodes (51): AdvancedTransactionFilterSheet(), endOfLocalDay(), inputStyle, labelStyle, Props, startOfLocalDay(), toDateInputValue(), CategoryForm() (+43 more)

### Community 1 - "Community 1"
Cohesion: 0.29
Nodes (9): CashflowSummary, CategorySummary, DateRange, PeriodSummary, ReportGranularity, WalletSummary, IReportRepository, SQLiteReportRepository (+1 more)

### Community 2 - "Community 2"
Cohesion: 0.06
Nodes (30): For --cluster-only, For git commit hook, For /graphify add, For /graphify explain, For /graphify path, For /graphify query, For native CLAUDE.md integration, For --update (incremental re-extraction) (+22 more)

### Community 3 - "Community 3"
Cohesion: 0.17
Nodes (10): mapToTransaction(), CreateTransactionInput, Transaction, TransactionFilter, UpdateTransactionInput, InMemoryTransactionRepository, matchesFilter(), SQLiteTransactionRepository (+2 more)

### Community 4 - "Community 4"
Cohesion: 0.05
Nodes (40): config, configFile, forbidOnly, fullyParallel, globalSetup, globalTeardown, globalTimeout, grep (+32 more)

### Community 5 - "Community 5"
Cohesion: 0.14
Nodes (18): BudgetAddSheet(), BudgetAlertsPanel(), Props, ACCOUNT_TYPE_ICONS, BudgetByAccountTypeSummary(), Props, STATUS_COLORS, BudgetSummaryStats() (+10 more)

### Community 6 - "Community 6"
Cohesion: 0.11
Nodes (35): BackupMetadata, BackupPayload, BackupRow, ValidationResult, importBackupJson(), readBackupFile(), LegacyRestorableBackupPayload, RestorableBackupPayload (+27 more)

### Community 7 - "Community 7"
Cohesion: 0.09
Nodes (22): compilerOptions, allowImportingTsExtensions, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+14 more)

### Community 8 - "Community 8"
Cohesion: 0.18
Nodes (15): validateCreateLoan(), validateCreateLoanPayment(), addLoanPayment(), AddLoanPaymentDeps, LoanPaymentExceedError, PAYMENT_CATEGORY, createLoan(), dateToMs() (+7 more)

### Community 9 - "Community 9"
Cohesion: 0.11
Nodes (18): Bug #10: Pixel 5 Layout and UX (iPhone X), Bug #11: Pixel 5 Layout and UX (Pixel 5), Bug #12: Pixel 5 Layout and UX (Tablet (iPad)), Bug #13: Tablet (iPad) Layout and UX (iPhone 12), Bug #14: Tablet (iPad) Layout and UX (iPhone X), Bug #15: Tablet (iPad) Layout and UX (Pixel 5), Bug #16: Tablet (iPad) Layout and UX (Tablet (iPad)), Bug #1: iPhone 12 Layout and UX (iPhone 12) (+10 more)

### Community 10 - "Community 10"
Cohesion: 0.10
Nodes (8): explainReportQueries(), generateId(), SQLiteBudgetRepository, SQLiteWalletRepository, getDbConnection(), countCategories(), getSchemaVersion(), listTables()

### Community 11 - "Community 11"
Cohesion: 0.39
Nodes (6): persistWeb(), ensureWebStoreInitialized(), initDatabaseConnection(), applyPragmas(), PRAGMAS, sqlite

### Community 12 - "Community 12"
Cohesion: 0.14
Nodes (13): 1. Local Backup & Restore, 2. Human-Readable Exports, 3. Portability Limitations, Android Sync & Build, Current Implemented Scope, Data Portability (Phase 6), Expense Tracker App, Final Quality Assurance (Phase 6 Hardening) (+5 more)

### Community 13 - "Community 13"
Cohesion: 0.07
Nodes (42): BudgetProgressCard(), Props, Props, Props, STATUS_COLORS, formatDaysDiff(), Props, RecurringBillReminderBanner() (+34 more)

### Community 14 - "Community 14"
Cohesion: 0.14
Nodes (13): compilerOptions, allowImportingTsExtensions, composite, isolatedModules, module, moduleResolution, noEmit, resolveJsonModule (+5 more)

### Community 15 - "Community 15"
Cohesion: 0.11
Nodes (18): Bug #10: Pixel 5 Layout and UX (iPhone X), Bug #11: Pixel 5 Layout and UX (Pixel 5), Bug #12: Pixel 5 Layout and UX (Tablet (iPad)), Bug #13: Tablet (iPad) Layout and UX (iPhone 12), Bug #14: Tablet (iPad) Layout and UX (iPhone X), Bug #15: Tablet (iPad) Layout and UX (Pixel 5), Bug #16: Tablet (iPad) Layout and UX (Tablet (iPad)), Bug #1: iPhone 12 Layout and UX (iPhone 12) (+10 more)

### Community 16 - "Community 16"
Cohesion: 0.11
Nodes (21): dependencies, cors, express, description, devDependencies, ts-node-dev, @types/cors, @types/express (+13 more)

### Community 17 - "Community 17"
Cohesion: 0.09
Nodes (23): devDependencies, autoprefixer, @capacitor/cli, copyfiles, eslint, eslint-plugin-react-hooks, eslint-plugin-react-refresh, jsdom (+15 more)

### Community 18 - "Community 18"
Cohesion: 0.09
Nodes (21): compilerOptions, allowImportingTsExtensions, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+13 more)

### Community 19 - "Community 19"
Cohesion: 0.10
Nodes (20): dependencies, @capacitor/android, @capacitor/app, @capacitor/camera, @capacitor-community/sqlite, @capacitor/core, @capacitor/filesystem, @capacitor/preferences (+12 more)

### Community 20 - "Community 20"
Cohesion: 0.10
Nodes (19): 1. Local Backup & Restore, 2. Human-Readable Exports, 3. Portability Limitations, Android Sync & Build, code:bash (npm install), code:bash (# On Windows PowerShell:), code:bash (npm run dev), code:bash (npm run build) (+11 more)

### Community 21 - "Community 21"
Cohesion: 0.29
Nodes (11): CreditCardStatementStatus, addDays(), addMonths(), buildDueDate(), clampedDate(), CreditCardStatementPeriod, daysInMonth(), getCreditCardStatementPeriod() (+3 more)

### Community 22 - "Community 22"
Cohesion: 0.34
Nodes (7): BiometricUnlockSettings(), CurrencySettings(), DatabaseDiagnostics(), LanguageSettings(), useLanguage(), MenuItem, SettingsPage()

### Community 23 - "Community 23"
Cohesion: 0.44
Nodes (9): addMonths(), coerceMonthDate(), DateRange, endOfMonth(), getMonthDateRange(), isCurrentMonth(), parseMonthKey(), startOfMonth() (+1 more)

### Community 24 - "Community 24"
Cohesion: 0.20
Nodes (15): DonutItem, formatPercentLabel(), makeId(), normalizeDonutData(), NormalizeDonutDataOptions, RawDonutItem, DonutCenterLabel(), DonutCenterLabelProps (+7 more)

### Community 25 - "Community 25"
Cohesion: 0.18
Nodes (12): ActivityCallback, ActivityResult, PluginCall, PluginMethod, String, PluginCall, PluginMethod, String (+4 more)

### Community 26 - "Community 26"
Cohesion: 0.13
Nodes (16): biometricAuth, biometricSubTitle, biometricTitle, appId, appName, androidBiometric, androidIsEncryption, iosBiometric (+8 more)

### Community 27 - "Community 27"
Cohesion: 0.30
Nodes (6): TransactionValidationError, AppRepositories, IWalletRepository, CreateCreditCardPaymentUseCase, DeleteTransactionUseCase, UpdateTransactionUseCase

### Community 28 - "Community 28"
Cohesion: 0.22
Nodes (11): RecurringBillList(), WalletForm(), ConfirmContext, ConfirmContextType, ConfirmOptions, useConfirm(), ConfirmDialog(), ConfirmDialogProps (+3 more)

### Community 30 - "Community 30"
Cohesion: 0.19
Nodes (12): TranslationPath, LanguageContext, LanguageContextType, LanguageProvider(), deleteTransactionUseCase, EditTransactionPage(), localizeMessage(), localizeTransactionError() (+4 more)

### Community 31 - "Community 31"
Cohesion: 0.15
Nodes (13): compilerOptions, esModuleInterop, forceConsistentCasingInFileNames, lib, module, outDir, resolveJsonModule, rootDir (+5 more)

### Community 32 - "Community 32"
Cohesion: 0.14
Nodes (13): compilerOptions, allowImportingTsExtensions, composite, isolatedModules, module, moduleResolution, noEmit, resolveJsonModule (+5 more)

### Community 33 - "Community 33"
Cohesion: 0.15
Nodes (11): Props, ReceiptCapture(), ReceiptStorageService, createUseCase, existingNoReceipt, existingWithReceipt, input, makeBaseInput() (+3 more)

### Community 34 - "Community 34"
Cohesion: 0.25
Nodes (10): ConfirmProvider(), useKeyboardSafeFocus(), AppProvider(), router, Toast(), ToastProps, ToastType, ToastContext (+2 more)

### Community 35 - "Community 35"
Cohesion: 0.18
Nodes (9): Application Architecture, Code Graph, code:mermaid (flowchart TB), code:mermaid (flowchart LR), code:mermaid (flowchart TB), code:mermaid (flowchart LR), Navigation Routes, Reports Data Flow (+1 more)

### Community 36 - "Community 36"
Cohesion: 0.36
Nodes (8): exclude, extractDocstrings, frameworks, include, languages, maxFileSize, trackCallSites, version

### Community 37 - "Community 37"
Cohesion: 0.20
Nodes (8): code:text (src/), code:ts (import { create } from 'zustand';), Current App Position, Decision, Example Pattern, Proposed Folder Shape, Shared State Strategy, When to Introduce Zustand

### Community 38 - "Community 38"
Cohesion: 0.23
Nodes (12): Props, TransactionForm(), buildTimestamp(), DateTimePicker(), detectMode(), formatDateDisplay(), formatPreview(), Props (+4 more)

### Community 39 - "Community 39"
Cohesion: 0.22
Nodes (8): compilerOptions, allowSyntheticDefaultImports, composite, module, moduleResolution, skipLibCheck, strict, include

### Community 40 - "Community 40"
Cohesion: 0.24
Nodes (11): createCreditCardPaymentUseCase, createTransactionUseCase, updateTransactionUseCase, clearStoredCreateTransactionState(), CreateTransactionFormValues, getCreateTransactionInitialValues(), getDefaultCreateTransactionValues(), getEditTransactionInitialValues() (+3 more)

### Community 41 - "Community 41"
Cohesion: 0.22
Nodes (8): compilerOptions, allowSyntheticDefaultImports, composite, module, moduleResolution, skipLibCheck, strict, include

### Community 42 - "Community 42"
Cohesion: 0.22
Nodes (9): scripts, build, dev, lint, postinstall, preview, test, test:ui (+1 more)

### Community 43 - "Community 43"
Cohesion: 0.28
Nodes (14): Props, BudgetEditForm(), Props, BudgetEditSheet(), Props, ALL_ACCOUNT_TYPES, BudgetScopePicker(), Props (+6 more)

### Community 44 - "Community 44"
Cohesion: 0.24
Nodes (4): useBudgetAnalysis(), useBudgets(), GetBudgetSettingsUseCase, ListBudgetAlertsUseCase

### Community 45 - "Community 45"
Cohesion: 0.39
Nodes (6): name, overrides, sql.js, private, type, version

### Community 46 - "Community 46"
Cohesion: 0.48
Nodes (4): MainActivity, BridgeActivity, Bundle, Override

### Community 47 - "Community 47"
Cohesion: 0.29
Nodes (5): Current State, Local SQLite Encryption, Remaining Security Work, Secret Handling, Security Notes

### Community 48 - "Community 48"
Cohesion: 0.17
Nodes (14): Budget, BudgetWithCategory, CreateBudgetDto, IBudgetRepository, CalculateBudgetProgressUseCase, BUDGET_THRESHOLDS, classifyBudgetStatus(), computeStartDate() (+6 more)

### Community 49 - "Community 49"
Cohesion: 0.48
Nodes (5): bundleVersion, _comment, minNativeVersionCodeForBundle, nativeVersionCode, nativeVersionName

### Community 52 - "Community 52"
Cohesion: 0.12
Nodes (34): documentSaver, DocumentSaverPlugin, SaveTextFileOptions, SaveTextFileResult, SaveTextFileToDownloadsOptions, AUTO_BACKUP_INTERVAL_MS, AUTO_BACKUP_INTERVALS, AUTO_BACKUP_SETTING_KEYS (+26 more)

### Community 73 - "Community 73"
Cohesion: 0.16
Nodes (20): BackButton(), BackButtonProps, CategoryList(), RecurringBillForm(), startOfLocalDay(), ROUTES, useCategories(), useTransactions() (+12 more)

### Community 76 - "Community 76"
Cohesion: 0.31
Nodes (7): code:block1 (Error: expect(locator).toBeVisible() failed), code:yaml (- main:), code:ts (63  |), Error details, Instructions, Test info, Test source

### Community 78 - "Community 78"
Cohesion: 0.18
Nodes (19): CashflowBarChart(), Props, percentChange(), Props, ReportSummaryCards(), Props, TransactionItem(), DaySummaryRow (+11 more)

### Community 79 - "Community 79"
Cohesion: 0.18
Nodes (9): ENV, installGlobalErrorLogging(), toMetadataValue(), isLogOptions(), Logger, LogOptions, normalizeError(), normalizeMetadata() (+1 more)

### Community 82 - "Community 82"
Cohesion: 0.23
Nodes (11): listTransactionsUseCase, useRecurringReminders(), TransactionSummary, useTransactionSummary(), useWalletBalances(), useWallets(), ACCOUNT_TYPE_ICON, DashboardPage() (+3 more)

### Community 83 - "Community 83"
Cohesion: 0.14
Nodes (19): BudgetCategoryItem(), Props, BudgetCategoryList(), EditableCategoryBudget, Props, SCOPE_ORDER, BudgetScopeBadge(), Props (+11 more)

### Community 84 - "Community 84"
Cohesion: 0.29
Nodes (9): CONTEXTUAL_ADD_ROUTES, ContextualAddRoute, DASHBOARD_WITH_DRAWER_BACK_ROUTES, DEFAULT_ADD_ROUTE, getContextualAddRoute(), MainLayout(), matchesRouteContext(), shouldBackToDashboardWithDrawer() (+1 more)

### Community 85 - "Community 85"
Cohesion: 0.09
Nodes (26): AuthResult, AuthService, BIOMETRIC_UNLOCK_SUPPORTED_PLATFORMS, BiometricAuthEvent, BiometricListenerPlugin, isAndroidPlatform(), isBiometricUnlockSupportedPlatform(), isNativePlatform() (+18 more)

### Community 86 - "Community 86"
Cohesion: 0.60
Nodes (3): determineSeverity(), generateReport(), PlaywrightResult

### Community 90 - "Community 90"
Cohesion: 0.17
Nodes (13): immediateTransactionRunner(), sqliteTransactionRunner(), TransactionRunner, createSQLiteRepositories(), assertCreditCardSettings(), BALANCE_ADJUSTMENT_CATEGORIES, ensureBalanceAdjustmentCategory(), generateId() (+5 more)

### Community 98 - "Community 98"
Cohesion: 0.23
Nodes (13): ACCOUNT_TYPE_ICONS, ACCOUNT_TYPES, COLOR_PRESETS, EMOJI_PRESETS, Props, StoredStatement, UseWalletsReturn, generateId() (+5 more)

### Community 99 - "Community 99"
Cohesion: 0.18
Nodes (15): ACCOUNT_TYPE_LABELS, formatDayMonth(), Props, WalletCard(), ACCOUNT_TYPE_ORDER, Props, WalletList(), CurrencyProvider() (+7 more)

### Community 105 - "Community 105"
Cohesion: 0.21
Nodes (9): BottomSheet(), Props, DropdownList(), DropdownListProps, DropdownOption, AppBackHandler, consumeAppBackButton(), handlers (+1 more)

### Community 106 - "Community 106"
Cohesion: 0.47
Nodes (5): formatDueDate(), fromDateInput(), isValidDateParts(), parseDueDate(), toDateInput()

### Community 107 - "Community 107"
Cohesion: 0.14
Nodes (13): createSampleTransactions(), validateCreateTransaction(), validateUpdateTransaction(), CreateCreditCardPaymentInput, CreateTransactionUseCase, getSourceDelta(), validateActiveWallet(), base (+5 more)

### Community 108 - "Community 108"
Cohesion: 0.12
Nodes (12): buildExportDatasetUseCase, BuildExportDatasetUseCase, exportToCsv(), csv, dataset, json, lines, mockReportRepo (+4 more)

### Community 109 - "Community 109"
Cohesion: 0.15
Nodes (16): DEFAULT_CATEGORIES, DefaultCategory, DefaultCategoryType, insertDefaultCategories(), seedDefaultData(), categoryInserts, dbError, expectExecuteContaining() (+8 more)

### Community 110 - "Community 110"
Cohesion: 0.19
Nodes (9): ErrorScreen(), ErrorScreenProps, LoadingScreen(), ACTIVITY_EVENTS, AppBootstrap(), AppBootstrapProps, GlobalErrorBoundary, GlobalErrorBoundaryProps (+1 more)

### Community 111 - "Community 111"
Cohesion: 0.20
Nodes (11): dateInputValue(), DateRangePicker(), endOfInputDate(), Props, startOfInputDate(), EXPENSE_DONUT_COLORS, INCOME_DONUT_COLORS, DateRangePreset (+3 more)

### Community 112 - "Community 112"
Cohesion: 0.16
Nodes (8): dumpReportData(), buildDateRange(), GetCashflowSummaryUseCase, GetCategorySummaryUseCase, GetPeriodSummaryUseCase, end, range, start

### Community 113 - "Community 113"
Cohesion: 0.22
Nodes (8): mapToLoan(), mapToLoanPayment(), mapToLoanWithSummary(), Loan, LoanPayment, loanRowToArray(), loanWithSummaryRowToArray(), SQLiteLoanRepository

### Community 114 - "Community 114"
Cohesion: 0.25
Nodes (13): forceAppUnlock(), resumeAppLock(), suspendAppLock(), appListeners, authServiceMock, autoBackupMock, capacitorMock, emitAppStateChange() (+5 more)

### Community 115 - "Community 115"
Cohesion: 0.18
Nodes (11): formatVnd(), PaymentForm(), PaymentFormProps, CreateLoanPaymentInput, useLoanMutations(), formatIsoDate(), formatVnd(), LoanDetailPage() (+3 more)

### Community 116 - "Community 116"
Cohesion: 0.31
Nodes (8): isDatabaseReady(), canUseLocalStorage(), ErrorLogRepository, generateId(), readPendingLogs(), writePendingLogs(), LogLevel, StructuredLogEntry

### Community 117 - "Community 117"
Cohesion: 0.23
Nodes (10): LoanForm(), LoanFormProps, TYPE_OPTIONS, CreateLoanInput, LoanType, LOAN_TYPES, useLoans(), FILTER_TABS (+2 more)

### Community 118 - "Community 118"
Cohesion: 0.15
Nodes (13): asOf, closedStatementAsOf, creditCard, firstStatement, lifecyclePeriod(), overdueAsOf, period, repo (+5 more)

### Community 119 - "Community 119"
Cohesion: 0.14
Nodes (12): createUseCase, deleteUseCase, FailingTransactionRepository, input, invalidInput, oldTx, paymentUseCase, transactionRepository (+4 more)

### Community 120 - "Community 120"
Cohesion: 0.33
Nodes (7): LoanCardProps, LoanFilter, LoanWithSummary, EMPTY_LOAN_FILTER, ILoanRepository, listLoans(), ListLoansDeps

### Community 121 - "Community 121"
Cohesion: 0.27
Nodes (5): loanListDeps, loanMutationDeps, loanServiceDeps, cancelLoan(), CancelLoanDeps

### Community 122 - "Community 122"
Cohesion: 0.50
Nodes (7): CurrencyAmountInput(), CurrencyAmountInputProps, formatAmountInput(), getFractionDigits(), normalizeAmountInput(), CURRENCIES, CurrencyCode

### Community 123 - "Community 123"
Cohesion: 0.25
Nodes (6): LoanValidationError, CreateLoanDeps, category(), generateUUIDMock, makeDeps(), wallet

### Community 124 - "Community 124"
Cohesion: 0.44
Nodes (7): applyKeyboardScrollPadding(), getKeyboardScrollContainer(), getScrollableParent(), isEditableElement(), restoreScrollPadding(), scrollElementIntoKeyboardSafeView(), ScrollPaddingState

### Community 125 - "Community 125"
Cohesion: 0.56
Nodes (7): columnExists(), executeMigrationStatement(), markMigrationDone(), MIGRATIONS, parseAddColumnStatement(), runMigrations(), splitSqlStatements()

### Community 126 - "Community 126"
Cohesion: 0.36
Nodes (7): formatDate(), formatVnd(), isOverdue(), LoanCard(), STATUS_LABELS, TYPE_LABELS, LoanStatus

### Community 127 - "Community 127"
Cohesion: 0.39
Nodes (3): Wallet, CreditCardService, CreditCardSummary

### Community 128 - "Community 128"
Cohesion: 0.50
Nodes (6): buildErrorLogExportPayload(), ErrorLogExportItem, ErrorLogExportPayload, exportErrorLogsToJson(), parseMetadata(), ErrorLogRecord

## Knowledge Gaps
- **399 isolated node(s):** `iosDatabaseLocation`, `iosIsEncryption`, `iosKeychainPrefix`, `biometricAuth`, `biometricTitle` (+394 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **12 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useLanguage()` connect `Community 22` to `Community 0`, `Community 5`, `Community 13`, `Community 24`, `Community 28`, `Community 30`, `Community 38`, `Community 40`, `Community 43`, `Community 73`, `Community 78`, `Community 82`, `Community 83`, `Community 84`, `Community 85`, `Community 98`, `Community 99`, `Community 106`, `Community 111`?**
  _High betweenness centrality (0.078) - this node is a cross-community bridge._
- **Why does `getDbConnection()` connect `Community 10` to `Community 0`, `Community 1`, `Community 3`, `Community 6`, `Community 11`, `Community 13`, `Community 33`, `Community 40`, `Community 43`, `Community 48`, `Community 52`, `Community 90`, `Community 98`, `Community 109`, `Community 112`, `Community 113`, `Community 116`, `Community 120`, `Community 125`?**
  _High betweenness centrality (0.062) - this node is a cross-community bridge._
- **Why does `Wallet` connect `Community 127` to `Community 0`, `Community 98`, `Community 99`, `Community 10`, `Community 123`, `Community 107`, `Community 13`, `Community 21`, `Community 118`, `Community 119`, `Community 90`, `Community 27`, `Community 28`, `Community 29`?**
  _High betweenness centrality (0.032) - this node is a cross-community bridge._
- **What connects `iosDatabaseLocation`, `iosIsEncryption`, `iosKeychainPrefix` to the rest of the system?**
  _399 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.06397016637980493 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.06451612903225806 - nodes in this community are weakly interconnected._
- **Should `Community 4` be split into smaller, more focused modules?**
  _Cohesion score 0.05110336817653891 - nodes in this community are weakly interconnected._