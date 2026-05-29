# Graph Report - TaiXiuCaNhan  (2026-05-29)

## Corpus Check
- 267 files · ~101,005 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1365 nodes · 3162 edges · 87 communities (79 shown, 8 thin omitted)
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
- [[_COMMUNITY_Community 83|Community 83]]
- [[_COMMUNITY_Community 84|Community 84]]
- [[_COMMUNITY_Community 86|Community 86]]
- [[_COMMUNITY_Community 90|Community 90]]

## God Nodes (most connected - your core abstractions)
1. `useLanguage()` - 111 edges
2. `getDbConnection()` - 84 edges
3. `Wallet` - 40 edges
4. `useToast()` - 31 edges
5. `useCurrency()` - 29 edges
6. `Transaction` - 28 edges
7. `config` - 24 edges
8. `InMemoryWalletRepository` - 24 edges
9. `AppRepositories` - 22 edges
10. `AccountType` - 21 edges

## Surprising Connections (you probably didn't know these)
- `explainReportQueries()` --calls--> `getDbConnection()`  [EXTRACTED]
  src/modules/reports/dev/query-explain.ts → src/core/db/sqlite/connection.ts
- `Props` --references--> `Transaction`  [EXTRACTED]
  src/modules/transactions/components/TransactionItem.tsx → src/modules/transactions/domain/transaction.model.ts
- `Props` --references--> `Transaction`  [EXTRACTED]
  src/modules/transactions/components/TransactionList.tsx → src/modules/transactions/domain/transaction.model.ts
- `WeekSummaryRow` --references--> `Transaction`  [EXTRACTED]
  src/modules/transactions/components/TransactionList.tsx → src/modules/transactions/domain/transaction.model.ts
- `Props` --references--> `Wallet`  [EXTRACTED]
  src/modules/wallets/components/WalletCard.tsx → src/modules/wallets/repositories/wallet.repository.ts

## Communities (87 total, 8 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.08
Nodes (29): AdvancedTransactionFilterSheet(), inputStyle, labelStyle, Props, toDateInputValue(), COLOR_PRESETS, Props, CATEGORY_ICON_LIBRARY_DEFINITIONS (+21 more)

### Community 1 - "Community 1"
Cohesion: 0.06
Nodes (46): CashflowBarChart(), Props, dateInputValue(), DateRangePicker(), Props, percentChange(), Props, ReportSummaryCards() (+38 more)

### Community 2 - "Community 2"
Cohesion: 0.09
Nodes (31): formatDueDate(), fromDateInput(), isValidDateParts(), parseDueDate(), Props, RecurringBillForm(), startOfLocalDay(), toDateInput() (+23 more)

### Community 3 - "Community 3"
Cohesion: 0.13
Nodes (11): IBudgetRepository, CalculateBudgetProgressUseCase, BUDGET_THRESHOLDS, classifyBudgetStatus(), GetBudgetSettingsUseCase, ListBudgetAlertsUseCase, budget, calculateProgress (+3 more)

### Community 4 - "Community 4"
Cohesion: 0.05
Nodes (40): config, configFile, forbidOnly, fullyParallel, globalSetup, globalTeardown, globalTimeout, grep (+32 more)

### Community 5 - "Community 5"
Cohesion: 0.15
Nodes (13): BudgetAlertsPanel(), ACCOUNT_TYPE_ICONS, BudgetByAccountTypeSummary(), STATUS_COLORS, BudgetSummaryStats(), Props, StatCardProps, useBudgetAddForm() (+5 more)

### Community 6 - "Community 6"
Cohesion: 0.08
Nodes (34): BackupMetadata, BackupPayload, BackupRow, ValidationResult, importBackupJson(), readBackupFile(), LegacyRestorableBackupPayload, RestorableBackupPayload (+26 more)

### Community 7 - "Community 7"
Cohesion: 0.09
Nodes (22): AuthResult, AuthService, BIOMETRIC_UNLOCK_SUPPORTED_PLATFORMS, BiometricAuthEvent, BiometricListenerPlugin, isAndroidPlatform(), isBiometricUnlockSupportedPlatform(), isNativePlatform() (+14 more)

### Community 8 - "Community 8"
Cohesion: 0.11
Nodes (8): generateId(), SQLiteBudgetRepository, generateId(), mapWallet(), SQLiteWalletRepository, ensureBalanceAdjustmentCategory(), getDbConnection(), isManagedTransactionActive()

### Community 9 - "Community 9"
Cohesion: 0.13
Nodes (13): immediateTransactionRunner(), createUseCase, deleteUseCase, FailingTransactionRepository, input, invalidInput, oldTx, paymentUseCase (+5 more)

### Community 10 - "Community 10"
Cohesion: 0.13
Nodes (10): Props, ReceiptCapture(), ReceiptStorageService, createUseCase, existingNoReceipt, existingWithReceipt, input, mockDb (+2 more)

### Community 11 - "Community 11"
Cohesion: 0.19
Nodes (8): Props, mapToTransaction(), CreateTransactionInput, Transaction, TransactionFilter, UpdateTransactionInput, InMemoryTransactionRepository, SQLiteTransactionRepository

