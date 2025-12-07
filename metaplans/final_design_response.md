# LockIn System - Backend & Web Implementation Plan

## Executive Summary

Extend the existing clean architecture LockIn app to support:
- User deposits and balance management
- Creating fitness commitments (LockIns) with staked money
- Progress monitoring via Cloud Scheduler
- Rewards (badges + refunds) for success or donations to NGOs for failure
- Web UI for all operations

**Key Decisions**:
- Storage: Google Cloud Firestore + MockStorageService for testing
- Payments: MockPaymentService only (real Stripe integration deferred)
- Scheduling: Cloud Scheduler + Pub/Sub for progress checks
- Penalties: "All or Nothing" strategy (extensible design for future strategies)

## Architecture Overview

Building on existing clean architecture (Phases 1-5 complete):

```
HTTP / Scheduled Jobs Layer
  ↓ Controllers + Cloud Functions
Domain Layer (NEW)
  ├── Models: LockIn, UserProfile, Badge, Transaction, NGO
  ├── Repositories: IUserRepository, ILockInRepository
  ├── Use Cases: DepositFunds, CreateLockIn, CheckProgress, CompleteLockIn
  └── Strategies: IPenaltyStrategy (All/None, Proportional, Tiered, Grace)
  ↓
Service Layer (EXTENDED)
  ├── IStorageService → FirestoreStorageService, MockStorageService (NEW)
  ├── IPaymentService → MockPaymentService (NEW)
  ├── INotificationService → NoOpNotificationService (placeholder)
  ├── IFitnessService → GoogleFitness, Mock (EXISTING)
  └── IAuthService → Google OAuth2, Mock (EXISTING)
  ↓
Infrastructure Layer (EXTENDED)
  ├── AppConfig (add Firestore, payment config)
  ├── Mock Data (users, badges, NGOs)
  └── Mappers (Firestore ↔ Domain)
```

**Follows Existing Patterns**:
- ServiceFactory with `USE_MOCKS` flag for all new services
- Constructor injection in use cases
- Repository interfaces for data access abstraction
- AuthenticatedRequest interface with Bearer token
- Consistent error handling via errorMiddleware

## Phase 6: Shared Types & Constants

### New Type Files

**`/src/shared/types/LockIn.types.ts`** (NEW)
```typescript
interface LockIn {
  id: string;
  userId: string;
  activityType: number;          // Google Fitness activity code
  targetWorkouts: number;
  durationDays: number;
  stakeAmountCents: number;       // Amount in cents (5000 = $50.00)
  penaltyType: PenaltyType;
  status: LockInStatus;
  completedWorkouts: number;
  startDate: string;              // ISO timestamp
  endDate: string;                // ISO timestamp
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  badgeId?: string;
  transactionId?: string;
}

enum LockInStatus {
  ACTIVE = 'active',
  COMPLETED_SUCCESS = 'completed_success',
  COMPLETED_FAILED = 'completed_failed',
  CANCELLED = 'cancelled'
}

enum PenaltyType {
  ALL_OR_NOTHING = 'all_or_nothing',
  PROPORTIONAL = 'proportional',
  TIERED = 'tiered',
  GRACE_PERIOD = 'grace_period'
}

interface LockInProgress {
  lockInId: string;
  completedWorkouts: number;
  targetWorkouts: number;
  percentComplete: number;
  daysElapsed: number;
  daysRemaining: number;
  isOnTrack: boolean;
  projectedCompletion: number;
  requiredPacePerDay: number;
}

interface CreateLockInRequest {
  activityType: number;
  targetWorkouts: number;
  durationDays: number;
  stakeAmountCents: number;
  penaltyType: PenaltyType;
}
```

**`/src/shared/types/UserProfile.types.ts`** (NEW)
```typescript
interface UserProfile extends User {
  balanceCents: number;           // Available balance
  totalDepositedCents: number;    // Lifetime deposits
  totalStakedCents: number;       // Currently locked in active LockIns
  createdAt: string;
  updatedAt: string;
  badges: string[];               // Badge IDs
  completedLockIns: number;
  failedLockIns: number;
}

interface DepositRequest {
  amountCents: number;
  paymentMethodId?: string;       // For future Stripe integration
}

interface DepositResponse {
  success: boolean;
  newBalanceCents: number;
  transactionId: string;
}
```

**`/src/shared/types/Badge.types.ts`** (NEW)
```typescript
interface Badge {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  activityType: number;           // 0 = any activity
  minWorkouts: number;
  tier: BadgeTier;
}

enum BadgeTier {
  BRONZE = 'bronze',
  SILVER = 'silver',
  GOLD = 'gold',
  PLATINUM = 'platinum'
}

interface EarnedBadge {
  badgeId: string;
  earnedAt: string;
  lockInId: string;
}
```

**`/src/shared/types/Transaction.types.ts`** (NEW)
```typescript
interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amountCents: number;
  status: TransactionStatus;
  lockInId?: string;
  paymentMethodId?: string;
  ngoRecipientId?: string;
  createdAt: string;
  updatedAt: string;
  description: string;
}

enum TransactionType {
  DEPOSIT = 'deposit',
  STAKE = 'stake',
  REFUND = 'refund',
  DONATION = 'donation'
}

enum TransactionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}
```

