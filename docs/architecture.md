# Architecture Documentation

## System Architecture Overview

Relationship Growth OS is built as a modern web application using a serverless architecture with real-time capabilities.

```
┌─────────────────────────────────────────────────────────────┐
│                      Client Layer                            │
│  Next.js 14 (App Router) + React + TypeScript              │
│  • PWA capabilities (Service Worker)                        │
│  • Client-side state management (Zustand)                   │
│  • Optimistic updates                                       │
└─────────────────────────────────────────────────────────────┘
                          ↓ ↑
                     HTTPS / WebSocket
                          ↓ ↑
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                         │
│  Next.js API Routes + Server Actions                        │
│  • Authentication middleware                                │
│  • Business logic engines                                   │
│  • AI provider abstraction                                  │
└─────────────────────────────────────────────────────────────┘
                          ↓ ↑
                      Supabase Client
                          ↓ ↑
┌─────────────────────────────────────────────────────────────┐
│                     Data Layer                               │
│  Supabase (PostgreSQL + Auth + Storage + Realtime)         │
│  • Row-Level Security (RLS)                                 │
│  • Automatic schema migrations                              │
│  • Real-time subscriptions                                  │
└─────────────────────────────────────────────────────────────┘
                          ↓ ↑
┌─────────────────────────────────────────────────────────────┐
│                   External Services                          │
│  • AI Provider (Claude/GPT-4 - optional)                    │
│  • PostHog (Analytics)                                      │
│  • Sentry (Error tracking)                                  │
└─────────────────────────────────────────────────────────────┘
```

## Core Engines

### 1. Relationship State Engine

**Purpose:** Analyze check-in data to determine current relationship state and needs.

**Location:** `lib/engines/relationship-state-engine.ts`

**Inputs:**
- Latest check-in data
- Relationship type (new/long_term)
- Historical check-ins (optional)

**Outputs:**
- Relationship state object with:
  - Connection level (1-10)
  - Priority pillar (which of 6 pillars to focus on)
  - Context constraints (time, budget, location)
  - Detected challenges

**Algorithm:**
```typescript
function analyzeRelationshipState(checkIn, relationshipType) {
  // 1. Map "what_matters_now" to priority pillar
  const priorityPillar = mapToPillar(checkIn.what_matters_now);
  
  // 2. Assess urgency based on mood + connection level
  const urgency = calculateUrgency(checkIn.current_mood, checkIn.connection_level);
  
  // 3. Extract practical constraints
  const context = {
    available_time: checkIn.available_time,
    budget: checkIn.budget_preference,
    location: checkIn.location_preference,
    city: user.city
  };
  
  return {
    priority_pillar: priorityPillar,
    urgency,
    connection_level: checkIn.connection_level,
    context
  };
}
```

---

### 2. Growth Plan Engine

**Purpose:** Generate exactly 3 different, personalized action plans.

**Location:** `lib/engines/growth-plan-engine.ts`

**Architecture:** Multi-stage pipeline

```
Input: Goal + State + Passport + Memory
    ↓
[Stage 1: Filter]
    Filter activities by:
    - Pillar match
    - Relationship type match
    - City match
    - Constraint compatibility (time, budget, location)
    - Not recently used (from memory)
    ↓
[Stage 2: Score]
    Score each activity:
    - Pillar match: 30%
    - Preference match: 25%
    - Context fit: 20%
    - Novelty: 15%
    - Success history: 10%
    ↓
[Stage 3: Select Top Candidates]
    Select top 10-15 activities
    ↓
[Stage 4: Ensure Diversity]
    Pick 3 activities that differ in:
    - Effort level
    - Location type
    - Time required
    - Cost range
    ↓
[Stage 5: Personalize (Optional AI)]
    If AI provider available:
    - Generate personalized reasoning
    - Customize conversation starters
    - Adapt steps to user context
    
    Otherwise:
    - Use template-based reasoning
    - Use default conversation prompts
    ↓
Output: 3 Ranked Plans
```

**Scoring Algorithm:**

