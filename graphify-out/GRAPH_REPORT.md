# Graph Report - TaiXiuCaNhan  (2026-05-29)

## Corpus Check
- 264 files · ~98,352 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1322 nodes · 3051 edges · 92 communities (84 shown, 8 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 4 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

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
- [[_COMMUNITY_Community 57|Community 57]]
- [[_COMMUNITY_Community 73|Community 73]]
- [[_COMMUNITY_Community 74|Community 74]]
- [[_COMMUNITY_Community 75|Community 75]]
- [[_COMMUNITY_Community 76|Community 76]]
- [[_COMMUNITY_Community 77|Community 77]]
- [[_COMMUNITY_Community 78|Community 78]]
- [[_COMMUNITY_Community 79|Community 79]]
- [[_COMMUNITY_Community 80|Community 80]]
- [[_COMMUNITY_Community 81|Community 81]]
- [[_COMMUNITY_Community 82|Community 82]]
- [[_COMMUNITY_Community 83|Community 83]]
- [[_COMMUNITY_Community 84|Community 84]]
- [[_COMMUNITY_Community 85|Community 85]]
- [[_COMMUNITY_Community 86|Community 86]]
- [[_COMMUNITY_Community 90|Community 90]]
- [[_COMMUNITY_Community 91|Community 91]]

## God Nodes (most connected - your core abstractions)
1. `useLanguage()` - 111 edges
2. `getDbConnection()` - 81 edges
3. `Wallet` - 40 edges
4. `useToast()` - 31 edges
5. `useCurrency()` - 29 edges
6. `Transaction` - 28 edges
7. `config` - 24 edges
8. `InMemoryWalletRepository` - 24 edges
9. `AppRepositories` - 22 edges
10. `AccountType` - 21 edges

## Surprising Connections (you probably didn't know these)
- `MainLayout()` --calls--> `useLanguage()`  [EXTRACTED]
  src/app/layouts/MainLayout.tsx → src/shared/context/LanguageContext.tsx
- `AppUnlock()` --calls--> `useLanguage()`  [EXTRACTED]
  src/app/providers/AppUnlock.tsx → src/shared/context/LanguageContext.tsx
- `sqliteTransactionRunner()` --calls--> `runInTransaction()`  [EXTRACTED]
  src/core/db/transaction-runner.ts → src/core/db/sqlite/transaction.ts
- `exportBackupJson()` --calls--> `getDbConnection()`  [EXTRACTED]
  src/modules/backup/services/export-backup-json.ts → src/core/db/sqlite/connection.ts
- `restoreDatabase()` --calls--> `getDbConnection()`  [EXTRACTED]
  src/modules/backup/services/restore-database.ts → src/core/db/sqlite/connection.ts

## Communities (92 total, 8 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.09
Nodes (28): CategoryForm(), COLOR_PRESETS, Props, CATEGORY_ICON_LIBRARY_DEFINITIONS, CATEGORY_ICON_PRESET_DEFINITIONS, CategoryIconPreset, CUSTOM_ICON_PRESETS, getCategoryIconKey() (+20 more)

### Community 1 - "Community 1"
Cohesion: 0.07
Nodes (41): Props, dateInputValue(), DateRangePicker(), Props, Props, dumpReportData(), CashflowSummary, CategorySummary (+33 more)

### Community 2 - "Community 2"
Cohesion: 0.16
Nodes (12): Props, STATUS_CONFIG, RecurringBillReminder, BUDGET_STATUS_ORDER, buildDashboardViewModel(), DashboardViewModel, DashboardViewModelInput, formatVND() (+4 more)

### Community 3 - "Community 3"
Cohesion: 0.16
Nodes (15): ACCOUNT_TYPE_LABELS, Budget, BudgetWithCategory, CreateBudgetDto, Wallet, IBudgetRepository, CalculateBudgetProgressUseCase, BUDGET_THRESHOLDS (+7 more)

### Community 4 - "Community 4"
Cohesion: 0.05
Nodes (40): config, configFile, forbidOnly, fullyParallel, globalSetup, globalTeardown, globalTimeout, grep (+32 more)

### Community 5 - "Community 5"
Cohesion: 0.11
Nodes (21): BiometricUnlockSettings(), BudgetAddSheet(), BudgetEditSheet(), BudgetSummaryStats(), Props, StatCardProps, CurrencySettings(), EmptyBudgetPrompt() (+13 more)

### Community 6 - "Community 6"
Cohesion: 0.08
Nodes (35): BackupMetadata, BackupPayload, BackupRow, ValidationResult, exportBackupJson(), importBackupJson(), readBackupFile(), LegacyRestorableBackupPayload (+27 more)

### Community 7 - "Community 7"
Cohesion: 0.15
Nodes (13): AuthResult, BIOMETRIC_UNLOCK_SUPPORTED_PLATFORMS, BiometricAuthEvent, BiometricListenerPlugin, isNativePlatform(), nativeBiometric, NativeBiometricAuthResult, NativeBiometricAvailability (+5 more)

### Community 8 - "Community 8"
Cohesion: 0.05
Nodes (36): DatabaseDiagnostics(), explainReportQueries(), columnExists(), executeMigrationStatement(), markMigrationDone(), MIGRATIONS, parseAddColumnStatement(), runMigrations() (+28 more)

### Community 9 - "Community 9"
Cohesion: 0.13
Nodes (13): immediateTransactionRunner(), createUseCase, deleteUseCase, FailingTransactionRepository, input, invalidInput, oldTx, paymentUseCase (+5 more)

### Community 10 - "Community 10"
Cohesion: 0.22
Nodes (15): Props, BudgetEditForm(), Props, Props, ALL_ACCOUNT_TYPES, BudgetScopePicker(), Props, CategoryIcon() (+7 more)

### Community 11 - "Community 11"
Cohesion: 0.13
Nodes (12): Props, Props, Props, WeekSummaryRow, mapToTransaction(), CreateTransactionInput, Transaction, TransactionFilter (+4 more)

### Community 12 - "Community 12"
Cohesion: 0.22
Nodes (9): Props, BudgetScopeBadge(), Props, BudgetStatusBadge(), Props, BudgetScope, BudgetStatus, ProgressBar() (+1 more)

### Community 13 - "Community 13"
Cohesion: 0.11
Nodes (19): addDays(), addMonths(), buildDueDate(), clampedDate(), CreditCardService, CreditCardStatementPeriod, daysInMonth(), getCreditCardStatementPeriod() (+11 more)

### Community 14 - "Community 14"
Cohesion: 0.18
Nodes (9): AdvancedTransactionFilterSheet(), inputStyle, labelStyle, Props, toDateInputValue(), TransactionType, useTransactions(), TransactionsPage() (+1 more)

### Community 15 - "Community 15"
Cohesion: 0.11
Nodes (18): Bug #10: Pixel 5 Layout and UX (iPhone X), Bug #11: Pixel 5 Layout and UX (Pixel 5), Bug #12: Pixel 5 Layout and UX (Tablet (iPad)), Bug #13: Tablet (iPad) Layout and UX (iPhone 12), Bug #14: Tablet (iPad) Layout and UX (iPhone X), Bug #15: Tablet (iPad) Layout and UX (Pixel 5), Bug #16: Tablet (iPad) Layout and UX (Tablet (iPad)), Bug #1: iPhone 12 Layout and UX (iPhone 12) (+10 more)

### Community 16 - "Community 16"
Cohesion: 0.09
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
Cohesion: 0.20
Nodes (18): BackButton(), BackButtonProps, useConfirm(), ROUTES, MainLayout(), AddRecurringBillPage(), AddTransactionPage(), BackupPage() (+10 more)

### Community 22 - "Community 22"
Cohesion: 0.29
Nodes (4): GlobalErrorBoundary, renderBootstrap(), renderAppUnlock(), renderWalletList()

### Community 23 - "Community 23"
Cohesion: 0.06
Nodes (30): Props, ReceiptCapture(), ENV, ReceiptStorageService, buildErrorLogExportPayload(), ErrorLogExportItem, ErrorLogExportPayload, exportErrorLogsToJson() (+22 more)

### Community 24 - "Community 24"
Cohesion: 0.15
Nodes (10): DonutItem, normalizeDonutData(), NormalizeDonutDataOptions, RawDonutItem, DonutCenterLabelProps, DonutLegendProps, ReportDonutCard(), ReportDonutCardProps (+2 more)

### Community 25 - "Community 25"
Cohesion: 0.21
Nodes (10): ActivityCallback, ActivityResult, PluginCall, PluginMethod, PluginCall, PluginMethod, DocumentSaverPlugin, NativeBiometricPlugin (+2 more)

### Community 26 - "Community 26"
Cohesion: 0.12
Nodes (16): biometricAuth, biometricSubTitle, biometricTitle, appId, appName, androidBiometric, androidIsEncryption, iosBiometric (+8 more)

### Community 28 - "Community 28"
Cohesion: 0.25
Nodes (6): AppUnlock(), AppUnlockProps, PIN_KEYS, UnlockMode, authServiceMock, onUnlocked

### Community 29 - "Community 29"
Cohesion: 0.14
Nodes (14): ConfirmContext, ConfirmContextType, ConfirmOptions, ConfirmProvider(), ConfirmDialog(), ConfirmDialogProps, CurrencyProvider(), router (+6 more)

### Community 30 - "Community 30"
Cohesion: 0.18
Nodes (11): useBudgetAnalysis(), TransactionSummary, useTransactionSummary(), useWalletBalances(), useWallets(), ACCOUNT_TYPE_ICON, DashboardPage(), STATUS_BG (+3 more)

### Community 31 - "Community 31"
Cohesion: 0.14
Nodes (13): compilerOptions, esModuleInterop, forceConsistentCasingInFileNames, lib, module, outDir, resolveJsonModule, rootDir (+5 more)

### Community 32 - "Community 32"
Cohesion: 0.14
Nodes (13): compilerOptions, allowImportingTsExtensions, composite, isolatedModules, module, moduleResolution, noEmit, resolveJsonModule (+5 more)

### Community 33 - "Community 33"
Cohesion: 0.21
Nodes (8): ErrorScreen(), ErrorScreenProps, LoadingScreen(), ACTIVITY_EVENTS, AppBootstrap(), AppBootstrapProps, GlobalErrorBoundaryProps, GlobalErrorBoundaryState

### Community 34 - "Community 34"
Cohesion: 0.26
Nodes (7): Props, Props, CreateRecurringBillInput, RecurringBill, UpdateRecurringBillInput, mapRow(), SQLiteRecurringBillRepository

### Community 35 - "Community 35"
Cohesion: 0.20
Nodes (9): Application Architecture, Code Graph, code:mermaid (flowchart TB), code:mermaid (flowchart LR), code:mermaid (flowchart TB), code:mermaid (flowchart LR), Navigation Routes, Reports Data Flow (+1 more)

### Community 36 - "Community 36"
Cohesion: 0.22
Nodes (8): exclude, extractDocstrings, frameworks, include, languages, maxFileSize, trackCallSites, version

### Community 37 - "Community 37"
Cohesion: 0.22
Nodes (8): code:text (src/), code:ts (import { create } from 'zustand';), Current App Position, Decision, Example Pattern, Proposed Folder Shape, Shared State Strategy, When to Introduce Zustand

### Community 38 - "Community 38"
Cohesion: 0.19
Nodes (11): useBudgetAddForm(), EditableCategoryBudget, useBudgetEditForm(), EditableCategoryBudget, useBudgetForm(), useBudgets(), BudgetSettingsPage(), ScopeTab (+3 more)

### Community 39 - "Community 39"
Cohesion: 0.22
Nodes (8): compilerOptions, allowSyntheticDefaultImports, composite, module, moduleResolution, skipLibCheck, strict, include

### Community 40 - "Community 40"
Cohesion: 0.27
Nodes (8): applyKeyboardScrollPadding(), getKeyboardScrollContainer(), getScrollableParent(), restoreScrollPadding(), scrollElementIntoKeyboardSafeView(), ScrollPaddingState, useKeyboardSafeFocus(), AppProvider()

### Community 41 - "Community 41"
Cohesion: 0.09
Nodes (20): NestedKeyOf, TranslationKey, TranslationPath, translations, LanguageContextType, buildTimestamp(), DateTimePicker(), formatDateDisplay() (+12 more)

### Community 42 - "Community 42"
Cohesion: 0.22
Nodes (9): scripts, build, dev, lint, postinstall, preview, test, test:ui (+1 more)

### Community 43 - "Community 43"
Cohesion: 0.20
Nodes (9): computeNextDueDate(), Frequency, due, future, next, nextDate, past, start (+1 more)

### Community 44 - "Community 44"
Cohesion: 0.15
Nodes (16): Props, Props, Props, StoredStatement, UseWalletsReturn, CreateWalletInput, CreditCardStatementStatus, UpdateWalletInput (+8 more)

### Community 45 - "Community 45"
Cohesion: 0.29
Nodes (6): name, overrides, sql.js, private, type, version

### Community 46 - "Community 46"
Cohesion: 0.47
Nodes (4): MainActivity, BridgeActivity, Bundle, Override

### Community 47 - "Community 47"
Cohesion: 0.33
Nodes (5): Current State, Local SQLite Encryption, Remaining Security Work, Secret Handling, Security Notes

### Community 48 - "Community 48"
Cohesion: 0.15
Nodes (12): TransactionValidationError, validateCreateTransaction(), validateUpdateTransaction(), CreateTransactionUseCase, getSourceDelta(), validateActiveWallet(), base, err (+4 more)

### Community 49 - "Community 49"
Cohesion: 0.33
Nodes (5): bundleVersion, _comment, minNativeVersionCodeForBundle, nativeVersionCode, nativeVersionName

### Community 52 - "Community 52"
Cohesion: 0.21
Nodes (8): BudgetAlertsPanel(), Props, ACCOUNT_TYPE_ICONS, BudgetByAccountTypeSummary(), Props, STATUS_COLORS, Props, BudgetProgress

### Community 73 - "Community 73"
Cohesion: 0.21
Nodes (9): forceAppUnlock(), resumeAppLock(), suspendAppLock(), appListeners, authServiceMock, capacitorMock, migrationsMock, seedMock (+1 more)

### Community 74 - "Community 74"
Cohesion: 0.19
Nodes (10): createCreditCardPaymentUseCase, createTransactionUseCase, deleteTransactionUseCase, listTransactionsUseCase, updateTransactionUseCase, CreateCreditCardPaymentUseCase, localizeMessage(), localizeTransactionError() (+2 more)

### Community 75 - "Community 75"
Cohesion: 0.36
Nodes (6): DueStatus, IRecurringBillRepository, classifyDueStatus(), daysDiff(), startOfDay(), GetDueRemindersUseCase

### Community 76 - "Community 76"
Cohesion: 0.25
Nodes (7): code:block1 (Error: expect(locator).toBeVisible() failed), code:yaml (- main:), code:ts (63  |), Error details, Instructions, Test info, Test source

### Community 77 - "Community 77"
Cohesion: 0.26
Nodes (11): CashflowBarChart(), percentChange(), ReportSummaryCards(), TransactionItem(), DaySummaryRow, MonthSummaryRow, SummaryRow, TransactionList() (+3 more)

### Community 78 - "Community 78"
Cohesion: 0.13
Nodes (19): CurrencyAmountInputProps, DropdownList(), ACCOUNT_TYPE_ICONS, ACCOUNT_TYPE_LABELS, formatDayMonth(), WalletCard(), ACCOUNT_TYPES, COLOR_PRESETS (+11 more)

### Community 79 - "Community 79"
Cohesion: 0.23
Nodes (8): BudgetCategoryItem(), BudgetCategoryList(), EditableCategoryBudget, Props, SCOPE_ORDER, CategoryBudget, resolveBudgetScope(), GetBudgetSettingsUseCase

### Community 80 - "Community 80"
Cohesion: 0.39
Nodes (8): formatDueDate(), fromDateInput(), isValidDateParts(), parseDueDate(), RecurringBillForm(), startOfLocalDay(), toDateInput(), useCategories()

### Community 81 - "Community 81"
Cohesion: 0.26
Nodes (9): sqliteTransactionRunner(), TransactionRunner, buildExportDatasetUseCase, AppRepositories, ITransactionRepository, IWalletRepository, DeleteTransactionUseCase, UpdateTransactionUseCase (+1 more)

### Community 82 - "Community 82"
Cohesion: 0.41
Nodes (3): AuthService, isAndroidPlatform(), isBiometricUnlockSupportedPlatform()

### Community 83 - "Community 83"
Cohesion: 0.25
Nodes (8): documentSaver, DocumentSaverPlugin, SaveTextFileOptions, SaveTextFileResult, downloadInBrowser(), saveBackupFile(), downloadInBrowser(), saveErrorLogFile()

### Community 84 - "Community 84"
Cohesion: 0.22
Nodes (8): BottomSheet(), Props, DropdownListProps, DropdownOption, AppBackHandler, consumeAppBackButton(), handlers, registerAppBackHandler()

### Community 85 - "Community 85"
Cohesion: 0.33
Nodes (7): ensureWebStoreInitialized(), initDatabaseConnection(), getSQLiteEncryptionConfig(), SQLITE_ENCRYPTION_CONFIG, SQLiteEncryptionConfig, SQLiteEncryptionMode, applyPragmas()

### Community 90 - "Community 90"
Cohesion: 0.31
Nodes (4): assertCreditCardSettings(), generateId(), persistWeb(), WalletService

### Community 91 - "Community 91"
Cohesion: 0.53
Nodes (3): getDueRemindersUseCase, useRecurringBills(), useRecurringReminders()

## Knowledge Gaps
- **452 isolated node(s):** `config`, `name`, `private`, `version`, `type` (+447 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useLanguage()` connect `Community 5` to `Community 0`, `Community 1`, `Community 38`, `Community 41`, `Community 10`, `Community 74`, `Community 12`, `Community 77`, `Community 78`, `Community 79`, `Community 80`, `Community 14`, `Community 52`, `Community 21`, `Community 24`, `Community 28`, `Community 30`?**
  _High betweenness centrality (0.092) - this node is a cross-community bridge._
- **Why does `getDbConnection()` connect `Community 8` to `Community 0`, `Community 1`, `Community 34`, `Community 3`, `Community 6`, `Community 74`, `Community 11`, `Community 44`, `Community 10`, `Community 81`, `Community 85`, `Community 23`?**
  _High betweenness centrality (0.085) - this node is a cross-community bridge._
- **Why does `Wallet` connect `Community 44` to `Community 2`, `Community 5`, `Community 8`, `Community 9`, `Community 13`, `Community 14`, `Community 78`, `Community 48`, `Community 81`, `Community 90`, `Community 27`, `Community 30`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **What connects `config`, `name`, `private` to the rest of the system?**
  _452 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.08953900709219859 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.0676056338028169 - nodes in this community are weakly interconnected._
- **Should `Community 4` be split into smaller, more focused modules?**
  _Cohesion score 0.04878048780487805 - nodes in this community are weakly interconnected._