**`/src/shared/types/NGO.types.ts`** (NEW)
```typescript
interface NGO {
  id: string;
  name: string;
  description: string;
  logoUrl: string;
  websiteUrl: string;
  isActive: boolean;
  totalDonatedCents: number;
}
```

## Phase 7: Service Layer - Storage

### Storage Service Interface

**`/src/backend/services/interfaces/IStorageService.ts`** (NEW)
```typescript
interface IStorageService {
  // User operations
  getUserProfile(userId: string): Promise<UserProfile | null>;
  createUserProfile(profile: UserProfile): Promise<void>;
  updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<void>;

  // LockIn operations
  getLockIn(lockInId: string): Promise<LockIn | null>;
  getLockInsByUser(userId: string, status?: string): Promise<LockIn[]>;
  getActiveLockIns(): Promise<LockIn[]>;
  createLockIn(lockIn: LockIn): Promise<void>;
  updateLockIn(lockInId: string, updates: Partial<LockIn>): Promise<void>;

  // Transaction operations
  getTransaction(transactionId: string): Promise<Transaction | null>;
  getTransactionsByUser(userId: string): Promise<Transaction[]>;
  createTransaction(transaction: Transaction): Promise<void>;
  updateTransaction(transactionId: string, updates: Partial<Transaction>): Promise<void>;

  // Badge operations
  getBadge(badgeId: string): Promise<Badge | null>;
  getAllBadges(): Promise<Badge[]>;
  getUserBadges(userId: string): Promise<EarnedBadge[]>;
  awardBadge(userId: string, badgeId: string, lockInId: string): Promise<void>;

  // NGO operations
  getNGO(ngoId: string): Promise<NGO | null>;
  getActiveNGOs(): Promise<NGO[]>;
  updateNGODonation(ngoId: string, amountCents: number): Promise<void>;
}
```

### Mock Storage Implementation

**`/src/backend/services/storage/MockStorageService.ts`** (NEW)
- In-memory Maps for users, lockIns, transactions, badges, earnedBadges, ngos
- Initialize with mock data in constructor
- Simulate 50ms network delay for realism
- Log all operations with console emojis (🎭 prefix)
- Follow pattern from MockAuthService and MockFitnessService

### Firestore Storage Implementation

**`/src/backend/services/storage/FirestoreStorageService.ts`** (NEW)
- Initialize Firestore client: `new Firestore()`
- Collections: `users`, `lockIns`, `transactions`, `badges`, `ngos`
- Subcollection: `users/{userId}/earnedBadges`
- Use transactions for updateNGODonation to prevent race conditions
- Log operations with console emojis (🌐 prefix)

### Mock Data Files

**`/src/backend/infrastructure/data/mock-users.data.ts`** (NEW)
```typescript
export const MOCK_USER_PROFILES: UserProfile[] = [
  {
    id: 'mock-user-123',
    email: 'mockuser@example.com',
    name: 'Mock User',
    picture: 'https://via.placeholder.com/150',
    balanceCents: 50000,        // $500 available
    totalDepositedCents: 100000, // $1000 lifetime
    totalStakedCents: 10000,     // $100 locked
    badges: ['badge-bronze', 'badge-silver'],
    completedLockIns: 3,
    failedLockIns: 1,
    createdAt: '2024-09-01T00:00:00Z',
    updatedAt: '2025-12-06T00:00:00Z'
  }
];
```

**`/src/backend/infrastructure/data/mock-badges.data.ts`** (NEW)
```typescript
export const MOCK_BADGES: Badge[] = [
  {
    id: 'badge-bronze',
    name: 'Bronze Commitment',
    description: 'Complete your first LockIn',
    iconUrl: '/assets/badges/bronze.png',
    activityType: 0,
    minWorkouts: 5,
    tier: BadgeTier.BRONZE
  },
  // Silver (15+ workouts), Gold (30+), Platinum (50+)
];
```

**`/src/backend/infrastructure/data/mock-ngos.data.ts`** (NEW)
```typescript
export const MOCK_NGOS: NGO[] = [
  {
    id: 'ngo-default',
    name: 'Global Health Initiative',
    description: 'Improving health outcomes worldwide through fitness and wellness',
    logoUrl: '/assets/ngos/health-initiative.png',
    websiteUrl: 'https://example.org',
    isActive: true,
    totalDonatedCents: 0
  }
];
```

## Phase 8: Service Layer - Payment

### Payment Service Interface

**`/src/backend/services/interfaces/IPaymentService.ts`** (NEW)
```typescript
interface PaymentResult {
  success: boolean;
  transactionId: string;
  error?: string;
}

interface IPaymentService {
  processDeposit(userId: string, amountCents: number, paymentMethodId?: string): Promise<PaymentResult>;
  processRefund(userId: string, amountCents: number, transactionId: string): Promise<PaymentResult>;
  processDonation(ngoId: string, amountCents: number, userId: string): Promise<PaymentResult>;
}
```

