# Graph Report - TaiXiuCaNhan  (2026-05-28)

## Corpus Check
- 257 files · ~81,162 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1241 nodes · 2973 edges · 87 communities (80 shown, 7 thin omitted)
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

## God Nodes (most connected - your core abstractions)
1. `useLanguage()` - 111 edges
2. `getDbConnection()` - 81 edges
3. `Wallet` - 40 edges
4. `useToast()` - 31 edges
5. `useCurrency()` - 29 edges
6. `Transaction` - 28 edges
7. `InMemoryWalletRepository` - 24 edges
8. `AppRepositories` - 22 edges
9. `AccountType` - 21 edges
10. `IWalletRepository` - 21 edges

## Surprising Connections (you probably didn't know these)
- `Props` --references--> `BudgetProgress`  [EXTRACTED]
  src/modules/budgets/components/BudgetAlertsPanel.tsx → src/modules/budgets/domain/budget.model.ts
- `Props` --references--> `BudgetProgress`  [EXTRACTED]
  src/modules/budgets/components/BudgetByAccountTypeSummary.tsx → src/modules/budgets/domain/budget.model.ts
- `Props` --references--> `PeriodSummary`  [EXTRACTED]
  src/modules/reports/components/CashflowBarChart.tsx → src/modules/reports/domain/report.model.ts
- `Props` --references--> `Wallet`  [EXTRACTED]
  src/modules/wallets/components/WalletCard.tsx → src/modules/wallets/repositories/wallet.repository.ts
- `Props` --references--> `Wallet`  [EXTRACTED]
  src/modules/wallets/components/WalletList.tsx → src/modules/wallets/repositories/wallet.repository.ts

## Communities (87 total, 7 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.16
Nodes (13): TranslationPath, LanguageContext, LanguageContextType, LanguageProvider(), buildTimestamp(), DateTimePicker(), formatDateDisplay(), formatPreview() (+5 more)

### Community 1 - "Community 1"
Cohesion: 0.07
Nodes (41): dateInputValue(), DateRangePicker(), Props, Props, ReportSummaryCards(), dumpReportData(), CashflowSummary, CategorySummary (+33 more)

### Community 2 - "Community 2"
Cohesion: 0.05
Nodes (48): Props, Props, STATUS_COLORS, Props, STATUS_CONFIG, getDueRemindersUseCase, listTransactionsUseCase, CreateRecurringBillInput (+40 more)

### Community 3 - "Community 3"
Cohesion: 0.19
Nodes (12): ACCOUNT_TYPE_LABELS, Budget, BudgetWithCategory, CreateBudgetDto, Wallet, BUDGET_THRESHOLDS, classifyBudgetStatus(), budget (+4 more)

### Community 4 - "Community 4"
Cohesion: 0.26
Nodes (13): Props, Props, Props, Props, AccountType, BudgetPeriod, CategoryBudget, BudgetScopeType (+5 more)

### Community 5 - "Community 5"
Cohesion: 0.17
Nodes (13): BudgetAlertsPanel(), Props, ACCOUNT_TYPE_ICONS, BudgetByAccountTypeSummary(), Props, STATUS_COLORS, useBudgetAddForm(), useBudgetEditForm() (+5 more)

### Community 6 - "Community 6"
Cohesion: 0.08
Nodes (35): BackupMetadata, BackupPayload, BackupRow, ValidationResult, exportBackupJson(), importBackupJson(), readBackupFile(), LegacyRestorableBackupPayload (+27 more)

### Community 7 - "Community 7"
Cohesion: 0.15
Nodes (13): AuthResult, BIOMETRIC_UNLOCK_SUPPORTED_PLATFORMS, BiometricAuthEvent, BiometricListenerPlugin, isNativePlatform(), nativeBiometric, NativeBiometricAuthResult, NativeBiometricAvailability (+5 more)

### Community 8 - "Community 8"
Cohesion: 0.06
Nodes (29): DatabaseDiagnostics(), explainReportQueries(), generateId(), SQLiteBudgetRepository, generateId(), mapWallet(), SQLiteWalletRepository, buildErrorLogExportPayload() (+21 more)

