export interface InitialCategoryItem {
  id: string;
  name: string;
  slug: string;
  description: string;
}

export interface InitialTopicItem {
  id: string;
  name: string;
  slug: string;
  description: string;
}

export const INITIAL_CATEGORIES: InitialCategoryItem[] = [
  { id: 'category-finance', name: 'Finance', slug: 'finance', description: 'Personal finance, banking, business finance, budgeting, and financial growth.' },
  { id: 'category-technology', name: 'Technology', slug: 'technology', description: 'Tech innovations, software platforms, hardware systems, and computing.' },
  { id: 'category-business', name: 'Business', slug: 'business', description: 'Business strategy, small business, startups, and commercial developments.' },
  { id: 'category-economy', name: 'Economy', slug: 'economy', description: 'Macro and micro-economics, global markets, monetary policies, and trends.' },
  { id: 'category-ai-automation', name: 'AI & Automation', slug: 'ai-automation', description: 'Artificial intelligence, AI agents, machine learning, and automation.' },
  { id: 'category-digital-internet', name: 'Digital & Internet', slug: 'digital-internet', description: 'Digital economy, fintech, web platforms, and internet commerce.' },
  { id: 'category-investing', name: 'Investing', slug: 'investing', description: 'Capital allocation, stock markets, assets, and wealth building.' },
  { id: 'category-personal-finance', name: 'Personal Finance', slug: 'personal-finance', description: 'Money management, saving, emergency fund, and financial planning.' },
  { id: 'category-entrepreneurship', name: 'Entrepreneurship', slug: 'entrepreneurship', description: 'Founder insights, venture building, and self-employment strategies.' },
  { id: 'category-markets', name: 'Markets', slug: 'markets', description: 'Financial markets, trade flows, commodities, and valuation insights.' },
  { id: 'category-policy-regulation', name: 'Policy & Regulation', slug: 'policy-regulation', description: 'Tax laws, government policies, central banking, and compliance.' },
  { id: 'category-research-analysis', name: 'Research & Analysis', slug: 'research-analysis', description: 'Deep-dive data, research methodologies, and quantitative economic reports.' },
];