### Mock Payment Implementation

**`/src/backend/services/payment/MockPaymentService.ts`** (NEW)
- Validate amounts (min $1, max $10,000)
- Simulate 100ms network delay
- Return PaymentResult with UUID transaction IDs
- Log with 🎭 prefix
- Always succeed (unless validation fails)

### Update Service Factory

**`/src/backend/services/ServiceFactory.ts`** (MODIFY)
```typescript
// Add new factory methods:

static getStorageService(): IStorageService {
  if (this.useMocks) {
    console.log('🎭 ServiceFactory: Using MockStorageService');
    return new MockStorageService();
  } else {
    console.log('🌐 ServiceFactory: Using FirestoreStorageService');
    return new FirestoreStorageService();
  }
}

static getPaymentService(): IPaymentService {
  // Always use mock for now (Stripe integration deferred)
  console.log('🎭 ServiceFactory: Using MockPaymentService');
  return new MockPaymentService();
}

static getNotificationService(): INotificationService {
  // Placeholder - no-op for now
  console.log('🎭 ServiceFactory: Using NoOpNotificationService');
  return new NoOpNotificationService();
}
```

### Update App Config

**`/src/backend/infrastructure/config/app.config.ts`** (MODIFY)
```typescript
// Add to AppConfig class:

static readonly FIRESTORE_PROJECT_ID = process.env.FIRESTORE_PROJECT_ID || '';
static readonly DEFAULT_NGO_ID = process.env.DEFAULT_NGO_ID || 'ngo-default';
static readonly SCHEDULER_TOPIC = process.env.SCHEDULER_TOPIC || 'lockin-progress-check';
static readonly MIN_DEPOSIT_CENTS = 100;      // $1.00
static readonly MAX_DEPOSIT_CENTS = 1000000;  // $10,000
static readonly MIN_STAKE_CENTS = 100;        // $1.00
static readonly MAX_STAKE_CENTS = 100000;     // $1,000
```

## Phase 9: Domain Layer - Penalty Strategies

### Strategy Interface

**`/src/backend/domain/strategies/IPenaltyStrategy.ts`** (NEW)
```typescript
interface PenaltyCalculationResult {
  isSuccess: boolean;
  refundAmountCents: number;      // 0 if failed
  donationAmountCents: number;    // 0 if successful
  reason: string;
}

interface IPenaltyStrategy {
  calculate(lockIn: LockIn, completedWorkouts: number): PenaltyCalculationResult;
  getName(): string;
}
```

### All or Nothing Strategy

**`/src/backend/domain/strategies/AllOrNothingStrategy.ts`** (NEW)
```typescript
export class AllOrNothingStrategy implements IPenaltyStrategy {
  calculate(lockIn: LockIn, completedWorkouts: number): PenaltyCalculationResult {
    const isSuccess = completedWorkouts >= lockIn.targetWorkouts;

    if (isSuccess) {
      return {
        isSuccess: true,
        refundAmountCents: lockIn.stakeAmountCents,
        donationAmountCents: 0,
        reason: `Successfully completed ${completedWorkouts}/${lockIn.targetWorkouts} workouts`
      };
    } else {
      return {
        isSuccess: false,
        refundAmountCents: 0,
        donationAmountCents: lockIn.stakeAmountCents,
        reason: `Failed. Only ${completedWorkouts}/${lockIn.targetWorkouts} workouts completed`
      };
    }
  }

  getName(): string {
    return 'All or Nothing';
  }
}
```

### Proportional Strategy (Design Only)

**`/src/backend/domain/strategies/ProportionalStrategy.ts`** (NEW - for extensibility)
```typescript
// Calculate refund proportional to completion rate
// Example: 8/12 workouts = 67% refund, 33% donation
export class ProportionalStrategy implements IPenaltyStrategy {
  calculate(lockIn: LockIn, completedWorkouts: number): PenaltyCalculationResult {
    const completionRate = completedWorkouts / lockIn.targetWorkouts;
    const refundAmountCents = Math.floor(lockIn.stakeAmountCents * completionRate);
    const donationAmountCents = lockIn.stakeAmountCents - refundAmountCents;

    return {
      isSuccess: completedWorkouts >= lockIn.targetWorkouts,
      refundAmountCents,
      donationAmountCents,
      reason: `Completed ${completedWorkouts}/${lockIn.targetWorkouts} (${Math.round(completionRate * 100)}%)`
    };
  }

  getName(): string {
    return 'Proportional';
  }
}
```

### Strategy Factory

**`/src/backend/domain/strategies/PenaltyStrategyFactory.ts`** (NEW)
```typescript
export class PenaltyStrategyFactory {
  static create(penaltyType: PenaltyType): IPenaltyStrategy {
    switch (penaltyType) {
      case PenaltyType.ALL_OR_NOTHING:
        return new AllOrNothingStrategy();
      case PenaltyType.PROPORTIONAL:
        return new ProportionalStrategy();
      // Add other strategies here
      default:
        throw new Error(`Unknown penalty type: ${penaltyType}`);
    }
  }
}
```