### Community 9 - "Community 9"
Cohesion: 0.14
Nodes (12): createUseCase, deleteUseCase, FailingTransactionRepository, input, invalidInput, oldTx, paymentUseCase, transactionRepository (+4 more)

### Community 10 - "Community 10"
Cohesion: 0.33
Nodes (5): CreateTransactionInput, TransactionFilter, UpdateTransactionInput, TransactionValidationError, validateUpdateTransaction()

### Community 11 - "Community 11"
Cohesion: 0.15
Nodes (8): Props, Props, Props, WeekSummaryRow, mapToTransaction(), Transaction, InMemoryTransactionRepository, SQLiteTransactionRepository

### Community 12 - "Community 12"
Cohesion: 0.21
Nodes (10): immediateTransactionRunner(), sqliteTransactionRunner(), TransactionRunner, buildExportDatasetUseCase, AppRepositories, ITransactionRepository, IWalletRepository, CreateCreditCardPaymentInput (+2 more)

### Community 13 - "Community 13"
Cohesion: 0.18
Nodes (13): CreditCardStatementStatus, addDays(), addMonths(), buildDueDate(), clampedDate(), CreditCardService, CreditCardStatementPeriod, daysInMonth() (+5 more)

### Community 14 - "Community 14"
Cohesion: 0.16
Nodes (15): BottomSheet(), Props, BudgetAddSheet(), BudgetEditForm(), BudgetEditSheet(), ALL_ACCOUNT_TYPES, BudgetScopePicker(), CategoryIcon() (+7 more)

### Community 15 - "Community 15"
Cohesion: 0.18
Nodes (6): Props, BudgetProgress, IBudgetRepository, CalculateBudgetProgressUseCase, GetBudgetSettingsUseCase, ListBudgetAlertsUseCase

### Community 16 - "Community 16"
Cohesion: 0.09
Nodes (21): dependencies, cors, express, description, devDependencies, ts-node-dev, @types/cors, @types/express (+13 more)

### Community 17 - "Community 17"
Cohesion: 0.09
Nodes (22): devDependencies, autoprefixer, @capacitor/cli, copyfiles, eslint, eslint-plugin-react-hooks, eslint-plugin-react-refresh, jsdom (+14 more)

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
Cohesion: 0.18
Nodes (16): WalletForm(), ConfirmContext, ConfirmContextType, ConfirmOptions, ConfirmProvider(), useConfirm(), ConfirmDialog(), ConfirmDialogProps (+8 more)

### Community 22 - "Community 22"
Cohesion: 0.18
Nodes (11): BiometricUnlockSettings(), BudgetSummaryStats(), Props, StatCardProps, CategoryList(), EmptyBudgetPrompt(), Props, LanguageSettings() (+3 more)

### Community 23 - "Community 23"
Cohesion: 0.12
Nodes (11): Props, ReceiptCapture(), ReceiptStorageService, UpdateTransactionUseCase, createUseCase, existingNoReceipt, existingWithReceipt, input (+3 more)

### Community 24 - "Community 24"
Cohesion: 0.14
Nodes (15): BudgetCategoryItem(), Props, BudgetCategoryList(), EditableCategoryBudget, Props, SCOPE_ORDER, BudgetScopeBadge(), Props (+7 more)

### Community 25 - "Community 25"
Cohesion: 0.21
Nodes (10): ActivityCallback, ActivityResult, PluginCall, PluginMethod, PluginCall, PluginMethod, DocumentSaverPlugin, NativeBiometricPlugin (+2 more)

### Community 26 - "Community 26"
Cohesion: 0.12
Nodes (16): biometricAuth, biometricSubTitle, biometricTitle, appId, appName, androidBiometric, androidIsEncryption, iosBiometric (+8 more)

### Community 28 - "Community 28"
Cohesion: 0.13
Nodes (10): AppUnlock(), AppUnlockProps, PIN_KEYS, UnlockMode, GlobalErrorBoundary, renderBootstrap(), authServiceMock, onUnlocked (+2 more)

