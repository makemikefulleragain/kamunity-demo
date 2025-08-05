# Comprehensive Batch Fix for Remaining Build Failures

## Critical Issues Identified:

### 1. Remaining API Routes with Deleted Operation File Imports:
- `actions/[id]/route.ts` - imports `getActionById`, `updateAction`, `deleteAction`, `getActionActivities`
- `actions/[id]/promote/route.ts` - imports `promotePrivateAction`
- `actions/[id]/activities/route.ts` - imports actions-operations
- `actions/route.ts` - still has partial imports from deleted file

### 2. TypeScript `any` Types to Fix:
- `middleware.ts:3` - `request: any`
- `auth-context.tsx:12,13,15` - error types should be specific
- `summaries/route.ts:21` - `whereClause: any`
- `rooms/request/route.ts:150` - `room: any`
- `conversations/route.ts:24` - `conv: any`
- `actions/detect/route.ts:79` - `result: any`

### 3. Unused Variables/Imports:
- Multiple `supabase` imports that are declared but never used
- Various unused function parameters

### 4. Missing Component Imports:
- Check for any missing UI component imports
- Verify all @/ path imports resolve correctly

### 5. Interface/Type Mismatches:
- Verify all Supabase schema types align with component props
- Check for any remaining Prisma-style naming conventions

## Batch Fix Strategy:
1. Replace all remaining deleted operation file imports with Supabase client
2. Add mock implementations for all missing functions
3. Fix all TypeScript `any` types with proper interfaces
4. Remove unused variables and imports
5. Verify all component imports resolve
6. Test build locally before pushing