## Phase 10: Domain Layer - Repositories

### User Repository Interface

**`/src/backend/services/interfaces/IUserRepository.ts`** (NEW)
```typescript
interface IUserRepository {
  findById(userId: string): Promise<UserProfile | null>;
  create(profile: UserProfile): Promise<void>;
  updateBalance(userId: string, amountCents: number, operation: 'add' | 'subtract'): Promise<void>;
  updateStakedAmount(userId: string, amountCents: number, operation: 'add' | 'subtract'): Promise<void>;
  incrementCompletedLockIns(userId: string): Promise<void>;
  incrementFailedLockIns(userId: string): Promise<void>;
}
```

### User Repository Implementation

**`/src/backend/domain/repositories/UserRepository.ts`** (NEW)
- Constructor takes `IStorageService`
- `updateBalance`: Validate sufficient funds before subtract
- `updateStakedAmount`: Track locked money in active LockIns
- Throw errors for not found or insufficient balance

### LockIn Repository Interface

**`/src/backend/services/interfaces/ILockInRepository.ts`** (NEW)
```typescript
interface ILockInRepository {
  findById(lockInId: string): Promise<LockIn | null>;
  findByUserId(userId: string, status?: LockInStatus): Promise<LockIn[]>;
  findActive(): Promise<LockIn[]>;
  create(lockIn: LockIn): Promise<void>;
  updateProgress(lockInId: string, completedWorkouts: number): Promise<void>;
  complete(lockInId: string, status: LockInStatus, badgeId?: string, transactionId?: string): Promise<void>;
}
```

### LockIn Repository Implementation

**`/src/backend/domain/repositories/LockInRepository.ts`** (NEW)
- Constructor takes `IStorageService`
- `complete`: Update status, completedAt timestamp, optional badgeId and transactionId
- Follow same pattern as existing WorkoutRepository

## Phase 11: Domain Layer - Use Cases

### Deposit Funds Use Case

**`/src/backend/domain/use-cases/DepositFunds.usecase.ts`** (NEW)
```typescript
export class DepositFundsUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly paymentService: IPaymentService,
    private readonly storageService: IStorageService
  ) {}

  async execute(userId: string, amountCents: number, paymentMethodId?: string): Promise<DepositResponse> {
    // 1. Validate amount (min $1, max $10,000)
    // 2. Verify user exists
    // 3. Process payment via IPaymentService
    // 4. Create Transaction record (type: DEPOSIT)
    // 5. Update user balance (+amountCents)
    // 6. Update totalDepositedCents
    // 7. Return DepositResponse
  }
}
```

### Create LockIn Use Case

**`/src/backend/domain/use-cases/CreateLockIn.usecase.ts`** (NEW)
```typescript
export class CreateLockInUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly lockInRepository: ILockInRepository,
    private readonly storageService: IStorageService
  ) {}

  async execute(userId: string, request: CreateLockInRequest): Promise<LockIn> {
    // 1. Validate request (target 1-1000, duration 1-365, stake $1-$1000, activity 1-113)
    // 2. Check user exists and has sufficient balance
    // 3. Check no active LockIn exists (limit 1 for now)
    // 4. Calculate startDate (now) and endDate (now + durationDays)
    // 5. Create LockIn record (status: ACTIVE, completedWorkouts: 0)
    // 6. Create Transaction record (type: STAKE)
    // 7. Update user balance (-stakeAmountCents)
    // 8. Update user staked amount (+stakeAmountCents)
    // 9. Return created LockIn
  }
}
```

### Get User Profile Use Case

**`/src/backend/domain/use-cases/GetUserProfile.usecase.ts`** (NEW)
```typescript
export class GetUserProfileUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly authService: IAuthService
  ) {}

  async execute(userId: string, accessToken: string): Promise<UserProfile> {
    // 1. Validate access token
    // 2. Get user info from token
    // 3. Verify userId matches token
    // 4. Get or create profile
    // 5. If new user: create profile with 0 balance
    // 6. Return profile
  }
}
```

### Check LockIn Progress Use Case (Scheduled)

**`/src/backend/domain/use-cases/CheckLockInProgress.usecase.ts`** (NEW)
```typescript
export class CheckLockInProgressUseCase {
  constructor(
    private readonly lockInRepository: ILockInRepository,
    private readonly workoutRepository: IWorkoutRepository,
    private readonly authService: IAuthService,
    private readonly completeLockInUseCase: CompleteLockInUseCase
  ) {}

  async executeForAll(): Promise<void> {
    // 1. Get all active LockIns
    // 2. For each LockIn:
    //    - Count qualifying workouts (matching activityType)
    //    - Update completedWorkouts count
    //    - If endDate passed: call completeLockInUseCase
  }

  async getProgress(lockInId: string): Promise<LockInProgress> {
    // 1. Get LockIn by ID
    // 2. Count qualifying workouts
    // 3. Calculate metrics:
    //    - percentComplete
    //    - daysElapsed, daysRemaining
    //    - projectedCompletion (extrapolate current rate)
    //    - requiredPacePerDay (workouts needed per day)
    //    - isOnTrack (projected >= target)
    // 4. Return LockInProgress
  }
}
```

