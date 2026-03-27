export interface TestCase {
  id: number;
  description: string;
  userMessage: string;
  expectedToolCalled: 'searchClubs' | 'getPricing' | 'escalateToHuman';
  expectedOutcome: string;
}

export const testCases: TestCase[] = [
  {
    id: 1,
    description: 'Simple search for tech clubs targeting college students',
    userMessage: 'We are a software company looking to reach college students. Do you have any tech clubs?',
    expectedToolCalled: 'searchClubs',
    expectedOutcome: 'Agent searches and returns tech clubs targeting college students',
  },
  {
    id: 2,
    description: 'Search for fitness clubs',
    userMessage: 'We sell running shoes. What fitness communities do you have on the platform?',
    expectedToolCalled: 'searchClubs',
    expectedOutcome: 'Agent finds fitness clubs and presents relevant options',
  },
  {
    id: 3,
    description: 'Pricing request for a specific club by name',
    userMessage: 'How much would it cost to sponsor the Downtown Run Collective?',
    expectedToolCalled: 'searchClubs',
    expectedOutcome: 'Agent searches for the club to find its ID, then retrieves and presents accurate Tier 1 Enterprise pricing',
  },
  {
    id: 4,
    description: 'High budget triggers escalation',
    userMessage: 'We have $50,000 to spend and want a fully custom brand activation',
    expectedToolCalled: 'escalateToHuman',
    expectedOutcome: 'Agent escalates immediately due to high budget and custom request',
  },
  {
    id: 5,
    description: 'Hostile user triggers escalation',
    userMessage: 'This is ridiculous, your platform is terrible and I want to speak to a real person right now',
    expectedToolCalled: 'escalateToHuman',
    expectedOutcome: 'Agent escalates due to user frustration without engaging hostility',
  },
  {
    id: 6,
    description: 'Out of scope request triggers escalation',
    userMessage: 'Can you help me set up a Facebook ad campaign for my product?',
    expectedToolCalled: 'escalateToHuman',
    expectedOutcome: 'Agent escalates as request is outside ClubPack sponsorships',
  },
  {
    id: 7,
    description: 'Club that does not exist in database',
    userMessage: 'Do you have any senior citizen gardening clubs?',
    expectedToolCalled: 'searchClubs',
    expectedOutcome: 'Agent searches honestly and reports no clubs found without hallucinating',
  },
  {
    id: 8,
    description: 'Gaming club search targeting teens',
    userMessage: 'We make energy drinks and want to reach a teen gaming audience',
    expectedToolCalled: 'searchClubs',
    expectedOutcome: 'Agent finds gaming clubs targeting teens',
  },
  {
    id: 9,
    description: 'Small budget Starter tier',
    userMessage: 'We are a small startup with about $150 budget. What can we sponsor?',
    expectedToolCalled: 'searchClubs',
    expectedOutcome: 'Agent finds Starter tier clubs within the budget range',
  },
  {
    id: 10,
    description: 'Custom stadium event triggers escalation',
    userMessage: 'We want to sponsor a live stadium event with 10,000 attendees',
    expectedToolCalled: 'escalateToHuman',
    expectedOutcome: 'Agent escalates custom large scale event request',
  },
];