### Community 12 - "Community 12"
Cohesion: 0.14
Nodes (11): nativeTransactionQueue, runExclusive(), runInTransaction(), categoryInserts, dbError, insertedCategoryIds, repository, requiredTables (+3 more)

### Community 13 - "Community 13"
Cohesion: 0.13
Nodes (16): Props, Props, Props, Props, STATUS_CONFIG, BudgetProgress, RecurringBillReminder, BUDGET_STATUS_ORDER (+8 more)

### Community 14 - "Community 14"
Cohesion: 0.21
Nodes (8): createCreditCardPaymentUseCase, createTransactionUseCase, updateTransactionUseCase, ListTransactionsUseCase, localizeMessage(), localizeTransactionError(), MESSAGE_KEYS, Translate

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
Cohesion: 0.09
Nodes (48): BackButton(), BackButtonProps, BiometricUnlockSettings(), BudgetAddSheet(), BudgetEditSheet(), CategoryForm(), getLocalizedCategoryDescription(), CategoryList() (+40 more)

### Community 22 - "Community 22"
Cohesion: 0.12
Nodes (17): BudgetCategoryItem(), Props, BudgetCategoryList(), EditableCategoryBudget, Props, SCOPE_ORDER, BudgetScopeBadge(), Props (+9 more)

### Community 23 - "Community 23"
Cohesion: 0.22
Nodes (6): ENV, Logger, LogOptions, normalizeError(), normalizeMetadata(), toSafeLogValue()

### Community 24 - "Community 24"
Cohesion: 0.16
Nodes (9): DonutItem, normalizeDonutData(), NormalizeDonutDataOptions, RawDonutItem, DonutCenterLabelProps, DonutLegendProps, ReportDonutCardProps, colors (+1 more)

### Community 25 - "Community 25"
Cohesion: 0.18
Nodes (12): ActivityCallback, ActivityResult, PluginCall, PluginMethod, String, PluginCall, PluginMethod, String (+4 more)

### Community 26 - "Community 26"
Cohesion: 0.12
Nodes (16): biometricAuth, biometricSubTitle, biometricTitle, appId, appName, androidBiometric, androidIsEncryption, iosBiometric (+8 more)

### Community 28 - "Community 28"
Cohesion: 0.18
Nodes (13): buildErrorLogExportPayload(), ErrorLogExportItem, ErrorLogExportPayload, exportErrorLogsToJson(), isDatabaseReady(), canUseLocalStorage(), ErrorLogRecord, ErrorLogRepository (+5 more)

### Community 29 - "Community 29"
Cohesion: 0.29
Nodes (6): ConfirmContext, ConfirmContextType, ConfirmOptions, ConfirmProvider(), ConfirmDialog(), ConfirmDialogProps

### Community 30 - "Community 30"
Cohesion: 0.09
Nodes (24): CreditCardStatementStatus, addDays(), addMonths(), buildDueDate(), clampedDate(), CreditCardService, CreditCardStatementPeriod, CreditCardSummary (+16 more)

### Community 31 - "Community 31"
Cohesion: 0.14
Nodes (13): compilerOptions, esModuleInterop, forceConsistentCasingInFileNames, lib, module, outDir, resolveJsonModule, rootDir (+5 more)

### Community 32 - "Community 32"
Cohesion: 0.14
Nodes (13): compilerOptions, allowImportingTsExtensions, composite, isolatedModules, module, moduleResolution, noEmit, resolveJsonModule (+5 more)

### Community 33 - "Community 33"
Cohesion: 0.24
Nodes (8): LoadingScreen(), ACTIVITY_EVENTS, AppBootstrapProps, DEFAULT_CATEGORIES, DefaultCategory, DefaultCategoryType, insertDefaultCategories(), seedDefaultData()

### Community 34 - "Community 34"
Cohesion: 0.29
Nodes (7): sqliteTransactionRunner(), TransactionRunner, buildExportDatasetUseCase, AppRepositories, ITransactionRepository, IWalletRepository, DeleteTransactionUseCase

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
Cohesion: 0.46
Nodes (7): columnExists(), executeMigrationStatement(), markMigrationDone(), MIGRATIONS, parseAddColumnStatement(), runMigrations(), splitSqlStatements()

### Community 39 - "Community 39"
Cohesion: 0.22
Nodes (8): compilerOptions, allowSyntheticDefaultImports, composite, module, moduleResolution, skipLibCheck, strict, include

### Community 40 - "Community 40"
Cohesion: 0.07
Nodes (23): ErrorScreen(), ErrorScreenProps, CurrencyProvider(), LanguageProvider(), applyKeyboardScrollPadding(), getKeyboardScrollContainer(), getScrollableParent(), restoreScrollPadding() (+15 more)

### Community 41 - "Community 41"
Cohesion: 0.09
Nodes (22): LocalizedCategoryIconPreset, Language, NestedKeyOf, TranslationKey, TranslationPath, translations, LanguageContextType, buildTimestamp() (+14 more)

### Community 42 - "Community 42"
Cohesion: 0.22
Nodes (9): scripts, build, dev, lint, postinstall, preview, test, test:ui (+1 more)