### Complete LockIn Use Case

**`/src/backend/domain/use-cases/CompleteLockIn.usecase.ts`** (NEW)
```typescript
export class CompleteLockInUseCase {
  constructor(
    private readonly lockInRepository: ILockInRepository,
    private readonly userRepository: IUserRepository,
    private readonly paymentService: IPaymentService,
    private readonly storageService: IStorageService
  ) {}

  async execute(lockInId: string): Promise<void> {
    // 1. Get LockIn (verify status is ACTIVE)
    // 2. Get penalty strategy via PenaltyStrategyFactory
    // 3. Calculate result (isSuccess, refund/donation amounts)
    // 4. Release staked amount (update user totalStakedCents -amount)
    //
    // If SUCCESS:
    //   5a. Process refund via IPaymentService
    //   6a. Create Transaction (type: REFUND)
    //   7a. Update user balance (+refundAmountCents)
    //   8a. Determine badge based on targetWorkouts
    //   9a. Award badge via IStorageService
    //   10a. Increment user completedLockIns
    //   11a. Update LockIn (status: COMPLETED_SUCCESS, badgeId, transactionId)
    //
    // If FAILURE:
    //   5b. Process donation via IPaymentService
    //   6b. Create Transaction (type: DONATION, ngoRecipientId)
    //   7b. Update NGO totalDonatedCents (+donationAmountCents)
    //   8b. Increment user failedLockIns
    //   9b. Update LockIn (status: COMPLETED_FAILED, transactionId)
  }

  private determineBadge(lockIn: LockIn): string {
    // Simple logic based on targetWorkouts
    // 50+: platinum, 30+: gold, 15+: silver, 5+: bronze
  }
}
```

## Phase 12: Controller Layer

### User Controller

**`/src/backend/controllers/user.controller.ts`** (NEW)
```typescript
export class UserController {
  constructor(
    private readonly getUserProfileUseCase: GetUserProfileUseCase,
    private readonly depositFundsUseCase: DepositFundsUseCase
  ) {}

  // GET /api/users/profile
  async getProfile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    // Extract userId from token (mock: 'mock-user-123')
    // Call use case
    // Return { success: true, profile }
  }

  // POST /api/users/deposit
  async deposit(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    // Extract userId from token
    // Validate body: { amountCents, paymentMethodId? }
    // Call use case
    // Return { success: true, newBalanceCents, transactionId }
  }
}
```

### LockIn Controller

**`/src/backend/controllers/lockin.controller.ts`** (NEW)
```typescript
export class LockInController {
  constructor(
    private readonly createLockInUseCase: CreateLockInUseCase,
    private readonly checkProgressUseCase: CheckLockInProgressUseCase
  ) {}

  // POST /api/lockins
  async create(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    // Extract userId from token
    // Validate body: CreateLockInRequest
    // Call use case
    // Return 201 { success: true, lockIn }
  }

  // GET /api/lockins/:id
  async getById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    // Extract lockInId from params
    // Call checkProgressUseCase.getProgress()
    // Return { success: true, progress }
  }
}
```

### Update Routes

**`/src/backend/routes/user.routes.ts`** (NEW)
```typescript
export function createUserRouter(userController: UserController): Router {
  const router = Router();
  router.get('/users/profile', authMiddleware, (req, res, next) => userController.getProfile(req, res, next));
  router.post('/users/deposit', authMiddleware, (req, res, next) => userController.deposit(req, res, next));
  return router;
}
```

**`/src/backend/routes/lockin.routes.ts`** (NEW)
```typescript
export function createLockInRouter(lockInController: LockInController): Router {
  const router = Router();
  router.post('/lockins', authMiddleware, (req, res, next) => lockInController.create(req, res, next));
  router.get('/lockins/:id', authMiddleware, (req, res, next) => lockInController.getById(req, res, next));
  return router;
}
```

**`/src/backend/routes/index.ts`** (MODIFY)
```typescript
// Add imports and register new routers
import { createUserRouter } from './user.routes';
import { createLockInRouter } from './lockin.routes';

// In createApiRouter, instantiate controllers and register routes
const userRouter = createUserRouter(userController);
const lockInRouter = createLockInRouter(lockInController);
router.use('/api', userRouter);
router.use('/api', lockInRouter);
```

**`/src/backend/server.ts`** (MODIFY)
- Instantiate all new use cases with dependencies
- Instantiate controllers
- Wire up in routes

## Phase 13: Cloud Scheduler Setup

### Pub/Sub Handler Function

