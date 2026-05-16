# Refactor Plan Tracker

## Completed

- [ ] Repo already inspected for CreateBill + GirviLedger.

## To do (next)

1. [ ] Create new reusable components for CreateBillPage:
   - [ ] FieldCard
   - [ ] ProductRow
   - [ ] SavedBillsPanel
   - [ ] BillPreview
2. [ ] Extract reusable pure functions from CreateBillPage to lib:
   - [ ] toNumberOrZero
   - [ ] buildBillHtml
3. [ ] Create `CreateBillPage.css` and move inline styles to classNames.
4. [ ] Refactor `src/features/girviLedger/CreateBillPage.jsx` to use components.
5. [ ] Refactor `src/features/girviLedger/GirviLedger.jsx` for readability:
   - [ ] move inline blocks (toasts/panels/header) into small components where useful
   - [ ] extract repeated logic helpers to lib if applicable
6. [ ] Run lint/build/dev sanity checks.
