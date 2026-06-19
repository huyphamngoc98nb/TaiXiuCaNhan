# Android Manual Test: Money Keyboard

Scope: Capacitor Android build, custom in-app money keyboard, native keyboard still enabled for normal text/date fields.

## Checklist

- Add Transaction: tap the amount field. The custom money keyboard opens, the amount field remains visible below the sticky header, and the form can still scroll.
- Add Transaction: tap note after closing the money keyboard. The native keyboard opens normally and safe-focus scrolling still works.
- Wallet form sheet: tap initial balance/current outstanding, credit limit, and annual fee. The keyboard is fixed to the screen bottom, is not clipped by the sheet, and each field scrolls above it.
- Wallet form sheet: statement day and due day still use the native numeric keyboard, not the money keyboard.
- Budget add sheet and budget edit form/sheet: tap budget amount. The field scrolls into view, footer actions do not trap scrolling, and the keyboard can be dismissed with Done.
- Recurring bill form: tap amount. The money keyboard opens; reminder days still uses the native numeric keyboard.
- Loan form and loan payment form: tap principal/payment amount. The keyboard opens, the field stays visible, and text/note fields still use the native keyboard.
- Calculator mode: open Calculator, apply a valid expression, and confirm the amount field is updated and formatted after returning to number mode.
- Rotate or resize once while the money keyboard is open. The keyboard height variable updates and the active field remains reachable.
- Open a confirm dialog while a form exists. The dialog remains above the money keyboard.