**`/src/backend/scheduled/check-progress.handler.ts`** (NEW)
```typescript
import { CloudEvent } from '@google-cloud/functions-framework';

export async function checkLockInProgressHandler(cloudEvent: CloudEvent): Promise<void> {
  console.log('⏰ Cloud Scheduler triggered: Check LockIn Progress');

  // 1. Initialize services via ServiceFactory
  const storageService = ServiceFactory.getStorageService();
  const fitnessService = ServiceFactory.getFitnessService();
  const authService = ServiceFactory.getAuthService();
  const paymentService = ServiceFactory.getPaymentService();

  // 2. Initialize repositories
  const lockInRepository = new LockInRepository(storageService);
  const workoutRepository = new WorkoutRepository(fitnessService);
  const userRepository = new UserRepository(storageService);

  // 3. Initialize use cases
  const completeLockInUseCase = new CompleteLockInUseCase(...);
  const checkProgressUseCase = new CheckLockInProgressUseCase(...);

  // 4. Execute check
  await checkProgressUseCase.executeForAll();
}
```

### Cloud Scheduler Configuration

**`/infrastructure/cloud-scheduler.yaml`** (NEW)
```yaml
# Cloud Scheduler setup
# Run: gcloud scheduler jobs create pubsub check-lockin-progress \
#        --schedule="0 */6 * * *" \
#        --topic="lockin-progress-check" \
#        --message-body="check" \
#        --location="us-central1"

schedule: "0 */6 * * *"  # Every 6 hours
topic: "lockin-progress-check"
location: "us-central1"
```

### Function Deployment

**`/functions/scheduled-check/index.js`** (NEW)
```javascript
const functions = require('@google-cloud/functions-framework');
const { checkLockInProgressHandler } = require('../../dist/backend/scheduled/check-progress.handler');

functions.cloudEvent('checkLockInProgress', checkLockInProgressHandler);
```

## Phase 14: Frontend Implementation

### Frontend Structure
```
src/frontend/
├── components/
│   ├── auth/
│   │   └── LoginButton.ts              # Google OAuth login
│   ├── user/
│   │   ├── ProfileCard.ts              # Display balance, stats
│   │   ├── DepositForm.ts              # Deposit money form
│   │   └── BalanceDisplay.ts           # Balance widget
│   ├── lockin/
│   │   ├── CreateLockInForm.ts         # Create commitment form
│   │   ├── LockInCard.ts               # Display LockIn summary
│   │   ├── ProgressBar.ts              # Progress visualization
│   │   └── LockInStatus.ts             # Status dashboard
│   ├── workouts/
│   │   ├── WorkoutList.ts              # List last 30 days
│   │   ├── WorkoutCard.ts              # Individual workout
│   │   └── WorkoutCalendar.ts          # Calendar view
│   └── badges/
│       ├── BadgeDisplay.ts             # Badge card
│       └── BadgeGrid.ts                # Badge collection
├── services/
│   ├── api/
│   │   ├── UserApiClient.ts            # User API calls
│   │   ├── LockInApiClient.ts          # LockIn API calls
│   │   └── WorkoutApiClient.ts         # Workout API calls (existing)
│   ├── auth/
│   │   └── GoogleAuthClient.ts         # Google OAuth flow
│   └── storage/
│       └── LocalStorageService.ts      # Store token, user data
├── pages/
│   ├── LoginPage.ts                    # Login screen
│   ├── DashboardPage.ts                # Main dashboard
│   ├── CreateLockInPage.ts             # Create LockIn flow
│   └── WorkoutHistoryPage.ts           # 30-day history
├── utils/
│   ├── formatters.ts                   # Currency, date formatting
│   └── validators.ts                   # Form validation
└── main.ts                              # App entry point
```

### Key Components

**`/src/frontend/services/api/UserApiClient.ts`** (NEW)
```typescript
export class UserApiClient {
  constructor(private baseUrl: string) {}

  async getProfile(accessToken: string): Promise<UserProfile> {
    // GET /api/users/profile with Bearer token
  }

  async deposit(accessToken: string, request: DepositRequest): Promise<DepositResponse> {
    // POST /api/users/deposit
  }
}
```

**`/src/frontend/services/api/LockInApiClient.ts`** (NEW)
```typescript
export class LockInApiClient {
  async create(accessToken: string, request: CreateLockInRequest): Promise<LockIn> {
    // POST /api/lockins
  }

  async getProgress(accessToken: string, lockInId: string): Promise<LockInProgress> {
    // GET /api/lockins/:id
  }
}
```

**`/src/frontend/components/lockin/CreateLockInForm.ts`** (NEW)
```typescript
export class CreateLockInForm {
  // HTML form with fields:
  // - Activity type (select from ACTIVITY_TYPE_MAP)
  // - Target workouts (number input)
  // - Duration days (number input)
  // - Stake amount (currency input)
  // - Penalty type (select: All or Nothing, Proportional)
  //
  // Submit handler:
  // - Validate inputs
  // - Convert stake dollars to cents
  // - Call LockInApiClient.create()
}
```

**`/src/frontend/components/lockin/LockInStatus.ts`** (NEW)
```typescript
export class LockInStatus {
  // Display:
  // - Activity type name
  // - Progress: X/Y workouts (progress bar)
  // - Days remaining
  // - Status: "On track" or "Behind schedule" (with color)
  // - Projected completion
  // - Required pace per day
  //
  // Fetch via LockInApiClient.getProgress()
}
```