```typescript
function scoreActivity(activity, state, passport, memory) {
  let score = 0;
  
  // 1. Pillar match (30 points)
  if (activity.pillar.includes(state.priority_pillar)) {
    score += 30;
  }
  
  // 2. Preference match (25 points)
  const prefScore = calculatePreferenceMatch(activity, passport);
  score += prefScore * 25;
  
  // 3. Context fit (20 points)
  const contextScore = calculateContextFit(activity, state.context);
  score += contextScore * 20;
  
  // 4. Novelty (15 points)
  const noveltyScore = calculateNovelty(activity, memory);
  score += noveltyScore * 15;
  
  // 5. Success history (10 points)
  const historyScore = calculateSuccessRate(activity, memory);
  score += historyScore * 10;
  
  return score;
}

function calculatePreferenceMatch(activity, passport) {
  let match = 0;
  const userInterests = passport.partner1_interests || [];
  
  // Check if activity tags overlap with user interests
  const overlap = activity.tags.filter(tag => userInterests.includes(tag));
  match = overlap.length / Math.max(activity.tags.length, 1);
  
  // Check boundaries (avoid patterns)
  const boundaries = passport.partner1_boundaries || {};
  if (boundaries.dislikes) {
    for (const dislike of boundaries.dislikes) {
      if (activity.tags.includes(dislike)) {
        match -= 0.5; // Penalty
      }
    }
  }
  
  return Math.max(0, Math.min(1, match));
}

function calculateContextFit(activity, context) {
  let fit = 1.0;
  
  // Time constraint
  if (context.available_time === 'tonight' && activity.time_required_minutes > 120) {
    fit -= 0.3;
  }
  
  // Budget constraint
  const budgetMatch = {
    'free': ['free'],
    'budget': ['free', 'budget'],
    'moderate': ['free', 'budget', 'moderate'],
    'premium': ['free', 'budget', 'moderate', 'premium']
  };
  
  if (!budgetMatch[context.budget].includes(activity.cost_range)) {
    fit -= 0.4;
  }
  
  // Location constraint
  if (context.location === 'home' && activity.location_type !== 'home') {
    fit -= 0.2;
  }
  
  return Math.max(0, fit);
}

function calculateNovelty(activity, memory) {
  const activityHistory = memory.find(m => 
    m.memory_type === 'activity_history' && 
    m.activity_id === activity.id
  );
  
  if (!activityHistory) {
    return 1.0; // New activity = full novelty
  }
  
  const daysSinceLastUse = getDaysSince(activityHistory.last_used_at);
  
  if (daysSinceLastUse < 7) return 0.2;
  if (daysSinceLastUse < 30) return 0.5;
  if (daysSinceLastUse < 90) return 0.8;
  return 1.0;
}

function calculateSuccessRate(activity, memory) {
  const activityHistory = memory.find(m => 
    m.memory_type === 'activity_history' && 
    m.activity_id === activity.id
  );
  
  if (!activityHistory) {
    return 0.5; // Neutral for new activities
  }
  
  // Average rating from 1-5 mapped to 0-1
  return (activityHistory.average_rating || 3) / 5;
}
```

**Diversity Enforcement:**

```typescript
function ensureDiversity(candidates) {
  const selected = [];
  
  // Pick highest scored
  selected.push(candidates[0]);
  
  // Pick second that differs in effort level
  const second = candidates.find(c => 
    c.effort_level !== selected[0].effort_level
  ) || candidates[1];
  selected.push(second);
  
  // Pick third that differs in both effort and location
  const third = candidates.find(c =>
    c.effort_level !== selected[0].effort_level &&
    c.effort_level !== selected[1].effort_level &&
    c.location_type !== selected[0].location_type
  ) || candidates[2];
  selected.push(third);
  
  return selected;
}
```

---

### 3. Relationship Memory Engine

**Purpose:** Learn from feedback to improve future recommendations.

**Location:** `lib/engines/memory-engine.ts`

**Memory Types:**

1. **Activity History**
   - Tracks: Which activities used, when, how often, average rating
   - Used for: Novelty scoring, avoiding repetition

2. **Preference Learned**
   - Tracks: What worked well (from positive feedback)
   - Used for: Preference matching in scoring

3. **Avoid Pattern**
   - Tracks: What consistently didn't work
   - Used for: Filtering out unsuitable activities

**Learning Algorithm:**