### Community 29 - "Community 29"
Cohesion: 0.22
Nodes (5): createCreditCardPaymentUseCase, createTransactionUseCase, updateTransactionUseCase, CreateCreditCardPaymentUseCase, ListTransactionsUseCase

### Community 30 - "Community 30"
Cohesion: 0.41
Nodes (3): AuthService, isAndroidPlatform(), isBiometricUnlockSupportedPlatform()

### Community 31 - "Community 31"
Cohesion: 0.14
Nodes (13): compilerOptions, esModuleInterop, forceConsistentCasingInFileNames, lib, module, outDir, resolveJsonModule, rootDir (+5 more)

### Community 32 - "Community 32"
Cohesion: 0.14
Nodes (13): compilerOptions, allowImportingTsExtensions, composite, isolatedModules, module, moduleResolution, noEmit, resolveJsonModule (+5 more)

### Community 33 - "Community 33"
Cohesion: 0.24
Nodes (7): ErrorScreen(), ErrorScreenProps, LoadingScreen(), ACTIVITY_EVENTS, AppBootstrapProps, GlobalErrorBoundaryProps, GlobalErrorBoundaryState

### Community 34 - "Community 34"
Cohesion: 0.16
Nodes (19): BackButton(), BackButtonProps, formatDueDate(), fromDateInput(), isValidDateParts(), parseDueDate(), RecurringBillForm(), startOfLocalDay() (+11 more)

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
Cohesion: 0.15
Nodes (10): DonutItem, normalizeDonutData(), NormalizeDonutDataOptions, RawDonutItem, DonutCenterLabelProps, DonutLegendProps, ReportDonutCard(), ReportDonutCardProps (+2 more)

### Community 39 - "Community 39"
Cohesion: 0.22
Nodes (8): compilerOptions, allowSyntheticDefaultImports, composite, module, moduleResolution, skipLibCheck, strict, include

### Community 40 - "Community 40"
Cohesion: 0.36
Nodes (6): applyKeyboardScrollPadding(), getKeyboardScrollContainer(), getScrollableParent(), restoreScrollPadding(), scrollElementIntoKeyboardSafeView(), ScrollPaddingState

### Community 41 - "Community 41"
Cohesion: 0.05
Nodes (44): AdvancedTransactionFilterSheet(), inputStyle, labelStyle, Props, toDateInputValue(), CategoryForm(), COLOR_PRESETS, Props (+36 more)

### Community 42 - "Community 42"
Cohesion: 0.25
Nodes (8): scripts, build, dev, lint, postinstall, preview, test, typecheck

### Community 43 - "Community 43"
Cohesion: 0.19
Nodes (5): Wallet, CreditCardSummary, assertCreditCardSettings(), generateId(), WalletService

### Community 44 - "Community 44"
Cohesion: 0.12
Nodes (13): DEFAULT_CATEGORIES, DefaultCategory, DefaultCategoryType, insertDefaultCategories(), seedDefaultData(), categoryInserts, dbError, insertedCategoryIds (+5 more)

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
Cohesion: 0.46
Nodes (7): columnExists(), executeMigrationStatement(), markMigrationDone(), MIGRATIONS, parseAddColumnStatement(), runMigrations(), splitSqlStatements()

### Community 49 - "Community 49"
Cohesion: 0.33
Nodes (5): bundleVersion, _comment, minNativeVersionCodeForBundle, nativeVersionCode, nativeVersionName

### Community 52 - "Community 52"
Cohesion: 0.29
Nodes (8): persistWeb(), ensureWebStoreInitialized(), initDatabaseConnection(), getSQLiteEncryptionConfig(), SQLITE_ENCRYPTION_CONFIG, SQLiteEncryptionConfig, SQLiteEncryptionMode, applyPragmas()

### Community 73 - "Community 73"
Cohesion: 0.20
Nodes (9): resumeAppLock(), suspendAppLock(), AppBootstrap(), appListeners, authServiceMock, capacitorMock, migrationsMock, seedMock (+1 more)

### Community 74 - "Community 74"
Cohesion: 0.17
Nodes (7): ENV, installGlobalErrorLogging(), Logger, LogOptions, normalizeError(), normalizeMetadata(), toSafeLogValue()

