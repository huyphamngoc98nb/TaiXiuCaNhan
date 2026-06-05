# Graph Report - TaiXiuCaNhan  (2026-06-05)

## Corpus Check
- 304 files · ~108,486 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2053 nodes · 6674 edges · 133 communities (123 shown, 10 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 9 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `3c3c6874`
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
- [[_COMMUNITY_Community 86|Community 86]]
- [[_COMMUNITY_Community 87|Community 87]]
- [[_COMMUNITY_Community 88|Community 88]]
- [[_COMMUNITY_Community 89|Community 89]]
- [[_COMMUNITY_Community 90|Community 90]]
- [[_COMMUNITY_Community 96|Community 96]]
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
- [[_COMMUNITY_Community 130|Community 130]]
- [[_COMMUNITY_Community 131|Community 131]]
- [[_COMMUNITY_Community 132|Community 132]]

## God Nodes (most connected - your core abstractions)
1. `useLanguage()` - 169 edges
2. `getDbConnection()` - 120 edges
3. `Wallet` - 70 edges
4. `useToast()` - 53 edges
5. `AppRepositories` - 44 edges
6. `useCurrency()` - 44 edges
7. `getDbConnectionForTransaction()` - 42 edges
8. `Transaction` - 42 edges
9. `ITransactionRepository` - 42 edges
10. `ROUTES` - 39 edges

## Surprising Connections (you probably didn't know these)
- `addLoanPayment()` --calls--> `runInTransaction()`  [INFERRED]
  src/modules/loans/services/add-loan-payment.ts → src/core/db/sqlite/transaction.ts
- `createLoan()` --calls--> `runInTransaction()`  [INFERRED]
  src/modules/loans/services/create-loan.ts → src/core/db/sqlite/transaction.ts
- `updateLoan()` --calls--> `runInTransaction()`  [INFERRED]
  src/modules/loans/services/update-loan.ts → src/core/db/sqlite/transaction.ts
- `exportToPdf()` --calls--> `formatDate()`  [INFERRED]
  src/modules/export/services/export-pdf.ts → src/modules/loans/components/LoanCard.tsx
- `MainLayout()` --calls--> `useLanguage()`  [EXTRACTED]
  src/app/layouts/MainLayout.tsx → src/shared/context/LanguageContext.tsx

## Communities (133 total, 10 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.07
Nodes (26): categories, categoryInserts, dbError, expectExecuteContaining(), expectMigrationMarked(), expectNoExecuteContaining(), id, insertedCategoryIds (+18 more)

### Community 1 - "Community 1"
Cohesion: 0.06
Nodes (57): CashflowBarChart(), Props, dateInputValue(), DateRangePicker(), endOfInputDate(), Props, startOfInputDate(), percentChange() (+49 more)

### Community 2 - "Community 2"
Cohesion: 0.10
Nodes (21): code:bash (mkdir -p graphify-out), code:bash ($(cat graphify-out/.graphify_python) -c "), code:bash ($(cat graphify-out/.graphify_python) -c "), code:bash ($(cat graphify-out/.graphify_python) -c "), code:bash ($(cat graphify-out/.graphify_python) -c "), code:bash (# Detect the correct Python interpreter (handles uv tool, pi), code:bash ($(cat graphify-out/.graphify_python) -c "), code:bash ($(cat graphify-out/.graphify_python) -c ") (+13 more)

### Community 3 - "Community 3"
Cohesion: 0.09
Nodes (22): devDependencies, autoprefixer, @capacitor/cli, copyfiles, eslint, eslint-plugin-react-hooks, eslint-plugin-react-refresh, jsdom (+14 more)

### Community 4 - "Community 4"
Cohesion: 0.11
Nodes (23): BudgetCategoryItem(), Props, BudgetCategoryList(), EditableCategoryBudget, Props, SCOPE_ORDER, BudgetProgressCard(), Props (+15 more)

### Community 5 - "Community 5"
Cohesion: 0.06
Nodes (56): DateDisplayInput(), DateDisplayInputProps, dateDisplayInputStyle, dateIconStyle, dateInputShellStyle, endOfLocalDay(), hiddenDateInputStyle, inputStyle (+48 more)

### Community 6 - "Community 6"
Cohesion: 0.11
Nodes (16): code:block1 (/graphify                                             # full), code:bash ($(cat graphify-out/.graphify_python) -c "), code:bash ($(cat graphify-out/.graphify_python) -c "), code:bash (python3 -m graphify.watch INPUT_PATH --debounce 3), code:bash (graphify hook install    # install), code:bash (graphify claude install), code:bash (graphify claude uninstall  # remove the section), For --cluster-only (+8 more)

### Community 7 - "Community 7"
Cohesion: 0.09
Nodes (22): compilerOptions, allowImportingTsExtensions, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+14 more)

### Community 8 - "Community 8"
Cohesion: 0.33
Nodes (8): ILoanRepository, deleteLoan(), DeleteLoanDeps, getLoanForDelete(), LoanHasPaymentsError, loan(), makeRepo(), repo

### Community 9 - "Community 9"
Cohesion: 0.23
Nodes (12): StoredStatement, UseWalletsReturn, generateId(), mapWallet(), CreateWalletInput, UpdateWalletInput, UpsertCreditCardStatementInput, WalletReferenceCounts (+4 more)

### Community 10 - "Community 10"
Cohesion: 0.27
Nodes (19): AppliedMigration, buildLoanSkipTransactionSql(), columnExists(), DbConnection, executeMigrationSql(), executeMigrationStatement(), getAppliedMigrations(), markMigrationDone() (+11 more)

### Community 11 - "Community 11"
Cohesion: 0.13
Nodes (19): BudgetAddSheet(), BudgetAlertsPanel(), Props, ACCOUNT_TYPE_ICONS, BudgetByAccountTypeSummary(), Props, STATUS_COLORS, BudgetEditSheet() (+11 more)

### Community 12 - "Community 12"
Cohesion: 0.14
Nodes (13): 1. Local Backup & Restore, 2. Human-Readable Exports, 3. Portability Limitations, Android Sync & Build, Current Implemented Scope, Data Portability (Phase 6), Expense Tracker App, Final Quality Assurance (Phase 6 Hardening) (+5 more)

### Community 13 - "Community 13"
Cohesion: 0.11
Nodes (16): Budget, BudgetWithCategory, CreateBudgetDto, IBudgetRepository, generateId(), SQLiteBudgetRepository, CalculateBudgetProgressUseCase, classifyBudgetStatus() (+8 more)

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
Nodes (20): dependencies, @capacitor/android, @capacitor/app, @capacitor/camera, @capacitor-community/sqlite, @capacitor/core, @capacitor/filesystem, @capacitor/preferences (+12 more)

### Community 20 - "Community 20"
Cohesion: 0.10
Nodes (19): 1. Local Backup & Restore, 2. Human-Readable Exports, 3. Portability Limitations, Android Sync & Build, code:bash (npm install), code:bash (# On Windows PowerShell:), code:bash (npm run dev), code:bash (npm run build) (+11 more)

### Community 21 - "Community 21"
Cohesion: 0.17
Nodes (16): ConfirmProvider(), CurrencyProvider(), applyKeyboardScrollPadding(), getKeyboardScrollContainer(), getScrollableParent(), isEditableElement(), restoreScrollPadding(), scrollElementIntoKeyboardSafeView() (+8 more)

### Community 22 - "Community 22"
Cohesion: 0.10
Nodes (28): NestedKeyOf, TranslationKey, TranslationPath, translations, LanguageContextType, buildTimestamp(), DateTimePicker(), detectMode() (+20 more)

### Community 23 - "Community 23"
Cohesion: 0.31
Nodes (7): loanMutationDeps, loanServiceDeps, emitLoanEvent(), toError(), cancelLoan(), CancelLoanDeps, updateLoan()

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
Cohesion: 0.20
Nodes (12): ConfirmContext, ConfirmContextType, ConfirmOptions, CONTEXTUAL_ADD_ROUTES, ContextualAddRoute, DASHBOARD_WITH_DRAWER_BACK_ROUTES, DEFAULT_ADD_ROUTE, getContextualAddRoute() (+4 more)

### Community 29 - "Community 29"
Cohesion: 0.14
Nodes (6): explainReportQueries(), SQLiteCategoryRepository, SQLiteWalletRepository, ensureBalanceAdjustmentCategory(), getDbConnection(), getDbConnectionForTransaction()

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
Cohesion: 0.23
Nodes (12): category(), { deps, loanUpdateLoan }, { deps, loanUpdateLoan, transactionCreate, transactionSoftDelete }, { deps, loanUpdateLoan, walletGetById }, { deps, walletGetById }, generateUUIDMock, input(), makeDeps() (+4 more)

### Community 34 - "Community 34"
Cohesion: 0.15
Nodes (11): Props, ReceiptCapture(), ReceiptStorageService, createUseCase, existingNoReceipt, existingWithReceipt, input, makeBaseInput() (+3 more)

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
Nodes (14): buildErrorLogExportPayload(), ErrorLogExportItem, ErrorLogExportPayload, exportErrorLogsToJson(), parseMetadata(), isDatabaseReady(), canUseLocalStorage(), ErrorLogRecord (+6 more)

### Community 49 - "Community 49"
Cohesion: 0.48
Nodes (5): bundleVersion, _comment, minNativeVersionCodeForBundle, nativeVersionCode, nativeVersionName

### Community 73 - "Community 73"
Cohesion: 0.43
Nodes (5): Toast(), ToastProps, ToastType, ToastContext, ToastContextType

### Community 76 - "Community 76"
Cohesion: 0.19
Nodes (14): computeCreditCardAlerts(), addDays(), addMonths(), buildDueDate(), clampedDate(), CreditCardService, CreditCardSummary, daysInMonth() (+6 more)

### Community 78 - "Community 78"
Cohesion: 0.67
Nodes (3): code:bash (python3 -m graphify.serve graphify-out/graph.json), code:json ({), Step 7d - MCP server (only if --mcp flag)

### Community 79 - "Community 79"
Cohesion: 0.12
Nodes (16): immediateTransactionRunner(), createUseCase, deleteUseCase, FailingTransactionRepository, input, invalidInput, oldTx, paymentUseCase (+8 more)

### Community 82 - "Community 82"
Cohesion: 0.67
Nodes (3): code:bash ($(cat graphify-out/.graphify_python) -c "), code:block27 (Graph complete. Outputs in PATH_TO_DIR/graphify-out/), Step 9 - Save manifest, update cost tracker, clean up, and report

### Community 83 - "Community 83"
Cohesion: 0.67
Nodes (3): code:bash ($(cat graphify-out/.graphify_python) -c "), code:block4 (Corpus: X files · ~Y words), Step 2 - Detect files

### Community 84 - "Community 84"
Cohesion: 0.24
Nodes (15): dateInputToMs(), formatVnd(), PaymentForm(), PaymentFormProps, startOfLocalDay(), todayInputValue(), CreateLoanPaymentInput, useLoanMutations() (+7 more)

### Community 85 - "Community 85"
Cohesion: 0.16
Nodes (15): AuthResult, AuthService, BIOMETRIC_UNLOCK_SUPPORTED_PLATFORMS, BiometricAuthEvent, BiometricListenerPlugin, isAndroidPlatform(), isBiometricUnlockSupportedPlatform(), isNativePlatform() (+7 more)

### Community 86 - "Community 86"
Cohesion: 0.17
Nodes (16): sqliteTransactionRunner(), TransactionType, TransactionValidationError, validateCreateTransaction(), validateUpdateTransaction(), assertActiveWallet(), assertNoCreditCardToCreditCardTransfer(), assertProjectedWalletDelta() (+8 more)

### Community 87 - "Community 87"
Cohesion: 0.16
Nodes (18): Props, formatDaysDiff(), Props, RecurringBillReminderBanner(), STATUS_CONFIG, CreateRecurringBillInput, RecurringBill, RecurringBillReminder (+10 more)

### Community 88 - "Community 88"
Cohesion: 0.24
Nodes (7): ENV, isLogOptions(), Logger, LogOptions, normalizeError(), normalizeMetadata(), toSafeLogValue()

### Community 89 - "Community 89"
Cohesion: 0.05
Nodes (80): BackupMetadata, BackupPayload, BackupRow, ValidationResult, documentSaver, DocumentSaverPlugin, SaveTextFileOptions, SaveTextFileResult (+72 more)

### Community 90 - "Community 90"
Cohesion: 0.12
Nodes (23): CurrencyAmountInput(), CurrencyAmountInputProps, formatAmountInput(), getFractionDigits(), normalizeAmountInput(), CurrencySettings(), DropdownList(), DropdownListProps (+15 more)

### Community 96 - "Community 96"
Cohesion: 0.25
Nodes (17): Props, BudgetEditForm(), Props, Props, ALL_ACCOUNT_TYPES, BudgetScopePicker(), Props, CategoryIcon() (+9 more)

### Community 99 - "Community 99"
Cohesion: 0.23
Nodes (8): createSampleTransactions(), CreateCreditCardPaymentInput, CreateCreditCardPaymentUseCase, CreateTransactionUseCase, getSourceDelta(), validateActiveWallet(), assertCreateTransactionFunding(), getSourceDelta()

### Community 105 - "Community 105"
Cohesion: 0.23
Nodes (9): persistWeb(), ensureWebStoreInitialized(), initDatabaseConnection(), getSQLiteEncryptionConfig(), SQLITE_ENCRYPTION_CONFIG, SQLiteEncryptionConfig, SQLiteEncryptionMode, applyPragmas() (+1 more)

### Community 106 - "Community 106"
Cohesion: 0.20
Nodes (21): LoanType, LOAN_TYPES, validateCreateLoan(), validateCreateLoanPayment(), validateLoanFields(), validateUpdateLoan(), addLoanPayment(), AddLoanPaymentDeps (+13 more)

### Community 107 - "Community 107"
Cohesion: 0.21
Nodes (10): BiometricUnlockSettings(), DatabaseDiagnostics(), LanguageSettings(), WalletForm(), WalletList(), useLanguage(), MenuItem, SettingsPage() (+2 more)

### Community 108 - "Community 108"
Cohesion: 0.25
Nodes (13): forceAppUnlock(), resumeAppLock(), suspendAppLock(), appListeners, authServiceMock, autoBackupMock, capacitorMock, emitAppStateChange() (+5 more)

### Community 109 - "Community 109"
Cohesion: 0.20
Nodes (15): DonutItem, formatPercentLabel(), makeId(), normalizeDonutData(), NormalizeDonutDataOptions, RawDonutItem, DonutCenterLabel(), DonutCenterLabelProps (+7 more)

### Community 110 - "Community 110"
Cohesion: 0.12
Nodes (19): Props, RecurringBillList(), STATUS_COLORS, getDueRemindersUseCase, DueStatus, RecurringBillsPage(), classifyDueStatus(), daysDiff() (+11 more)

### Community 111 - "Community 111"
Cohesion: 0.23
Nodes (15): formatDate(), formatVnd(), isOverdue(), LoanCard(), LoanCardProps, STATUS_LABELS, TYPE_LABELS, useLoans() (+7 more)

### Community 112 - "Community 112"
Cohesion: 0.12
Nodes (18): CreditCardStatementStatus, CreditCardStatementPeriod, deriveStatus(), getStatementPeriodForLifecycle(), SyncCreditCardStatementUseCase, asOf, closedStatementAsOf, creditCard (+10 more)

### Community 113 - "Community 113"
Cohesion: 0.20
Nodes (14): listTransactionsUseCase, useBudgetAnalysis(), useCreditCardAlerts(), useRecurringBills(), useRecurringReminders(), TransactionSummary, useTransactionSummary(), useWalletBalances() (+6 more)

### Community 114 - "Community 114"
Cohesion: 0.17
Nodes (11): THEME_OPTIONS, ThemeSelector(), getStoredThemePreference(), isThemePreference(), ResolvedTheme, THEME_COLOR, ThemeContext, ThemeContextType (+3 more)

### Community 115 - "Community 115"
Cohesion: 0.15
Nodes (24): AdvancedTransactionFilterSheet(), BackButton(), BackButtonProps, TransactionForm(), TransactionList(), useConfirm(), ROUTES, deleteTransactionUseCase (+16 more)

### Community 116 - "Community 116"
Cohesion: 0.26
Nodes (11): Wallet, BUDGET_STATUS_ORDER, buildDashboardViewModel(), DashboardViewModel, DashboardViewModelInput, formatVND(), getTopBudgets(), makeBudgetProgress() (+3 more)

### Community 118 - "Community 118"
Cohesion: 0.18
Nodes (16): ACCOUNT_TYPE_ICONS, ACCOUNT_TYPE_LABELS, formatDayMonth(), Props, WalletCard(), ACCOUNT_TYPES, COLOR_PRESETS, EMOJI_PRESETS (+8 more)

### Community 119 - "Community 119"
Cohesion: 0.23
Nodes (8): mapToTransaction(), CreateTransactionInput, Transaction, TransactionFilter, UpdateTransactionInput, InMemoryTransactionRepository, matchesFilter(), SQLiteTransactionRepository

### Community 120 - "Community 120"
Cohesion: 0.25
Nodes (17): loanListDeps, mapBooleanFlag(), mapToLoan(), mapToLoanPayment(), mapToLoanWithSummary(), Loan, LoanFilter, LoanPayment (+9 more)

### Community 121 - "Community 121"
Cohesion: 0.23
Nodes (12): dateStringToTimestamp(), LoanForm(), LoanFormProps, startOfLocalDay(), timestampToDateString(), TYPE_OPTIONS, CreateLoanInput, { container } (+4 more)

### Community 122 - "Community 122"
Cohesion: 0.51
Nodes (9): addMonths(), coerceMonthDate(), DateRange, endOfMonth(), getMonthDateRange(), isCurrentMonth(), parseMonthKey(), startOfMonth() (+1 more)

### Community 123 - "Community 123"
Cohesion: 0.27
Nodes (8): LoadingScreen(), ACTIVITY_EVENTS, AppBootstrapProps, DEFAULT_CATEGORIES, DefaultCategory, DefaultCategoryType, insertDefaultCategories(), seedDefaultData()

### Community 124 - "Community 124"
Cohesion: 0.29
Nodes (5): ErrorScreen(), ErrorScreenProps, GlobalErrorBoundary, GlobalErrorBoundaryProps, GlobalErrorBoundaryState

### Community 125 - "Community 125"
Cohesion: 0.33
Nodes (8): CreditCardAlertBanner(), CreditCardAlertBannerProps, fmtDayMonth(), getAlertTitle(), CreditCardAlertsPanel(), CreditCardAlertsPanelProps, CreditCardAlert, CreditCardAlertType

### Community 126 - "Community 126"
Cohesion: 0.20
Nodes (14): createCreditCardPaymentUseCase, createTransactionUseCase, updateTransactionUseCase, clearStoredCreateTransactionState(), CreateTransactionFormValues, getCreateTransactionInitialValues(), getDefaultCreateTransactionValues(), getEditTransactionInitialValues() (+6 more)

### Community 127 - "Community 127"
Cohesion: 0.18
Nodes (12): LanguageProvider(), AppUnlock(), AppUnlockProps, PIN_KEYS, UnlockMode, authServiceMock, enterPin(), onUnlocked (+4 more)

### Community 128 - "Community 128"
Cohesion: 0.30
Nodes (7): TransactionRunner, buildExportDatasetUseCase, AppRepositories, createSQLiteRepositories(), ITransactionRepository, IWalletRepository, DeleteTransactionUseCase

### Community 129 - "Community 129"
Cohesion: 0.24
Nodes (10): LoanValidationError, CreateLoanDeps, baseInput(), category(), { deps, loanCreateLoan, loanUpdateLoan, transactionCreate }, { deps, loanCreateLoan, transactionCreate }, { deps, transactionCreate }, generateUUIDMock (+2 more)

### Community 130 - "Community 130"
Cohesion: 0.67
Nodes (3): countCategories(), getSchemaVersion(), listTables()

### Community 131 - "Community 131"
Cohesion: 0.47
Nodes (7): getReentrantDb(), isReentrantTransactionCall(), nativeTransactionQueue, runExclusive(), runInTransaction(), runManagedWork(), transactionQueue

### Community 132 - "Community 132"
Cohesion: 0.43
Nodes (7): formatDueDate(), fromDateInput(), isValidDateParts(), parseDueDate(), RecurringBillForm(), startOfLocalDay(), toDateInput()

## Knowledge Gaps
- **444 isolated node(s):** `config`, `dev`, `build`, `typecheck`, `lint` (+439 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useLanguage()` connect `Community 107` to `Community 1`, `Community 4`, `Community 5`, `Community 132`, `Community 11`, `Community 22`, `Community 28`, `Community 87`, `Community 89`, `Community 90`, `Community 96`, `Community 109`, `Community 110`, `Community 113`, `Community 114`, `Community 115`, `Community 118`, `Community 126`, `Community 127`?**
  _High betweenness centrality (0.108) - this node is a cross-community bridge._
- **Why does `getDbConnection()` connect `Community 29` to `Community 1`, `Community 130`, `Community 131`, `Community 34`, `Community 5`, `Community 105`, `Community 10`, `Community 9`, `Community 13`, `Community 48`, `Community 119`, `Community 117`, `Community 87`, `Community 120`, `Community 89`, `Community 123`, `Community 126`?**
  _High betweenness centrality (0.051) - this node is a cross-community bridge._
- **Why does `Wallet` connect `Community 116` to `Community 129`, `Community 33`, `Community 98`, `Community 99`, `Community 5`, `Community 9`, `Community 107`, `Community 76`, `Community 79`, `Community 112`, `Community 115`, `Community 86`, `Community 118`, `Community 29`, `Community 127`?**
  _High betweenness centrality (0.041) - this node is a cross-community bridge._
- **What connects `config`, `dev`, `build` to the rest of the system?**
  _444 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.07389162561576355 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.05782145782145782 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.09523809523809523 - nodes in this community are weakly interconnected._