export const INITIAL_TOPICS: InitialTopicItem[] = [
  { id: 'topic-business', name: 'Business', slug: 'business', description: 'Enterprise, commerce and trade.' },
  { id: 'topic-startup', name: 'Startup', slug: 'startup', description: 'Early-stage venture creation and growth.' },
  { id: 'topic-income-expenses', name: 'Income & Expenses', slug: 'income-expenses', description: 'Cash flow tracking and balance management.' },
  { id: 'topic-budgeting', name: 'Budgeting', slug: 'budgeting', description: 'Structured personal and business budgets.' },
  { id: 'topic-saving', name: 'Saving', slug: 'saving', description: 'Disciplined savings habits and interest-bearing deposits.' },
  { id: 'topic-emergency-fund', name: 'Emergency Fund', slug: 'emergency-fund', description: 'Financial safety nets for unexpected life events.' },
  { id: 'topic-investment', name: 'Investment', slug: 'investment', description: 'Strategic capital growth and asset diversification.' },
  { id: 'topic-personal-finance', name: 'Personal Finance', slug: 'personal-finance', description: 'Day-to-day individual financial decisions.' },
  { id: 'topic-money-management', name: 'Money Management', slug: 'money-management', description: 'Techniques for sustainable financial health.' },
  { id: 'topic-wealth-building', name: 'Wealth Building', slug: 'wealth-building', description: 'Long-term equity, compounding, and financial freedom.' },
  { id: 'topic-banking', name: 'Banking', slug: 'banking', description: 'Checking accounts, savings facilities, and banking systems.' },
  { id: 'topic-loans-credit', name: 'Loans & Credit', slug: 'loans-credit', description: 'Borrowing, credit scores, debt payoff, and interest rates.' },
  { id: 'topic-insurance', name: 'Insurance', slug: 'insurance', description: 'Risk mitigation, life and asset coverage.' },
  { id: 'topic-taxes', name: 'Taxes', slug: 'taxes', description: 'Tax planning, deductions, returns, and compliance.' },
  { id: 'topic-financial-planning', name: 'Financial Planning', slug: 'financial-planning', description: 'Roadmaps for retirement and long-term milestones.' },
  { id: 'topic-artificial-intelligence', name: 'Artificial Intelligence', slug: 'artificial-intelligence', description: 'Core artificial intelligence research and applications.' },
  { id: 'topic-ai-agents', name: 'AI Agents', slug: 'ai-agents', description: 'Autonomous agentic systems and workflow automations.' },
  { id: 'topic-machine-learning', name: 'Machine Learning', slug: 'machine-learning', description: 'Predictive modeling, data science, and neural nets.' },
  { id: 'topic-automation', name: 'Automation', slug: 'automation', description: 'Workflow automation and efficiency engineering.' },
  { id: 'topic-generative-ai', name: 'Generative AI', slug: 'generative-ai', description: 'Large language models and creative AI systems.' },
  { id: 'topic-computing', name: 'Computing', slug: 'computing', description: 'Hardware architecture and high-performance computing.' },
  { id: 'topic-cloud-computing', name: 'Cloud Computing', slug: 'cloud-computing', description: 'Scalable infrastructure and serverless systems.' },
  { id: 'topic-gpus', name: 'GPUs', slug: 'gpus', description: 'Parallel acceleration hardware and compute clusters.' },
  { id: 'topic-software', name: 'Software', slug: 'software', description: 'Applications, developer tooling, and systems programming.' },
  { id: 'topic-digital-platforms', name: 'Digital Platforms', slug: 'digital-platforms', description: 'Online marketplaces, social networks, and web services.' },
  { id: 'topic-digital-payments', name: 'Digital Payments', slug: 'digital-payments', description: 'UPI, payment gateways, cards, and cross-border settlement.' },
  { id: 'topic-digital-assets', name: 'Digital Assets', slug: 'digital-assets', description: 'Tokenized securities, digital currencies, and contracts.' },
  { id: 'topic-blockchain', name: 'Blockchain', slug: 'blockchain', description: 'Distributed ledgers and decentralized state machines.' },
  { id: 'topic-machine-to-machine-commerce', name: 'Machine-to-Machine Commerce', slug: 'machine-to-machine-commerce', description: 'Automated economic interactions between software agents.' },
  { id: 'topic-digital-economy', name: 'Digital Economy', slug: 'digital-economy', description: 'Electronic commerce and internet-native value creation.' },
  { id: 'topic-fintech', name: 'Fintech', slug: 'fintech', description: 'Financial technology disruptions and neobanking.' },
  { id: 'topic-internet-economy', name: 'Internet Economy', slug: 'internet-economy', description: 'Online publishing, SaaS, and digital business models.' },
  { id: 'topic-entrepreneurship', name: 'Entrepreneurship', slug: 'entrepreneurship', description: 'Founder leadership, fundraising, and execution.' },
  { id: 'topic-business-strategy', name: 'Business Strategy', slug: 'business-strategy', description: 'Competitive moats, margins, and market positioning.' },
  { id: 'topic-small-business', name: 'Small Business', slug: 'small-business', description: 'MSMEs, local businesses, and sole proprietorships.' },
  { id: 'topic-e-commerce', name: 'E-commerce', slug: 'e-commerce', description: 'Online storefronts, logistics, and retail tech.' },
  { id: 'topic-productivity', name: 'Productivity', slug: 'productivity', description: 'Operational leverage, time management, and tooling.' },
  { id: 'topic-innovation', name: 'Innovation', slug: 'innovation', description: 'Pioneering technologies and creative disruption.' },
  { id: 'topic-economy', name: 'Economy', slug: 'economy', description: 'Macro-economic indicators and monetary policies.' },
  { id: 'topic-economic-policy', name: 'Economic Policy', slug: 'economic-policy', description: 'Fiscal budgets, government stimulus, and public finance.' },
  { id: 'topic-regulation', name: 'Regulation', slug: 'regulation', description: 'Compliance, consumer protection, and legal statutes.' },
  { id: 'topic-monetary-policy', name: 'Monetary Policy', slug: 'monetary-policy', description: 'Interest rates, inflation control, and central banking.' },
  { id: 'topic-global-economy', name: 'Global Economy', slug: 'global-economy', description: 'International trade, supply chains, and foreign exchange.' },
  { id: 'topic-economic-trends', name: 'Economic Trends', slug: 'economic-trends', description: 'Market cycles, demographic shifts, and consumer spending.' },
  { id: 'topic-research', name: 'Research', slug: 'research', description: 'Empirical studies, academic rigor, and verified facts.' },
  { id: 'topic-data-statistics', name: 'Data & Statistics', slug: 'data-statistics', description: 'Quantitative analysis, statistical modeling, and indices.' },
];
