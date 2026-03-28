-- ClubPack Database Schema
-- Run this once in your Neon SQL editor to create and seed the tables

-- ============================================================
-- STEP 1: Create Tables
-- ============================================================

CREATE TABLE IF NOT EXISTS clubs (
  id                     TEXT PRIMARY KEY,
  name                   TEXT NOT NULL,
  category               TEXT NOT NULL,
  audience               TEXT NOT NULL,
  member_count           INTEGER NOT NULL,
  average_engagement_rate TEXT NOT NULL,
  pricing_tier           TEXT NOT NULL,
  description            TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS pricing (
  tier                    TEXT PRIMARY KEY,
  dedicated_email         TEXT NOT NULL,
  newsletter_feature      TEXT NOT NULL,
  in_person_event_booth   TEXT NOT NULL,
  minimum_spend           TEXT NOT NULL
);

-- ============================================================
-- STEP 2: Seed Pricing Tiers
-- ============================================================

INSERT INTO pricing (tier, dedicated_email, newsletter_feature, in_person_event_booth, minimum_spend) VALUES
  ('Tier 1 (Enterprise)', '$1,500', '$800',  '$3,000',              '$2,000'),
  ('Tier 2 (Growth)',     '$600',   '$300',  '$1,000',              '$500'),
  ('Tier 3 (Starter)',    '$200',   '$100',  'Not available for this tier', '$100')
ON CONFLICT (tier) DO NOTHING;

-- ============================================================
-- STEP 3: Seed Clubs
-- ============================================================

INSERT INTO clubs (id, name, category, audience, member_count, average_engagement_rate, pricing_tier, description) VALUES
  ('club_001', 'Boston Tech Innovators',       'Tech',     'College Students',     850,  '68%', 'Tier 2 (Growth)',     'A highly active community of computer science students and hackathon enthusiasts across Boston universities.'),
  ('club_002', 'Downtown Run Collective',      'Fitness',  'Young Professionals',  2200, '85%', 'Tier 1 (Enterprise)', 'The largest post-work run club in the city. Members frequently buy premium running gear and attend social mixers.'),
  ('club_003', 'Northeast Smash Bros League',  'Gaming',   'Teens',                450,  '92%', 'Tier 3 (Starter)',    'Weekly Super Smash Bros tournaments. Highly engaged Discord community with weekly live streams.'),
  ('club_004', 'Future Founders Guild',        'Business', 'Founders',             150,  '45%', 'Tier 2 (Growth)',     'An exclusive club for early-stage startup founders. High-net-worth potential, focused on B2B SaaS and networking.'),
  ('club_005', 'City Canvas Painters',         'Arts',     'Young Professionals',  600,  '55%', 'Tier 3 (Starter)',    'Weekend watercolor and acrylic painting club. Members are highly receptive to art supply and lifestyle brands.'),
  ('club_006', 'NYC Data Science Society',     'Tech',     'Young Professionals',  1400, '72%', 'Tier 1 (Enterprise)', 'Monthly meetups for working data scientists and ML engineers across New York. Highly receptive to dev tools, cloud platforms, and B2B software.'),
  ('club_007', 'Varsity Chess & Strategy Club','Business', 'College Students',     320,  '61%', 'Tier 3 (Starter)',    'Competitive collegiate chess club focused on strategic thinking and finance career prep. Members skew toward consulting and investment banking recruits.'),
  ('club_008', 'Pacific Founders Collective',  'Business', 'Founders',             890,  '58%', 'Tier 1 (Enterprise)', 'West Coast network of Series A and seed-stage founders including ex-YC and a16z portfolio companies. Ideal for B2B SaaS, fintech, and legal/HR tools.'),
  ('club_009', 'Midwest Yoga & Wellness Circle','Fitness', 'Seniors',              540,  '48%', 'Tier 3 (Starter)',    'Weekly yoga and gentle fitness for adults 55+. High brand loyalty — members respond well to health supplements, insurance, and wellness product sponsors.'),
  ('club_010', 'Collegiate Esports Alliance',  'Gaming',   'College Students',     1750, '88%', 'Tier 2 (Growth)',     'Multi-title varsity esports org competing in League of Legends, Valorant, and Rocket League. Massive Twitch viewership with a highly engaged student fan base.')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- STEP 4: Leads table (email capture from landing page)
-- ============================================================

CREATE TABLE IF NOT EXISTS leads (
  id         SERIAL PRIMARY KEY,
  email      TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