```typescript
async function processFeedback(feedback, execution, plan) {
  // 1. Update activity history
  await updateActivityHistory(plan.activity_id, feedback.outcome);
  
  // 2. Learn preferences if positive feedback
  if (feedback.outcome === 'great' || feedback.outcome === 'good') {
    await learnPositivePreferences(feedback);
  }
  
  // 3. Learn avoid patterns if negative feedback
  if (feedback.outcome === 'difficult' || feedback.outcome === 'didnt_work') {
    await learnAvoidPatterns(feedback);
  }
  
  // 4. Update passport with high-confidence learnings
  if (shouldUpdatePassport(feedback)) {
    await updatePassport(feedback.relationship_id, feedback.learned_preferences);
  }
}

async function updateActivityHistory(activityId, outcome) {
  const rating = outcomeToRating(outcome); // 'great'=5, 'good'=4, etc.
  
  const existing = await getActivityHistory(activityId);
  
  if (existing) {
    // Update running average
    const newAverage = (existing.average_rating * existing.times_used + rating) / (existing.times_used + 1);
    
    await updateMemory(existing.id, {
      times_used: existing.times_used + 1,
      average_rating: newAverage,
      last_used_at: new Date()
    });
  } else {
    // Create new history
    await createMemory({
      type: 'activity_history',
      activity_id: activityId,
      times_used: 1,
      average_rating: rating,
      last_used_at: new Date()
    });
  }
}

async function learnPositivePreferences(feedback) {
  const insights = [];
  
  // Extract from what_worked
  if (feedback.what_worked) {
    for (const item of feedback.what_worked) {
      insights.push({
        type: 'preference',
        content: item,
        confidence: 0.6, // Initial confidence
        source: feedback.id
      });
    }
  }
  
  // Check for existing similar learnings
  for (const insight of insights) {
    const existing = await findSimilarLearning(insight.content);
    
    if (existing) {
      // Increase confidence
      await updateMemory(existing.id, {
        confidence_score: Math.min(1.0, existing.confidence_score + 0.2),
        source_feedback_ids: [...existing.source_feedback_ids, feedback.id]
      });
    } else {
      // Create new learning
      await createMemory({
        type: 'preference_learned',
        content: insight,
        confidence_score: insight.confidence,
        source_feedback_ids: [feedback.id]
      });
    }
  }
}

async function learnAvoidPatterns(feedback) {
  // Similar to learnPositivePreferences but for negative patterns
  const avoidPatterns = [];
  
  if (feedback.what_didnt_work) {
    for (const item of feedback.what_didnt_work) {
      avoidPatterns.push({
        type: 'avoid',
        content: item,
        confidence: 0.6
      });
    }
  }
  
  // Track activities with multiple negative feedbacks
  const activityId = feedback.plan_execution.plan.activity_id;
  const negativeCount = await countNegativeFeedbacks(activityId);
  
  if (negativeCount >= 2) {
    await createMemory({
      type: 'avoid_pattern',
      activity_id: activityId,
      content: { reason: 'repeatedly_unsuccessful' },
      confidence_score: 0.8
    });
  }
}
```

---

## Data Flow Examples

### Example 1: User Completes Check-in Flow

```
1. User fills check-in form
   ↓
2. POST /api/check-in
   • Validate input
   • Insert into check_ins table
   • Track analytics event: "check_in_completed"
   ↓
3. Relationship State Engine analyzes check-in
   • Determine priority pillar
   • Extract context
   ↓
4. GET /api/goals/suggestions
   • Return 3-6 suggested goals based on priority pillar
   ↓
5. User selects a goal
   ↓
6. POST /api/goals
   • Insert into goals table
   • Track analytics event: "goal_selected"
   ↓
7. Redirect to /plans/generate
```

### Example 2: Generate 3 Plans

```
1. POST /api/plans/generate
   • goalId in request body
   ↓
2. Fetch context:
   • Get goal details
   • Get latest check-in
   • Get relationship passport
   • Get relationship memory
   ↓
3. Growth Plan Engine.generatePlans()
   • Filter activities (pillar, type, city, constraints)
   • Score remaining activities
   • Select top 10-15 candidates
   • Ensure diversity, pick 3
   • Personalize with AI (if available)
   ↓
4. Insert 3 plans into plans table
   • rank: 1, 2, 3
   • Include scoring_metadata for debugging
   ↓
5. Return plans to client
   ↓
6. Track analytics event: "plans_generated"
```

### Example 3: User Completes Activity

```
1. User clicks "Start Activity"
   ↓
2. POST /api/plans/:planId/execution
   • Create plan_execution record
   • status: "started"
   • Track analytics: "plan_execution_started"
   ↓
3. User marks steps complete
   ↓
4. PATCH /api/plans/:planId/execution
   • Update steps_completed
   ↓
5. User clicks "Complete"
   ↓
6. PATCH /api/plans/:planId/execution
   • status: "completed"
   • Track analytics: "plan_execution_completed"
   ↓
7. Redirect to /feedback
```