### Community 43 - "Community 43"
Cohesion: 0.26
Nodes (8): explainReportQueries(), ensureWebStoreInitialized(), initDatabaseConnection(), getSQLiteEncryptionConfig(), SQLITE_ENCRYPTION_CONFIG, SQLiteEncryptionConfig, SQLiteEncryptionMode, applyPragmas()

### Community 44 - "Community 44"
Cohesion: 0.29
Nodes (4): ACCOUNT_TYPE_ORDER, Props, Wallet, filterActiveWallets()

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
Cohesion: 0.20
Nodes (8): validateUpdateTransaction(), UpdateTransactionUseCase, base, err, midnight, now, row, tx

### Community 49 - "Community 49"
Cohesion: 0.33
Nodes (5): bundleVersion, _comment, minNativeVersionCodeForBundle, nativeVersionCode, nativeVersionName

### Community 52 - "Community 52"
Cohesion: 0.18
Nodes (23): Props, BudgetEditForm(), Props, Props, ALL_ACCOUNT_TYPES, BudgetScopePicker(), Props, CategoryIcon() (+15 more)

### Community 73 - "Community 73"
Cohesion: 0.25
Nodes (7): Props, TransactionItem(), DaySummaryRow, MonthSummaryRow, Props, SummaryRow, WeekSummaryRow

### Community 74 - "Community 74"
Cohesion: 0.21
Nodes (7): TransactionValidationError, validateCreateTransaction(), CreateCreditCardPaymentInput, CreateCreditCardPaymentUseCase, CreateTransactionUseCase, getSourceDelta(), validateActiveWallet()

### Community 75 - "Community 75"
Cohesion: 0.18
Nodes (13): listTransactionsUseCase, useBudgetAnalysis(), useBudgets(), useRecurringBills(), useRecurringReminders(), TransactionSummary, useTransactionSummary(), useWalletBalances() (+5 more)

### Community 76 - "Community 76"
Cohesion: 0.25
Nodes (7): code:block1 (Error: expect(locator).toBeVisible() failed), code:yaml (- main:), code:ts (63  |), Error details, Instructions, Test info, Test source

### Community 77 - "Community 77"
Cohesion: 0.53
Nodes (4): DatabaseDiagnostics(), countCategories(), getSchemaVersion(), listTables()

### Community 78 - "Community 78"
Cohesion: 0.14
Nodes (19): CurrencyAmountInput(), CurrencyAmountInputProps, formatAmountInput(), getFractionDigits(), ACCOUNT_TYPE_ICONS, ACCOUNT_TYPE_LABELS, formatDayMonth(), Props (+11 more)

### Community 79 - "Community 79"
Cohesion: 0.43
Nodes (5): Toast(), ToastProps, ToastType, ToastContext, ToastContextType

### Community 83 - "Community 83"
Cohesion: 0.07
Nodes (46): documentSaver, DocumentSaverPlugin, SaveTextFileOptions, SaveTextFileResult, SaveTextFileToDownloadsOptions, formatLastRunAt(), forceAppUnlock(), resumeAppLock() (+38 more)

### Community 84 - "Community 84"
Cohesion: 0.22
Nodes (8): BottomSheet(), Props, DropdownListProps, DropdownOption, AppBackHandler, consumeAppBackButton(), handlers, registerAppBackHandler()

### Community 90 - "Community 90"
Cohesion: 0.19
Nodes (12): Props, StoredStatement, UseWalletsReturn, CreateWalletInput, UpdateWalletInput, UpsertCreditCardStatementInput, WalletReferenceCounts, assertCreditCardSettings() (+4 more)

## Knowledge Gaps
- **464 isolated node(s):** `config`, `name`, `private`, `version`, `type` (+459 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useLanguage()` connect `Community 21` to `Community 0`, `Community 1`, `Community 2`, `Community 5`, `Community 7`, `Community 40`, `Community 73`, `Community 41`, `Community 75`, `Community 44`, `Community 14`, `Community 78`, `Community 83`, `Community 52`, `Community 22`, `Community 24`?**
  _High betweenness centrality (0.080) - this node is a cross-community bridge._
- **Why does `getDbConnection()` connect `Community 8` to `Community 0`, `Community 33`, `Community 2`, `Community 1`, `Community 3`, `Community 38`, `Community 6`, `Community 10`, `Community 43`, `Community 12`, `Community 77`, `Community 14`, `Community 11`, `Community 83`, `Community 52`, `Community 90`, `Community 28`?**
  _High betweenness centrality (0.071) - this node is a cross-community bridge._
- **Why does `Wallet` connect `Community 44` to `Community 0`, `Community 8`, `Community 9`, `Community 74`, `Community 13`, `Community 78`, `Community 21`, `Community 90`, `Community 27`, `Community 30`?**
  _High betweenness centrality (0.037) - this node is a cross-community bridge._
- **What connects `config`, `name`, `private` to the rest of the system?**
  _464 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.07764705882352942 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.061668289516390785 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.08627450980392157 - nodes in this community are weakly interconnected._