**`/src/frontend/pages/DashboardPage.ts`** (NEW)
```typescript
export class DashboardPage {
  // Layout:
  // 1. Header with user name and balance
  // 2. Active LockIn status (if exists)
  // 3. Recent workouts (last 30 days)
  // 4. Badges earned
  // 5. Create new LockIn button
}
```

## Phase 15: Firestore Schema

### Collections
```
users/{userId}
  - id, email, name, picture
  - balanceCents, totalDepositedCents, totalStakedCents
  - badges[], completedLockIns, failedLockIns
  - createdAt, updatedAt

  users/{userId}/earnedBadges/{badgeId}
    - badgeId, earnedAt, lockInId

lockIns/{lockInId}
  - id, userId, activityType
  - targetWorkouts, durationDays, stakeAmountCents
  - penaltyType, status, completedWorkouts
  - startDate, endDate, createdAt, updatedAt
  - completedAt?, badgeId?, transactionId?

transactions/{transactionId}
  - id, userId, type, amountCents, status
  - lockInId?, paymentMethodId?, ngoRecipientId?
  - createdAt, updatedAt, description

badges/{badgeId}
  - id, name, description, iconUrl
  - activityType, minWorkouts, tier

ngos/{ngoId}
  - id, name, description, logoUrl, websiteUrl
  - isActive, totalDonatedCents
```

### Indexes

**`/firestore.indexes.json`** (NEW)
```json
{
  "indexes": [
    {
      "collectionGroup": "lockIns",
      "fields": [
        { "fieldPath": "userId", "order": "ASCENDING" },
        { "fieldPath": "status", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "lockIns",
      "fields": [
        { "fieldPath": "status", "order": "ASCENDING" },
        { "fieldPath": "endDate", "order": "ASCENDING" }
      ]
    },
    {
      "collectionGroup": "transactions",
      "fields": [
        { "fieldPath": "userId", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    }
  ]
}
```

## Testing Strategy

### Unit Tests (70%+ coverage)

**Use Case Tests**:
- `/tests/unit/backend/domain/use-cases/DepositFunds.usecase.test.ts`
  - Valid deposit, invalid amounts, payment failure
- `/tests/unit/backend/domain/use-cases/CreateLockIn.usecase.test.ts`
  - Valid LockIn, insufficient balance, existing active LockIn, validation errors
- `/tests/unit/backend/domain/use-cases/CheckLockInProgress.usecase.test.ts`
  - Progress calculation, expired LockIn completion
- `/tests/unit/backend/domain/use-cases/CompleteLockIn.usecase.test.ts`
  - Successful completion (refund + badge), failed completion (donation)

**Strategy Tests**:
- `/tests/unit/backend/domain/strategies/AllOrNothingStrategy.test.ts`
  - 100% completion = full refund
  - 99% completion = full donation
- `/tests/unit/backend/domain/strategies/ProportionalStrategy.test.ts`
  - 67% completion = 67% refund, 33% donation

**Repository Tests**:
- `/tests/unit/backend/domain/repositories/UserRepository.test.ts`
  - Balance updates, insufficient funds error, counter increments
- `/tests/unit/backend/domain/repositories/LockInRepository.test.ts`
  - CRUD operations, filtering by status

**Service Tests**:
- `/tests/unit/backend/services/MockStorageService.test.ts`
  - All CRUD operations, data integrity
- `/tests/unit/backend/services/MockPaymentService.test.ts`
  - Deposit, refund, donation flows

**Controller Tests**:
- `/tests/unit/backend/controllers/user.controller.test.ts`
  - HTTP request/response handling, error cases
- `/tests/unit/backend/controllers/lockin.controller.test.ts`
  - HTTP request/response handling, validation

### Integration Tests
- `/tests/integration/lockin-creation-flow.test.ts`
  - End-to-end: deposit → create LockIn → check status
- `/tests/integration/scheduled-completion.test.ts`
  - Scheduled job execution, LockIn completion

## Implementation Phases Summary

### Phase 6: Storage Foundation
- New shared types (LockIn, UserProfile, Badge, Transaction, NGO)
- IStorageService interface
- MockStorageService with mock data
- FirestoreStorageService
- Update ServiceFactory and AppConfig

### Phase 7: Payment & Strategies
- IPaymentService interface
- MockPaymentService
- Penalty strategy pattern (All or Nothing + Proportional design)
- PenaltyStrategyFactory

### Phase 8: Repositories
- IUserRepository + UserRepository
- ILockInRepository + LockInRepository

### Phase 9: Use Cases
- DepositFundsUseCase
- CreateLockInUseCase
- GetUserProfileUseCase
- CheckLockInProgressUseCase
- CompleteLockInUseCase

### Phase 10: Controllers & Routes
- UserController (profile, deposit)
- LockInController (create, get)
- New routes
- Update server.ts wiring