### Community 75 - "Community 75"
Cohesion: 0.15
Nodes (10): asOf, closedStatementAsOf, creditCard, firstStatement, overdueAsOf, period, repo, statement (+2 more)

### Community 76 - "Community 76"
Cohesion: 0.27
Nodes (8): CurrencyAmountInput(), CurrencyAmountInputProps, formatAmountInput(), getFractionDigits(), TransactionForm(), CurrencyCode, useTransactionForm(), AddTransactionPage()

### Community 77 - "Community 77"
Cohesion: 0.14
Nodes (20): CashflowBarChart(), Props, CurrencySettings(), RecurringBillList(), percentChange(), TransactionItem(), DaySummaryRow, MonthSummaryRow (+12 more)

### Community 78 - "Community 78"
Cohesion: 0.23
Nodes (10): ACCOUNT_TYPE_ICONS, ACCOUNT_TYPE_LABELS, formatDayMonth(), Props, WalletCard(), ACCOUNT_TYPES, COLOR_PRESETS, EMOJI_PRESETS (+2 more)

### Community 79 - "Community 79"
Cohesion: 0.40
Nodes (7): Props, StoredStatement, UseWalletsReturn, CreateWalletInput, UpdateWalletInput, UpsertCreditCardStatementInput, WalletReferenceCounts

### Community 80 - "Community 80"
Cohesion: 0.24
Nodes (4): ACCOUNT_TYPE_ORDER, Props, WalletList(), filterActiveWallets()

### Community 81 - "Community 81"
Cohesion: 0.39
Nodes (4): validateCreateTransaction(), CreateTransactionUseCase, getSourceDelta(), validateActiveWallet()

### Community 82 - "Community 82"
Cohesion: 0.38
Nodes (5): deleteTransactionUseCase, localizeMessage(), localizeTransactionError(), MESSAGE_KEYS, Translate

### Community 83 - "Community 83"
Cohesion: 0.25
Nodes (8): documentSaver, DocumentSaverPlugin, SaveTextFileOptions, SaveTextFileResult, downloadInBrowser(), saveBackupFile(), downloadInBrowser(), saveErrorLogFile()

### Community 84 - "Community 84"
Cohesion: 0.29
Nodes (6): base, err, midnight, now, row, tx

### Community 85 - "Community 85"
Cohesion: 0.40
Nodes (5): CurrencyProvider(), useKeyboardSafeFocus(), AppProvider(), router, ToastProvider()

### Community 86 - "Community 86"
Cohesion: 0.50
Nodes (3): EXPORT_COPY, ExportPage(), shareFile()

## Knowledge Gaps
- **393 isolated node(s):** `config`, `name`, `private`, `version`, `type` (+388 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useLanguage()` connect `Community 22` to `Community 0`, `Community 1`, `Community 2`, `Community 4`, `Community 5`, `Community 14`, `Community 21`, `Community 24`, `Community 28`, `Community 29`, `Community 34`, `Community 38`, `Community 41`, `Community 76`, `Community 77`, `Community 78`, `Community 80`, `Community 82`, `Community 86`?**
  _High betweenness centrality (0.111) - this node is a cross-community bridge._
- **Why does `getDbConnection()` connect `Community 8` to `Community 1`, `Community 2`, `Community 3`, `Community 4`, `Community 6`, `Community 41`, `Community 11`, `Community 44`, `Community 12`, `Community 79`, `Community 48`, `Community 52`, `Community 23`, `Community 29`?**
  _High betweenness centrality (0.066) - this node is a cross-community bridge._
- **Why does `Wallet` connect `Community 43` to `Community 2`, `Community 8`, `Community 9`, `Community 41`, `Community 75`, `Community 12`, `Community 13`, `Community 78`, `Community 79`, `Community 80`, `Community 81`, `Community 21`, `Community 27`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **What connects `config`, `name`, `private` to the rest of the system?**
  _393 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.06768388106416276 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.05228105228105228 - nodes in this community are weakly interconnected._
- **Should `Community 6` be split into smaller, more focused modules?**
  _Cohesion score 0.08013937282229965 - nodes in this community are weakly interconnected._