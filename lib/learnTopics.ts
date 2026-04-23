export type LearnTopic = {
  title: string;
  slug: string;
  blurb: string;
};

export const learnTopics: LearnTopic[] = [
  {
    title: "Productivity",
    slug: "productivity",
    blurb: "How productivity changes influence output, prices, and market balance.",
  },
  {
    title: "Goods Market (IS)",
    slug: "goods-market-is",
    blurb: "How spending decisions determine goods-market equilibrium and IS shifts.",
  },
  {
    title: "Money Market (LM)",
    slug: "money-market-lm",
    blurb: "How money supply and demand interact to determine interest-rate pressure.",
  },
  {
    title: "Labor Market",
    slug: "labor-market",
    blurb: "How labor supply and demand shape employment outcomes in the model.",
  },
  {
    title: "Full Employment",
    slug: "full-employment",
    blurb: "How full-employment output is represented and used as a benchmark.",
  },
  {
    title: "ISLM",
    slug: "islm",
    blurb: "How IS and LM combine to determine joint equilibrium in output and rates.",
  },
  {
    title: "Demand Shocks",
    slug: "demand-shocks",
    blurb: "How changes in demand drivers move equilibrium and policy tradeoffs.",
  },
  {
    title: "Supply Shocks",
    slug: "supply-shocks",
    blurb: "How production-side disruptions affect output and market balance.",
  },
  {
    title: "Fx",
    slug: "fx",
    blurb: "How exchange-rate dynamics connect to capital flows and macro outcomes.",
  },
  {
    title: "Open Economy",
    slug: "open-economy",
    blurb: "How trade and capital mobility alter IS-LM behavior across countries.",
  },
];