### Phase 11: Scheduled Jobs
- Cloud Function handler
- Cloud Scheduler configuration
- Pub/Sub topic setup

### Phase 12: Frontend
- API clients
- Login page
- Dashboard with LockIn status
- Create LockIn form
- Workout history (30 days)
- Badge display

### Phase 13: Testing & Deployment
- Comprehensive unit tests
- Integration tests
- Firestore setup in production
- Cloud Scheduler deployment
- Frontend deployment

## Critical Files to Create/Modify

### New Files (25 core files):
1. `/src/shared/types/LockIn.types.ts`
2. `/src/shared/types/UserProfile.types.ts`
3. `/src/shared/types/Badge.types.ts`
4. `/src/shared/types/Transaction.types.ts`
5. `/src/shared/types/NGO.types.ts`
6. `/src/backend/services/interfaces/IStorageService.ts`
7. `/src/backend/services/interfaces/IPaymentService.ts`
8. `/src/backend/services/interfaces/IUserRepository.ts`
9. `/src/backend/services/interfaces/ILockInRepository.ts`
10. `/src/backend/services/storage/MockStorageService.ts`
11. `/src/backend/services/storage/FirestoreStorageService.ts`
12. `/src/backend/services/payment/MockPaymentService.ts`
13. `/src/backend/domain/strategies/IPenaltyStrategy.ts`
14. `/src/backend/domain/strategies/AllOrNothingStrategy.ts`
15. `/src/backend/domain/strategies/PenaltyStrategyFactory.ts`
16. `/src/backend/domain/repositories/UserRepository.ts`
17. `/src/backend/domain/repositories/LockInRepository.ts`
18. `/src/backend/domain/use-cases/DepositFunds.usecase.ts`
19. `/src/backend/domain/use-cases/CreateLockIn.usecase.ts`
20. `/src/backend/domain/use-cases/GetUserProfile.usecase.ts`
21. `/src/backend/domain/use-cases/CheckLockInProgress.usecase.ts`
22. `/src/backend/domain/use-cases/CompleteLockIn.usecase.ts`
23. `/src/backend/controllers/user.controller.ts`
24. `/src/backend/controllers/lockin.controller.ts`
25. `/src/backend/scheduled/check-progress.handler.ts`

### Modified Files (4):
1. `/src/backend/services/ServiceFactory.ts` (add storage, payment services)
2. `/src/backend/infrastructure/config/app.config.ts` (add Firestore config)
3. `/src/backend/routes/index.ts` (register new routes)
4. `/src/backend/server.ts` (wire up new dependencies)

### Mock Data Files (3):
1. `/src/backend/infrastructure/data/mock-users.data.ts`
2. `/src/backend/infrastructure/data/mock-badges.data.ts`
3. `/src/backend/infrastructure/data/mock-ngos.data.ts`

## Dependencies to Add

**Production**:
```json
{
  "@google-cloud/firestore": "^7.1.0",
  "@google-cloud/pubsub": "^4.0.0",
  "@google-cloud/functions-framework": "^3.3.0"
}
```

## API Endpoints Summary

```
# Authentication (existing)
GET  /api/health                  # Health check

# Workouts (existing)
GET  /api/workouts                # Get 300-day workout history

# User (new)
GET  /api/users/profile           # Get user profile with balance
POST /api/users/deposit           # Deposit money
                                  # Body: { amountCents, paymentMethodId? }

# LockIn (new)
POST /api/lockins                 # Create new LockIn
                                  # Body: CreateLockInRequest
GET  /api/lockins/:id             # Get LockIn progress
                                  # Response: LockInProgress
```

## Environment Variables

**`.env.development`**:
```bash
USE_MOCKS=true
FIRESTORE_PROJECT_ID=lockin-dev
DEFAULT_NGO_ID=ngo-default
```

**`.env.production`**:
```bash
USE_MOCKS=false
FIRESTORE_PROJECT_ID=lockin-prod
GOOGLE_CLIENT_ID=your-actual-client-id
DEFAULT_NGO_ID=ngo-default
SCHEDULER_TOPIC=lockin-progress-check
```

## Success Criteria

1. **Fully testable without 3rd party integrations**: Mock implementations for storage, payment, auth, fitness
2. **Uses existing technologies**: Express, TypeScript, Firestore, Cloud Functions, Google OAuth
3. **Builds on current design**: Extends ServiceFactory pattern, follows clean architecture layers
4. **Web platform support**: SPA frontend with all features
5. **All features implemented**:
   - ✓ Login via Google account
   - ✓ Fetch workout history (last 30 days from 300-day data)
   - ✓ Deposit money
   - ✓ Create LockIn with stake
   - ✓ Monitor progress (scheduled checks)
   - ✓ Display status on website
   - ✓ Refund + badge on success
   - ✓ Donate to NGO on failure

## Next Steps

After plan approval:
1. Start with Phase 6 (types and storage) - foundational layer
2. Build up through use cases and controllers
3. Add scheduled job
4. Implement frontend
5. Comprehensive testing
6. Deployment to production
