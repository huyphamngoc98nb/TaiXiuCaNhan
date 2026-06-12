# Graph Report - TaiXiuCaNhan  (2026-06-12)

## Corpus Check
- 324 files · ~119,852 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2219 nodes · 7098 edges · 129 communities (119 shown, 10 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 11 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f5de2367`
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
- [[_COMMUNITY_Community 87|Community 87]]
- [[_COMMUNITY_Community 88|Community 88]]
- [[_COMMUNITY_Community 89|Community 89]]
- [[_COMMUNITY_Community 96|Community 96]]
- [[_COMMUNITY_Community 98|Community 98]]
- [[_COMMUNITY_Community 99|Community 99]]
- [[_COMMUNITY_Community 106|Community 106]]
- [[_COMMUNITY_Community 108|Community 108]]
- [[_COMMUNITY_Community 109|Community 109]]
- [[_COMMUNITY_Community 110|Community 110]]
- [[_COMMUNITY_Community 112|Community 112]]
- [[_COMMUNITY_Community 114|Community 114]]
- [[_COMMUNITY_Community 115|Community 115]]
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
- [[_COMMUNITY_Community 131|Community 131]]
- [[_COMMUNITY_Community 132|Community 132]]
- [[_COMMUNITY_Community 137|Community 137]]
- [[_COMMUNITY_Community 141|Community 141]]
- [[_COMMUNITY_Community 143|Community 143]]
- [[_COMMUNITY_Community 144|Community 144]]
- [[_COMMUNITY_Community 146|Community 146]]

## God Nodes (most connected - your core abstractions)
1. `useLanguage()` - 180 edges
2. `getDbConnection()` - 120 edges
3. `Wallet` - 80 edges
4. `useToast()` - 55 edges
5. `getDbConnectionForTransaction()` - 48 edges
6. `ITransactionRepository` - 47 edges
7. `useCurrency()` - 46 edges
8. `Transaction` - 45 edges
9. `AppRepositories` - 44 edges
10. `IWalletRepository` - 44 edges

## Surprising Connections (you probably didn't know these)
- `addLoanPayment()` --calls--> `runInTransaction()`  [INFERRED]
  src/modules/loans/services/add-loan-payment.ts → src/core/db/sqlite/transaction.ts
- `createLoan()` --calls--> `runInTransaction()`  [INFERRED]
  src/modules/loans/services/create-loan.ts → src/core/db/sqlite/transaction.ts
- `deleteLoan()` --calls--> `runInTransaction()`  [INFERRED]
  src/modules/loans/services/delete-loan.ts → src/core/db/sqlite/transaction.ts
- `updateLoan()` --calls--> `runInTransaction()`  [INFERRED]
  src/modules/loans/services/update-loan.ts → src/core/db/sqlite/transaction.ts
- `buildImageReportPages()` --calls--> `formatDate()`  [INFERRED]
  src/modules/export/services/export-pdf.ts → src/modules/loans/components/LoanCard.tsx

## Communities (129 total, 10 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.31
Nodes (7): loanListDeps, loanMutationDeps, loanServiceDeps, emitLoanEvent(), toError(), cancelLoan(), CancelLoanDeps

### Community 1 - "Community 1"
Cohesion: 0.10
Nodes (38): DateDisplayInput(), DateDisplayInputProps, dateDisplayInputStyle, dateIconStyle, dateInputShellStyle, endOfLocalDay(), hiddenDateInputStyle, inputStyle (+30 more)

### Community 2 - "Community 2"
Cohesion: 0.10
Nodes (21): code:bash (mkdir -p graphify-out), code:bash ($(cat graphify-out/.graphify_python) -c "), code:bash ($(cat graphify-out/.graphify_python) -c "), code:bash ($(cat graphify-out/.graphify_python) -c "), code:bash ($(cat graphify-out/.graphify_python) -c "), code:bash (# Detect the correct Python interpreter (handles uv tool, pi), code:bash ($(cat graphify-out/.graphify_python) -c "), code:bash ($(cat graphify-out/.graphify_python) -c ") (+13 more)

### Community 3 - "Community 3"
Cohesion: 0.09
Nodes (22): devDependencies, autoprefixer, @capacitor/cli, copyfiles, eslint, eslint-plugin-react-hooks, eslint-plugin-react-refresh, jsdom (+14 more)

### Community 4 - "Community 4"
Cohesion: 0.06
Nodes (52): dateInputValue(), DateRangePicker(), endOfInputDate(), Props, startOfInputDate(), percentChange(), Props, ReportSummaryCards() (+44 more)

### Community 5 - "Community 5"
Cohesion: 0.05
Nodes (48): explainReportQueries(), CategoryReferenceCounts, mapCategory(), SQLiteCategoryRepository, SQLiteLoanRepository, SQLiteTransactionRepository, generateId(), mapWallet() (+40 more)

### Community 6 - "Community 6"
Cohesion: 0.11
Nodes (16): code:block1 (/graphify                                             # full), code:bash ($(cat graphify-out/.graphify_python) -c "), code:bash ($(cat graphify-out/.graphify_python) -c "), code:bash (python3 -m graphify.watch INPUT_PATH --debounce 3), code:bash (graphify hook install    # install), code:bash (graphify claude install), code:bash (graphify claude uninstall  # remove the section), For --cluster-only (+8 more)

### Community 7 - "Community 7"
Cohesion: 0.09
Nodes (22): compilerOptions, allowImportingTsExtensions, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+14 more)

### Community 8 - "Community 8"
Cohesion: 0.51
Nodes (9): addMonths(), coerceMonthDate(), DateRange, endOfMonth(), getMonthDateRange(), isCurrentMonth(), parseMonthKey(), startOfMonth() (+1 more)

### Community 9 - "Community 9"
Cohesion: 0.05
Nodes (80): BackupMetadata, BackupPayload, BackupRow, ValidationResult, documentSaver, DocumentSaverPlugin, SaveTextFileOptions, SaveTextFileResult (+72 more)

### Community 10 - "Community 10"
Cohesion: 0.29
Nodes (5): ErrorScreen(), ErrorScreenProps, GlobalErrorBoundary, GlobalErrorBoundaryProps, GlobalErrorBoundaryState

### Community 11 - "Community 11"
Cohesion: 0.10
Nodes (30): mapToTransaction(), CreateTransactionInput, Transaction, TransactionFilter, TransactionType, UpdateTransactionInput, TransactionValidationError, validateCreateTransaction() (+22 more)

### Community 12 - "Community 12"
Cohesion: 0.14
Nodes (13): 1. Local Backup & Restore, 2. Human-Readable Exports, 3. Portability Limitations, Android Sync & Build, Current Implemented Scope, Data Portability (Phase 6), Expense Tracker App, Final Quality Assurance (Phase 6 Hardening) (+5 more)

### Community 13 - "Community 13"
Cohesion: 0.28
Nodes (5): scrollPositions, useScrollRestoration(), { rerender }, scrollContainer, ScrollRestorationHarness()

### Community 14 - "Community 14"
Cohesion: 0.14
Nodes (13): compilerOptions, allowImportingTsExtensions, composite, isolatedModules, module, moduleResolution, noEmit, resolveJsonModule (+5 more)

### Community 15 - "Community 15"
Cohesion: 0.10
Nodes (20): dependencies, @capacitor/android, @capacitor/app, @capacitor/camera, @capacitor-community/sqlite, @capacitor/core, @capacitor/filesystem, @capacitor/preferences (+12 more)

### Community 16 - "Community 16"
Cohesion: 0.11
Nodes (21): dependencies, cors, express, description, devDependencies, ts-node-dev, @types/cors, @types/express (+13 more)

### Community 17 - "Community 17"
Cohesion: 0.09
Nodes (22): devDependencies, autoprefixer, @capacitor/cli, copyfiles, eslint, eslint-plugin-react-hooks, eslint-plugin-react-refresh, jsdom (+14 more)

### Community 18 - "Community 18"
Cohesion: 0.09
Nodes (22): compilerOptions, allowImportingTsExtensions, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+14 more)

### Community 19 - "Community 19"
Cohesion: 0.10
Nodes (21): dependencies, @capacitor/android, @capacitor/app, @capacitor/camera, @capacitor-community/sqlite, @capacitor/core, @capacitor/filesystem, @capacitor/preferences (+13 more)

### Community 20 - "Community 20"
Cohesion: 0.06
Nodes (39): 1. Local Backup & Restore, 2. Human-Readable Exports, 3. Portability Limitations, Android Sync & Build, Backup, restore và export, Build Android, Chạy Web, code:text (src/) (+31 more)

### Community 21 - "Community 21"
Cohesion: 0.57
Nodes (4): DatabaseDiagnostics(), countCategories(), getSchemaVersion(), listTables()

### Community 22 - "Community 22"
Cohesion: 0.50
Nodes (6): buildErrorLogExportPayload(), ErrorLogExportItem, ErrorLogExportPayload, exportErrorLogsToJson(), parseMetadata(), ErrorLogRecord

### Community 23 - "Community 23"
Cohesion: 0.16
Nodes (10): listTransactionsUseCase, summarizeTransactions(), TransactionSummary, deleteSpy, getReferenceCounts, service, transactionRepository, updateSpy (+2 more)

### Community 24 - "Community 24"
Cohesion: 0.25
Nodes (8): scripts, build, dev, lint, postinstall, preview, test, typecheck

### Community 25 - "Community 25"
Cohesion: 0.18
Nodes (12): ActivityCallback, ActivityResult, PluginCall, PluginMethod, String, PluginCall, PluginMethod, String (+4 more)

### Community 26 - "Community 26"
Cohesion: 0.13
Nodes (16): biometricAuth, biometricSubTitle, biometricTitle, appId, appName, androidBiometric, androidIsEncryption, iosBiometric (+8 more)

### Community 27 - "Community 27"
Cohesion: 0.15
Nodes (13): code:block10 (You are a graphify extraction subagent. Read the files liste), code:bash ($(cat graphify-out/.graphify_python) -c "), code:bash ($(cat graphify-out/.graphify_python) -c "), code:bash ($(cat graphify-out/.graphify_python) -c "), code:bash ($(cat graphify-out/.graphify_python) -c "), code:bash ($(cat graphify-out/.graphify_python) -c "), code:bash ($(cat graphify-out/.graphify_python) -c "), code:block8 (spawn_agent(agent_type="worker", message="Your task is to pe) (+5 more)

### Community 28 - "Community 28"
Cohesion: 0.27
Nodes (20): AppliedMigration, buildLoanSkipTransactionSql(), columnExists(), DbConnection, executeMigrationSql(), executeMigrationStatement(), getAppliedMigrations(), markMigrationDone() (+12 more)

### Community 29 - "Community 29"
Cohesion: 0.06
Nodes (47): Props, Props, STATUS_COLORS, formatDaysDiff(), Props, RecurringBillReminderBanner(), STATUS_CONFIG, getDueRemindersUseCase (+39 more)

### Community 30 - "Community 30"
Cohesion: 0.29
Nodes (6): name, overrides, sql.js, private, type, version

### Community 31 - "Community 31"
Cohesion: 0.15
Nodes (13): compilerOptions, esModuleInterop, forceConsistentCasingInFileNames, lib, module, outDir, resolveJsonModule, rootDir (+5 more)

### Community 32 - "Community 32"
Cohesion: 0.14
Nodes (13): compilerOptions, allowImportingTsExtensions, composite, isolatedModules, module, moduleResolution, noEmit, resolveJsonModule (+5 more)

### Community 33 - "Community 33"
Cohesion: 0.16
Nodes (17): category(), { deps, loanUpdateLoan }, { deps, loanUpdateLoan, transactionCreate, transactionSoftDelete }, {
      deps,
      loanUpdateLoan,
      transactionCreate,
      transactionSoftDelete,
      walletUpdateBalanceDelta,
    }, { deps, loanUpdateLoan, walletGetById }, {
      deps,
      transactionCreate,
      walletUpdateBalanceDelta,
    }, { deps, walletGetById }, existingLoan (+9 more)

### Community 34 - "Community 34"
Cohesion: 0.15
Nodes (16): BiometricUnlockSettings(), CategoryList(), CurrencySettings(), EmptyBudgetPrompt(), Props, LanguageSettings(), Language, LanguageContext (+8 more)

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
Cohesion: 0.33
Nodes (6): code:bash ($(cat graphify-out/.graphify_python) -c "), code:bash ($(cat graphify-out/.graphify_python) -c "), code:bash (if [ ! -f graphify-out/.graphify_extract.json ]; then), code:bash ($(cat graphify-out/.graphify_python) -c "), code:bash ($(cat graphify-out/.graphify_python) -c "), For --update (incremental re-extraction)

### Community 39 - "Community 39"
Cohesion: 0.22
Nodes (8): compilerOptions, allowSyntheticDefaultImports, composite, module, moduleResolution, skipLibCheck, strict, include

### Community 40 - "Community 40"
Cohesion: 0.50
Nodes (4): code:bash ($(cat graphify-out/.graphify_python) -c "), code:bash ($(cat graphify-out/.graphify_python) -c "), code:bash ($(cat graphify-out/.graphify_python) -m graphify save-result), For /graphify query

### Community 41 - "Community 41"
Cohesion: 0.22
Nodes (8): compilerOptions, allowSyntheticDefaultImports, composite, module, moduleResolution, skipLibCheck, strict, include

### Community 42 - "Community 42"
Cohesion: 0.20
Nodes (10): scripts, build, dev, generate:icons, lint, postinstall, preview, test (+2 more)

### Community 43 - "Community 43"
Cohesion: 0.50
Nodes (4): code:bash ($(cat graphify-out/.graphify_python) -c "), code:bash ($(cat graphify-out/.graphify_python) -c "), code:bash ($(cat graphify-out/.graphify_python) -m graphify save-result), For /graphify path

### Community 44 - "Community 44"
Cohesion: 0.50
Nodes (4): code:bash ($(cat graphify-out/.graphify_python) -c "), code:bash ($(cat graphify-out/.graphify_python) -c "), code:bash ($(cat graphify-out/.graphify_python) -m graphify save-result), For /graphify explain

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
Cohesion: 0.20
Nodes (10): ILoanRepository, deleteLoan(), DeleteLoanDeps, getLoanForDelete(), LoanHasPaymentsError, deps, loan(), makeRepo() (+2 more)

### Community 49 - "Community 49"
Cohesion: 0.48
Nodes (5): bundleVersion, _comment, minNativeVersionCodeForBundle, nativeVersionCode, nativeVersionName

### Community 73 - "Community 73"
Cohesion: 0.07
Nodes (24): immediateTransactionRunner(), InMemoryTransactionRepository, callOrder, cashTx, createSpy, createUseCase, creditCardTx, deleteUseCase (+16 more)

### Community 76 - "Community 76"
Cohesion: 0.22
Nodes (8): createTransaction, creditCardWallet, runTransaction(), runTransactionSpy, sourceWallet, transaction, useCase, walletRepository

### Community 78 - "Community 78"
Cohesion: 0.67
Nodes (3): code:bash (python3 -m graphify.serve graphify-out/graph.json), code:json ({), Step 7d - MCP server (only if --mcp flag)

### Community 79 - "Community 79"
Cohesion: 0.24
Nodes (15): dateInputToMs(), formatVnd(), PaymentForm(), PaymentFormProps, startOfLocalDay(), todayInputValue(), CreateLoanPaymentInput, useLoanMutations() (+7 more)

### Community 82 - "Community 82"
Cohesion: 0.67
Nodes (3): code:bash ($(cat graphify-out/.graphify_python) -c "), code:block27 (Graph complete. Outputs in PATH_TO_DIR/graphify-out/), Step 9 - Save manifest, update cost tracker, clean up, and report

### Community 83 - "Community 83"
Cohesion: 0.67
Nodes (3): code:bash ($(cat graphify-out/.graphify_python) -c "), code:block4 (Corpus: X files · ~Y words), Step 2 - Detect files

### Community 84 - "Community 84"
Cohesion: 0.09
Nodes (32): CreditCardStatementStatus, addDays(), addMonths(), buildDueDate(), clampedDate(), CreditCardService, CreditCardStatementPeriod, CreditCardSummary (+24 more)

### Community 85 - "Community 85"
Cohesion: 0.17
Nodes (11): THEME_OPTIONS, ThemeSelector(), getStoredThemePreference(), isThemePreference(), ResolvedTheme, THEME_COLOR, ThemeContext, ThemeContextType (+3 more)

### Community 87 - "Community 87"
Cohesion: 0.44
Nodes (8): mapBooleanFlag(), mapToLoan(), mapToLoanPayment(), mapToLoanWithSummary(), LoanPayment, loanPaymentRowToArray(), loanRowToArray(), loanWithSummaryRowToArray()

### Community 88 - "Community 88"
Cohesion: 0.20
Nodes (14): Props, Props, StoredStatement, UseWalletsReturn, createSQLiteRepositories(), CreateWalletInput, UpdateWalletInput, UpsertCreditCardStatementInput (+6 more)

### Community 89 - "Community 89"
Cohesion: 0.06
Nodes (13): InMemoryWalletRepository, destinationWallet, includeDeletedSpy, readStoredWallet, sourceWallet, transactionRepository, transfer, useCase (+5 more)

### Community 96 - "Community 96"
Cohesion: 0.10
Nodes (18): Props, ReceiptCapture(), OrphanReceiptCleanupService, runReceiptOrphanCleanup(), ReceiptStorageService, cleanupSpy, db, deleteSpy (+10 more)

### Community 98 - "Community 98"
Cohesion: 0.19
Nodes (14): ENV, isDatabaseReady(), canUseLocalStorage(), ErrorLogRepository, generateId(), readPendingLogs(), writePendingLogs(), isLogOptions() (+6 more)

### Community 99 - "Community 99"
Cohesion: 0.23
Nodes (14): dateStringToTimestamp(), LoanForm(), LoanFormProps, startOfLocalDay(), timestampToDateString(), TYPE_OPTIONS, CreateLoanInput, Loan (+6 more)

### Community 106 - "Community 106"
Cohesion: 0.17
Nodes (25): UpdateLoanInput, LOAN_TYPES, LoanValidationError, validateCreateLoan(), validateCreateLoanPayment(), validateLoanFields(), validateUpdateLoan(), addLoanPayment() (+17 more)

### Community 108 - "Community 108"
Cohesion: 0.11
Nodes (21): DropdownList(), DropdownListProps, DropdownOption, isEditableElement(), blurActiveEditableElement(), HIDDEN_MANUAL_TRANSACTION_CATEGORY_KEYS, HIDDEN_MANUAL_TRANSACTION_CATEGORY_SLUGS, Props (+13 more)

### Community 109 - "Community 109"
Cohesion: 0.20
Nodes (15): DonutItem, formatPercentLabel(), makeId(), normalizeDonutData(), NormalizeDonutDataOptions, RawDonutItem, DonutCenterLabel(), DonutCenterLabelProps (+7 more)

### Community 110 - "Community 110"
Cohesion: 0.05
Nodes (72): BottomSheet(), BudgetAddSheet(), Props, BudgetAlertsPanel(), Props, ACCOUNT_TYPE_ICONS, BudgetByAccountTypeSummary(), Props (+64 more)

### Community 112 - "Community 112"
Cohesion: 0.29
Nodes (3): installGlobalErrorLogging(), toMetadataValue(), Logger

### Community 114 - "Community 114"
Cohesion: 0.13
Nodes (26): CashflowBarChart(), Props, Props, TransactionItem(), DaySummaryRow, MonthSummaryRow, Props, QuarterSummaryRow (+18 more)

### Community 115 - "Community 115"
Cohesion: 0.16
Nodes (20): formatDueDate(), fromDateInput(), isValidDateParts(), parseDueDate(), RecurringBillForm(), startOfLocalDay(), toDateInput(), useBudgetAnalysis() (+12 more)

### Community 117 - "Community 117"
Cohesion: 0.25
Nodes (13): forceAppUnlock(), resumeAppLock(), suspendAppLock(), appListeners, authServiceMock, autoBackupMock, capacitorMock, emitAppStateChange() (+5 more)

### Community 118 - "Community 118"
Cohesion: 0.19
Nodes (12): AuthResult, AuthService, BIOMETRIC_UNLOCK_SUPPORTED_PLATFORMS, BiometricAuthEvent, BiometricListenerPlugin, isAndroidPlatform(), isBiometricUnlockSupportedPlatform(), isNativePlatform() (+4 more)

### Community 119 - "Community 119"
Cohesion: 0.19
Nodes (19): formatDate(), formatVnd(), isOverdue(), LoanCard(), LoanCardProps, STATUS_LABELS, TYPE_LABELS, LoanFilter (+11 more)

### Community 120 - "Community 120"
Cohesion: 0.18
Nodes (14): CreditCardAlertBanner(), CreditCardAlertBannerProps, fmtDayMonth(), getAlertTitle(), CreditCardAlertsPanel(), CreditCardAlertsPanelProps, CreditCardAlert, CreditCardAlertType (+6 more)

### Community 121 - "Community 121"
Cohesion: 0.29
Nodes (8): AppUnlock(), AppUnlockProps, PIN_KEYS, UnlockMode, authServiceMock, enterPin(), onUnlocked, renderAppUnlock()

### Community 122 - "Community 122"
Cohesion: 0.21
Nodes (10): LoadingScreen(), ACTIVITY_EVENTS, AppBootstrap(), AppBootstrapProps, DEFAULT_CATEGORIES, DefaultCategory, DefaultCategoryType, insertDefaultCategories() (+2 more)

### Community 123 - "Community 123"
Cohesion: 0.12
Nodes (20): Props, BodyScrollLockSnapshot, lockBodyScroll(), shouldUseFixedBodyLock(), useBodyScrollLock(), CONTEXTUAL_ADD_ROUTES, ContextualAddRoute, DASHBOARD_WITH_DRAWER_BACK_ROUTES (+12 more)

### Community 124 - "Community 124"
Cohesion: 0.60
Nodes (3): base64ToBlob(), parseBase64DataUri(), shareFile()

### Community 125 - "Community 125"
Cohesion: 0.22
Nodes (11): ConfirmContext, ConfirmContextType, ConfirmOptions, ConfirmProvider(), ConfirmDialog(), ConfirmDialogProps, CurrencyProvider(), useKeyboardSafeFocus() (+3 more)

### Community 126 - "Community 126"
Cohesion: 0.15
Nodes (14): category(), { deps, transactionCreate, updateLoanStatus }, { deps, transactionCreate, walletRepo }, { deps, updateBalanceDelta }, { deps, updateBalanceDelta, updateLoanStatus }, firstPayment, generateUUIDMock, makeDeps() (+6 more)

### Community 127 - "Community 127"
Cohesion: 0.10
Nodes (30): NestedKeyOf, TranslationKey, TranslationPath, translations, createTransactionUseCase, updateTransactionUseCase, clearStoredCreateTransactionState(), CreateTransactionFormValues (+22 more)

### Community 128 - "Community 128"
Cohesion: 0.44
Nodes (7): applyKeyboardScrollPadding(), getKeyboardScrollContainer(), getScrollableParent(), isEditableElement(), restoreScrollPadding(), scrollElementIntoKeyboardSafeView(), ScrollPaddingState

### Community 131 - "Community 131"
Cohesion: 0.17
Nodes (13): persistWeb(), ensureWebStoreInitialized(), initDatabaseConnection(), _initDatabaseConnectionImpl(), getSQLiteEncryptionConfig(), SQLITE_ENCRYPTION_CONFIG, SQLiteEncryptionConfig, SQLiteEncryptionMode (+5 more)

### Community 132 - "Community 132"
Cohesion: 0.13
Nodes (28): AdvancedTransactionFilterSheet(), BackButton(), BackButtonProps, RecurringBillList(), useConfirm(), ROUTES, deleteTransactionUseCase, useCategories() (+20 more)

### Community 137 - "Community 137"
Cohesion: 0.24
Nodes (10): baseInput(), category(), { deps }, { deps, loanCreateLoan, loanUpdateLoan, transactionCreate }, { deps, loanCreateLoan, transactionCreate }, { deps, transactionCreate }, generateUUIDMock, makeDeps() (+2 more)

### Community 141 - "Community 141"
Cohesion: 0.17
Nodes (19): CurrencyAmountInput(), CurrencyAmountInputProps, formatAmountInput(), getFractionDigits(), normalizeAmountInput(), ACCOUNT_TYPE_ICONS, ACCOUNT_TYPES, COLOR_PRESETS (+11 more)

### Community 144 - "Community 144"
Cohesion: 0.18
Nodes (14): sqliteTransactionRunner(), TransactionRunner, createSampleTransactions(), buildExportDatasetUseCase, createCreditCardPaymentUseCase, AppRepositories, ITransactionRepository, IWalletRepository (+6 more)

## Knowledge Gaps
- **532 isolated node(s):** `config`, `dev`, `build`, `typecheck`, `lint` (+527 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useLanguage()` connect `Community 34` to `Community 1`, `Community 99`, `Community 132`, `Community 4`, `Community 108`, `Community 109`, `Community 110`, `Community 79`, `Community 141`, `Community 114`, `Community 115`, `Community 85`, `Community 119`, `Community 121`, `Community 123`, `Community 29`, `Community 127`?**
  _High betweenness centrality (0.096) - this node is a cross-community bridge._
- **Why does `getDbConnection()` connect `Community 5` to `Community 96`, `Community 98`, `Community 131`, `Community 4`, `Community 9`, `Community 11`, `Community 110`, `Community 119`, `Community 21`, `Community 87`, `Community 88`, `Community 122`, `Community 28`, `Community 29`, `Community 127`?**
  _High betweenness centrality (0.063) - this node is a cross-community bridge._
- **Why does `Wallet` connect `Community 88` to `Community 33`, `Community 1`, `Community 132`, `Community 5`, `Community 137`, `Community 73`, `Community 11`, `Community 76`, `Community 141`, `Community 144`, `Community 114`, `Community 115`, `Community 84`, `Community 23`, `Community 120`, `Community 89`, `Community 29`, `Community 126`?**
  _High betweenness centrality (0.042) - this node is a cross-community bridge._
- **What connects `config`, `dev`, `build` to the rest of the system?**
  _532 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.09523809523809523 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.09523809523809523 - nodes in this community are weakly interconnected._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._