### Example 4: Process Feedback & Learn

```
1. User submits feedback form
   ↓
2. POST /api/feedback
   • Insert into feedback table
   • Track analytics: "feedback_submitted"
   ↓
3. Trigger Memory Engine.processFeedback()
   • Update activity_history (async)
   • Learn preferences (if positive)
   • Learn avoid patterns (if negative)
   • Update passport (if high confidence)
   ↓
4. Memory updated for next recommendation cycle
```

---

## Activity photo ownership

An activity photo belongs to `plan_executions`, not to the shared `activities`
library or reusable `plans` row. The same person can run a plan more than once,
and each execution is a distinct private memory. `plan_executions.activity_photo_path`
stores only the private Storage object path. Objects live in the private
`activity_images` bucket under `<user id>/<execution id>/<random id>.<ext>`.
The server validates ownership and returns short-lived signed URLs for display;
Storage RLS permits only that execution's user to read, insert, or delete its
objects. Uploads are JPEG, PNG, or WebP and are limited to 5 MB in both the UI
and bucket configuration. See `supabase/migrations/011_add_image_to_activities.sql`
for the canonical schema and policy setup.

## Security Architecture

### Authentication Flow

```
1. User submits login form
   ↓
2. Client: supabase.auth.signInWithPassword()
   ↓
3. Supabase Auth validates credentials
   ↓
4. Returns JWT token + session
   ↓
5. Token stored in HTTP-only cookie
   ↓
6. Middleware validates token on each request
   ↓
7. User context injected into Server Components
```

### Row-Level Security (RLS)

Every table has RLS policies:

**Example: plans table**

```sql
-- Users can view their own plans
CREATE POLICY "view_own_plans"
ON plans FOR SELECT
USING (user_id = auth.uid());

-- Users can view partner's plans IF consent given
CREATE POLICY "view_partner_plans"
ON plans FOR SELECT
USING (
  relationship_id IN (
    SELECT rm.relationship_id
    FROM relationship_members rm
    WHERE rm.user_id = auth.uid()
      AND rm.consent_shared_data = true
  )
);
```

**Privacy Levels:**

1. **Private by default:** check_ins, feedback, notes
2. **Relationship-scoped:** relationship_passport, goals, plans
3. **Partner-visible with consent:** Shared only if both consent
4. **Public:** activities (read-only for all authenticated users)

---

## Performance Considerations

### Database Indexes

All foreign keys indexed. Additional indexes on:
- Frequently filtered columns (pillar, city, is_active)
- JSONB fields with GIN indexes
- Timestamp fields for ordering

### Caching Strategy

1. **Activity Library:** Cached client-side (changes rarely)
2. **User Session:** Cached in middleware
3. **Relationship Passport:** Cached per-request
4. **Plans:** No caching (always fresh)

### Query Optimization

- Use `SELECT` with specific columns (not `SELECT *`)
- Paginate large result sets
- Use joins sparingly, denormalize when needed
- Leverage Supabase's automatic connection pooling

---

## Deployment Architecture

```
┌─────────────────────────────────────┐
│         Vercel Edge Network         │
│  • Global CDN                       │
│  • Edge middleware                  │
│  • Static asset caching             │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│      Vercel Serverless Functions    │
│  • API routes                       │
│  • Server components                │
│  • Image optimization               │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│         Supabase Cloud              │
│  • PostgreSQL (AWS)                 │
│  • Auth service                     │
│  • Storage                          │
│  • Realtime subscriptions           │
└─────────────────────────────────────┘
```

**Deployment Flow:**

1. Push to main branch
2. Vercel automatically builds & deploys
3. Environment variables injected
4. Preview deployment for PRs
5. Production deployment on merge

---

## Scalability Considerations

### Current Architecture (MVP)
- Supports: ~1,000 DAU
- Database: Supabase free tier (500MB, 2 CPU)
- No special optimization needed

### Growth Path (10k+ DAU)
1. Upgrade Supabase tier
2. Add Redis for caching (activity library, user sessions)
3. Implement request rate limiting
4. Add database read replicas
5. Optimize heavy queries (memory, scoring)
6. Consider AI response caching

### Enterprise Scale (100k+ DAU)
1. Microservices for heavy engines
2. Dedicated AI infrastructure
3. Multi-region deployment
4. Advanced caching (CDN + Redis)
5. Database sharding by city

---

**Document Version:** 1.0  
**Last Updated:** 2026-08-27  
**Author:** Architecture Team
